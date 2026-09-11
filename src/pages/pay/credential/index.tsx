import {type FC} from 'react';
import {Form, Input, Radio, Select, Table, Tag, Typography} from 'antd';
import credentialApi, {type Credential, type CredentialForm, type CredentialSearchForm} from '@/api/pay/credential';
import {SearchForm} from '@/components/crud/SearchForm';
import {Toolbar} from '@/components/crud/Toolbar';
import {CrudModal} from '@/components/crud/CrudModal';
import {CrudLayout} from '@/components/crud/CrudLayout';
import {createActionColumn} from '@/components/crud/ActionColumn';
import {useCrudPage} from '@/hooks/useCrudPage';
import {auditColumns} from '@/components/crud/AuditColumns';
import {usePermission} from '@/hooks/usePermission';

const {Text} = Typography;

const CredentialManagement: FC = () => {
    const [searchForm] = Form.useForm<CredentialSearchForm>();
    const {hasPermission} = usePermission();
    const canDelete = hasPermission('pay:credential:delete');

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
    } = useCrudPage<Credential, CredentialForm, CredentialSearchForm>({
        api: credentialApi,
        searchForm,
    });

    function handleCreate() {
        openCreate({enabled: true});
    }

    function handleEdit(record: Credential) {
        openEdit({
            id: record.id,
            name: record.name,
            enabled: record.enabled,
            remark: record.remark,
        });
    }

    const columns = [
        {
            title: '凭证名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Access Key',
            dataIndex: 'accessKey',
            key: 'accessKey',
            render: (key: string) => <Text copyable code>{key}</Text>,
        },
        {
            title: 'Access Secret',
            dataIndex: 'accessSecret',
            key: 'accessSecret',
            render: (secret: string) => <Text copyable code>{secret}</Text>,
        },
        {
            title: '凭证状态',
            dataIndex: 'enabled',
            key: 'enabled',
            render: (enabled: boolean) => (
                <Tag color={enabled ? 'green' : 'red'}>{enabled ? '启用' : '禁用'}</Tag>
            ),
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
            ellipsis: true,
        },
        ...auditColumns,
        createActionColumn<Credential>({
            entityName: '凭证',
            updatePermission: 'pay:credential:update',
            deletePermission: 'pay:credential:delete',
            onEdit: handleEdit,
            onDelete: id => deleteByIds([id]),
            deletingIds,
        }),
    ];

    return (
        <CrudLayout>
            <SearchForm form={searchForm} onSearch={refreshTableData} onReset={reset}>
                <Form.Item name="name" label="凭证名称">
                    <Input allowClear/>
                </Form.Item>
                <Form.Item name="enabled" label="凭证状态">
                    <Select
                        allowClear
                        options={[
                            {value: true, label: '启用'},
                            {value: false, label: '禁用'},
                        ]}
                    />
                </Form.Item>
            </SearchForm>

            <Toolbar
                createPermission="pay:credential:create"
                deletePermission="pay:credential:delete"
                onCreate={handleCreate}
                onRefresh={refreshTableData}
                entityName="凭证"
                selectedCount={selectedRowKeys.length}
                onBatchDelete={() => deleteByIds(selectedRowKeys as number[])}
            />

            <Table
                rowKey="id"
                loading={loading}
                columns={columns}
                dataSource={data}
                rowSelection={canDelete ? {
                    selectedRowKeys,
                    onChange: setSelectedRowKeys,
                } : undefined}
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
                title="凭证"
            >
                <Form.Item name="id" hidden>
                    <Input/>
                </Form.Item>
                <Form.Item name="name" label="凭证名称"
                           rules={[{required: true, message: '请输入凭证名称'}]}>
                    <Input/>
                </Form.Item>
                <Form.Item name="enabled" label="凭证状态" initialValue={true}>
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

export default CredentialManagement;
