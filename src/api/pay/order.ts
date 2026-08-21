import type {BaseEntity} from "@/api/common";
import {createCrudApi} from "@/api/crud";

export interface SimpleApplication {
    id: number;
    name: string;
}

export interface SimpleMethod {
    id: number;
    label: string;
}

export interface SimpleMerchant {
    id: number;
    merchantId: number;
}

export interface Order extends BaseEntity {
    orderNumber: string;
    productName: string;
    productPrice: number;
    productQuantity: number;
    totalAmount: number;
    payUrl: string;
    payStatus: 'UNPAID' | 'PAID';
    payDate: Date | null;
    notifyParam: string;
    remark: string;
    merchant: SimpleMerchant;
    application: SimpleApplication;
    method: SimpleMethod;
}

export interface OrderForm {
    id?: number;
    productName: string;
    productPrice: number;
    productQuantity: number;
    remark?: string;
    applicationId: number;
    methodId: number;
}

export interface OrderSearchForm {
    orderNumber?: string | null;
    productName?: string | null;
    payStatus?: 'UNPAID' | 'PAID' | null;
    applicationId?: number | null;
    methodId?: number | null;
}

const BASE_PATH = '/pay/order';

const crud = createCrudApi<Order, OrderForm, OrderSearchForm>(BASE_PATH);

export default {
    ...crud,
};
