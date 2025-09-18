import React, { useEffect } from "react";
import { db } from "../cloudbase/cloudbase"; // 引入统一实例

function Home() {
    const [id] = React.useState("88ce883568c9122900e1cc2b0af12e23"); // 示例文章ID

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const res = await db.collection("articles").doc(id).get();
                if (res.data) {
                    console.log("Fetched article:", res.data[0]); // 取 data 字段
                } else {
                    console.log("No article found with the given ID.");
                }
            } catch (err) {
                console.error("Failed to fetch article:", err);
            }
        };

        fetchArticle();
    }, [id]);

    return (
        <div>
            <h1>欢迎来到首页</h1>
            {/* <InsertArticleButton /> */}
            {/* <ReadArticleButton articleId="123" /> */}
        </div>
    );
}

export default Home;
