import * as tf from '@tensorflow/tfjs';

/**
 * Global model cache to prevent reloading the same model multiple times
 * and ensure proper cleanup on unmount
 */
class ModelCache {
  constructor() {
    this.cache = new Map(); // modelPath -> { model, refCount }
    this.initialized = false;
  }

  /**
   * Initialize TensorFlow.js with WebGL backend for GPU acceleration
   */
  async initialize() {
    if (this.initialized) return;
    
    try {
      // Ensure WebGL backend is used for GPU acceleration
      await tf.setBackend('webgl');
      await tf.ready();
      console.log(`[ModelCache] TensorFlow.js initialized with backend: ${tf.getBackend()}`);
      this.initialized = true;
    } catch (err) {
      console.error('[ModelCache] Failed to initialize WebGL backend:', err);
      console.log(`[ModelCache] Falling back to backend: ${tf.getBackend()}`);
      this.initialized = true;
    }
  }

  /**
   * Load a model or return cached instance
   * @param {string} modelPath - Path to the TF.js model
   * @returns {Promise<tf.GraphModel>} The loaded model
   */
  async load(modelPath) {
    // Ensure TensorFlow.js is initialized
    await this.initialize();

    // Check if model is already cached
    if (this.cache.has(modelPath)) {
      const cached = this.cache.get(modelPath);
      cached.refCount++;
      const tensors = tf.memory().numTensors;
      console.log(`[ModelCache] ✅ Reusing cached model: ${modelPath} (refs: ${cached.refCount}, tensors: ${tensors})`);
      return cached.model;
    }

    // Load new model
    const tensorsBefore = tf.memory().numTensors;
    console.log(`[ModelCache] 🔄 Loading new model: ${modelPath} (tensors before: ${tensorsBefore})`);
    const model = await tf.loadGraphModel(modelPath);

    const tensorsAfterLoad = tf.memory().numTensors;
    console.log(`[ModelCache] Model loaded (tensors after load: ${tensorsAfterLoad}, added: ${tensorsAfterLoad - tensorsBefore})`);

    console.log(`[ModelCache] 🔥 Warming up model (1 pass): ${modelPath}`);
    
    const warmupStart = performance.now();
    const dummyInput = tf.zeros([1, 640, 640, 3]);
    const warmupOutput = model.predict(dummyInput);
    await warmupOutput.data(); // Force GPU execution
    dummyInput.dispose();
    tf.dispose(warmupOutput);
    const warmupTime = performance.now() - warmupStart;
    console.log(`[ModelCache] ✅ Warmup completed in ${warmupTime.toFixed(1)}ms`);

    const tensorsAfterWarmup = tf.memory().numTensors;
    console.log(`[ModelCache] 🎉 Model ready for inference (tensors: ${tensorsAfterWarmup})`);

    // Cache the model
    this.cache.set(modelPath, {
      model,
      refCount: 1
    });

    console.log(`[ModelCache] 💾 Model cached: ${modelPath}`);
    return model;
  }

  /**
   * Check if a model is cached
   * @param {string} modelPath - Path to the TF.js model
   * @returns {boolean} True if model is cached
   */
  isCached(modelPath) {
    return this.cache.has(modelPath);
  }

  /**
   * Get a cached model without incrementing ref count
   * Use this when you want to access a model that was already loaded
   * @param {string} modelPath 
   * @returns {tf.GraphModel|null} 
   */
  get(modelPath) {
    const cached = this.cache.get(modelPath);
    return cached ? cached.model : null;
  }

  /**
   * Release a reference to a model
   * Disposes the model only when refCount reaches 0
   * @param {string} modelPath - Path to the TF.js model
   */
  release(modelPath) {
    if (!this.cache.has(modelPath)) {
      console.warn(`[ModelCache] ⚠️ Attempted to release non-cached model: ${modelPath}`);
      return;
    }

    const cached = this.cache.get(modelPath);
    cached.refCount--;

    console.log(`[ModelCache] 📉 Released model: ${modelPath} (refs: ${cached.refCount})`);

    // Only dispose when no more references
    if (cached.refCount <= 0) {
      const tensorsBefore = tf.memory().numTensors;
      console.log(`[ModelCache] 🗑️ Disposing model: ${modelPath} (tensors before: ${tensorsBefore})`);

      cached.model.dispose();
      this.cache.delete(modelPath);

      const tensorsAfter = tf.memory().numTensors;
      const tensorsFreed = tensorsBefore - tensorsAfter;
      console.log(`[ModelCache] ✅ Model disposed (tensors after: ${tensorsAfter}, freed: ${tensorsFreed})`);
    }
  }

  /**
   * Clear all cached models (use on app unmount)
   */
  clearAll() {
    console.log(`[ModelCache] 🧹 Clearing all cached models`);
    for (const [modelPath, cached] of this.cache.entries()) {
      console.log(`[ModelCache] Disposing ${modelPath} (refs: ${cached.refCount})`);
      cached.model.dispose();
    }
    this.cache.clear();
    console.log(`[ModelCache] ✅ All models cleared`);
  }

  /**
   * Get cache stats for debugging
   */
  getStats() {
    const stats = [];
    for (const [modelPath, cached] of this.cache.entries()) {
      stats.push({
        path: modelPath,
        refCount: cached.refCount
      });
    }
    return stats;
  }
}

// Export singleton instance
export const modelCache = new ModelCache();