import { useEffect, useRef, useCallback } from 'react';

const SYMBOLS = [
    '{ }', '( )', '< >', '[ ]', ';', '=', '+', '-', '/', '|', '&', '%', '!', '?'
];

// Pre-calculate random values for better performance
function randomSymbol() {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

// Throttle function to limit how often a function can be called
function throttle(callback, delay) {
    let lastCall = 0;
    return function (...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            callback(...args);
        }
    };
}

const AnimatedCodeBackground = ({
    symbolCount = 128,
    minSize = 24,
    maxSize = 64,
    minSpeed = 0.3,
    maxSpeed = 0.75,
    minOpacity = 0.1, 
    maxOpacity = 0.7,
    reduceMotion = false, // Option to reduce animations for performance or accessibility
}) => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const symbols = useRef([]);
    const isVisibleRef = useRef(true);
    const frameCountRef = useRef(0);
    const ctxRef = useRef(null);
    const dimensionsRef = useRef({ width: 0, height: 0 });

    // Initialize symbols only once
    const initializeSymbols = useCallback((width, height) => {
        if (symbols.current.length === 0) {
            symbols.current = Array.from({ length: symbolCount }).map(() => ({
                x: Math.random() * width,           // Random horizontal position
                y: Math.random() * -height,         // Start above the screen (negative y)
                size: Math.random() * (maxSize - minSize) + minSize,
                speed: Math.random() * (maxSpeed - minSpeed) + minSpeed,
                symbol: randomSymbol(),
                alpha: Math.random() * (maxOpacity - minOpacity) + minOpacity, // Random opacity
                rotation: Math.random() * 360,      // Random rotation for each symbol
                direction: 1, // Always downward (1) for constant falling
                // Add a flag to enable/disable certain symbols for optimization
                active: true 
            }));
        }
    }, [symbolCount, minSize, maxSize, minSpeed, maxSpeed, minOpacity, maxOpacity]);

    // Drawing function optimized to avoid recreating functions on each frame
    const draw = useCallback(() => {
        const ctx = ctxRef.current;
        const { width, height } = dimensionsRef.current;
        
        if (!ctx) return;
        
        ctx.clearRect(0, 0, width, height);
        
        // Set shared properties once instead of for each symbol
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fff';
        
        // Only draw active symbols
        for (let i = 0; i < symbols.current.length; i++) {
            const s = symbols.current[i];
            if (!s.active) continue;
            
            ctx.save();
            ctx.translate(s.x, s.y);
            ctx.rotate(s.rotation * Math.PI / 180);
            ctx.globalAlpha = s.alpha;
            
            // Set font size only when it changes to avoid recomputation
            ctx.font = `${s.size}px 'Minecraft', 'Pixel', 'monospace'`;
            
            ctx.fillText(s.symbol, -s.size / 2, s.size / 2);
            ctx.restore();
        }
    }, []);

    // Update function separated from rendering for better control
    const update = useCallback(() => {
        const { width, height } = dimensionsRef.current;
        const animationSpeed = isVisibleRef.current ? 1 : 0.1; // Reduce animation when tab not visible
        
        for (let i = 0; i < symbols.current.length; i++) {
            const s = symbols.current[i];
            
            // Skip updates for inactive symbols
            if (!s.active) continue;
            
            // Apply speed modulator when not visible or when reducing motion
            s.y += s.speed * s.direction * animationSpeed;
            
            // Reset symbol when it goes off-screen
            if (s.y > height + s.size) {
                s.y = Math.random() * -height;
                s.x = Math.random() * width;
                s.size = Math.random() * (maxSize - minSize) + minSize;
                s.speed = Math.random() * (maxSpeed - minSpeed) + minSpeed;
                s.symbol = randomSymbol();
                s.alpha = Math.random() * (maxOpacity - minOpacity) + minOpacity;
                s.rotation = Math.random() * 360;
            }
        }
    }, [minSize, maxSize, minSpeed, maxSpeed, minOpacity, maxOpacity]);

    // Animation loop with performance optimizations
    const animate = useCallback(() => {
        frameCountRef.current++;
        
        // If tab is not visible, render at a lower frame rate (every 5 frames)
        const shouldRender = isVisibleRef.current || frameCountRef.current % 5 === 0;
        
        update();
        
        if (shouldRender) {
            draw();
        }
        
        animationRef.current = requestAnimationFrame(animate);
    }, [update, draw]);

    // Handle resize with throttling to improve performance
    const handleResize = useCallback(throttle(() => {
        if (!canvasRef.current) return;
        
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        
        dimensionsRef.current = { width, height };
        
        // Redraw immediately after resize
        draw();
    }, 150), [draw]);

    // Handle visibility change to reduce performance impact when tab is not visible
    const handleVisibilityChange = useCallback(() => {
        isVisibleRef.current = document.visibilityState === 'visible';
    }, []);

    // Effects separated for cleaner organization
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d', { alpha: true });
        ctxRef.current = ctx;
        
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        canvas.width = width;
        canvas.height = height;
        dimensionsRef.current = { width, height };
        
        // Initialize symbols
        initializeSymbols(width, height);
        
        // Start animation
        animate();
        
        // Set up event listeners
        window.addEventListener('resize', handleResize);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // Apply reduced motion setting if needed
        if (reduceMotion) {
            // Keep only half of the symbols active when reducing motion
            symbols.current.forEach((s, i) => {
                s.active = i % 2 === 0;
            });
        }
        
        return () => {
            cancelAnimationFrame(animationRef.current);
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [animate, handleResize, handleVisibilityChange, initializeSymbols, reduceMotion]);    return (
        <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none !blur-[1.5px]">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-brown-light/10 to-brown-dark/20 z-0"></div>
            <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none opacity-70"
                aria-hidden="true" // Improves accessibility
            />
        </div>
    );
};

export default AnimatedCodeBackground;
