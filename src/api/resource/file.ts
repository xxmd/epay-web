import type {BaseEntity, Pageable, PagedModel, Sort} from "@/api/common";
import request from "@/utils/request.ts";

export interface FileEntity extends BaseEntity {
    name: string;
    size: string;
    path: string;
}

export interface FileSearchForm {
    name?: string | null;
}

const BASE_PATH = '/resource/file';

export function getFileUrl(path: string): string {
    return `${import.meta.env.VITE_API_BASE_URL}/files/${path}`;
}


export default {
    read(data: FileSearchForm, pageable: Pageable, sorts?: Sort[]): Promise<PagedModel<FileEntity>> {
        return request.post(`${BASE_PATH}/read`, data, {
            params: {
                page: pageable.page - 1,
                size: pageable.size,
                ...(sorts && sorts.length > 0 ? {sort: sorts.map(s => `${s.property},${s.direction}`)} : {}),
            },
            paramsSerializer: {indexes: null},
        });
    },
}
