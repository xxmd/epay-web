import request from '@/utils/request';
import type {Pageable, PagedModel, Result, Sort} from "@/api/common";

interface CrudForm {
    id?: number;
}

export function createCrudApi<
    T,
    F extends CrudForm,
    S
>(basePath: string) {
    return {
        create(data: F): Promise<Result<void>> {
            return request.post(`${basePath}/create`, data);
        },
        read(data: S, pageable: Pageable, sorts?: Sort[]): Promise<Result<PagedModel<T>>> {
            return request.post(`${basePath}/read`, data, {
                params: {
                    page: pageable.page - 1,
                    size: pageable.size,
                    ...(sorts && sorts.length > 0 ? {sort: sorts.map(s => `${s.property},${s.direction}`)} : {}),
                },
                paramsSerializer: {indexes: null},
            });
        },
        update(data: F): Promise<Result<void>> {
            return request.post(`${basePath}/update`, data);
        },
        delete(ids: number[]): Promise<Result<void>> {
            return request.post(`${basePath}/delete`, ids);
        },
    };
}
