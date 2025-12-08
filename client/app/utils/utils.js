import { useRef, useEffect, useState } from 'react';
import { AutoTokenizer, CLIPTextModelWithProjection, AutoProcessor, CLIPVisionModelWithProjection, RawImage } from '@huggingface/transformers';
import Dexie from 'dexie';

// Initialize IndexedDB - Changed structure to store individual frames
const db = new Dexie('VideoSearchDB');
db.version(2).stores({
  frames: '++id, sessionName, location, timestamp, imageData, embedding'
});

export { db };

// Custom hook for CLIP models
export function useClipModels() {
  const textModelRef = useRef(null);
  const visionModelRef = useRef(null);
  const tokenizerRef = useRef(null);
  const processorRef = useRef(null);
  const loadingRef = useRef(false);

  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [modelLoadProgress, setModelLoadProgress] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    if (loadingRef.current) {
      console.log('[VideoSearch] Models already loading, skipping...');
      return;
    }

    async function loadModels() {
      if (loadingRef.current) return;
      loadingRef.current = true;

      try {
        console.log('[VideoSearch] Loading CLIP models...');

        if (isMounted) {
          setModelLoadProgress('Loading text model...');
        }

        const loadedTextModel = await CLIPTextModelWithProjection.from_pretrained(
          'Xenova/clip-vit-base-patch32',
          {
            dtype: 'fp32',
            progress_callback: (progress) => {
              if (progress.status === 'progress' && isMounted) {
                setModelLoadProgress(`Loading text model: ${Math.round(progress.progress)}%`);
              }
            }
          }
        );

        if (!isMounted) {
          console.log('[VideoSearch] Component unmounted during text model load, aborting...');
          return;
        }

        const loadedTokenizer = await AutoTokenizer.from_pretrained('Xenova/clip-vit-base-patch32');

        console.log('[VideoSearch] Text model loaded (fp32)');

        if (isMounted) {
          setModelLoadProgress('Loading vision model...');
        }

        const loadedVisionModel = await CLIPVisionModelWithProjection.from_pretrained(
          'Xenova/clip-vit-base-patch32',
          {
            dtype: 'fp32',
            progress_callback: (progress) => {
              if (progress.status === 'progress' && isMounted) {
                setModelLoadProgress(`Loading vision model: ${Math.round(progress.progress)}%`);
              }
            }
          }
        );

        if (!isMounted) {
          console.log('[VideoSearch] Component unmounted during vision model load, aborting...');
          return;
        }

        const loadedProcessor = await AutoProcessor.from_pretrained('Xenova/clip-vit-base-patch32');

        console.log('[VideoSearch] Vision model loaded');

        if (isMounted) {
          textModelRef.current = loadedTextModel;
          visionModelRef.current = loadedVisionModel;
          tokenizerRef.current = loadedTokenizer;
          processorRef.current = loadedProcessor;

          setIsModelLoaded(true);
          setModelLoadProgress('');
          setError(null);
          console.log('[VideoSearch] All CLIP models ready');
        }
      } catch (err) {
        console.error('[VideoSearch] Error loading CLIP models:', err);

        if (isMounted) {
          if (err.message && err.message.includes('Aborted')) {
            console.log('[VideoSearch] Model loading aborted (component unmounted)');
            setError('Model loading was cancelled');
          } else {
            setError(`Model load error: ${err.message}`);
          }
          setModelLoadProgress('');
        }
      } finally {
        loadingRef.current = false;
      }
    }

    loadModels();

    return () => {
      console.log('[VideoSearch] useClipModels cleanup called');
      isMounted = false;
    };
  }, []);

  return {
    getModels: () => ({
      textModel: textModelRef.current,
      visionModel: visionModelRef.current,
      tokenizer: tokenizerRef.current,
      processor: processorRef.current
    }),
    isModelLoaded,
    modelLoadProgress,
    error
  };
}

