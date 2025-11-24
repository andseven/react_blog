// src/components/NavBar/index.tsx

import { Menu, Button, Tooltip, Dropdown, Avatar } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { navRoutes } from "../../routes/routes";
import s from "./index.module.scss";
import { useTheme } from "../../context/useTheme";
import ColorButton from "../Theme/ColorButton";
import { SunOutlined, MoonOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";

import { CloudContext } from "../../cloudbase/cloudContext"; // 请确认路径是否正确
import { useSelector } from "react-redux";
import { useContext } from "react";

const NavBar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // 从全局 Context 获取主题状态和切换函数
    const { theme, toggleTheme } = useTheme();
    const tooltipTitle = theme === "dark" ? "切换至日间模式" : "切换至夜间模式";

    const cloud = useContext(CloudContext);
    const user = useSelector((state: any) => state.user.info);

    const items = navRoutes.map((r) => ({
        label: r.label,
        key: r.path,
        icon: r.icon ? <r.icon /> : undefined,
    }));

    // --- 登录跳转 ---
    const handleToLogin = () => {
        if (!cloud) {
            message.error("云服务未初始化");
            return;
        }

        const auth = cloud.auth();
        
        // 自动构建回调地址：当前域名 + basename
        // 比如：http://localhost:5173/react_blog/
        const currentDomain = window.location.origin; 
        const callbackUrl = `${currentDomain}/react_blog/`; 

        auth.toDefaultLoginPage({
            redirect_uri: callbackUrl,
        });
    };

    // --- 退出登录 ---
    const handleLogout = async () => {
        if (!cloud) return;
        
        try {
            await cloud.auth().signOut();
            message.success("已退出登录");
            // 退出后刷新页面，清空 Redux 状态
            window.location.reload();
        } catch (err) {
            console.error(err);
            message.error("退出失败");
        }
    };

    // --- 已登录用户的下拉菜单 ---
    const userMenuProps = {
        items: [
            {
                key: 'email',
                label: <span style={{ cursor: 'default', color: '#999' }}>{user?.email || '未知用户'}</span>,
                disabled: true, // 仅做展示，不可点击
            },
            {
                type: 'divider',
            },
            {
                key: 'logout',
                label: '退出登录',
                icon: <LogoutOutlined />,
                onClick: handleLogout
            }
        ]
    };

    return (
        <div className={s.navbarCenter}>
            <div className={s.menuContainer}>
                <Menu
                    mode="horizontal"
                    items={items}
                    selectedKeys={[location.pathname]}
                    onClick={(e) => navigate(e.key)}
                />
            </div>

            <div className={s.actionsContainer}>
                <Tooltip title="更改主题颜色">
                    <div><ColorButton /></div>
                </Tooltip>
                
                <Tooltip title={tooltipTitle}>
                    <Button
                        type="default"
                        onClick={toggleTheme}
                        icon={theme === "dark" ? <SunOutlined /> : <MoonOutlined />}
                        style={{ marginRight: 8 }} // 稍微加一点间距
                    />
                </Tooltip>

                {/* 4. 登录状态条件渲染 */}
                {user ? (
                    // --- 已登录：显示头像和下拉菜单 ---
                    <Dropdown menu={userMenuProps} placement="bottomRight">
                        <Avatar 
                            style={{ backgroundColor: '#1677ff', cursor: 'pointer', marginLeft: 8 }} 
                            icon={<UserOutlined />} 
                            src={user.avatarUrl} // 如果你的用户信息里有头像链接
                        >
                            {/* 如果没有头像链接，取邮箱首字母 */}
                            {user.email ? user.email[0].toUpperCase() : 'U'}
                        </Avatar>
                    </Dropdown>
                ) : (
                    // --- 未登录：显示登录按钮 ---
                    <Button type="primary" onClick={handleToLogin} style={{ marginLeft: 8 }}>
                        登录
                    </Button>
                )}
            </div>
        </div>
    );
};

export default NavBar;
