import type {BaseEntity, Result} from '@/api/common';
import {createCrudApi} from '@/api/crud';
import type {FileEntity} from '@/api/resource/file';
import type {FileValue} from '@/components/upload/FileUpload';
import request from "@/utils/request.ts";

export interface Application extends BaseEntity {
    iconFile: FileEntity | null;
    name: string;
    platform: string;
    enabled: boolean;
    remark: string;
}

export interface ApplicationForm {
    id?: number;
    iconFile?: FileValue | null;
    iconFileId?: number;
    name: string;
    platform: string;
    enabled: boolean;
    remark?: string;
}

export interface ApplicationSearchForm {
    name?: string | null;
    platform?: string | null;
    enabled?: boolean | null;
}

export interface SimpleApplication {
    id: number;
    name: string;
}

const BASE_PATH = '/pay/application';

const crud = createCrudApi<Application, ApplicationForm, ApplicationSearchForm>(BASE_PATH);

export default {
    ...crud,
    findAll(): Promise<Result<SimpleApplication[]>> {
        return request.get(`${BASE_PATH}/findAll`);
    },
};
