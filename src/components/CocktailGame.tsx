import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { Trophy, RotateCcw, Play, AlertCircle } from 'lucide-react';

// --- Constants & Types ---

interface DrinkLevel {
  level: number;
  name: string;
  radius: number;
  color: string;
  svgString: string;
}

const DRINK_LEVELS: DrinkLevel[] = [
  { 
    level: 1, name: 'Blue Gelato Cup', radius: 20, color: '#4FC3F7',
    svgString: `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="cup1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fff" stop-opacity="0.5"/><stop offset="100%" stop-color="#fff" stop-opacity="0.1"/></defs><path d="M8 25 Q20 40 32 25 Z" fill="url(#cup1)" stroke="rgba(255,255,255,0.6)"/><circle cx="20" cy="18" r="12" fill="#4FC3F7"/><path d="M15 12 Q18 8 22 12" stroke="white" stroke-width="2" fill="none" opacity="0.5"/></svg>`
  },
  { 
    level: 2, name: 'Yellow Mini Cup', radius: 28, color: '#FFF176',
    svgString: `<svg width="56" height="56" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><path d="M15 25 L20 45 L36 45 L41 25 Z" fill="rgba(255,255,255,0.2)" stroke="white" stroke-opacity="0.6"/><circle cx="28" cy="22" r="14" fill="#FFF176"/><path d="M22 15 Q28 10 34 15" stroke="white" stroke-width="2" fill="none" opacity="0.4"/></svg>`
  },
  { 
    level: 3, name: 'Mint Glass', radius: 36, color: '#81C784',
    svgString: `<svg width="72" height="72" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg"><path d="M20 30 L28 60 L44 60 L52 30 Z" fill="rgba(255,255,255,0.2)" stroke="white"/><circle cx="36" cy="25" r="18" fill="#81C784"/><path d="M45 15 Q55 5 50 25" fill="#2E7D32" opacity="0.8"/></svg>`
  },
  { 
    level: 4, name: 'Purple Double Bowl', radius: 45, color: '#BA68C8',
    svgString: `<svg width="90" height="90" viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg"><path d="M20 40 Q45 75 70 40 L60 35 L30 35 Z" fill="rgba(255,255,255,0.2)" stroke="white"/><circle cx="35" cy="32" r="18" fill="#BA68C8"/><circle cx="55" cy="32" r="18" fill="#9575CD"/></svg>`
  },
  { 
    level: 5, name: 'Mango Tall Glass', radius: 55, color: '#FFB74D',
    svgString: `<svg width="110" height="110" viewBox="0 0 110 110" xmlns="http://www.w3.org/2000/svg"><path d="M35 45 L45 95 L65 95 L75 45 Z" fill="rgba(255,255,255,0.2)" stroke="white"/><circle cx="45" cy="40" r="20" fill="#FFB74D"/><circle cx="65" cy="40" r="20" fill="#FFA726"/><circle cx="55" cy="25" r="20" fill="#FF9800"/></svg>`
  },
  { 
    level: 6, name: 'Strawberry Sundae', radius: 65, color: '#F06292',
    svgString: `<svg width="130" height="130" viewBox="0 0 130 130" xmlns="http://www.w3.org/2000/svg"><path d="M40 60 Q65 110 90 60 L80 120 L50 120 Z" fill="rgba(255,255,255,0.2)" stroke="white"/><circle cx="50" cy="50" r="25" fill="#F06292"/><circle cx="80" cy="50" r="25" fill="#EC407A"/><path d="M45 35 Q65 60 85 35" stroke="#C62828" stroke-width="5" fill="none"/></svg>`
  },
  { 
    level: 7, name: 'Mint Choco Wafer', radius: 75, color: '#4DB6AC',
    svgString: `<svg width="150" height="150" viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg"><path d="M50 70 Q75 130 100 70 L90 140 L60 140 Z" fill="rgba(255,255,255,0.2)" stroke="white"/><circle cx="60" cy="60" r="30" fill="#4DB6AC"/><circle cx="90" cy="60" r="30" fill="#26A69A"/><rect x="95" y="30" width="10" height="40" fill="#A1887F" transform="rotate(20 100 50)"/></svg>`
  },
  { 
    level: 8, name: 'Blue Floral Sundae', radius: 88, color: '#64B5F6',
    svgString: `<svg width="176" height="176" viewBox="0 0 176 176" xmlns="http://www.w3.org/2000/svg"><path d="M60 80 Q88 150 116 80 L100 160 L76 160 Z" fill="rgba(255,255,255,0.2)" stroke="white"/><circle cx="75" cy="70" r="35" fill="#64B5F6"/><circle cx="101" cy="70" r="35" fill="#42A5F5"/><path d="M110 40 Q115 30 120 40 Q130 45 120 50 Q115 60 110 50 Q100 45 110 40" fill="#FFF176"/></svg>`
  },
  { 
    level: 9, name: 'Fruit Party Bowl', radius: 105, color: '#E57373',
    svgString: `<svg width="210" height="210" viewBox="0 0 210 210" xmlns="http://www.w3.org/2000/svg"><path d="M50 90 Q105 180 160 90 L140 190 L70 190 Z" fill="rgba(255,255,255,0.2)" stroke="white"/><circle cx="80" cy="80" r="45" fill="#E57373"/><circle cx="130" cy="80" r="45" fill="#EF5350"/><circle cx="105" cy="50" r="40" fill="#D32F2F"/><circle cx="140" cy="40" r="10" fill="#FF1744"/></svg>`
  },
  { 
    level: 10, name: 'Ultimate Banana Split', radius: 125, color: '#FFF176',
    svgString: `<svg width="250" height="250" viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg"><path d="M30 120 Q125 200 220 120 L200 100 L50 100 Z" fill="rgba(255,255,255,0.2)" stroke="white"/><circle cx="80" cy="100" r="40" fill="#FFF176"/><circle cx="125" cy="100" r="40" fill="#FFB74D"/><circle cx="170" cy="100" r="40" fill="#F06292"/><rect x="180" y="50" width="6" height="60" fill="#5D4037" transform="rotate(15 183 80)"/><circle cx="125" cy="50" r="12" fill="#D32F2F"/></svg>`
  },
];

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 600;
const DANGER_LINE_Y = 480; // Aligned to white dashed line in image
const LAUNCH_Y = 540;
const WALL_THICKNESS = 50;
const TABLE_TOP_Y = 120; // Wood texture ends here (20% of height)
const TABLE_LEFT = 40;
const TABLE_RIGHT = 360;

