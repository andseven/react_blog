    // src/pages/ArticleListPage/ArticleListPage.tsx

    import React, { useState } from "react";
    import SearchBar from "../../components/SearchBar/SearchBar";
    import ArticleList from "../ArticlesList";
    import s from "./ArticleListPage.module.scss";

    const ArticleListPage: React.FC = () => {
        // 父组件只关心搜索词
        const [searchTerm, setSearchTerm] = useState(
            () => sessionStorage.getItem('searchTermCache') || ''
        );

        const handleSearch = (query: string) => {
            sessionStorage.setItem('searchTermCache', query); // 同时也缓存搜索词
            setSearchTerm(query);
        };

        return (
            <div className={s.container}>
                <div className={s.searchBarContainer}>
                    <SearchBar onSearchSubmit={handleSearch} initialValue={searchTerm} />
                </div>
                <ArticleList searchTerm={searchTerm} />
            </div>
        );
    };

    export default ArticleListPage;
