import {type FC} from 'react';
import {Form, Input, Radio, Select, Table, Tag, Image} from 'antd';
import type {Application, ApplicationForm, ApplicationSearchForm} from '../../../api/pay/application';
import applicationApi from '../../../api/pay/application';
import {EnumName} from '@/api/enum';
import {getFileUrl} from '@/api/resource/file';
import {SearchForm} from '@/components/crud/SearchForm';
import {Toolbar} from '@/components/crud/Toolbar';
import {CrudModal} from '@/components/crud/CrudModal';
import {CrudLayout} from '@/components/crud/CrudLayout';
import {createActionColumn} from '@/components/crud/ActionColumn';
import {useCrudPage} from '@/hooks/useCrudPage';
import {useEnum} from '@/hooks/useEnum';
import {auditColumns} from '@/components/crud/AuditColumns';
import {FileUpload} from '@/components/upload/FileUpload';

const ApplicationManagement: FC = () => {
    const [searchForm] = Form.useForm<ApplicationSearchForm>();
    const platformOptions = useEnum(EnumName.Platform);

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
    } = useCrudPage<Application, ApplicationForm, ApplicationSearchForm>({
        api: applicationApi,
        searchForm,
        transform: (values) => ({...values, iconFileId: values.iconFile?.id}),
    });

    function handleCreate() {
        openCreate({enabled: true});
    }

    function handleEdit(app: Application) {
        openEdit({...app});
    }

    const columns = [
        {
            title: '图标',
            key: 'icon',
            width: 80,
            render: (_: unknown, record: Application) =>
                record.iconFile ? (
                    <Image
                        src={getFileUrl(record.iconFile.path)}
                        width={40}
                        height={40}
                        style={{objectFit: 'cover', borderRadius: 4}}
                        fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZjBmMmY1Ii8+PC9zdmc+"
                    />
                ) : '-',
        },
        {
            title: '应用名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '平台',
            dataIndex: 'platform',
            key: 'platform',
            render: (val: string) => {
                const option = platformOptions.find(o => o.value === val);
                return option ? <Tag>{option.label}</Tag> : val;
            },
        },
        {
            title: '状态',
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
            render: (val: string) => val || '-',
        },
        ...auditColumns,
        createActionColumn<Application>({
            entityName: '应用',
            updatePermission: 'pay:application:update',
            deletePermission: 'pay:application:delete',
            onEdit: handleEdit,
            onDelete: id => deleteByIds([id]),
            deletingIds,
        }),
    ];

    return (
        <CrudLayout>
            <SearchForm form={searchForm} onSearch={refreshTableData} onReset={reset}>
                <Form.Item name="name" label="应用名称">
                    <Input allowClear placeholder="请输入应用名称"/>
                </Form.Item>
                <Form.Item name="platform" label="平台">
                    <Select
                        allowClear
                        options={platformOptions}
                        placeholder="请选择平台"
                    />
                </Form.Item>
                <Form.Item name="enabled" label="状态">
                    <Select
                        allowClear
                        options={[
                            {value: true, label: '启用'},
                            {value: false, label: '禁用'},
                        ]}
                        placeholder="请选择状态"
                    />
                </Form.Item>
            </SearchForm>

            <Toolbar
                createPermission="pay:application:create"
                deletePermission="pay:application:delete"
                onCreate={handleCreate}
                onRefresh={refreshTableData}
                entityName="应用"
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
                title="应用"
                labelCol={5}
            >
                <Form.Item name="id" hidden>
                    <Input/>
                </Form.Item>
                <Form.Item name="iconFile" label="应用图标" rules={[{required: true, message: '请上传应用图标'}]}>
                    <FileUpload accept="image/*" listType="picture-card"/>
                </Form.Item>
                <Form.Item name="name" label="应用名称" rules={[{required: true, message: '请输入应用名称'}]}>
                    <Input placeholder="请输入应用名称"/>
                </Form.Item>
                <Form.Item name="platform" label="平台" rules={[{required: true, message: '请选择平台'}]}>
                    <Select options={platformOptions} placeholder="请选择平台"/>
                </Form.Item>
                <Form.Item name="enabled" label="状态" initialValue={true}>
                    <Radio.Group>
                        <Radio value={true}>启用</Radio>
                        <Radio value={false}>禁用</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item name="remark" label="备注">
                    <Input.TextArea rows={3} placeholder="请输入备注"/>
                </Form.Item>
            </CrudModal>
        </CrudLayout>
    );
};

export default ApplicationManagement;
