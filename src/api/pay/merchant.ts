import type {BaseEntity} from "@/api/common";
import {createCrudApi} from "@/api/crud";
import type {Method} from "@/api/pay/method";

export interface SimplePlatform {
    id: number;
    name: string;
}

export interface Merchant extends BaseEntity {
    merchantId: number;
    md5SecretKey: string;
    sort: number;
    enabled: boolean;
    remark: string;
    platform: SimplePlatform;
    methodList: Method[];
}

export interface MerchantForm {
    id?: number;
    merchantId: number;
    md5SecretKey: string;
    platformId: number;
    methodIdSet?: number[];
    sort?: number;
    enabled: boolean;
    remark?: string;
}

export interface MerchantSearchForm {
    merchantId?: number | null;
    enabled?: boolean | null;
    platformId?: number | null;
}

const BASE_PATH = '/pay/merchant';

const crud = createCrudApi<Merchant, MerchantForm, MerchantSearchForm>(BASE_PATH);

export default {
    ...crud,
}
