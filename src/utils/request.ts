import axios from 'axios';
import {message, Modal} from 'antd';

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
        const result = response.data;
        
        // 检查 Result 对象的 success 字段
        if (result.success === false) {
            // 根据 Result 中的 code 处理
            switch (result.code) {
                case 401:
                    Modal.confirm({
                        title: '登录已过期',
                        content: '您的登录信息已失效，请重新登录后继续操作。您可以选择留在当前页面或立即重新登录。',
                        okText: '重新登录',
                        cancelText: '留在页面',
                        onOk: () => {
                            localStorage.removeItem('token');
                            window.location.href = '/login';
                        },
                    });
                    break;
                case 403:
                    void message.error('您没有权限执行此操作，请联系管理员');
                    break;
                case 500:
                    void message.error('服务器内部错误，请稍后重试或联系技术支持');
                    break;
                default:
                    void message.error(result.message || '操作失败');
            }
            return Promise.reject(new Error(result.message || '操作失败'));
        }
        
        return result;
    },
    (error) => {
        if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
            void message.error('请求超时，请稍后重试');
        } else if (!error.response) {
            void message.error('网络异常，无法连接到服务器');
        } else {
            // HTTP 错误状态码处理
            const status = error.response.status;
            const result = error.response.data;
            
            switch (status) {
                case 401:
                    Modal.confirm({
                        title: '登录已过期',
                        content: '您的登录信息已失效，请重新登录后继续操作。您可以选择留在当前页面或立即重新登录。',
                        okText: '重新登录',
                        cancelText: '留在页面',
                        onOk: () => {
                            localStorage.removeItem('token');
                            window.location.href = '/login';
                        },
                    });
                    break;
                case 403:
                    void message.error('您没有权限执行此操作，请联系管理员');
                    break;
                case 500:
                    void message.error(result?.message || '服务器内部错误，请稍后重试或联系技术支持');
                    break;
                default:
                    void message.error(result?.message || '网络请求错误');
            }
        }
        return Promise.reject(error);
    }
);

export default request;
