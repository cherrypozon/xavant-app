'use client';

import { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { modelCache } from '@/app/utils/modelCache';

// Colors for bounding boxes
const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8',
  '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8B500', '#00D4AA', '#FF8C00', '#00CED1'
];

// Configuration
const INPUT_SIZE = 640;
const CONF_THRESHOLD = 0.4;
const IOU_THRESHOLD = 0.45;

// PERFORMANCE CONFIGS
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

export default function LiveFeed({
  modelPath,
  classes,
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
  const modelRef = useRef(null);
  const intervalRef = useRef(null);
  const isDetectingRef = useRef(false);

  const [isStreaming, setIsStreaming] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [fps, setFps] = useState(0);
  const [detections, setDetections] = useState([]);
  const [tensorCount, setTensorCount] = useState(0);

  // FPS tracking
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  // Unattended detection tracking
  const trackedSuitcasesRef = useRef(new Map());
  const nextIdRef = useRef(0);

  // Load model on mount
  useEffect(() => {
    let isMounted = true;

    async function loadModel() {
      try {
        console.log(`[LiveFeed] Loading model: ${modelPath}`);
        const model = await modelCache.load(modelPath);

        if (isMounted) {
          modelRef.current = model;
          setIsModelLoaded(true);
          console.log(`[LiveFeed] Model ready: ${modelPath}`);
        }
      } catch (err) {
        console.error('[LiveFeed] Error loading model:', err);
        if (isMounted) {
          setError(`Model load error: ${err.message}`);
        }
      }
    }

    loadModel();

    return () => {
      isMounted = false;
      const tensorsBeforeCleanup = tf.memory().numTensors;
      console.log(`[LiveFeed] Cleanup START: releasing model ${modelPath} (tensors: ${tensorsBeforeCleanup})`);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (modelRef.current) {
        modelCache.release(modelPath);
        modelRef.current = null;
      }

      const tensorsAfterCleanup = tf.memory().numTensors;
      console.log(`[LiveFeed] Cleanup END (tensors: ${tensorsAfterCleanup})`);
    };
  }, [modelPath]);

  // Start camera on mount
  useEffect(() => {
    let isMounted = true;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: config.resolution.width },
            height: { ideal: config.resolution.height }
          }
        });

        if (isMounted && videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            if (isMounted && canvasRef.current && videoRef.current) {
              canvasRef.current.width = videoRef.current.videoWidth;
              canvasRef.current.height = videoRef.current.videoHeight;
            }
            if (isMounted) {
              setIsStreaming(true);
            }
          };
        } else if (!isMounted) {
          stream.getTracks().forEach(track => track.stop());
        }
      } catch (err) {
        console.error('[LiveFeed] Error accessing camera:', err);
        if (isMounted) {
          setError(`Camera error: ${err.message}`);
        }
      }
    }

    startCamera();

    return () => {
      isMounted = false;
      console.log('[LiveFeed] Cleanup: stopping camera');

      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => {
          track.stop();
          console.log(`[LiveFeed] Stopped track: ${track.kind}`);
        });
        videoRef.current.srcObject = null;
      }

      setIsStreaming(false);
    };
  }, [config.resolution]);

  // Start detection when both camera and model are ready
  useEffect(() => {
    if (!isStreaming || !isModelLoaded) return;

    let isActive = true;

    const detectObjects = async () => {
      if (!isActive || isDetectingRef.current) return;

      if (!modelRef.current || !videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (video.readyState !== video.HAVE_ENOUGH_DATA) return;

      isDetectingRef.current = true;

      try {
        // Preprocess: resize and normalize
        const inputTensor = tf.tidy(() => {
          const img = tf.browser.fromPixels(video);
          const resized = tf.image.resizeBilinear(img, [INPUT_SIZE, INPUT_SIZE]);
          const normalized = resized.div(255.0);
          return normalized.expandDims(0);
        });

        // Run inference
        const outputTensor = modelRef.current.predict(inputTensor);

        // Get output data
        const output = await outputTensor.array();

        // Cleanup tensors immediately
        inputTensor.dispose();
        tf.dispose(outputTensor);

        if (!isActive) return;

        // Post-process YOLO output
        const boxes = postprocess(output[0], video.videoWidth, video.videoHeight);

        // Handle unattended detection logic
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
              if (personNearby) {
                timer = 0;
              } else {
                timer = tracked.timer + DETECTION_INTERVAL;
              }
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

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          drawBoxesWithUnattended(ctx, displayBoxes);
        } else {
          setDetections(boxes);

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          drawBoxes(ctx, boxes);
        }

        // Calculate FPS and monitor tensors
        frameCountRef.current++;
        const currentTime = performance.now();
        if (currentTime - lastTimeRef.current >= 1000) {
          setFps(frameCountRef.current);
          setTensorCount(tf.memory().numTensors);
          frameCountRef.current = 0;
          lastTimeRef.current = currentTime;
        }
      } catch (err) {
        console.error('[LiveFeed] Detection error:', err);
      } finally {
        isDetectingRef.current = false;
      }
    };

    console.log(`[LiveFeed] Starting detection loop (${performanceMode} mode: ${DETECTION_INTERVAL}ms)`);
    intervalRef.current = setInterval(detectObjects, DETECTION_INTERVAL);

    return () => {
      isActive = false;
      console.log('[LiveFeed] Cleanup: stopping detection loop');

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    };
  }, [isStreaming, isModelLoaded, DETECTION_INTERVAL, unattendedDetection, proximityThreshold, showPersonBoxes, unattendedThreshold, performanceMode]);

  // Post-process YOLO output [1, 84, 8400] -> boxes
  const postprocess = (output, videoWidth, videoHeight) => {
    const boxes = [];
    const numDetections = output[0].length;

    for (let i = 0; i < numDetections; i++) {
      // Get box coordinates
      const cx = output[0][i];
      const cy = output[1][i];
      const w = output[2][i];
      const h = output[3][i];

      // Get class scores
      let maxScore = 0;
      let maxClass = 0;
      for (let c = 0; c < 80; c++) {
        const score = output[4 + c][i];
        if (score > maxScore) {
          maxScore = score;
          maxClass = c;
        }
      }

      if (maxScore > CONF_THRESHOLD) {
        const className = classes[maxClass];

        // For unattended detection, we need both person and suitcase
        if (unattendedDetection) {
          if (className !== 'person' && className !== 'suitcase') {
            continue;
          }
        } else {
          if (filterClasses && !filterClasses.includes(className)) {
            continue;
          }
        }

        // Convert to pixel coordinates
        const x1 = (cx - w / 2) / INPUT_SIZE * videoWidth;
        const y1 = (cy - h / 2) / INPUT_SIZE * videoHeight;
        const x2 = (cx + w / 2) / INPUT_SIZE * videoWidth;
        const y2 = (cy + h / 2) / INPUT_SIZE * videoHeight;

        boxes.push({
          x1, y1, x2, y2,
          score: maxScore,
          classId: maxClass,
          className
        });
      }
    }

    return nms(boxes, IOU_THRESHOLD);
  };

  // Non-Maximum Suppression
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
        if (iou > iouThreshold) {
          active[j] = false;
        }
      }
    }

    return selected;
  };

  // Calculate IoU
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

  // Calculate edge-to-edge distance between two boxes
  const calculateEdgeToEdgeDistance = (box1, box2) => {
    let dx = 0;
    if (box1.x2 < box2.x1) {
      dx = box2.x1 - box1.x2;
    } else if (box2.x2 < box1.x1) {
      dx = box1.x1 - box2.x2;
    }

    let dy = 0;
    if (box1.y2 < box2.y1) {
      dy = box2.y1 - box1.y2;
    } else if (box2.y2 < box1.y1) {
      dy = box1.y1 - box2.y2;
    }

    return Math.sqrt(dx * dx + dy * dy);
  };

  // Check if a suitcase has a person nearby
  const hasPersonNearby = (suitcase, people, threshold) => {
    for (const person of people) {
      const distance = calculateEdgeToEdgeDistance(suitcase, person);
      if (distance <= threshold) {
        return true;
      }
    }
    return false;
  };

  // Match current suitcases with tracked suitcases using IoU
  const matchSuitcases = (currentSuitcases, trackedMap) => {
    const IOU_MATCH_THRESHOLD = 0.3;
    const matched = new Map();
    const unmatchedCurrent = [...currentSuitcases];

    for (const [id, tracked] of trackedMap.entries()) {
      let bestMatch = null;
      let bestIoU = IOU_MATCH_THRESHOLD;
      let bestIdx = -1;

      for (let i = 0; i < unmatchedCurrent.length; i++) {
        const current = unmatchedCurrent[i];
        const iou = calculateIoU(tracked.bbox, current);

        if (iou > bestIoU) {
          bestIoU = iou;
          bestMatch = current;
          bestIdx = i;
        }
      }

      if (bestMatch) {
        matched.set(id, bestMatch);
        unmatchedCurrent.splice(bestIdx, 1);
      }
    }

    for (const suitcase of unmatchedCurrent) {
      const newId = nextIdRef.current++;
      matched.set(newId, suitcase);
    }

    return matched;
  };

  // Draw bounding boxes
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

  // Draw bounding boxes with unattended detection
  const drawBoxesWithUnattended = (ctx, boxes) => {
    boxes.forEach((box) => {
      let color;
      let label;

      if (box.className === 'suitcase') {
        color = box.isUnattended ? '#FF0000' : '#00FF00';
        const status = box.isUnattended ? 'Suitcase - UNATTENDED' : 'Suitcase - Attended';
        label = `${status} ${Math.round(box.score * 100)}%`;
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
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
      />

      {/* Status overlay */}
      <div className="absolute top-2 left-2 text-white text-xs bg-black/50 px-2 py-1 rounded">
        {!isStreaming && !isModelLoaded && <span>Loading and warming up model...</span>}
        {!isStreaming && isModelLoaded && <span>Starting camera...</span>}
        {isStreaming && !isModelLoaded && <span>Waiting for model...</span>}
        
        {/* Uncomment this to display FPS and tensors */}
        {/* {isStreaming && isModelLoaded && (
          <span>FPS: {fps} | Detections: {detections.length} | Tensors: {tensorCount}</span>
        )} */}
      </div>
    </div>
  );
}
