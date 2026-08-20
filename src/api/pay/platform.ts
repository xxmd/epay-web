import type {BaseEntity} from "@/api/common";
import {createCrudApi} from "@/api/crud";
import request from "@/utils/request.ts";

export interface Platform extends BaseEntity {
    name: string;
    domainName: string;
    contact: string;
    sort: number;
    enabled: boolean;
    remark: string;
}

export interface SimplePlatform {
    id: number;
    name: string;
}

export interface PlatformForm {
    id?: number;
    name: string;
    domainName: string;
    contact: string;
    sort?: number;
    enabled: boolean;
    remark?: string;
}

export interface PlatformSearchForm {
    name?: string | null;
    contact?: string | null;
    enabled?: boolean | null;
}

const BASE_PATH = '/pay/platform';

const crud = createCrudApi<Platform, PlatformForm, PlatformSearchForm>(BASE_PATH);

export default {
    ...crud,
    findAll(): Promise<SimplePlatform[]> {
        return request.get(`${BASE_PATH}/findAll`);
    },
}
