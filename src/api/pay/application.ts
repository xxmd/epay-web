import type {BaseEntity} from '@/api/common';
import {createCrudApi} from '@/api/crud';
import type {FileEntity} from '@/api/resource/file';
import type {FileValue} from '@/components/upload/FileUpload';

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

const BASE_PATH = '/pay/application';

const crud = createCrudApi<Application, ApplicationForm, ApplicationSearchForm>(BASE_PATH);

export default {
    ...crud,
};
