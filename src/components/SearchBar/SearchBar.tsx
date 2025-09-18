// src/components/SearchBar/SearchBar.tsx

import React, { useState } from "react";
import { Input } from "antd";
import type { GetProps } from "antd";
import { RedoOutlined } from "@ant-design/icons";
import { useTheme } from "../../context/ThemeContext";

type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;

interface SearchBarProps {
    onSearchSubmit: (query: string) => void;
    initialValue?: string; // 可选的初始值属性
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearchSubmit, initialValue }) => {
    const [value, setValue] = useState(initialValue || "");
    const { primaryColor } = useTheme();

    // 搜索逻辑
    const onSearch: SearchProps["onSearch"] = (val) => {
        onSearchSubmit(val.trim());
        console.log("Search submitted:", val.trim());
    };

    // 点击重置
    const handleReset = () => {
        setValue("");
        onSearchSubmit(""); // 触发外部清空逻辑
    };

    return (
        <Search
            value={value}
            placeholder="根据文章标题筛选..."
            onChange={(e) => setValue(e.target.value)}
            onSearch={onSearch}
            enterButton
            // 自定义 suffix，把原来的 icon 包在一个可点区域
            suffix={
                <RedoOutlined
                    onClick={handleReset}
                    style={{
                        fontSize: 16,
                        color: primaryColor,
                        cursor: "pointer",
                    }}
                />
            }
        />
    );
};

export default SearchBar;
