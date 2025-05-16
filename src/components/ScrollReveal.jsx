import React, { useEffect, useRef, useState } from 'react';

/**
 * ScrollReveal component that animates children when they enter the viewport
 * @param {Object} props Component props
 * @param {React.ReactNode} props.children Child elements to animate on scroll
 * @param {string} props.animation Animation class to apply (fadeIn, slideInLeft, etc.)
 * @param {string} props.threshold Percentage of element visible before triggering (0-1)
 * @param {string} props.delay Animation delay in ms
 * @param {string} props.duration Animation duration in ms
 * @param {string} props.className Additional CSS classes
 */
function ScrollReveal({ 
  children, 
  animation = 'fadeIn', 
  threshold = 0.2, 
  delay = 0,
  duration = 500, 
  className = '' 
}) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: parseFloat(threshold) }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold]);

  const animationClass = isVisible ? `animate-${animation}` : 'opacity-0';
  const delayClass = delay ? `delay-${delay}` : '';
  const durationClass = duration ? `duration-${duration}` : '';

  return (
    <div 
      ref={elementRef} 
      className={`${className} ${animationClass} ${delayClass} ${durationClass}`}
      style={{ 
        transition: 'opacity 0.4s ease-out',
      }}
    >
      {children}
    </div>
  );
}

export default ScrollReveal;
