import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// 1. 定义用户信息的类型接口
// 只定义你需要用到的字段，不要太多
export interface UserInfo {
    uid: string;
    email?: string;
    nickName?: string;
    avatarUrl?: string; // 如果将来有头像
    loginType?: string; // 登录方式
}

// 2. 定义 State 的结构
interface UserState {
    info: UserInfo | null; // 没登录就是 null
    isAuthenticated: boolean; // 方便判断是否登录
}

// 3. 初始状态
const initialState: UserState = {
    info: null,
    isAuthenticated: false,
};

// 4. 创建 Slice
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // 登录动作
        setUser: (state, action: PayloadAction<UserInfo>) => {
            state.info = action.payload;
            state.isAuthenticated = true;
        },
        // 登出/清除动作
        clearUser: (state) => {
            state.info = null;
            state.isAuthenticated = false;
        },
    },
});

// 导出 Actions
export const { setUser, clearUser } = userSlice.actions;

// 导出 Reducer 供 store 使用
export default userSlice.reducer;