import React, { Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/Nav/NavBar";
import { routes } from "./routes/routes";
import BackgroundCanvas from "./components/Background/Background";
import { useTheme } from "./context/useTheme";
import { ConfigProvider, theme } from "antd";
import styles from "./App.module.scss";
import { ThemeProvider } from "./context/ThemeContext";
import { WEBSITE_TITLE } from "./config/siteConfig";
import BackToTop from "./components/BackToTop/BackToTop";

const AppContent: React.FC = () => {
    const { theme: currentTheme, primaryColor } = useTheme();

    useEffect(() => {
        document.title = WEBSITE_TITLE;
    }, []);

    return (
        <ConfigProvider
            theme={{
                // 1. antd 内置的暗色主题算法
                algorithm:
                    currentTheme === "dark"
                        ? theme.darkAlgorithm
                        : theme.defaultAlgorithm,

                // 2. (可选) 自定义 token 来微调主题
                token: {
                    colorPrimary: primaryColor,
                },
            }}
        >
            <Router basename="/react_blog">
                <BackgroundCanvas color={primaryColor} />
                <NavBar />
                <BackToTop />
                <main className={styles.mainContent}>
                    <Suspense
                        fallback={
                            <div className={styles.loader}>Loading...</div>
                        }
                    >
                        <Routes>
                            {routes.map((r) => (
                                <Route
                                    key={r.path}
                                    path={r.path}
                                    element={r.element ? <r.element /> : null}
                                />
                            ))}
                        </Routes>
                    </Suspense>
                </main>
            </Router>
        </ConfigProvider>
    );
};

const App: React.FC = () => {
    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    );
};

export default App;
