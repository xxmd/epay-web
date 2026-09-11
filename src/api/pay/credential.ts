import type {BaseEntity, Result} from "@/api/common";
import {createCrudApi} from "@/api/crud";
import request from "@/utils/request";

export interface SimpleCredential {
    id: number;
    name: string;
    enabled: boolean;
}

export interface CredentialUser {
    id: number;
    username: string;
}

export interface Credential extends BaseEntity {
    name: string;
    accessKey: string;
    accessSecret: string;
    enabled: boolean;
    remark: string;
    user: CredentialUser;
}

export interface CredentialForm {
    id?: number;
    name: string;
    enabled: boolean;
    remark?: string;
}

export interface CredentialSearchForm {
    name?: string | null;
    enabled?: boolean | null;
}

const BASE_PATH = '/pay/credential';

const crud = createCrudApi<Credential, CredentialForm, CredentialSearchForm>(BASE_PATH);

export default {
    ...crud,
    findAll(): Promise<Result<SimpleCredential[]>> {
        return request.get(`${BASE_PATH}/findAll`);
    },
};
