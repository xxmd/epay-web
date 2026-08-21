import request from '@/utils/request';
import type {Result} from '@/api/common';

export interface LoginForm {
    username: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message?: string;
    data: Record<string, unknown>;
}
const BASE_PATH = '/auth';

export default {
    login(data: LoginForm): Promise<Result<Record<string, unknown>>> {
        return request.post(`${BASE_PATH}/login`, data);
    }
};
