import { useRef, useEffect, useState } from 'react';
import { AutoTokenizer, CLIPTextModelWithProjection, AutoProcessor, CLIPVisionModelWithProjection, RawImage } from '@huggingface/transformers';
import Dexie from 'dexie';

// Initialize IndexedDB
const db = new Dexie('VideoSearchDB');
db.version(1).stores({
  recordings: '++id, sessionName, location, timestamp, duration, videoBlob'
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

    // Prevent multiple simultaneous loads
    if (loadingRef.current) {
      console.log('[VideoSearch] Models already loading, skipping...');
      return;
    }

    async function loadModels() {
      // Guard against concurrent loads
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

        // Check if still mounted before continuing
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

        // Check if still mounted before continuing
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

        // Only set error if component is still mounted
        if (isMounted) {
          // Check if it's an abort error (component unmounted during load)
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
  }, []); // Empty deps - only load once

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

export function startVideoRecording(stream) {
  const mediaRecorder = new MediaRecorder(stream, {
    mimeType: 'video/webm;codecs=vp8',
  });

  const chunks = [];

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      chunks.push(event.data);
    }
  };

  mediaRecorder.start();
  console.log('[VideoSearch] Recording started');

  return {
    mediaRecorder,
    chunks,
    getVideoBlob: () => new Blob(chunks, { type: 'video/webm' })
  };
}

export async function stopAndSaveRecording(mediaRecorder, chunks, sessionName, location) {
  return new Promise((resolve, reject) => {
    mediaRecorder.onstop = async () => {
      try {
        const videoBlob = new Blob(chunks, { type: 'video/webm' });
        console.log(`[VideoSearch] Recording stopped. Size: ${(videoBlob.size / 1024 / 1024).toFixed(2)} MB`);

        const id = await db.recordings.add({
          sessionName,
          location,
          timestamp: Date.now(),
          duration: 0,
          videoBlob
        });

        console.log(`[VideoSearch] Recording saved to database with ID: ${id}`);
        resolve(id);
      } catch (err) {
        console.error('[VideoSearch] Error saving recording:', err);
        reject(err);
      }
    };

    mediaRecorder.stop();
  });
}

// Extract frames at higher frequency with quality checks
export async function extractFramesFromVideo(videoBlob, frameInterval = 500) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const frames = [];

    video.preload = 'metadata';
    video.muted = true;

    video.onloadedmetadata = () => {
      const targetWidth = 448;
      const aspectRatio = video.videoWidth / video.videoHeight;
      canvas.width = targetWidth;
      canvas.height = Math.round(targetWidth / aspectRatio);

      const duration = video.duration * 1000;
      const timestamps = [];

      for (let time = 0; time < duration; time += frameInterval) {
        timestamps.push(time / 1000);
      }

      let currentIndex = 0;
      let lastFrameData = null;

      const captureFrame = () => {
        if (currentIndex >= timestamps.length) {
          video.remove();
          canvas.remove();
          console.log(`[VideoSearch] Extracted ${frames.length} unique frames`);
          resolve(frames);
          return;
        }

        video.currentTime = timestamps[currentIndex];
      };

      video.onseeked = () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const currentFrameData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        if (!lastFrameData || hasSignificantChange(lastFrameData, currentFrameData)) {
          const imageData = canvas.toDataURL('image/jpeg', 0.95);

          frames.push({
            timestamp: timestamps[currentIndex] * 1000,
            imageData
          });

          lastFrameData = currentFrameData;
        }

        currentIndex++;
        captureFrame();
      };

      video.onerror = (err) => {
        video.remove();
        canvas.remove();
        reject(err);
      };

      captureFrame();
    };

    video.src = URL.createObjectURL(videoBlob);
  });
}

function hasSignificantChange(imageData1, imageData2, threshold = 0.05) {
  const data1 = imageData1.data;
  const data2 = imageData2.data;
  let diffCount = 0;
  const totalPixels = data1.length / 4;

  for (let i = 0; i < data1.length; i += 16) {
    const diff = Math.abs(data1[i] - data2[i]) +
      Math.abs(data1[i + 1] - data2[i + 1]) +
      Math.abs(data1[i + 2] - data2[i + 2]);

    if (diff > 30) diffCount++;
  }

  return (diffCount / (totalPixels / 4)) > threshold;
}

export async function generateFrameEmbedding(imageData, visionModel, processor) {
  if (!visionModel || !processor) {
    throw new Error('Vision model or processor not loaded');
  }

  try {
    const image = await RawImage.fromURL(imageData);
    const imageInputs = await processor(image);
    const { image_embeds } = await visionModel(imageInputs);

    const embedding = Array.from(image_embeds.data);
    return normalizeVector(embedding);
  } catch (err) {
    console.error('[VideoSearch] Error generating frame embedding:', err);
    throw new Error('Failed to generate frame embedding: ' + err.message);
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

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
  }

  return Math.max(-1, Math.min(1, dotProduct));
}

