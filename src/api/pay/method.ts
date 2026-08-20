import type {BaseEntity} from "@/api/common";
import {createCrudApi} from "@/api/crud";

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

const BASE_PATH = '/pay/method';

const crud = createCrudApi<Method, MethodForm, MethodSearchForm>(BASE_PATH);

export default {
    ...crud,
    async findAll(): Promise<Method[]> {
        const res = await crud.read({}, {page: 1, size: 1000});
        return res.content;
    },
}