// --- Main Component ---

export default function CocktailGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [nextFruitType, setNextFruitType] = useState<DrinkLevel>(DRINK_LEVELS[0]);
  const [previewX, setPreviewX] = useState(CANVAS_WIDTH / 2);
  const [previewY, setPreviewY] = useState(LAUNCH_Y);
  const [isLaunching, setIsLaunching] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);

  // Refs to track interaction state
  const isDraggingRef = useRef(false);
  const isFirstTimeRef = useRef(true);

  // Refs to avoid stale closures in the render loop
  const nextFruitTypeRef = useRef(nextFruitType);
  const previewXRef = useRef(previewX);
  const previewYRef = useRef(previewY);
  const isLaunchingRef = useRef(isLaunching);
  const svgCache = useRef<Map<number, HTMLImageElement>>(new Map());

  useEffect(() => {
    // Pre-cache SVGs
    DRINK_LEVELS.forEach(level => {
      const img = new Image();
      const svg = new Blob([level.svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svg);
      img.onload = () => {
        svgCache.current.set(level.level, img);
        URL.revokeObjectURL(url);
      };
      img.src = url;
    });
  }, []);

  useEffect(() => {
    // Check storage (web or WeChat)
    let firstTime = true;
    try {
      // @ts-ignore - Check for WeChat environment
      if (typeof wx !== 'undefined' && wx.getStorageSync) {
        // @ts-ignore
        const val = wx.getStorageSync('gelato_merge_first_time');
        if (val === 'false') firstTime = false;
      } else {
        const val = localStorage.getItem('gelato_merge_first_time');
        if (val === 'false') firstTime = false;
      }
    } catch (e) {
      console.error('Storage error', e);
    }
    setIsFirstTime(firstTime);
    isFirstTimeRef.current = firstTime;
  }, []);

  useEffect(() => { nextFruitTypeRef.current = nextFruitType; }, [nextFruitType]);
  useEffect(() => { previewXRef.current = previewX; }, [previewX]);
  useEffect(() => { previewYRef.current = previewY; }, [previewY]);
  useEffect(() => { isLaunchingRef.current = isLaunching; }, [isLaunching]);

  // Helper to get a random starting drink (Level 1-3)
  const getRandomDrink = () => {
    const level = Math.floor(Math.random() * 3) + 1;
    return DRINK_LEVELS.find(d => d.level === level)!;
  };

  // Initialize Physics Engine
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    // Initialize the first fruit type
    setNextFruitType(getRandomDrink());

    const engine = Matter.Engine.create();
    engine.gravity.y = 0; // Top-down view, no gravity
    engineRef.current = engine;

    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);

    // Add Walls
    const walls = [
      // Left (Aligned to table edge)
      Matter.Bodies.rectangle(TABLE_LEFT - WALL_THICKNESS / 2, CANVAS_HEIGHT / 2, WALL_THICKNESS, CANVAS_HEIGHT, { isStatic: true, friction: 0.5, restitution: 0.6 }),
      // Right (Aligned to table edge)
      Matter.Bodies.rectangle(TABLE_RIGHT + WALL_THICKNESS / 2, CANVAS_HEIGHT / 2, WALL_THICKNESS, CANVAS_HEIGHT, { isStatic: true, friction: 0.5, restitution: 0.6 }),
      // Top (Aligned to table edge)
      Matter.Bodies.rectangle(CANVAS_WIDTH / 2, TABLE_TOP_Y - WALL_THICKNESS / 2, CANVAS_WIDTH, WALL_THICKNESS, { isStatic: true, friction: 0.5, restitution: 0.4 }),
      // Bottom (behind launch line)
      Matter.Bodies.rectangle(CANVAS_WIDTH / 2, CANVAS_HEIGHT + WALL_THICKNESS / 2, CANVAS_WIDTH, WALL_THICKNESS, { isStatic: true, friction: 0.5, restitution: 0.6 }),
    ];
    Matter.World.add(engine.world, walls);

    // Collision Handling for Merging
    Matter.Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        const bodyA = pair.bodyA as any;
        const bodyB = pair.bodyB as any;

        // Check if both are drinks and have the same level
        if (bodyA.drinkLevel && bodyB.drinkLevel && bodyA.drinkLevel === bodyB.drinkLevel) {
          const currentLevel = bodyA.drinkLevel;
          if (currentLevel < 9) {
            // Merge!
            const newLevel = currentLevel + 1;
            const midX = (bodyA.position.x + bodyB.position.x) / 2;
            const midY = (bodyA.position.y + bodyB.position.y) / 2;

            // Remove old bodies from the world
            Matter.Composite.remove(engine.world, [bodyA, bodyB]);

            // Create new body at the midpoint
            const nextLevelData = DRINK_LEVELS.find(d => d.level === newLevel)!;
            const newBody = createDrinkBody(midX, midY, nextLevelData);
            Matter.Composite.add(engine.world, newBody);

            // Update Score - higher levels give more points
            setScore(prev => prev + (currentLevel * 10));
            
            // Visual feedback could be added here (e.g., particles)
          }
        }
      });
    });

    // --- WeChat Mini Program Adaptation Note ---
    // In a WeChat Mini Program, you would use:
    // 1. const query = wx.createSelectorQuery();
    // 2. query.select('#gameCanvas').fields({ node: true, size: true }).exec((res) => { ... });
    // 3. const canvas = res[0].node;
    // 4. const ctx = canvas.getContext('2d');
    // The Matter.js logic remains identical.
    // Use wx.onTouchStart, wx.onTouchMove, wx.onTouchEnd for input.

    // --- Background Rendering ---
    const drawBackground = (ctx: CanvasRenderingContext2D) => {
      const width = CANVAS_WIDTH;
      const height = CANVAS_HEIGHT;

      // Sky & Sea
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, width, height * 0.3);
      ctx.fillStyle = '#00BFFF';
      ctx.fillRect(0, height * 0.25, width, height * 0.1);
      
      // Sand
      ctx.fillStyle = '#F5DEB3';
      ctx.fillRect(0, height * 0.35, width, height * 0.65);

      // Beach Chairs (Striped)
      const drawChair = (x: number, y: number, color: string, angle: number) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.fillStyle = '#D2B48C'; // Wood frame
        ctx.fillRect(-20, -40, 40, 80);
        ctx.fillStyle = color; // Stripes
        for(let i = -35; i < 35; i += 10) {
          ctx.fillRect(-15, i, 30, 5);
        }
        ctx.restore();
      };
      drawChair(40, 400, '#FF4444', -0.2); // Red chair
      drawChair(width - 40, 400, '#4444FF', 0.2); // Blue chair

      // The Wooden Table
      ctx.fillStyle = '#DEB887';
      ctx.beginPath();
      ctx.moveTo(40, TABLE_TOP_Y);
      ctx.lineTo(width - 40, TABLE_TOP_Y);
      ctx.lineTo(width + 60, height);
      ctx.lineTo(-60, height);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.1)';
      for(let i = 60; i < width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, TABLE_TOP_Y);
        ctx.lineTo(i * 1.3 - 60, height);
        ctx.stroke();
      }
    };

    // Animation Loop
    let animationId: number;
    const render = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx || !canvas) return;

      // Clear
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw Perspective Background
      drawBackground(ctx);

      // --- Visual Clipping for Table Area ---
      // This ensures items don't appear on the sand even if they slightly overlap walls
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(TABLE_LEFT, TABLE_TOP_Y);
      ctx.lineTo(TABLE_RIGHT, TABLE_TOP_Y);
      ctx.lineTo(CANVAS_WIDTH + 60, CANVAS_HEIGHT);
      ctx.lineTo(-60, CANVAS_HEIGHT);
      ctx.closePath();
      ctx.clip();

      // 2. Draw Bodies (Already launched)
      const bodies = Matter.Composite.allBodies(engine.world);
      bodies.forEach((body: any) => {
        if (body.isStatic) return;

        const levelData = DRINK_LEVELS.find(d => d.level === body.drinkLevel);
        if (!levelData) return;

        // 1. Draw Ground Shadow (Entity sense)
        ctx.save();
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.ellipse(body.position.x, body.position.y + levelData.radius * 0.8, levelData.radius, levelData.radius * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.translate(body.position.x, body.position.y);
        ctx.rotate(body.angle);

        // 2. Draw SVG from cache
        const cachedImg = svgCache.current.get(levelData.level);
        if (cachedImg) {
          ctx.drawImage(cachedImg, -levelData.radius, -levelData.radius, levelData.radius * 2, levelData.radius * 2);
        } else {
          // Fallback if not cached yet
          ctx.fillStyle = levelData.color;
          ctx.beginPath();
          ctx.arc(0, 0, levelData.radius, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // 3. Glass Border & Highlight
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, levelData.radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();

        // Check Lose Condition
        // 1. Mark as "entered play" once it crosses above the danger line
        if (body.position.y < DANGER_LINE_Y) {
          body.hasEnteredPlay = true;
        }

        // 2. Game Over if a body that was in play falls back below the line and settles
        if (body.hasEnteredPlay && body.position.y > DANGER_LINE_Y && !body.isLaunching && Matter.Vector.magnitude(body.velocity) < 0.2) {
          setGameOver(true);
        }
      });

      // 3. Draw Danger Line (White Decorative Line from Image)
      ctx.setLineDash([10, 5]);
      ctx.strokeStyle = isDraggingRef.current ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, DANGER_LINE_Y);
      ctx.lineTo(CANVAS_WIDTH, DANGER_LINE_Y);
      ctx.stroke();
      ctx.setLineDash([]);

      // 4. Draw Preview Drink, Finger, and Guide Line (Top Layer)
      if (!isLaunchingRef.current && !gameOver) {
        const currentNext = nextFruitTypeRef.current;
        
        // --- Tutorial Layer (Guide Line) ---
        if (isFirstTimeRef.current) {
          ctx.save();
          ctx.globalAlpha = 0.3; // Independent transparency for guide line
          ctx.setLineDash([8, 8]);
          ctx.strokeStyle = '#FFFFFF';
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(previewXRef.current, previewYRef.current);
          ctx.lineTo(previewXRef.current, 50); // Extend to top
          ctx.stroke();
          ctx.restore();
        }

        // Preview Shadow
        ctx.save();
        ctx.globalAlpha = 0.15;
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.ellipse(previewXRef.current, previewYRef.current + currentNext.radius * 0.8, currentNext.radius, currentNext.radius * 0.2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Preview Object (Opaque 1.0)
        ctx.save();
        ctx.globalAlpha = 1.0; 
        ctx.translate(previewXRef.current, previewYRef.current);
        
        const cachedPreview = svgCache.current.get(currentNext.level);
        if (cachedPreview) {
          ctx.drawImage(cachedPreview, -currentNext.radius, -currentNext.radius, currentNext.radius * 2, currentNext.radius * 2);
        }

        // Glass border
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, currentNext.radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();

        // --- Tutorial Layer (Finger Animation) ---
        if (isFirstTimeRef.current) {
          const time = Date.now() * 0.003;
          const animY = Math.sin(time) * 30; // Float up and down
          const opacity = 0.4 + Math.sin(time) * 0.2;
          
          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.translate(previewXRef.current + 20, previewYRef.current + 40 + animY);
          
          // Draw a simple finger SVG-like shape
          ctx.fillStyle = '#ffffff';
          ctx.shadowBlur = 15;
          ctx.shadowColor = 'rgba(255,255,255,0.5)';
          
          // Palm/Hand base
          ctx.beginPath();
          ctx.roundRect(-15, 0, 30, 40, 10);
          ctx.fill();
          // Pointing finger
          ctx.beginPath();
          ctx.roundRect(-5, -35, 12, 40, 6);
          ctx.fill();
          
          // "Tap & Flick" text
          ctx.font = 'bold 10px Arial';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.fillText('TAP & FLICK', 0, 55);
          
          ctx.restore();
        }
      }

      ctx.restore(); // End of Visual Clipping

      // Draw Canopy Edges (Top) - Occluding game objects for natural look
      ctx.fillStyle = '#FFFFFF';
      for(let i = 0; i < CANVAS_WIDTH; i += 60) {
        ctx.beginPath();
        ctx.arc(i + 30, 0, 40, 0, Math.PI);
        ctx.fill();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
    };
  }, [gameStarted, gameOver]);

  // Helper to create a drink body
  const createDrinkBody = (x: number, y: number, levelData: DrinkLevel) => {
    const body = Matter.Bodies.circle(x, y, levelData.radius, {
      restitution: 0.6, // Bounciness
      friction: 0.1,    // Surface friction
      frictionAir: 0.05, // Air resistance (simulates sliding friction on surface)
      density: 0.001 * levelData.level, // Mass increases with level
      label: `drink-${levelData.level}`,
    });
    (body as any).drinkLevel = levelData.level;
    return body;
  };

  // Handle Input
  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (gameOver || isLaunching) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    const radius = nextFruitType.radius;
    
    // Horizontal Constraints: Stay within table edges
    const clampedX = Math.max(radius + TABLE_LEFT, Math.min(TABLE_RIGHT - radius, x));
    
    // Vertical Constraints: MUST be BELOW the Danger Line
    // Min Y (Upper bound) is DANGER_LINE_Y + radius
    // Max Y (Lower bound) is CANVAS_HEIGHT - radius
    const clampedY = Math.max(DANGER_LINE_Y + radius, Math.min(CANVAS_HEIGHT - radius, y));
    
    setPreviewX(clampedX);
    setPreviewY(clampedY);
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (gameOver || isLaunching) return;
    isDraggingRef.current = true;
    // Update position immediately on start
    handleMouseMove(e);
  };

  const handleEnd = () => {
    if (gameOver || isLaunching || !isDraggingRef.current) return;
    
    isDraggingRef.current = false;
    executeLaunch();
  };

  const executeLaunch = () => {
    if (gameOver || isLaunching || !engineRef.current) return;

    // Clear tutorial on first launch
    if (isFirstTimeRef.current) {
      setIsFirstTime(false);
      isFirstTimeRef.current = false;
      try {
        // @ts-ignore
        if (typeof wx !== 'undefined' && wx.setStorageSync) {
          // @ts-ignore
          wx.setStorageSync('gelato_merge_first_time', 'false');
        } else {
          localStorage.setItem('gelato_merge_first_time', 'false');
        }
      } catch (e) {}
    }

    setIsLaunching(true);
    // Use the current nextFruitType and current preview position for the physical entity
    const body = createDrinkBody(previewX, previewY, nextFruitType);
    (body as any).isLaunching = true;
    (body as any).hasEnteredPlay = false;

    Matter.Composite.add(engineRef.current.world, body);
    
    // Launch upwards with a FIXED velocity of -18
    Matter.Body.setVelocity(body, { x: 0, y: -18 });

    // Refresh nextFruitType IMMEDIATELY for the next round
    const newFruit = getRandomDrink();
    setNextFruitType(newFruit);

    // After a short time, it's no longer "launching"
    setTimeout(() => {
      (body as any).isLaunching = false;
      setIsLaunching(false);
    }, 800);
  };

  const resetGame = () => {
    if (engineRef.current) {
      const bodies = Matter.Composite.allBodies(engineRef.current.world);
      bodies.forEach(body => {
        if (!body.isStatic) {
          Matter.Composite.remove(engineRef.current!.world, body);
        }
      });
    }
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    setNextFruitType(getRandomDrink());
    setPreviewX(CANVAS_WIDTH / 2);
    setPreviewY(LAUNCH_Y);
    setIsFirstTime(false);
    isFirstTimeRef.current = false;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1a1a1a] text-white p-4 font-sans">
      {/* Header */}
      <div className="w-full max-w-[400px] flex justify-between items-center mb-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight text-blue-400">BEACH GELATO</h1>
          <p className="text-xs text-slate-400 uppercase tracking-widest">Premium Dessert Merge</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-slate-800/50 px-4 py-2 rounded-xl border border-white/10 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="text-xl font-mono font-bold">{score}</span>
          </div>
          <button 
            onClick={resetGame}
            className="bg-slate-800/50 hover:bg-slate-700/50 px-3 py-2 rounded-xl border border-white/10 flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-bold">Reset</span>
          </button>
        </div>
      </div>

      {/* Game Canvas Container */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-800 bg-slate-900">
        {!gameStarted && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm">
            <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <Play className="w-12 h-12 text-white fill-current" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Ready for Dessert?</h2>
            <p className="text-slate-400 text-center px-8 mb-8">
              Slide to aim, release to launch. Merge identical sundaes to create the Ultimate Giant Sundae!
            </p>
            <button 
              onClick={() => setGameStarted(true)}
              className="px-8 py-3 bg-pink-500 hover:bg-pink-400 text-white font-bold rounded-full transition-all transform hover:scale-105 active:scale-95"
            >
              START SERVING
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-red-900/80 backdrop-blur-md">
            <AlertCircle className="w-20 h-20 text-white mb-4" />
            <h2 className="text-4xl font-black mb-2">GAME OVER</h2>
            <p className="text-xl mb-6">Final Score: <span className="font-bold">{score}</span></p>
            <button 
              onClick={resetGame}
              className="flex items-center gap-2 px-8 py-4 bg-white text-red-600 font-bold rounded-full hover:bg-slate-100 transition-all transform hover:scale-105"
            >
              <RotateCcw className="w-5 h-5" />
              TRY AGAIN
            </button>
          </div>
        )}

        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onMouseMove={handleMouseMove}
          onTouchMove={handleMouseMove}
          onMouseDown={handleStart}
          onMouseUp={handleEnd}
          onTouchStart={handleStart}
          onTouchEnd={handleEnd}
          className="cursor-crosshair touch-none"
        />

        {/* HUD Overlay */}
        <div className="absolute top-4 left-4 pointer-events-none flex flex-col gap-2">
          <div className="bg-blue-500/20 backdrop-blur-md px-3 py-1 rounded-full border border-blue-500/30 text-[10px] uppercase tracking-tighter text-blue-400 flex items-center gap-2">
            <span className="opacity-70">NEXT:</span>
            <span className="font-bold">{nextFruitType.name}</span>
          </div>
        </div>
      </div>

      {/* Instructions / Legend */}
      <div className="mt-8 w-full max-w-[400px]">
        <h3 className="text-xs font-bold text-slate-500 uppercase mb-3 tracking-widest">Evolution Chain</h3>
        <div className="flex flex-wrap gap-2 justify-center">
          {DRINK_LEVELS.map((level) => (
            <div 
              key={level.level}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-bold border border-white/5 shadow-inner transition-all ${nextFruitType.level === level.level ? 'ring-2 ring-blue-400 scale-110' : 'opacity-50'}`}
              style={{ backgroundColor: level.color }}
              title={level.name}
            >
              L{level.level}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6 text-slate-500 text-[10px] uppercase tracking-[0.2em] text-center">
        Built with Matter.js & React
      </div>
    </div>
  );
}
