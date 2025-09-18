// src/routes.ts
import { lazy } from "react";
import type { ComponentType } from "react";
import {
    MailOutlined,
    AppstoreOutlined,
    SettingOutlined,
} from "@ant-design/icons";

// 路由配置接口
export interface AppRoute {
    path: string; // URL 路径
    label: string; // 菜单或页面显示名称
    icon?: ComponentType; // 菜单图标组件类型
    element?: ComponentType; // 路由对应页面组件
    showInNav?: boolean; // 是否在导航栏显示，默认为 true
}

// 懒加载页面组件
const Home = lazy(() => import("../pages/Home"));
const ArticlesList = lazy(() => import("../pages/ArticleListPage/ArticleListPage"));
const About = lazy(() => import("../pages/About"));
const ArticleDetail = lazy(() => import('../pages/ArticleDetail'));


// 统一路由和菜单配置
export const routes: AppRoute[] = [
    {
        path: "/",
        label: "首页",
        icon: MailOutlined,
        element: Home,
        showInNav: true,
    },
    {
        path: "/articleslist",
        label: "文章列表",
        icon: AppstoreOutlined,
        element: ArticlesList,
        showInNav: true,
    },
    {
        path: "/about",
        label: "关于我",
        icon: SettingOutlined,
        element: About,
        showInNav: true,
    },
    {
        path: '/article/:id',
        label: '文章详情',
        element: ArticleDetail,
        showInNav: false,
    },
];


export const navRoutes = routes.filter(route => route.showInNav);