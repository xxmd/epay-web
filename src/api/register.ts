import request from '@/utils/request';

const BASE_PATH = '/register';

export interface SendCaptchaResponse {
    success: boolean;
    message?: string;
}

export interface EmailRegisterForm {
    email: string;
    emailCaptcha: string;
    password: string;
    confirmPassword: string;
}

export interface EmailRegisterResponse {
    success: boolean;
    message?: string;
    data: Record<string, unknown>;
}

export default {
    sendEmailCaptcha(email: string): Promise<SendCaptchaResponse> {
        return request.get(`${BASE_PATH}/sendEmailCaptcha/${email}`);
    },
    byEmail(data: EmailRegisterForm): Promise<EmailRegisterResponse> {
        return request.post(`${BASE_PATH}/byEmail`, data);
    },
};
