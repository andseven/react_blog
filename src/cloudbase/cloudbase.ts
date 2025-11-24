// src/cloudbase.ts
import cloudbase from "@cloudbase/js-sdk";

// 初始化一次
const envId = `${import.meta.env.VITE_CLOUDBASE_ENV}`;
const app = cloudbase.init({ env: envId });

// 匿名登录（可选，保证前端 SDK 有权限）
const auth = app.auth();
await auth.signInAnonymously().catch(console.error);

// 数据库实例
const db = app.database();

const call = (name: string, data: Record<string, any>) => app.callFunction({ name, data, env: envId });

export { app, auth, db, call };