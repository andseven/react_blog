import React, { useEffect, useState, useRef, useCallback } from "react";
import { db } from "../cloudbase/cloudbase";
import ArticleCard from "../components/ArticleCard/ArticleCard";
import type { Article } from "../types/article";
import s from "./ArticleList.module.scss";
import "@ant-design/v5-patch-for-react-19";

interface ArticleListProps {
    searchTerm: string;
}

const ARTICLE_LIST_CACHE_KEY = 'articleListState';
const PAGE_SIZE = 12;

// 将此函数移至组件外部，因为它是一个纯函数
const getInitialState = (currentSearchTerm: string) => {
    const cachedJSON = sessionStorage.getItem(ARTICLE_LIST_CACHE_KEY);
    if (cachedJSON) {
        try {
            const cachedState = JSON.parse(cachedJSON);
            if (cachedState.searchTerm === currentSearchTerm) {
                cachedState.articles = cachedState.articles.map((a: Article) => ({ ...a, date: new Date(a.date) }));
                return cachedState;
            }
        } catch (error) { console.error("解析缓存失败:", error); }
    }
    return { articles: [], page: 0, hasMore: true, searchTerm: currentSearchTerm };
};

const ArticleList: React.FC<ArticleListProps> = ({ searchTerm }) => {
    const [articles, setArticles] = useState(() => getInitialState(searchTerm).articles);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(() => getInitialState(searchTerm).hasMore);
    const pageRef = useRef(getInitialState(searchTerm).page);
    const loadMoreRef = useRef<HTMLDivElement>(null);
    const isInitialMount = useRef(true);

    // ---  修改 1: 优化 useCallback  ---
    // 现在 fetchArticles 只依赖于 searchTerm。它不再关心 loading 和 hasMore 状态，
    // 从而避免了因为 setLoading 导致函数被重新创建。
    const fetchArticles = useCallback(async (pageToFetch: number) => {
        setLoading(true);
        try {
            let query = db.collection("articles");
            if (searchTerm) {
                query = query.where({
                    title: db.RegExp({ regexp: searchTerm, options: "i" }),
                });
            }
            const res = await query
                .orderBy("date", "desc")
                .skip(pageToFetch * PAGE_SIZE)
                .limit(PAGE_SIZE)
                .get();

            const newArticles: Article[] = res.data.map((item: any) => ({
                ...item,
                _id: item._id,
                date: new Date(item.date),
            }));

            const isReset = pageToFetch === 0;
            setArticles(prev => isReset ? newArticles : [...prev, ...newArticles]);
            setHasMore(newArticles.length === PAGE_SIZE);
            pageRef.current = pageToFetch + 1;
        } catch (err) {
            console.error("加载文章失败:", err);
        } finally {
            setLoading(false);
        }
    }, [searchTerm]);

    // ---  修改 2: 简化 Effect 逻辑  ---

    // Effect 1: 负责初次加载和搜索词变化
    useEffect(() => {
        // 如果是首次挂载且已从缓存恢复数据，则不请求
        if (isInitialMount.current && articles.length > 0) {
            isInitialMount.current = false;
            setLoading(false);
            return;
        }

        isInitialMount.current = false;
        fetchArticles(0); // 无论是首次加载还是搜索，都获取第 0 页
    }, [searchTerm, fetchArticles]);

    // Effect 2: 负责缓存状态（保持不变）
    useEffect(() => {
        if (!isInitialMount.current) {
            const stateToCache = { searchTerm, articles, page: pageRef.current, hasMore };
            sessionStorage.setItem(ARTICLE_LIST_CACHE_KEY, JSON.stringify(stateToCache));
        }
    }, [searchTerm, articles, hasMore]);

    // Effect 3: 负责无限滚动
    useEffect(() => {
        if (!loadMoreRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                // 将 loading 和 hasMore 的判断移到这里，这是触发加载的最后一道关卡
                if (entries[0].isIntersecting && !loading && hasMore) {
                    fetchArticles(pageRef.current); // 请求下一页
                }
            },
            { rootMargin: "200px" }
        );
        observer.observe(loadMoreRef.current);

        const loadMoreEl = loadMoreRef.current;
        return () => {
            if (loadMoreEl) observer.unobserve(loadMoreEl);
        };
    }, [loading, hasMore, fetchArticles]); // 依赖项现在是正确的

    return (
        <div className={s.gridContainer}>
            {articles.map((article: Article) => (
                <ArticleCard key={article._id} article={article} />
            ))}
            {loading && <p>加载中...</p>}
            {hasMore && !loading && <div ref={loadMoreRef} style={{ height: "1px" }} />}
            {!hasMore && !loading && articles.length > 0 && <p className={s.finally}>没有更多文章了</p>}
            {!loading && articles.length === 0 && <p>没有找到相关文章</p>}
        </div>
    );
};

export default ArticleList;