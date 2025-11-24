import cloudbase from '@cloudbase/js-sdk'
import { createContext } from 'react';

export const cloud = cloudbase.init({
  env: "cloud1-5ggkn0jjf3cb85b9", // 环境 ID
  region: "ap-shanghai" // 地域，不传默认为上海地域
})

export const CloudContext = createContext(cloud);