// NEW: Use CLIP to semantically understand query type
async function analyzeQueryWithCLIP(query, textModel, tokenizer) {
  try {
    // Generate embedding for the user's query
    const queryInputs = await tokenizer([query], { padding: true, truncation: true });
    const { text_embeds: queryEmbeds } = await textModel(queryInputs);
    const queryEmbedding = normalizeVector(Array.from(queryEmbeds.data));

    // Define semantic categories with example phrases
    const categories = {
      objectOnly: [
        "garbage on the ground",
        "empty food tray on table",
        "abandoned luggage alone",
        "unattended bag by itself",
        "trash pile",
        "suitcase without person"
      ],
      personWithObject: [
        "person carrying luggage",
        "person holding bag",
        "person with suitcase",
        "man carrying backpack",
        "woman with handbag"
      ],
      personAction: [
        "person walking",
        "person standing",
        "person running",
        "man moving",
        "woman sitting"
      ],
      behavioral: [
        "person loitering in area",
        "suspicious behavior",
        "person leaving object behind",
        "person waiting for long time",
        "person pacing back and forth"
      ],
      sequential: [
        "last person near the object",
        "person who was holding the bag",
        "person before the incident",
        "who left the luggage"
      ]
    };

    // Generate embeddings for each category
    const categoryScores = {};

    for (const [category, examples] of Object.entries(categories)) {
      let maxScore = -1;

      for (const example of examples) {
        const exampleInputs = await tokenizer([example], { padding: true, truncation: true });
        const { text_embeds: exampleEmbeds } = await textModel(exampleInputs);
        const exampleEmbedding = normalizeVector(Array.from(exampleEmbeds.data));

        const similarity = cosineSimilarity(queryEmbedding, exampleEmbedding);
        maxScore = Math.max(maxScore, similarity);
      }

      categoryScores[category] = maxScore;
    }

    // Find the best matching category
    const sortedCategories = Object.entries(categoryScores)
      .sort(([, a], [, b]) => b - a);

    const bestCategory = sortedCategories[0][0];
    const bestScore = sortedCategories[0][1];
    const secondBestScore = sortedCategories[1][1];

    console.log('[VideoSearch] Semantic category scores:',
      Object.entries(categoryScores).map(([cat, score]) =>
        `${cat}: ${(score * 100).toFixed(1)}%`
      ).join(', ')
    );

    // Need clear winner (at least 10% difference) to be confident
    const hasConfidentMatch = (bestScore - secondBestScore) > 0.1;

    return {
      category: hasConfidentMatch ? bestCategory : 'general',
      confidence: bestScore,
      allScores: categoryScores,
      isConfident: hasConfidentMatch
    };

  } catch (err) {
    console.error('[VideoSearch] Error in semantic query analysis:', err);
    return {
      category: 'general',
      confidence: 0,
      allScores: {},
      isConfident: false
    };
  }
}

// Simplified intent analysis - let CLIP do the heavy lifting
function analyzeQueryIntent(query) {
  const lowerQuery = query.toLowerCase();

  const intent = {
    isBehavioral: false,
    isObjectBased: false,
    isTemporal: false,
    isSequential: false,
    queryType: 'simple',
    keywords: []
  };

  // Only detect temporal patterns (these are syntactic, not semantic)
  const temporalPatterns = ['ago', 'last', 'recent', 'before', 'after', 'seconds', 'minutes', 'hours'];
  if (temporalPatterns.some(pattern => lowerQuery.includes(pattern))) {
    intent.isTemporal = true;
  }

  return intent;
}

