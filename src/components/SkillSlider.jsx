import React from 'react';

function SkillSlider({ value }) {
    return (
        <div className="w-full bg-gray-300 rounded-full h-6 pixelated-border">
            <div
                className="bg-green-500 h-6 rounded-full"
                style={{ width: `${value}%` }}
            ></div>
        </div>
    );
}

export default SkillSlider;

// CSS (add to your global styles or a CSS module)
// .pixelated-border {
//     border: 2px solid black;
//     box-shadow: 0 0 0 2px #000, inset 0 0 0 2px #000;
// }
