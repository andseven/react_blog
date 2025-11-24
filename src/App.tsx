import React, { Suspense, useEffect, useContext } from "react";
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
import { CloudContext } from "./cloudbase/cloudContext"; // 2. 引入你的 CloudContext (请确认路径)
import { useDispatch } from "react-redux"; // 假设你使用 Redux 存用户信息
import { setUser, clearUser } from "./store/userSlice";

const AppContent: React.FC = () => {
    const { theme: currentTheme, primaryColor } = useTheme();

    // 3. 获取云开发实例
    const cloud = useContext(CloudContext);
    const dispatch = useDispatch(); // 如果不用 Redux，这里可以忽略

    useEffect(() => {
        document.title = WEBSITE_TITLE;
    }, []);

    // 4. 新增：全局登录状态监听
    useEffect(() => {
        if (!cloud) return;
        const auth = cloud.auth();

        // 核心：当用户从腾讯云登录页跳回来，或者刷新页面时，这里会触发
        const observer = auth.onLoginStateChanged((loginState) => {
            if (loginState) {
                console.log("用户已登录:", loginState.user);
                // 将用户信息存入 Redux 或 Context
                const cleanUserData = {
                    uid: loginState.user.uid,
                    email: loginState.user.email,
                    nickName: loginState.user.nickName,
                    loginType: loginState.loginType,
                };
                dispatch(setUser(cleanUserData));
            } else {
                console.log("用户未登录");
                dispatch(clearUser());
            }
        });

        // return () => {
        //     // 清除监听
        //     // observer.close(); // 视 SDK 版本而定，有些版本不需要手动清除或方法名不同
        // };
    }, [cloud, dispatch]);

    return (
        <ConfigProvider
            theme={{
                algorithm:
                    currentTheme === "dark"
                        ? theme.darkAlgorithm
                        : theme.defaultAlgorithm,
                token: { colorPrimary: primaryColor },
            }}
        >
            {/* 注意：basename 必须与你回调地址的路径一致 */}
            <Router basename="/react_blog">
                <BackgroundCanvas color={primaryColor} />

                {/* NavBar 通常是放置登录按钮的地方。
                不需要传 props，直接在 NavBar 内部再次 useContext(CloudContext) 即可
                */}
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
