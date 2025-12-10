import * as ort from 'onnxruntime-web';

class ModelCache {
  constructor() {
    this.cache = new Map();
    this.initialized = false;
    this.executionProviders = ['wasm'];
  }

  async initialize() {
    if (this.initialized) return;

    try {
      ort.env.wasm.numThreads = navigator.hardwareConcurrency || 4;
      ort.env.wasm.simd = true;

      this.executionProviders = ['webgpu', 'wasm'];
      this.initialized = true;
      console.log('[ModelCache] Initialized');
    } catch (err) {
      console.error('[ModelCache] Init failed:', err);
      this.executionProviders = ['wasm'];
      this.initialized = true;
    }
  }

  async load(modelPath) {
    await this.initialize();

    if (this.cache.has(modelPath)) {
      const cached = this.cache.get(modelPath);
      cached.refCount++;
      console.log(`[ModelCache] Reusing: ${modelPath} (refs: ${cached.refCount})`);
      return {
        session: cached.session,
        inputShape: cached.inputShape,
        inputName: cached.inputName
      };
    }

    console.log(`[ModelCache] Loading: ${modelPath}`);
    const t0 = performance.now();

    const session = await ort.InferenceSession.create(modelPath, {
      executionProviders: this.executionProviders,
      graphOptimizationLevel: 'all',
      enableCpuMemArena: true,
      enableMemPattern: true
    });

    console.log('Inputs:', session.inputNames);
    console.log('Metadata:', session.inputMetadata);
    console.log(`[ModelCache] Load time: ${(performance.now() - t0).toFixed(1)}ms`);

    const inputName = session.inputNames[0];
    const meta = session.inputMetadata[inputName];

    // Ensure dimensions exist; fallback to default YOLOv8 shape if missing
    let dims = meta?.dimensions || [1, 3, 640, 640];
    if (!Array.isArray(dims) || dims.length !== 4) {
      throw new Error(`Input ${inputName} has invalid or missing dimensions`);
    }

    const [batch, channels, height, width] = dims.map((d, i) => (i === 0 && d === -1 ? 1 : d));

    const dummy = new Float32Array(batch * channels * height * width);
    const tensor = new ort.Tensor('float32', dummy, [batch, channels, height, width]);

    console.log('[ModelCache] Warmup');
    const warm0 = performance.now();
    await session.run({ [inputName]: tensor });
    console.log(`[ModelCache] Warmup time: ${(performance.now() - warm0).toFixed(1)}ms`);

    const info = {
      session,
      inputShape: [batch, channels, height, width],
      inputName,
      refCount: 1
    };

    this.cache.set(modelPath, info);
    console.log(`[ModelCache] Cached: ${modelPath}`);

    return {
      session,
      inputShape: info.inputShape,
      inputName
    };
  }

  isCached(path) {
    return this.cache.has(path);
  }

  get(path) {
    const cached = this.cache.get(path);
    if (!cached) return null;
    return {
      session: cached.session,
      inputShape: cached.inputShape,
      inputName: cached.inputName
    };
  }

  release(path) {
    const cached = this.cache.get(path);
    if (!cached) return;

    cached.refCount--;
    console.log(`[ModelCache] Release: ${path} (refs: ${cached.refCount})`);
    if (cached.refCount <= 0) {
      this.cache.delete(path);
      console.log(`[ModelCache] Removed: ${path}`);
    }
  }

  clearAll() {
    this.cache.clear();
    console.log('[ModelCache] Cleared');
  }

  getStats() {
    return Array.from(this.cache.entries()).map(([path, c]) => ({
      path,
      refCount: c.refCount,
      inputShape: c.inputShape
    }));
  }
}

export const modelCache = new ModelCache();