// Capture and store a single frame with embedding
export async function captureAndStoreFrame(videoElement, sessionName, location, visionModel, processor) {
  if (!videoElement || !visionModel || !processor) {
    throw new Error('Missing required parameters for frame capture');
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Set canvas size to match video
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;

  // Draw current video frame to canvas
  ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

  // Get image data as base64
  const imageData = canvas.toDataURL('image/jpeg', 0.8);

  try {
    // Convert base64 to RawImage
    const image = await RawImage.fromURL(imageData);

    // Process image and generate embedding
    const imageInputs = await processor(image);
    const { image_embeds } = await visionModel(imageInputs);

    // Convert to regular array for storage
    const embeddingArray = Array.from(image_embeds.data);

    // Store frame in IndexedDB
    const id = await db.frames.add({
      sessionName: sessionName,
      location: location,
      timestamp: Date.now(),
      imageData: imageData,
      embedding: embeddingArray
    });

    console.log(`[VideoSearch] Frame captured and stored with ID: ${id}`);
    canvas.remove();
    
    return id;
  } catch (err) {
    canvas.remove();
    console.error('[VideoSearch] Error capturing frame:', err);
    throw err;
  }
}

function normalizeVector(vec) {
  let norm = 0;
  for (let i = 0; i < vec.length; i++) {
    norm += vec[i] * vec[i];
  }
  norm = Math.sqrt(norm);

  if (norm === 0) return vec;

  return vec.map(v => v / norm);
}

export function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) {
    console.error('[VideoSearch] Invalid vectors for similarity calculation');
    return 0;
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (normA * normB);
}

