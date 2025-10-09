import React, { useState, useRef } from "react";
// 假设这是您的 cloudbase 初始化文件
import { auth, db } from "./cloudbase";

// 获取数据库集合的引用
const collection = db.collection("articles");

const BatchImportMarkdown: React.FC = () => {
    const [statusMessage, setStatusMessage] = useState<string>(
        "请选择一个 Markdown 文件进行批量导入。"
    );
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    // 使用 ref 来引用文件输入元素
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        setIsProcessing(true);
        setStatusMessage("正在读取和解析文件...");

        const reader = new FileReader();
        // 设置当文件读取完成时的回调函数
        reader.onload = async (e) => {
            let content = e.target?.result as string;
            if (!content) {
                setStatusMessage("错误：无法读取文件内容。");
                setIsProcessing(false);
                return;
            }

            // 如果文件直接以 '### ' 开头，在前面添加换行符以确保第一个文章能被正确分割
            if (content.startsWith("### ")) {
                content = "\n" + content;
            }

            // 使用 '\n### ' 作为分隔符，这意味着每个 '###' 标题都需要另起一行
            //    split 方法会返回一个字符串数组
            const chunks = content.split("\n### ");

            // 移除第一个元素，因为它现在始终是第一个 '###' 之前的内容（现在是空的或一些前言）
            const articleChunks = chunks.slice(1);

            if (articleChunks.length === 0) {
                setStatusMessage(
                    "未找到以 '### ' 开头的文章片段，请检查文件格式。"
                );
                setIsProcessing(false);
                return;
            }

            setStatusMessage(
                `已解析出 ${articleChunks.length} 篇文章，准备插入数据库...`
            );

            const articlesToInsert = articleChunks.map((chunk) => {
                // 找到第一个换行符的位置
                const firstNewlineIndex = chunk.indexOf("\n");
                // 标题是第一个换行符之前的内容
                const title = chunk.substring(0, firstNewlineIndex).trim();
                // 完整内容需要重新加上 '###'，以保持 Markdown 格式
                const articleContent = `### ${chunk.trim()}`;
                // 从内容中生成一个简单的摘要
                const summary =
                    articleContent
                        .substring(0, 100)
                        .replace(/\s+/g, " ")
                        .trim() + "...";

                // 按照您提供的数据库样本格式构造对象
                return {
                    title,
                    content: articleContent,
                    date: new Date(), // 使用当前时间作为文章日期
                    author: "批量导入", // 添加默认作者
                    summary: summary, // 添加自动生成的摘要
                    likes: 0, // 添加默认点赞数
                    comments: [], // 评论默认为空数组
                };
            });

            // --- 批量插入数据库 ---
            try {
                const loginState = await auth.getLoginState();
                if (!loginState) {
                    await auth.signInAnonymously();
                }

                // [修复] 获取云端所有文章的标题，通过循环分页获取全部数据
                setStatusMessage("正在获取云端文章列表以防重复...");
                const MAX_LIMIT_PER_QUERY = 100; // 云开发数据库单次查询上限
                const allTitles: string[] = [];
                let skip = 0;

                while (true) {
                    const snapshot = await collection
                        .field({ title: true })
                        .skip(skip)
                        .limit(MAX_LIMIT_PER_QUERY)
                        .get();

                    if (snapshot.data.length === 0) {
                        break; // 没有更多数据了，退出循环
                    }

                    // 将本次查询到的标题添加到总列表中
                    snapshot.data.forEach((doc) => allTitles.push(doc.title));
                    skip += snapshot.data.length;

                    // 如果返回的数据量小于请求的上限，说明已经是最后一页
                    if (snapshot.data.length < MAX_LIMIT_PER_QUERY) {
                        break;
                    }
                }
                const existingTitles = new Set(allTitles);
                setStatusMessage(
                    `云端存在 ${existingTitles.size} 篇文章。开始对比并插入新文章...`
                );

                let successCount = 0;
                let skippedCount = 0;

                for (const article of articlesToInsert) {
                    if (existingTitles.has(article.title)) {
                        skippedCount++;
                        console.log(
                            `标题: "${article.title}" 已存在，跳过插入。`
                        );
                        continue;
                    }

                    await collection.add(article);
                    successCount++;
                    setStatusMessage(
                        `正在插入... (成功: ${successCount} / 跳过: ${skippedCount})`
                    );
                }

                setStatusMessage(
                    `批量导入完成！成功插入 ${successCount} 篇新文章，因标题重复跳过 ${skippedCount} 篇。`
                );
            } catch (error) {
                console.error("数据库操作失败:", error);
                setStatusMessage(`导入过程中发生错误，请查看控制台。`);
            } finally {
                setIsProcessing(false);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            }
        };

        // 以文本格式读取文件
        reader.readAsText(file);
    };

    return (
        <div
            style={{
                border: "1px solid #ccc",
                padding: "20px",
                borderRadius: "8px",
                textAlign: "center",
            }}
        >
            <h4>Markdown 批量导入工具</h4>
            <p style={{ color: "#666", minHeight: "40px" }}>{statusMessage}</p>
            <input
                type="file"
                accept=".md, .markdown"
                onChange={handleFileChange}
                disabled={isProcessing}
                ref={fileInputRef}
                style={{ display: "block", margin: "20px auto" }}
            />
        </div>
    );
};

export default BatchImportMarkdown;
