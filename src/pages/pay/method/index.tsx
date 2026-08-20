import {type FC} from 'react';
import {Form, Input, Radio, Select, Table, Tag} from 'antd';
import methodApi, {type Method, type MethodForm, type MethodSearchForm} from '@/api/pay/method';
import {SearchForm} from '@/components/crud/SearchForm';
import {Toolbar} from '@/components/crud/Toolbar';
import {CrudModal} from '@/components/crud/CrudModal';
import {CrudLayout} from '@/components/crud/CrudLayout';
import {createActionColumn} from '@/components/crud/ActionColumn';
import {useCrudPage} from '@/hooks/useCrudPage';
import {auditColumns} from '@/components/crud/AuditColumns';

const MethodManagement: FC = () => {
    const [searchForm] = Form.useForm<MethodSearchForm>();

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
    } = useCrudPage<Method, MethodForm, MethodSearchForm>({
        api: methodApi,
        searchForm,
    });

    function handleCreate() {
        openCreate({enabled: true});
    }

    const columns = [
        {
            title: '名称',
            dataIndex: 'label',
            key: 'label',
        },
        {
            title: '标识',
            dataIndex: 'value',
            key: 'value',
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
        createActionColumn<Method>({
            entityName: '支付方式',
            updatePermission: 'pay:method:update',
            deletePermission: 'pay:method:delete',
            onEdit: (method) => openEdit(method),
            onDelete: id => deleteByIds([id]),
            deletingIds,
        }),
    ];

    return (
        <CrudLayout>
            <SearchForm form={searchForm} onSearch={refreshTableData} onReset={reset}>
                <Form.Item name="label" label="名称">
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
                createPermission="pay:method:create"
                deletePermission="pay:method:delete"
                onCreate={handleCreate}
                onRefresh={refreshTableData}
                entityName="支付方式"
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
                title="支付方式"
            >
                <Form.Item name="id" hidden>
                    <Input/>
                </Form.Item>
                <Form.Item name="label" label="名称" rules={[{required: true, message: '请输入名称'}]}>
                    <Input/>
                </Form.Item>
                <Form.Item name="value" label="标识" rules={[{required: true, message: '请输入标识'}]}>
                    <Input/>
                </Form.Item>
                <Form.Item name="enabled" label="状态" initialValue={true}>
                    <Radio.Group>
                        <Radio value={true}>启用</Radio>
                        <Radio value={false}>禁用</Radio>
                    </Radio.Group>
                </Form.Item>
            </CrudModal>
        </CrudLayout>
    );
};

export default MethodManagement;
