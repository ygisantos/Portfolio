import React from 'react';
import './PixelatedSlider.css'; // Import custom styles for pixelated slider

function PixelatedSlider({ value, className}) {
    return (
        <div className={`${className} pixelated-slider`}>
            <div
                className="pixelated-slider-fill"
                style={{ width: `${value}%` }}
            ></div>
        </div>
    );
}

export default PixelatedSlider;
