import { Card } from "pixel-retroui";
import PropTypes from 'prop-types';
import { useEffect, useState, useRef } from 'react';

function CustomCard({
    className,
    children,
    variant = 'default',
    bg,
    textColor,
    borderColor,
    shadowColor,
    hoverEffect = true,
    noPadding = false,
    elevated = false,
    glowOnHover = false,
    interactive = false,
    onClick,
    animated = true
}) {
    const [isHovered, setIsHovered] = useState(false);
    const [wasAnimated, setWasAnimated] = useState(false);
    const cardRef = useRef(null);

    // Enhanced color variants with carefully chosen color combinations
    const variants = {
        default: {
            bg: "#f8f4e1",
            textColor: "#74512d",
            borderColor: "#543310",
            shadowColor: "rgba(84, 51, 16, 0.2)",
            glowColor: "rgba(255, 236, 209, 0.5)"
        },
        primary: {
            bg: "#ffffff",
            textColor: "#74512d",
            borderColor: "#d4a373",
            shadowColor: "rgba(212, 163, 115, 0.2)",
            glowColor: "rgba(212, 163, 115, 0.3)"
        },
        secondary: {
            bg: "#fefae0",
            textColor: "#74512d",
            borderColor: "#dda15e",
            shadowColor: "rgba(221, 161, 94, 0.2)",
            glowColor: "rgba(221, 161, 94, 0.3)"
        },
        dark: {
            bg: "#543310",
            textColor: "#f8f4e1",
            borderColor: "#d4a373",
            shadowColor: "rgba(0, 0, 0, 0.3)",
            glowColor: "rgba(212, 163, 115, 0.3)"
        }
    };

    // Intersection Observer for entrance animation
    useEffect(() => {
        if (!animated || wasAnimated) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setWasAnimated(true);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, [animated, wasAnimated]);

    // Use variant values or override with props
    const selectedVariant = variants[variant] || variants.default;
    const styles = {
        bg: bg || selectedVariant.bg,
        textColor: textColor || selectedVariant.textColor,
        borderColor: borderColor || selectedVariant.borderColor,
        shadowColor: shadowColor || selectedVariant.shadowColor,
        glowColor: selectedVariant.glowColor
    };

    // Handle keyboard interactions
    const handleKeyDown = (e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onClick(e);
        }
    };

    return (
        <Card
            ref={cardRef}
            bg={styles.bg}
            textColor={styles.textColor}
            borderColor={styles.borderColor}
            shadowColor={styles.shadowColor}
            className={`
                ${className || ''} 
                ${!noPadding ? 'p-4' : ''} 
                ${hoverEffect ? 'transition-all duration-300' : ''}
                ${elevated ? 'shadow-md' : ''}
                ${interactive ? 'cursor-pointer active:scale-[0.98] hover:scale-[1.02]' : ''}
                ${onClick ? 'cursor-pointer' : ''}
                ${wasAnimated ? 'animate-fadeIn' : 'opacity-0'}
                ${glowOnHover && isHovered ? 'shadow-2xl' : ''}
                relative overflow-hidden rounded-lg backdrop-blur-sm
                hover:shadow-lg
            `}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onKeyDown={handleKeyDown}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
            style={{
                transform: isHovered && glowOnHover ? 'translateY(-2px)' : 'none',
                boxShadow: isHovered && glowOnHover ? `0 8px 32px -8px ${styles.glowColor}` : undefined,
            }}
        >
            {/* Optional hover glow effect */}
            {glowOnHover && isHovered && (
                <div 
                    className="absolute inset-0 opacity-50 pointer-events-none transition-opacity duration-300"
                    style={{
                        background: `radial-gradient(circle at 50% 50%, ${styles.glowColor}, transparent 70%)`
                    }}
                />
            )}
              {/* Card content */}
            <div className="relative">
                {children}
            </div>

            {/* Optional interactive highlight effect */}
            {interactive && (
                <div 
                    className={`
                        absolute inset-0 transition-opacity duration-300
                        pointer-events-none border-2 rounded-lg
                        ${isHovered ? 'opacity-100' : 'opacity-0'}
                    `}
                    style={{ borderColor: styles.glowColor }}
                />
            )}
        </Card>
    );
}

CustomCard.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'dark']),
    bg: PropTypes.string,
    textColor: PropTypes.string,
    borderColor: PropTypes.string,
    shadowColor: PropTypes.string,
    hoverEffect: PropTypes.bool,
    noPadding: PropTypes.bool,
    elevated: PropTypes.bool,
    glowOnHover: PropTypes.bool,
    interactive: PropTypes.bool,
    onClick: PropTypes.func,
    animated: PropTypes.bool
};

export default CustomCard;