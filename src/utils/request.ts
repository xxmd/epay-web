import axios from 'axios';
import { message } from 'antd';

const request = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
});

// 请求拦截器
request.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
});

// 响应拦截器
request.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
            void message.error('请求超时，请稍后重试');
        } else if (!error.response) {
            void message.error('网络异常，无法连接到服务器');
        } else {
            switch (error.response.status) {
                case 400:
                    void message.error(error.response.data?.message || '请求参数错误');
                    break;
                case 401:
                    void message.error('登录已过期，请重新登录');
                    break;
                case 403:
                    void message.error('权限不足');
                    break;
                case 500:
                    void message.error('服务器异常');
                    break;
                default:
                    void message.error(error.response.data?.message || '网络请求错误');
            }
        }
        return Promise.reject(error);
    }
);

export default request;
