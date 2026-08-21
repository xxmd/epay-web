import request from '@/utils/request';
import type {Result} from '@/api/common';

export interface EnumOption {
    value: string;
    label: string;
}

export enum EnumName {
    MenuType = 'MenuType',
    Platform = 'Platform',
}

const BASE_PATH = '/enum';

export default {
    get(name: EnumName): Promise<Result<EnumOption[]>> {
        return request.get(`${BASE_PATH}/${name}`);
    },
};
