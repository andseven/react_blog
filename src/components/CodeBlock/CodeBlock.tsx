/* /src/components/CodeBlock/CodeBlock.tsx */

import React from 'react'; 
import { Tooltip, Button } from 'antd';
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import copy from 'copy-to-clipboard';
import { useTheme } from '../../context/ThemeContext'; // 引入你的主题 Hook
import s from './CodeBlock.module.scss';
import { useState } from 'react';

interface CodeBlockProps {
    language: string | null;
    value: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, value }) => {
    const { theme } = useTheme(); // 获取当前主题
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        copy(value);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // 2秒后重置状态
    };

    return (
        <div className={s.codeBlockContainer}>
            <Tooltip title={isCopied ? '已复制!' : '复制'}>
                <Button
                    icon={isCopied ? <CheckOutlined /> : <CopyOutlined />}
                    onClick={handleCopy}
                    className={s.copyButton}
                />
            </Tooltip>
            <SyntaxHighlighter
                language={language || 'text'}
                // 根据全局主题动态选择高亮样式
                style={theme === 'dark' ? atomDark : prism} 
                showLineNumbers // 显示行号
            >
                {value}
            </SyntaxHighlighter>
        </div>
    );
};

export default CodeBlock;