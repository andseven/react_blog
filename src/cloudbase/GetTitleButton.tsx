import React, { useState } from "react";
// 假设这是您的 cloudbase 初始化文件
import { auth, db } from "./cloudbase";

// 获取数据库集合的引用
const collection = db.collection("articles");

const GetTitleButton: React.FC = () => {
    const [title, setTitle] = useState<string>("（尚未获取）");

    const handleClick = async () => {
        try {
            // 确保已登录
            const loginState = await auth.getLoginState();
            if (!loginState) {
                await auth.signInAnonymously();
            }

            // 查询文档
            const res = await collection.field({ title: true }).get();
            console.log(res);
            console.log(res.data[0].title)
            const docTitle = res.data[0]?.title || "未找到标题";
            setTitle(docTitle); // ✅ 更新状态（会触发组件重新渲染）
        } catch (err) {
            console.error("获取标题失败：", err);
            setTitle("加载失败");
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "40px" }}>
            <button onClick={handleClick}>获取标题</button>
            <p>文章标题：{title}</p>
        </div>
    );
};

export default GetTitleButton;
