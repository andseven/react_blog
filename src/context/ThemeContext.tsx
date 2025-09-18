// src/context/ThemeContext.tsx

import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';

// 定义主题的类型
type Theme = 'light' | 'dark';

// 定义 Context 将提供的值的类型
interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    primaryColor: string; // 新增：主题色状态
    setPrimaryColor: (color: string) => void; // 新增：更新主题色的方法
}

// antd 的默认主色
const DEFAULT_PRIMARY_COLOR = '#1677ff';

// 创建 Context，并提供一个默认值
const ThemeContext = createContext<ThemeContextType>({
    theme: 'light',
    toggleTheme: () => console.warn('toggleTheme function not implemented'),
    primaryColor: DEFAULT_PRIMARY_COLOR,
    setPrimaryColor: () => console.warn('setPrimaryColor function not implemented'),
});

// 创建一个 Provider 组件
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        // 从 localStorage 初始化主题
        const storedTheme = localStorage.getItem('theme') as Theme;
        return storedTheme || 'light';
    });

    useEffect(() => {
        // 当 theme 状态改变时，更新 <html> 标签和 localStorage
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    // 创建一个 toggle 函数
    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const [primaryColor, setPrimaryColor] = useState<string>(() => {
        // 同样从 localStorage 初始化，实现持久化
        return localStorage.getItem('primaryColor') || DEFAULT_PRIMARY_COLOR;
    });

    useEffect(() => {
        // 当 primaryColor 变化时，保存到 localStorage
        localStorage.setItem('primaryColor', primaryColor);
    }, [primaryColor]);

    // 使用 useMemo 避免不必要的重渲染
    const value = useMemo(() => ({ theme, toggleTheme, primaryColor, setPrimaryColor }), [theme, primaryColor]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

// 创建一个自定义 Hook，方便子组件使用
export const useTheme = () => useContext(ThemeContext);