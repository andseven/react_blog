// The custom hook file, e.g., src/hooks/useCanvasAnimation.ts

import React, { useRef, useEffect } from "react";

function useCanvasAnimation(
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    color: string
) {
    const colorRef = useRef(color);
    useEffect(() => {
        colorRef.current = color;
    }, [color]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // 1. 将宽高和粒子数组定义在 useEffect 的顶层作用域
        let w = window.innerWidth;
        let h = window.innerHeight;
        let particles: {
            x: number;
            y: number;
            vx: number;
            vy: number;
            r: number;
        }[] = [];
        let animationId: number;

        // 2. 将设置和初始化逻辑封装成一个函数
        const handleResize = () => {
            w = window.innerWidth;
            h = window.innerHeight;
            particles = []; // 清空粒子数组

            const dpr = window.devicePixelRatio || 1;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.scale(dpr, dpr);

            // 1. 定义一个缩放比例，例如以 1200px 宽度为基准
            // 当窗口为 1200px 时，scalingFactor 为 1，粒子大小在 2-4px
            // 当窗口为 600px 时，scalingFactor 为 0.5，粒子大小在 1-2px
            // 当窗口为 2400px 时，scalingFactor 为 2，粒子大小在 4-8px
            const scalingFactor = w / 1200;

            // 重新初始化粒子
            for (let i = 0; i < 60; i++) {
                particles.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    vx: (Math.random() - 0.5) * 1.2,
                    vy: (Math.random() - 0.5) * 1.2,
                    // 2. 使用缩放比例来动态计算粒子半径
                    r: 2 * scalingFactor + Math.random() * (2 * scalingFactor),
                });
            }
        };

        const draw = () => {
            // 使用顶层作用域的 w 和 h，它们会在 resize 时被更新
            ctx.clearRect(0, 0, w, h);
            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = colorRef.current;
                ctx.fill();
            });
            animationId = requestAnimationFrame(draw);
        };

        // 3. 首次挂载时，调用一次 handleResize 进行初始化
        handleResize();
        draw();

        // 4. 添加窗口 resize 事件监听器
        window.addEventListener("resize", handleResize);

        // 5. 在组件卸载时，清理动画帧和事件监听器
        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("resize", handleResize);
        };
    }, [canvasRef]); // 依赖项依然只有 canvasRef，确保只在挂载和卸载时执行
}

export default useCanvasAnimation;
