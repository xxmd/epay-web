import {type FC, useEffect, useMemo, useState} from 'react';
import {Form, Input, InputNumber, message, Select, Table, Tag} from 'antd';
import orderApi, {
    type Order,
    type OrderForm,
    type OrderSearchForm,
    type SimpleApplication,
    type SimpleMethod
} from '@/api/pay/order';
import applicationApi from '@/api/pay/application';
import methodApi from '@/api/pay/method';
import {SearchForm} from '@/components/crud/SearchForm';
import {Toolbar} from '@/components/crud/Toolbar';
import {CrudModal} from '@/components/crud/CrudModal';
import {CrudLayout} from '@/components/crud/CrudLayout';
import {createActionColumn} from '@/components/crud/ActionColumn';
import {useCrudPage} from '@/hooks/useCrudPage';
import {auditColumns} from '@/components/crud/AuditColumns';

const OrderManagement: FC = () => {
    const [searchForm] = Form.useForm<OrderSearchForm>();
    const [applications, setApplications] = useState<SimpleApplication[]>([]);
    const [methods, setMethods] = useState<SimpleMethod[]>([]);

    const applicationOptions = useMemo(
        () => applications.map(a => ({label: a.name, value: a.id})),
        [applications],
    );

    const methodOptions = useMemo(
        () => methods.map(m => ({label: m.label, value: m.id})),
        [methods],
    );

    useEffect(() => {
        applicationApi.findAll()
            .then(res => setApplications(res))
            .catch(error => {
                void message.error('请求应用数据失败: ' + error);
            });
        methodApi.findAll()
            .then(setMethods)
            .catch(error => {
                void message.error('请求支付方式数据失败: ' + error);
            });
    }, []);

    const {
        loading,
        data,
        pagination,
        selectedRowKeys,
        setSelectedRowKeys,
        requestTableData,
        refreshTableData,
        reset,
        handleTableChange,
        deletingIds,
        deleteByIds,
        modalOpen,
        confirmLoading,
        form: modalForm,
        openCreate,
        openEdit,
        close,
        submit,
    } = useCrudPage<Order, OrderForm, OrderSearchForm>({
        api: orderApi,
        searchForm,
    });

    const editingId = Form.useWatch('id', modalForm);
    const isEditing = !!editingId;

    function handleCreate() {
        openCreate({});
    }

    function handleEdit(record: Order) {
        openEdit({
            id: record.id,
            productName: record.productName,
            productPrice: record.productPrice,
            productQuantity: record.productQuantity,
            remark: record.remark,
            applicationId: record.application.id,
            methodId: record.method.id,
        });
    }

    const columns = [
        {
            title: '订单号',
            dataIndex: 'orderNumber',
            key: 'orderNumber',
        },
        {
            title: '商品名称',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: '商品价格',
            dataIndex: 'productPrice',
            key: 'productPrice',
            render: (val: number) => `¥${val?.toFixed(2)}`,
        },
        {
            title: '商品数量',
            dataIndex: 'productQuantity',
            key: 'productQuantity',
        },
        {
            title: '总金额',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (val: number) => `¥${val?.toFixed(2)}`,
        },
        {
            title: '支付状态',
            dataIndex: 'payStatus',
            key: 'payStatus',
            render: (status: string) => (
                <Tag color={status === 'PAID' ? 'green' : 'orange'}>
                    {status === 'PAID' ? '已支付' : '未支付'}
                </Tag>
            ),
        },
        {
            title: '支付链接',
            dataIndex: 'payUrl',
            key: 'payUrl',
            ellipsis: true,
            render: (url: string) => url ? <a href={url} target="_blank" rel="noopener noreferrer">{url}</a> : '-',
        },
        {
            title: '所属应用',
            key: 'application',
            render: (_: unknown, record: Order) => record.application?.name || '-',
        },
        {
            title: '支付方式',
            key: 'method',
            render: (_: unknown, record: Order) => record.method?.label || '-',
        },
        {
            title: '支付时间',
            dataIndex: 'payDate',
            key: 'payDate',
            render: (val: Date | null) => val ? new Date(val).toLocaleString() : '-',
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
            ellipsis: true,
        },
        ...auditColumns,
        createActionColumn<Order>({
            entityName: '订单',
            updatePermission: 'pay:order:update',
            deletePermission: 'pay:order:delete',
            onEdit: handleEdit,
            onDelete: id => deleteByIds([id]),
            deletingIds,
        }),
    ];

    return (
        <CrudLayout>
            <SearchForm form={searchForm} onSearch={refreshTableData} onReset={reset}>
                <Form.Item name="orderNumber" label="订单号">
                    <Input allowClear/>
                </Form.Item>
                <Form.Item name="productName" label="商品名称">
                    <Input allowClear/>
                </Form.Item>
                <Form.Item name="payStatus" label="支付状态">
                    <Select
                        allowClear
                        options={[
                            {value: 'UNPAID', label: '未支付'},
                            {value: 'PAID', label: '已支付'},
                        ]}
                    />
                </Form.Item>
                <Form.Item name="applicationId" label="所属应用">
                    <Select allowClear options={applicationOptions}/>
                </Form.Item>
                <Form.Item name="methodId" label="支付方式">
                    <Select allowClear options={methodOptions}/>
                </Form.Item>
            </SearchForm>

            <Toolbar
                createPermission="pay:order:create"
                deletePermission="pay:order:delete"
                onCreate={handleCreate}
                onRefresh={refreshTableData}
                entityName="订单"
                selectedCount={selectedRowKeys.length}
                onBatchDelete={() => deleteByIds(selectedRowKeys as number[])}
            />

            <Table
                rowKey="id"
                loading={loading}
                columns={columns}
                dataSource={data}
                rowSelection={{
                    selectedRowKeys,
                    onChange: setSelectedRowKeys,
                }}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    showSizeChanger: true,
                    showTotal: total => `共 ${total} 条`,
                    onChange: (page, pageSize) => requestTableData(page, pageSize),
                }}
                onChange={handleTableChange}
            />

            <CrudModal
                open={modalOpen}
                confirmLoading={confirmLoading}
                onOk={submit}
                onCancel={close}
                form={modalForm}
                title="订单"
            >
                <Form.Item name="id" hidden>
                    <Input/>
                </Form.Item>
                <Form.Item name="productName" label="商品名称"
                           rules={[{required: true, message: '请输入商品名称'}]}>
                    <Input disabled={isEditing}/>
                </Form.Item>
                <Form.Item name="productPrice" label="商品价格"
                           rules={[{required: true, message: '请输入商品价格'}]}>
                    <InputNumber controls={false} disabled={isEditing} min={0.01} precision={2} style={{width: '100%'}} suffix="元"/>
                </Form.Item>
                <Form.Item name="productQuantity" label="商品数量"
                           rules={[{required: true, message: '请输入商品数量'}]}>
                    <InputNumber controls={false} disabled={isEditing} min={0.01} precision={2} style={{width: '100%'}}/>
                </Form.Item>
                <Form.Item name="applicationId" label="所属应用"
                           rules={[{required: true, message: '请选择所属应用'}]}>
                    <Select disabled={isEditing} allowClear options={applicationOptions}/>
                </Form.Item>
                <Form.Item name="methodId" label="支付方式"
                           rules={[{required: true, message: '请选择支付方式'}]}>
                    <Select disabled={isEditing} allowClear options={methodOptions}/>
                </Form.Item>
                <Form.Item name="remark" label="备注">
                    <Input.TextArea rows={3}/>
                </Form.Item>
            </CrudModal>
        </CrudLayout>
    );
};

export default OrderManagement;
