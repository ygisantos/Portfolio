import React, { useRef, useEffect } from 'react';

const SYMBOLS = [
    '{', '}', '(', ')', '<', '>', '[', ']', ';', '=', '+', '-', '*', '/', '|', '&', '%', '!', '?'
];

function randomSymbol() {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

const AnimatedCodeBackground = ({
    symbolCount = 128,
    minSize = 24,
    maxSize = 64,
    minSpeed = 0.3,
    maxSpeed = 0.75,
    minOpacity = 0.1, 
    maxOpacity = 0.7, 
}) => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const symbols = useRef([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        // Ensure symbols are initialized only once
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
            }));
        }

        function draw() {
            ctx.clearRect(0, 0, width, height);
            ctx.globalAlpha = 1;

            // Apply the pixelated font (Minecraft-like)
            ctx.font = `${symbols.current[0].size}px 'Minecraft', 'Pixel', 'monospace'`;  // Use the Minecraft-like font
            ctx.textBaseline = 'middle'; // Center the text vertically

            // Draw falling symbols
            symbols.current.forEach(s => {
                ctx.save(); // Save current state for transformation
                ctx.translate(s.x, s.y);
                ctx.rotate(s.rotation * Math.PI / 180); // Rotate symbol
                ctx.globalAlpha = s.alpha; // Apply random opacity
                ctx.fillStyle = '#fff'; // White color for symbols
                ctx.fillText(s.symbol, -s.size / 2, s.size / 2); // Center the symbol
                ctx.restore(); // Restore the state

                ctx.globalAlpha = 1;
            });
        }

        function update() {
            symbols.current.forEach(s => {
                // Update position and rotation
                s.y += s.speed * s.direction;  // Falling speed (downward)

                // Reset symbol when it goes off-screen
                if (s.y > height + s.size) { // If it reaches the bottom
                    s.y = Math.random() * -height; // Reset to a random position above the screen
                    s.x = Math.random() * width;   // Random horizontal position
                    s.size = Math.random() * (maxSize - minSize) + minSize;
                    s.speed = Math.random() * (maxSpeed - minSpeed) + minSpeed;
                    s.symbol = randomSymbol();
                    s.alpha = Math.random() * (maxOpacity - minOpacity) + minOpacity; // Reset random opacity
                    s.rotation = Math.random() * 360; // Randomize rotation
                }
            });
        }

        function animate() {
            update();
            draw();
            animationRef.current = requestAnimationFrame(animate);
        }

        animate();

        function handleResize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        }

        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationRef.current);
            window.removeEventListener('resize', handleResize);
        };
    }, [symbolCount, minSize, maxSize, minSpeed, maxSpeed, minOpacity, maxOpacity]);

    return (
        <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none !blur-[2px]">
            <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
            />
        </div>
    );
};

export default AnimatedCodeBackground;
