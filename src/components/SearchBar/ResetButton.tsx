import React from "react";
// 1. 引入 useState 和 Button
import { Button } from "antd";
import { RedoOutlined } from '@ant-design/icons'; // 引入一个合适的图标
import type { GetProps } from "antd";

type ResetButtonProps = GetProps<typeof Button>;

const ResetButton: React.FC<ResetButtonProps> = (props) => {
    return (
        <Button {...props} icon={<RedoOutlined />} aria-label="重置搜索" title="重置" />
    );
};

export default ResetButton;
