import type {BaseEntity, Result} from "@/api/common";
import {createCrudApi} from "@/api/crud";
import request from "@/utils/request.ts";

export interface Method extends BaseEntity {
    label: string;
    value: string;
    enabled: boolean;
}

export interface MethodForm {
    id?: number;
    label: string;
    value: string;
    enabled: boolean;
}

export interface MethodSearchForm {
    label?: string | null;
    enabled?: boolean | null;
}

export interface SimpleMethod {
    id: number;
    label: string;
}

const BASE_PATH = '/pay/method';

const crud = createCrudApi<Method, MethodForm, MethodSearchForm>(BASE_PATH);

export default {
    ...crud,
    findAll(): Promise<Result<SimpleMethod[]>> {
        return request.get(`${BASE_PATH}/findAll`);
    },
    findAvailable(): Promise<Result<SimpleMethod[]>> {
        return request.get(`${BASE_PATH}/findAvailable`);
    },
}
