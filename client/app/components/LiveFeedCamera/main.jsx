'use client';

import { useRef, useEffect, useState } from 'react';
import * as ort from 'onnxruntime-web';
import { modelCache } from '@/app/utils/modelCache';

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8',
  '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8B500', '#00D4AA', '#FF8C00', '#00CED1'
];

const INPUT_SIZE = 640;
const CONF_THRESHOLD = 0.4;
const IOU_THRESHOLD = 0.45;

// PERFORMANCE CONFIGS - Much better with ONNX!
const PERFORMANCE_CONFIGS = {
  high: {
    interval: 50,  
    resolution: { width: 640, height: 480 }
  },
  balanced: {
    interval: 100, 
    resolution: { width: 640, height: 480 }
  },
  performance: {
    interval: 200,
    resolution: { width: 480, height: 360 }
  }
};

function LiveFeed({
  modelPath = '/models/yolov8n.onnx',
  classes = [],
  filterClasses = null,
  displayAs = null,
  unattendedDetection = false,
  unattendedThreshold = 3000,
  proximityThreshold = 150,
  showPersonBoxes = true,
  performanceMode = 'balanced'
}) {
  const config = PERFORMANCE_CONFIGS[performanceMode];
  const DETECTION_INTERVAL = config.interval;
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const sessionRef = useRef(null);
  const inputNameRef = useRef(null);
  const inputShapeRef = useRef(null);
  const intervalRef = useRef(null);
  const isDetectingRef = useRef(false);
  const lastDetectionTimeRef = useRef(0);
  const rafRef = useRef(null);
  const offscreenCanvasRef = useRef(null);

  const [isStreaming, setIsStreaming] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [fps, setFps] = useState(0);
  const [detections, setDetections] = useState([]);
  const [inferenceTime, setInferenceTime] = useState(0);

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  const trackedSuitcasesRef = useRef(new Map());
  const nextIdRef = useRef(0);

  // Load ONNX model (most likely already cached by PageLoader)
  useEffect(() => {
    if (!modelPath) {
      setIsModelLoaded(false);
      return;
    }

    async function loadModel() {
      try {
        console.log(`[LiveFeed] Getting ONNX model: ${modelPath}`);
        
        // Check if already cached (should be from PageLoader)
        if (modelCache.isCached(modelPath)) {
          console.log(`[LiveFeed] ✅ Using pre-cached model: ${modelPath}`);
          const cached = modelCache.get(modelPath);
          
          // Increment ref count since we're using it
          const cachedEntry = modelCache.cache.get(modelPath);
          if (cachedEntry) {
            cachedEntry.refCount++;
            console.log(`[LiveFeed] Ref count: ${cachedEntry.refCount}`);
          }
          
          sessionRef.current = cached.session;
          inputNameRef.current = cached.inputName;
          inputShapeRef.current = cached.inputShape;
          setIsModelLoaded(true);
          return;
        }

        // If not cached (shouldn't happen), load it
        console.log(`[LiveFeed] ⏳ Loading ONNX model: ${modelPath}`);
        const { session, inputShape, inputName } = await modelCache.load(modelPath);

        sessionRef.current = session;
        inputNameRef.current = inputName;
        inputShapeRef.current = inputShape;
        setIsModelLoaded(true);
        console.log(`[LiveFeed] ✅ ONNX model ready: ${modelPath}`);
      } catch (err) {
        console.error('[LiveFeed] Error loading ONNX model:', err);
        setError(`Model load error: ${err.message}`);
      }
    }

    loadModel();

    return () => {
      console.log(`[LiveFeed] Cleanup: releasing model ${modelPath}`);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      // Release model reference
      if (modelPath && modelCache.isCached(modelPath)) {
        modelCache.release(modelPath);
        sessionRef.current = null;
      }
    };
  }, [modelPath]);

  // Start camera
  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: config.resolution.width },
            height: { ideal: config.resolution.height },
            facingMode: 'environment'
          }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            if (canvasRef.current && videoRef.current) {
              canvasRef.current.width = videoRef.current.videoWidth;
              canvasRef.current.height = videoRef.current.videoHeight;
              
              // Create offscreen canvas for preprocessing
              offscreenCanvasRef.current = document.createElement('canvas');
              offscreenCanvasRef.current.width = INPUT_SIZE;
              offscreenCanvasRef.current.height = INPUT_SIZE;
            }
            setIsStreaming(true);
          };
        }
      } catch (err) {
        console.error('[LiveFeed] Error accessing camera:', err);
        setError(`Camera error: ${err.message}`);
      }
    }

    startCamera();

    return () => {
      console.log('[LiveFeed] Cleanup: stopping camera');

      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }

      setIsStreaming(false);
    };
  }, [config.resolution]);

  // Optimized preprocessing function
  const preprocessImage = (video) => {
    const offscreenCanvas = offscreenCanvasRef.current;
    const ctx = offscreenCanvas.getContext('2d', { willReadFrequently: true });
    
    // Draw and resize in one operation
    ctx.drawImage(video, 0, 0, INPUT_SIZE, INPUT_SIZE);
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, INPUT_SIZE, INPUT_SIZE);
    const pixels = imageData.data;
    
    // Convert to CHW format (channels, height, width) and normalize
    const red = [];
    const green = [];
    const blue = [];
    
    for (let i = 0; i < pixels.length; i += 4) {
      red.push(pixels[i] / 255.0);
      green.push(pixels[i + 1] / 255.0);
      blue.push(pixels[i + 2] / 255.0);
    }
    
    // Combine into single array in CHW format
    const inputData = Float32Array.from([...red, ...green, ...blue]);
    
    return new ort.Tensor('float32', inputData, [1, 3, INPUT_SIZE, INPUT_SIZE]);
  };

  // Start detection loop
  useEffect(() => {
    if (!isStreaming || !isModelLoaded || !sessionRef.current) {
      return;
    }

    let isActive = true;

    const detectObjects = async () => {
      if (!isActive || isDetectingRef.current) return;
      
      const now = performance.now();
      if (now - lastDetectionTimeRef.current < DETECTION_INTERVAL - 10) {
        return;
      }

      if (!sessionRef.current || !videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video.readyState !== video.HAVE_ENOUGH_DATA) return;

      isDetectingRef.current = true;
      lastDetectionTimeRef.current = now;

      try {
        // Preprocess image
        const inferenceStart = performance.now();
        const inputTensor = preprocessImage(video);

        // Run inference
        const outputs = await sessionRef.current.run({
          [inputNameRef.current]: inputTensor
        });

        // Get output tensor
        const output = outputs[sessionRef.current.outputNames[0]];
        const inferenceEnd = performance.now();
        setInferenceTime(inferenceEnd - inferenceStart);

        if (!isActive) return;

        // Post-process detections
        const boxes = postprocess(output.data, output.dims, video.videoWidth, video.videoHeight);

        if (unattendedDetection) {
          const suitcases = boxes.filter(box => box.className === 'suitcase');
          const people = boxes.filter(box => box.className === 'person');

          const matchedSuitcases = matchSuitcases(suitcases, trackedSuitcasesRef.current);
          const newTrackedMap = new Map();

          for (const [id, suitcase] of matchedSuitcases.entries()) {
            const tracked = trackedSuitcasesRef.current.get(id);
            const personNearby = hasPersonNearby(suitcase, people, proximityThreshold);

            let timer = 0;
            let isUnattended = false;

            if (tracked) {
              timer = personNearby ? 0 : tracked.timer + DETECTION_INTERVAL;
              isUnattended = timer >= unattendedThreshold;
            } else {
              timer = personNearby ? 0 : DETECTION_INTERVAL;
              isUnattended = false;
            }

            suitcase.isUnattended = isUnattended;
            suitcase.trackingId = id;

            newTrackedMap.set(id, {
              bbox: suitcase,
              timer: timer,
              isUnattended: isUnattended
            });
          }

          trackedSuitcasesRef.current = newTrackedMap;

          const displayBoxes = [
            ...suitcases.map(s => ({ ...s, isUnattended: s.isUnattended })),
            ...(showPersonBoxes ? people : [])
          ];

          setDetections(displayBoxes);
          
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
          rafRef.current = requestAnimationFrame(() => {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBoxesWithUnattended(ctx, displayBoxes);
          });
        } else {
          setDetections(boxes);
          
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
          rafRef.current = requestAnimationFrame(() => {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBoxes(ctx, boxes);
          });
        }

        // Update FPS
        frameCountRef.current++;
        const currentTime = performance.now();
        if (currentTime - lastTimeRef.current >= 1000) {
          setFps(frameCountRef.current);
          frameCountRef.current = 0;
          lastTimeRef.current = currentTime;
        }
      } catch (err) {
        console.error('[LiveFeed] Detection error:', err);
      } finally {
        isDetectingRef.current = false;
      }
    };

    console.log(`[LiveFeed] Starting ONNX detection loop (${performanceMode} mode: ${DETECTION_INTERVAL}ms)`);
    intervalRef.current = setInterval(detectObjects, DETECTION_INTERVAL);

    return () => {
      isActive = false;
      console.log('[LiveFeed] Cleanup: stopping detection loop');

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    };
  }, [isStreaming, isModelLoaded, DETECTION_INTERVAL, unattendedDetection, proximityThreshold, showPersonBoxes, unattendedThreshold, performanceMode]);

  // Post-process ONNX output (YOLOv8 format)
  const postprocess = (outputData, dims, videoWidth, videoHeight) => {
    if (!classes.length) return [];
    
    const boxes = [];
    const [batch, outputs, detections] = dims; // e.g., [1, 84, 8400]
    
    // YOLOv8 format: 84 values per detection (4 bbox + 80 classes)
    for (let i = 0; i < detections; i++) {
      // Extract bbox (center_x, center_y, width, height)
      const cx = outputData[i];
      const cy = outputData[detections + i];
      const w = outputData[2 * detections + i];
      const h = outputData[3 * detections + i];
      
      // Find class with highest confidence
      let maxScore = 0;
      let maxClass = 0;
      
      for (let c = 0; c < 80; c++) {
        const score = outputData[(4 + c) * detections + i];
        if (score > maxScore) {
          maxScore = score;
          maxClass = c;
        }
      }
      
      if (maxScore > CONF_THRESHOLD) {
        const className = classes[maxClass];
        
        // Filter classes
        if (unattendedDetection) {
          if (className !== 'person' && className !== 'suitcase') continue;
        } else {
          if (filterClasses && !filterClasses.includes(className)) continue;
        }
        
        // Convert to corner coordinates and scale to video size
        const x1 = ((cx - w / 2) / INPUT_SIZE) * videoWidth;
        const y1 = ((cy - h / 2) / INPUT_SIZE) * videoHeight;
        const x2 = ((cx + w / 2) / INPUT_SIZE) * videoWidth;
        const y2 = ((cy + h / 2) / INPUT_SIZE) * videoHeight;
        
        boxes.push({ x1, y1, x2, y2, score: maxScore, classId: maxClass, className });
      }
    }
    
    return nms(boxes, IOU_THRESHOLD);
  };

  const nms = (boxes, iouThreshold) => {
    if (boxes.length === 0) return [];
    boxes.sort((a, b) => b.score - a.score);
    const selected = [];
    const active = new Array(boxes.length).fill(true);

    for (let i = 0; i < boxes.length; i++) {
      if (!active[i]) continue;
      selected.push(boxes[i]);
      for (let j = i + 1; j < boxes.length; j++) {
        if (!active[j]) continue;
        const iou = calculateIoU(boxes[i], boxes[j]);
        if (iou > iouThreshold) active[j] = false;
      }
    }
    return selected;
  };

  const calculateIoU = (box1, box2) => {
    const x1 = Math.max(box1.x1, box2.x1);
    const y1 = Math.max(box1.y1, box2.y1);
    const x2 = Math.min(box1.x2, box2.x2);
    const y2 = Math.min(box1.y2, box2.y2);
    const intersection = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
    const area1 = (box1.x2 - box1.x1) * (box1.y2 - box1.y1);
    const area2 = (box2.x2 - box2.x1) * (box2.y2 - box2.y1);
    const union = area1 + area2 - intersection;
    return intersection / union;
  };

  const calculateEdgeToEdgeDistance = (box1, box2) => {
    let dx = 0;
    if (box1.x2 < box2.x1) dx = box2.x1 - box1.x2;
    else if (box2.x2 < box1.x1) dx = box1.x1 - box2.x2;
    let dy = 0;
    if (box1.y2 < box2.y1) dy = box2.y1 - box1.y2;
    else if (box2.y2 < box1.y1) dy = box1.y1 - box2.y2;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const hasPersonNearby = (suitcase, people, threshold) => {
    for (const person of people) {
      if (calculateEdgeToEdgeDistance(suitcase, person) <= threshold) return true;
    }
    return false;
  };

  const matchSuitcases = (currentSuitcases, trackedMap) => {
    const IOU_MATCH_THRESHOLD = 0.3;
    const matched = new Map();
    const unmatchedCurrent = [...currentSuitcases];

    for (const [id, tracked] of trackedMap.entries()) {
      let bestMatch = null;
      let bestIoU = IOU_MATCH_THRESHOLD;
      let bestIdx = -1;

      for (let i = 0; i < unmatchedCurrent.length; i++) {
        const iou = calculateIoU(tracked.bbox, unmatchedCurrent[i]);
        if (iou > bestIoU) {
          bestIoU = iou;
          bestMatch = unmatchedCurrent[i];
          bestIdx = i;
        }
      }

      if (bestMatch) {
        matched.set(id, bestMatch);
        unmatchedCurrent.splice(bestIdx, 1);
      }
    }

    for (const suitcase of unmatchedCurrent) {
      matched.set(nextIdRef.current++, suitcase);
    }

    return matched;
  };

  const drawBoxes = (ctx, boxes) => {
    boxes.forEach((box) => {
      const color = COLORS[box.classId % COLORS.length];
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.strokeRect(box.x1, box.y1, box.x2 - box.x1, box.y2 - box.y1);

      const displayLabel = displayAs || box.className;
      const label = `${displayLabel} ${Math.round(box.score * 100)}%`;
      ctx.font = '14px Arial';
      const textWidth = ctx.measureText(label).width;

      ctx.fillStyle = color;
      ctx.fillRect(box.x1, box.y1 - 20, textWidth + 8, 20);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(label, box.x1 + 4, box.y1 - 6);
    });
  };

  const drawBoxesWithUnattended = (ctx, boxes) => {
    boxes.forEach((box) => {
      let color, label;

      if (box.className === 'suitcase') {
        color = box.isUnattended ? '#FF0000' : '#00FF00';
        const status = box.isUnattended ? 'UNATTENDED' : 'Attended';
        label = `Suitcase - ${status} ${Math.round(box.score * 100)}%`;
      } else if (box.className === 'person') {
        color = '#0000FF';
        label = `Person ${Math.round(box.score * 100)}%`;
      } else {
        color = COLORS[box.classId % COLORS.length];
        label = `${box.className} ${Math.round(box.score * 100)}%`;
      }

      ctx.strokeStyle = color;
      ctx.lineWidth = box.className === 'suitcase' && box.isUnattended ? 3 : 2;
      ctx.strokeRect(box.x1, box.y1, box.x2 - box.x1, box.y2 - box.y1);

      ctx.font = box.className === 'suitcase' && box.isUnattended ? 'bold 14px Arial' : '14px Arial';
      const textWidth = ctx.measureText(label).width;

      ctx.fillStyle = color;
      ctx.fillRect(box.x1, box.y1 - 20, textWidth + 8, 20);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(label, box.x1 + 4, box.y1 - 6);
    });
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500 p-4">
        <div className="text-center">
          <p className="font-medium">Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black">
      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none" />

      <div className="absolute top-13 left-2 text-white text-xs bg-black/50 px-2 py-1 rounded">
        {!isStreaming && !isModelLoaded && <span>🔄 Initializing...</span>}
        {!isStreaming && isModelLoaded && <span>📷 Starting camera...</span>}
        {isStreaming && !isModelLoaded && <span>⏳ Loading ONNX model...</span>}
        {isStreaming && isModelLoaded && (
          <span>✅ {fps} FPS | {inferenceTime.toFixed(0)}ms | {detections.length} det | {performanceMode}</span>
        )}
      </div>
    </div>
  );
}

export default LiveFeed;