// src/components/ColorPickerButton.tsx

import React from "react";
import { generate, green, presetPalettes, red } from "@ant-design/colors";
import { ColorPicker } from "antd";
import type { ColorPickerProps } from "antd";
import { useTheme } from "../../context/useTheme";

type Presets = Required<ColorPickerProps>["presets"][number];

function genPresets(presets = presetPalettes) {
    return Object.entries(presets).map<Presets>(([label, colors]) => ({
        label,
        colors,
        key: label,
    }));
}

const ColorPickerButton: React.FC = () => {
    // 1. 从全局 context 获取当前的主题色和设置方法
    const { primaryColor, setPrimaryColor } = useTheme();

    const presets = genPresets({
        // 预设颜色中的 "primary" 现在会根据全局主题色动态生成
        primary: generate(primaryColor),
        red,
        green,
    });

    // 2. 当颜色选择完成时，调用全局的 setPrimaryColor 更新主题
    const handleColorChange: ColorPickerProps["onChangeComplete"] = (color) => {
        setPrimaryColor(color.toHexString?.() ?? color);
    };

    return (
        <ColorPicker
            presets={presets}
            value={primaryColor} // 3. 将 ColorPicker 的值绑定到全局状态
            onChangeComplete={handleColorChange} // 使用 onChangeComplete 性能更好
        />
    );
};

export default ColorPickerButton;
