// src/components/NavBar/index.tsx

import { Menu, Button, Tooltip } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { navRoutes } from "../../routes/routes";
import s from "./index.module.scss";
import { useTheme } from "../../context/useTheme";
import ColorButton from "../Theme/ColorButton";
import { SunOutlined, MoonOutlined } from "@ant-design/icons";

const NavBar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // 从全局 Context 获取主题状态和切换函数
    const { theme, toggleTheme } = useTheme();
    const tooltipTitle = theme === "dark" ? "切换至日间模式" : "切换至夜间模式";

    const items = navRoutes.map((r) => ({
        label: r.label,
        key: r.path,
        icon: r.icon ? <r.icon /> : undefined,
    }));

    return (
        // 这个父容器将作为定位的基准
        <div className={s.navbarCenter}>
            {/* 1. 为菜单创建一个独立的容器 */}
            <div className={s.menuContainer}>
                <Menu
                    mode="horizontal"
                    items={items}
                    selectedKeys={[location.pathname]}
                    onClick={(e) => navigate(e.key)}
                />
            </div>

            {/* 2. 为右侧的所有操作按钮创建一个容器 */}
            <div className={s.actionsContainer}>
                <Tooltip title="更改主题颜色">
                    <div>
                        <ColorButton />
                    </div>
                </Tooltip>
                <Tooltip title={tooltipTitle}>
                    <Button
                        type="default"
                        onClick={toggleTheme}
                        icon={
                            theme === "dark" ? (
                                <SunOutlined />
                            ) : (
                                <MoonOutlined />
                            )
                        }
                        aria-label={tooltipTitle}
                    />
                </Tooltip>
            </div>
        </div>
    );
};

export default NavBar;
