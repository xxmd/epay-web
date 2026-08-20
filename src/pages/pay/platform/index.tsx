import {type FC} from 'react';
import {Form, Input, Radio, Select, Table, Tag} from 'antd';
import platformApi, {type Platform, type PlatformForm, type PlatformSearchForm} from '../../../api/pay/platform';
import {SearchForm} from '@/components/crud/SearchForm';
import {Toolbar} from '@/components/crud/Toolbar';
import {CrudModal} from '@/components/crud/CrudModal';
import {CrudLayout} from '@/components/crud/CrudLayout';
import {createActionColumn} from '@/components/crud/ActionColumn';
import {useCrudPage} from '@/hooks/useCrudPage';
import {auditColumns} from '@/components/crud/AuditColumns';

const PlatformManagement: FC = () => {
    const [searchForm] = Form.useForm<PlatformSearchForm>();

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
    } = useCrudPage<Platform, PlatformForm, PlatformSearchForm>({
        api: platformApi,
        searchForm,
    });

    function handleCreate() {
        openCreate({enabled: true});
    }

    const columns = [
        {
            title: '平台名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '平台域名',
            dataIndex: 'domainName',
            key: 'domainName',
        },
        {
            title: '联系方式',
            dataIndex: 'contact',
            key: 'contact',
        },
        {
            title: '排序',
            dataIndex: 'sort',
            key: 'sort',
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
        createActionColumn<Platform>({
            entityName: '支付平台',
            updatePermission: 'pay:platform:update',
            deletePermission: 'pay:platform:delete',
            onEdit: (platform) => openEdit(platform),
            onDelete: id => deleteByIds([id]),
            deletingIds,
        }),
    ];

    return (
        <CrudLayout>
            <SearchForm form={searchForm} onSearch={refreshTableData} onReset={reset}>
                <Form.Item name="name" label="平台名称">
                    <Input allowClear/>
                </Form.Item>
                <Form.Item name="contact" label="联系方式">
                    <Input allowClear/>
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
                createPermission="pay:platform:create"
                deletePermission="pay:platform:delete"
                onCreate={handleCreate}
                onRefresh={refreshTableData}
                entityName="支付平台"
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
                title="支付平台"
            >
                <Form.Item name="id" hidden>
                    <Input/>
                </Form.Item>
                <Form.Item name="name" label="平台名称" rules={[{required: true, message: '请输入平台名称'}]}>
                    <Input/>
                </Form.Item>
                <Form.Item name="domainName" label="平台域名" rules={[{required: true, message: '请输入平台域名'}]}>
                    <Input/>
                </Form.Item>
                <Form.Item name="contact" label="联系方式" rules={[{required: true, message: '请输入联系方式'}]}>
                    <Input/>
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

export default PlatformManagement;