export function parseTemporalQuery(query) {
  const now = Date.now();
  let timeRange = null;
  let cleanedQuery = query;

  const secondsPattern = /(\d+)\s*(second|seconds|sec|secs)\s*ago/i;
  const secondsMatch = query.match(secondsPattern);
  if (secondsMatch) {
    const seconds = parseInt(secondsMatch[1]);
    const targetTime = now - (seconds * 1000);
    const window = 5 * 1000;
    timeRange = { start: targetTime - window, end: targetTime + window };
    cleanedQuery = query.replace(secondsPattern, '').replace(/\s+/g, ' ').trim();
    console.log(`[VideoSearch] Time filter: Around ${seconds} seconds ago (±5s window)`);
  }

  const minutesPattern = /(\d+)\s*(minute|minutes|min|mins)\s*ago/i;
  const minutesMatch = query.match(minutesPattern);
  if (minutesMatch) {
    const minutes = parseInt(minutesMatch[1]);
    const targetTime = now - (minutes * 60 * 1000);
    const window = 30 * 1000;
    timeRange = { start: targetTime - window, end: targetTime + window };
    cleanedQuery = query.replace(minutesPattern, '').replace(/\s+/g, ' ').trim();
    console.log(`[VideoSearch] Time filter: Around ${minutes} minutes ago (±30s window)`);
  }

  const hoursPattern = /(\d+)\s*(hour|hours|hr|hrs)\s*ago/i;
  const hoursMatch = query.match(hoursPattern);
  if (hoursMatch) {
    const hours = parseInt(hoursMatch[1]);
    const targetTime = now - (hours * 60 * 60 * 1000);
    const window = 15 * 60 * 1000;
    timeRange = { start: targetTime - window, end: targetTime + window };
    cleanedQuery = query.replace(hoursPattern, '').replace(/\s+/g, ' ').trim();
    console.log(`[VideoSearch] Time filter: Around ${hours} hours ago (±15 min window)`);
  }

  const daysPattern = /(\d+)\s*(day|days)\s*ago/i;
  const daysMatch = query.match(daysPattern);
  if (daysMatch) {
    const days = parseInt(daysMatch[1]);
    const targetTime = now - (days * 24 * 60 * 60 * 1000);
    const window = 1 * 60 * 60 * 1000;
    timeRange = { start: targetTime - window, end: targetTime + window };
    cleanedQuery = query.replace(daysPattern, '').replace(/\s+/g, ' ').trim();
    console.log(`[VideoSearch] Time filter: Around ${days} days ago (±1 hour window)`);
  }

  cleanedQuery = cleanedQuery
    .replace(/\b(occurred|happening|happened)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (cleanedQuery.length < 3) {
    cleanedQuery = query.replace(/(\d+)\s*(second|seconds|sec|secs|minute|minutes|min|mins|hour|hours|hr|hrs|day|days)\s*ago/i, '').trim();
  }

  const finalQuery = cleanedQuery || query;

  console.log(`[VideoSearch] Original query: "${query}"`);
  console.log(`[VideoSearch] Cleaned visual query: "${finalQuery}"`);

  return {
    timeRange,
    visualQuery: finalQuery
  };
}

// Search stored frames
export async function searchRecordings(searchQuery, textModel, tokenizer, topK = 10, locationFilter = null, onProgress = null) {
  if (!searchQuery.trim()) {
    throw new Error('Search query is empty');
  }

  if (!textModel || !tokenizer) {
    throw new Error('Models not fully loaded');
  }

  console.log(`[VideoSearch] 🔍 Starting search for: "${searchQuery}"`);

  // Parse temporal aspects
  const { timeRange, visualQuery } = parseTemporalQuery(searchQuery);

  if (!visualQuery || visualQuery.trim().length < 2) {
    console.error('[VideoSearch] ❌ Visual query too short after temporal parsing:', visualQuery);
    throw new Error('Search query is too short. Please provide a description of what to search for.');
  }

  console.log(`[VideoSearch] 📊 Visual query for analysis: "${visualQuery}"`);

  // Generate text embedding
  const textInputs = await tokenizer([visualQuery], { padding: true, truncation: true });
  const { text_embeds } = await textModel(textInputs);
  const textEmbedding = Array.from(text_embeds.data);

  console.log(`[VideoSearch] Generated text embedding`);

  // Get all frames from database
  let allFrames = await db.frames.toArray();
  console.log(`[VideoSearch] 💾 Found ${allFrames.length} frames in database`);

  if (locationFilter && locationFilter !== 'Select Location') {
    allFrames = allFrames.filter(frame => frame.location === locationFilter);
    console.log(`[VideoSearch] 📍 After location filter: ${allFrames.length} frames`);
  }

  if (timeRange) {
    const beforeFilter = allFrames.length;
    allFrames = allFrames.filter(frame =>
      frame.timestamp >= timeRange.start && frame.timestamp <= timeRange.end
    );
    console.log(`[VideoSearch] ⏰ After time filter: ${allFrames.length} frames (filtered ${beforeFilter - allFrames.length} out)`);

    if (allFrames.length === 0) {
      console.log(`[VideoSearch] ⚠️ No frames found in time range: ${new Date(timeRange.start).toLocaleTimeString()} - ${new Date(timeRange.end).toLocaleTimeString()}`);
    }
  }

  if (allFrames.length === 0) {
    console.log('[VideoSearch] ❌ No frames to search through');
    return [];
  }

  // Calculate similarities
  const results = [];
  
  for (let idx = 0; idx < allFrames.length; idx++) {
    const frame = allFrames[idx];
    
    // Update progress every frame for smooth progress bar
    if (onProgress) {
      onProgress({
        current: idx + 1,
        total: allFrames.length,
        status: `Analyzing frame ${idx + 1}/${allFrames.length}...`
      });
      
      // Allow UI to update every 50 frames
      if (idx % 50 === 0) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }

    const similarity = cosineSimilarity(textEmbedding, frame.embedding);

    results.push({
      id: frame.id,
      sessionName: frame.sessionName,
      location: frame.location,
      recordingTimestamp: frame.timestamp,
      frameTimestamp: 0,
      imageData: frame.imageData,
      similarity: similarity,
      isLive: false
    });
  }

  // Sort by similarity
  results.sort((a, b) => b.similarity - a.similarity);

  console.log(`[VideoSearch] Found ${results.length} total matches`);

  if (results.length > 0) {
    console.log(`[VideoSearch] Top 5 similarities:`,
      results.slice(0, 5).map(m => `${(m.similarity * 100).toFixed(1)}%`).join(', ')
    );
  }

  const topResults = results.slice(0, topK);

  console.log(`[VideoSearch] Returning top ${topResults.length} matches`);
  if (topResults.length > 0) {
    console.log(`[VideoSearch] Best match: ${(topResults[0].similarity * 100).toFixed(1)}%`);
  }

  return topResults;
}

export async function clearDatabase() {
  await db.frames.clear();
  console.log('[VideoSearch] Database cleared');
}

export async function getFrameCount() {
  return await db.frames.count();
}

export async function getUniqueLocations() {
  const frames = await db.frames.toArray();
  const locations = [...new Set(frames.map(f => f.location))];
  return locations;
}