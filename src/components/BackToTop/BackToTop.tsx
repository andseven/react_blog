// src/components/BackToTop.tsx
import React from "react";
import { FloatButton } from "antd";

const BackToTop: React.FC = () => {
    return (
        <FloatButton.BackTop
            visibilityHeight={200} // 滚动超过200px才显示
            style={{ right: 24, bottom: 24 }} // 按钮位置
        />
    );
};

export default BackToTop;
