import {type FC, useEffect, useMemo, useState} from 'react';
import {Form, Input, InputNumber, message, Radio, Select, Table, Tag} from 'antd';
import merchantApi, {type Merchant, type MerchantForm, type MerchantSearchForm} from '../../../api/pay/merchant';
import platformApi, {type SimplePlatform} from '../../../api/pay/platform';
import methodApi, {type SimpleMethod} from '@/api/pay/method';
import {SearchForm} from '@/components/crud/SearchForm';
import {Toolbar} from '@/components/crud/Toolbar';
import {CrudModal} from '@/components/crud/CrudModal';
import {CrudLayout} from '@/components/crud/CrudLayout';
import {createActionColumn} from '@/components/crud/ActionColumn';
import {useCrudPage} from '@/hooks/useCrudPage';
import {auditColumns} from '@/components/crud/AuditColumns';

const MerchantManagement: FC = () => {
    const [searchForm] = Form.useForm<MerchantSearchForm>();
    const [platforms, setPlatforms] = useState<SimplePlatform[]>([]);
    const [methods, setMethods] = useState<SimpleMethod[]>([]);

    const platformOptions = useMemo(
        () => platforms.map(p => ({label: p.name, value: p.id})),
        [platforms],
    );

    const methodOptions = useMemo(
        () => methods.map(m => ({label: m.label, value: m.id})),
        [methods],
    );

    function requestPlatforms() {
        platformApi.findAll().then(res => {
            setPlatforms(res);
        }).catch(error => {
            void message.error('请求平台数据失败: ' + error);
        });
    }

    function requestMethods() {
        methodApi.findAll().then(methods => {
            setMethods(methods);
        }).catch(error => {
            void message.error('请求支付方式数据失败: ' + error);
        });
    }

    useEffect(() => {
        requestPlatforms();
        requestMethods();
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
    } = useCrudPage<Merchant, MerchantForm, MerchantSearchForm>({
        api: merchantApi,
        searchForm,
    });

    function handleCreate() {
        openCreate({enabled: true, methodIdSet: []});
    }

    function handleEdit(merchant: Merchant) {
        openEdit({
            ...merchant,
            platformId: merchant.platform.id,
            methodIdSet: merchant.methodList.map(m => m.id),
        });
    }

    const columns = [
        {
            title: '商户ID',
            dataIndex: 'merchantId',
            key: 'merchantId',
        },
        {
            title: '所属平台',
            key: 'platform',
            render: (_: unknown, merchant: Merchant) => merchant.platform?.name || '-',
        },
        {
            title: '支付方式',
            key: 'methodList',
            render: (_: unknown, merchant: Merchant) => (
                <>
                    {merchant.methodList?.map(method => (
                        <Tag key={method.id}>{method.label}</Tag>
                    ))}
                </>
            ),
        },
        {
            title: '状态',
            dataIndex: 'enabled',
            key: 'enabled',
            render: (enabled: boolean) => (
                <Tag color={enabled ? 'green' : 'red'}>{enabled ? '启用' : '禁用'}</Tag>
            ),
        },
        ...auditColumns,
        createActionColumn<Merchant>({
            entityName: '商户',
            updatePermission: 'pay:merchant:update',
            deletePermission: 'pay:merchant:delete',
            onEdit: handleEdit,
            onDelete: id => deleteByIds([id]),
            deletingIds,
        }),
    ];

    return (
        <CrudLayout>
            <SearchForm form={searchForm} onSearch={refreshTableData} onReset={reset}>
                <Form.Item name="merchantId" label="商户ID">
                    <Input allowClear/>
                </Form.Item>
                <Form.Item name="platformId" label="所属平台">
                    <Select
                        allowClear
                        options={platformOptions}
                    />
                </Form.Item>
                <Form.Item name="enabled" label="状态">
                    <Select
                        style={{width: 200}}
                        allowClear
                        options={[
                            {value: true, label: '启用'},
                            {value: false, label: '禁用'},
                        ]}
                    />
                </Form.Item>
            </SearchForm>

            <Toolbar
                createPermission="pay:merchant:create"
                deletePermission="pay:merchant:delete"
                onCreate={handleCreate}
                onRefresh={refreshTableData}
                entityName="商户"
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
                title="商户"
            >
                <Form.Item name="id" hidden>
                    <Input/>
                </Form.Item>
                <Form.Item name="merchantId" label="商户ID" rules={[{required: true, message: '请输入商户ID'}]}>
                    <InputNumber min={1} style={{width: '100%'}}/>
                </Form.Item>
                <Form.Item name="md5SecretKey" label="MD5私钥" rules={[{required: true, message: '请输入MD5私钥'}]}>
                    <Input.Password/>
                </Form.Item>
                <Form.Item name="platformId" label="所属平台" rules={[{required: true, message: '请选择所属平台'}]}>
                    <Select
                        allowClear
                        options={platformOptions}
                        placeholder="请选择支付平台"
                    />
                </Form.Item>
                <Form.Item name="methodIdSet" label="支付方式">
                    <Select
                        mode="multiple"
                        allowClear
                        options={methodOptions}
                        placeholder="请选择支付方式"
                    />
                </Form.Item>
                <Form.Item name="sort" label="排序" rules={[
                    {
                        validator: (_, value) => {
                            if (!value && value !== 0) return Promise.resolve();
                            const num = Number(value);
                            if (isNaN(num) || !Number.isInteger(num) || num < 1 || num > 100) {
                                return Promise.reject(new Error('排序值必须为1-100之间的整数'));
                            }
                            return Promise.resolve();
                        },
                    },
                ]}>
                    <Input placeholder="可选，1-100"/>
                </Form.Item>
                <Form.Item name="enabled" label="状态" initialValue={true}>
                    <Radio.Group>
                        <Radio value={true}>启用</Radio>
                        <Radio value={false}>禁用</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item name="remark" label="备注">
                    <Input.TextArea rows={3}/>
                </Form.Item>
            </CrudModal>
        </CrudLayout>
    );
};

export default MerchantManagement;