// Smart query expansion based on semantic category
function expandQuery(query, semanticCategory) {
  const expandedTerms = [query]; // Always keep original

  // Expand based on semantic understanding from CLIP
  if (semanticCategory === 'objectOnly') {
    // Add variations that emphasize object isolation
    expandedTerms.push(
      `${query} without people`,
      `${query} alone`,
      `${query} by itself`
    );
  } else if (semanticCategory === 'personWithObject') {
    // Add variations showing person-object interaction
    expandedTerms.push(
      `person holding ${query}`,
      `person carrying ${query}`
    );
  } else if (semanticCategory === 'behavioral') {
    // Keep behavioral queries focused
    expandedTerms.push(`${query} behavior`);
  } else if (semanticCategory === 'sequential') {
    // Emphasize the sequential/relational aspect
    expandedTerms.push(`person interacting with ${query}`);
  }

  // Limit expansions - original query is most important
  return expandedTerms.slice(0, 3);
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
    // Remove temporal phrase but keep the rest
    cleanedQuery = query.replace(secondsPattern, '').replace(/\s+/g, ' ').trim();
    console.log(`[VideoSearch] Time filter: Around ${seconds} seconds ago (±5s window)`);
  }

  const minutesPattern = /(\d+)\s*(minute|minutes|min|mins)\s*ago/i;
  const minutesMatch = query.match(minutesPattern);
  if (minutesMatch) {
    const minutes = parseInt(minutesMatch[1]);
    const targetTime = now - (minutes * 60 * 1000);
    const window = 30 * 1000; // ±30 seconds for minute queries
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

  // Clean up common temporal words that might remain
  cleanedQuery = cleanedQuery
    .replace(/\b(occurred|happening|happened)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  // If cleaned query is too short or empty, keep original (minus just the time part)
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

// Enhanced search with semantic understanding
export async function searchRecordings(searchQuery, textModel, tokenizer, visionModel, processor, topK = 10, locationFilter = null, onProgress = null) {
  if (!searchQuery.trim()) {
    throw new Error('Search query is empty');
  }

  if (!textModel || !tokenizer || !visionModel || !processor) {
    throw new Error('Models not fully loaded');
  }

  console.log(`[VideoSearch] 🔍 Starting search for: "${searchQuery}"`);

  // Basic intent analysis (temporal only)
  const intent = analyzeQueryIntent(searchQuery);

  // Parse temporal aspects
  const { timeRange, visualQuery } = parseTemporalQuery(searchQuery);

  // Validate visual query after temporal parsing
  if (!visualQuery || visualQuery.trim().length < 2) {
    console.error('[VideoSearch] ❌ Visual query too short after temporal parsing:', visualQuery);
    throw new Error('Search query is too short. Please provide a description of what to search for.');
  }

  console.log(`[VideoSearch] 📊 Visual query for analysis: "${visualQuery}"`);

  // NEW: Use CLIP to semantically understand the query
  console.log('[VideoSearch] 🤖 Analyzing query semantics with CLIP...');
  const semanticAnalysis = await analyzeQueryWithCLIP(visualQuery, textModel, tokenizer);
  console.log(`[VideoSearch] 📋 Semantic category: ${semanticAnalysis.category} (confidence: ${(semanticAnalysis.confidence * 100).toFixed(1)}%)`);

  // Generate query variants based on semantic understanding
  const queryVariants = expandQuery(visualQuery, semanticAnalysis.category);
  console.log(`[VideoSearch] 🔄 Generated ${queryVariants.length} query variants:`, queryVariants);

  const textEmbeddings = [];

  for (const variant of queryVariants) {
    try {
      const textInputs = await tokenizer([variant], { padding: true, truncation: true });
      const { text_embeds } = await textModel(textInputs);
      const embedding = Array.from(text_embeds.data);
      textEmbeddings.push(normalizeVector(embedding));
    } catch (err) {
      console.error('[VideoSearch] Error generating text embedding:', err);
    }
  }

  if (textEmbeddings.length === 0) {
    throw new Error('Failed to generate text embeddings');
  }

  console.log(`[VideoSearch] Generated ${textEmbeddings.length} text embeddings`);

  let allRecordings = await db.recordings.toArray();
  console.log(`[VideoSearch] 💾 Found ${allRecordings.length} recordings in database`);

  if (locationFilter && locationFilter !== 'Select Location') {
    allRecordings = allRecordings.filter(rec => rec.location === locationFilter);
    console.log(`[VideoSearch] 📍 After location filter: ${allRecordings.length} recordings`);
  }

  if (timeRange) {
    const beforeFilter = allRecordings.length;
    allRecordings = allRecordings.filter(rec =>
      rec.timestamp >= timeRange.start && rec.timestamp <= timeRange.end
    );
    console.log(`[VideoSearch] ⏰ After time filter: ${allRecordings.length} recordings (filtered ${beforeFilter - allRecordings.length} out)`);

    if (allRecordings.length === 0) {
      console.log(`[VideoSearch] ⚠️ No recordings found in time range: ${new Date(timeRange.start).toLocaleTimeString()} - ${new Date(timeRange.end).toLocaleTimeString()}`);
    }
  }

  if (allRecordings.length === 0) {
    console.log('[VideoSearch] ❌ No recordings to search through');
    return [];
  }

  const allMatches = [];

  for (let i = 0; i < allRecordings.length; i++) {
    const recording = allRecordings[i];

    if (onProgress) {
      onProgress({
        current: i + 1,
        total: allRecordings.length,
        status: `Analyzing recording ${i + 1}/${allRecordings.length}...`
      });
    }

    console.log(`[VideoSearch] Processing recording ${i + 1}/${allRecordings.length}: ${recording.sessionName}`);

    try {
      const frames = await extractFramesFromVideo(recording.videoBlob, 500);
      console.log(`[VideoSearch] Extracted ${frames.length} frames from recording`);

      for (const frame of frames) {
        const frameEmbedding = await generateFrameEmbedding(frame.imageData, visionModel, processor);

        let maxSimilarity = -1;
        for (const textEmbedding of textEmbeddings) {
          const similarity = cosineSimilarity(textEmbedding, frameEmbedding);
          maxSimilarity = Math.max(maxSimilarity, similarity);
        }

        const normalizedSimilarity = (maxSimilarity + 1) / 2;

        allMatches.push({
          recordingId: recording.id,
          sessionName: recording.sessionName,
          location: recording.location,
          recordingTimestamp: recording.timestamp,
          frameTimestamp: frame.timestamp,
          imageData: frame.imageData,
          similarity: normalizedSimilarity,
          queryType: intent.queryType
        });
      }
    } catch (err) {
      console.error(`[VideoSearch] Error processing recording ${recording.id}:`, err);
    }
  }

  // Adaptive threshold based on semantic understanding from CLIP
  allMatches.sort((a, b) => b.similarity - a.similarity);

  let confidenceThreshold;

  // Use CLIP's semantic understanding to determine threshold
  if (semanticAnalysis.category === 'objectOnly' && semanticAnalysis.isConfident) {
    // Pure object queries need high confidence
    confidenceThreshold = 0.65;
    console.log('[VideoSearch] ✓ Object-only query detected by CLIP - using 65% threshold');
  } else if (semanticAnalysis.category === 'behavioral' && semanticAnalysis.isConfident) {
    // Behavioral queries need high confidence
    confidenceThreshold = 0.61;
    console.log('[VideoSearch] ✓ Behavioral query detected by CLIP - using 61% threshold');
  } else if (semanticAnalysis.category === 'sequential' && semanticAnalysis.isConfident) {
    // Sequential queries need high confidence
    confidenceThreshold = 0.63;
    console.log('[VideoSearch] ✓ Sequential query detected by CLIP - using 63% threshold');
  } else if (semanticAnalysis.category === 'personWithObject' && semanticAnalysis.isConfident) {
    // Person with object queries
    confidenceThreshold = 0.57;
    console.log('[VideoSearch] ✓ Person+object query detected by CLIP - using 57% threshold');
  } else if (semanticAnalysis.category === 'personAction' && semanticAnalysis.isConfident) {
    // Person/action queries
    confidenceThreshold = 0.54;
    console.log('[VideoSearch] ✓ Person/action query detected by CLIP - using 54% threshold');
  } else {
    // Default for unclear queries - LOWERED FROM 63% to 58%
    confidenceThreshold = 0.58;
    console.log('[VideoSearch] General query - using 58% threshold');
  }

  const filteredMatches = allMatches.filter(m => m.similarity >= confidenceThreshold);

  console.log(`[VideoSearch] Found ${allMatches.length} total matches, ${filteredMatches.length} above ${(confidenceThreshold * 100).toFixed(0)}% confidence`);

  if (allMatches.length > 0) {
    console.log(`[VideoSearch] Top 5 similarities:`,
      allMatches.slice(0, 5).map(m => `${(m.similarity * 100).toFixed(1)}%`).join(', ')
    );
  }

  // Additional quality check for object-only queries
  let topResults = filteredMatches.slice(0, topK);

  if (topResults.length > 0 && topResults[0].similarity < 0.63 && semanticAnalysis.category === 'objectOnly') {
    console.log(`[VideoSearch] ⚠️ Warning: Best match for object-only query is only ${(topResults[0].similarity * 100).toFixed(1)}%`);
    console.log(`[VideoSearch] Clearing results - no confident object matches found`);
    topResults = [];
  }

  console.log(`[VideoSearch] Returning top ${topResults.length} matches`);
  if (topResults.length > 0) {
    console.log(`[VideoSearch] Best match: ${(topResults[0].similarity * 100).toFixed(1)}%`);
  } else if (filteredMatches.length === 0) {
    console.log(`[VideoSearch] No matches found above ${(confidenceThreshold * 100).toFixed(0)}% threshold`);
  }

  return topResults;
}

export async function clearDatabase() {
  await db.recordings.clear();
  console.log('[VideoSearch] Database cleared');
}

export async function getRecordingCount() {
  return await db.recordings.count();
}

export async function getUniqueLocations() {
  const recordings = await db.recordings.toArray();
  const locations = [...new Set(recordings.map(r => r.location))];
  return locations;
}