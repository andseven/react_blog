// src/components/BackgroundCanvas.tsx

import React, { useRef } from "react";
import useCanvasAnimation from "../../hooks/useCanvasAnimation"; // Make sure path is correct

// The component now accepts a color prop
interface BackgroundCanvasProps {
    color: string;
}

const BackgroundCanvas: React.FC<BackgroundCanvasProps> = ({ color }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    
    // Pass the color prop to the hook
    useCanvasAnimation(canvasRef, color);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: -1,
            }}
        />
    );
};

export default BackgroundCanvas;