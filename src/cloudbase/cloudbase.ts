// src/cloudbase.ts
import cloudbase from "@cloudbase/js-sdk";

// 初始化一次
const app = cloudbase.init({
    env: import.meta.env.VITE_CLOUDBASE_ENV,
});

// 匿名登录（可选，保证前端 SDK 有权限）
const auth = app.auth();
auth.signInAnonymously().catch(console.error);

// 数据库实例
const db = app.database();

export { app, auth, db };
