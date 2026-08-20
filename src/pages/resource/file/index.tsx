import {type FC} from 'react';
import {Form, Input, Table, Button, Tooltip} from 'antd';
import {ReloadOutlined} from '@ant-design/icons';
import fileApi, {getFileUrl, type FileEntity, type FileSearchForm} from '@/api/resource/file';
import {SearchForm} from '@/components/crud/SearchForm';
import {CrudLayout} from '@/components/crud/CrudLayout';
import {auditColumns} from '@/components/crud/AuditColumns';
import {usePagedTable} from '@/hooks/usePagedTable';

function formatFileSize(size: string | number): string {
    const bytes = typeof size === 'string' ? Number(size) : size;
    if (isNaN(bytes) || bytes === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 2)} ${units[i]}`;
}

const FileManagement: FC = () => {
    const [searchForm] = Form.useForm<FileSearchForm>();

    const {
        loading,
        data,
        pagination,
        refreshTableData,
        reset,
        handleTableChange,
        requestTableData,
    } = usePagedTable<FileEntity, FileSearchForm>({
        read: fileApi.read,
        searchForm,
    });

    const columns = [
        {
            title: '文件名称',
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
        },
        {
            title: '文件大小',
            dataIndex: 'size',
            key: 'size',
            width: 120,
            render: (val: string) => formatFileSize(val),
        },
        {
            title: '存储路径',
            dataIndex: 'path',
            key: 'path',
            ellipsis: true,
            render: (val: string) => (
                <Tooltip title={val}>
                    <span>{val}</span>
                </Tooltip>
            ),
        },
        {
            title: '链接地址',
            key: 'path',
            ellipsis: true,
            render: (_: unknown, record: FileEntity) => {
                const url = getFileUrl(record.path);
                return (
                    <Tooltip title={url}>
                        <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
                    </Tooltip>
                );
            },
        },
        ...auditColumns,
    ];

    return (
        <CrudLayout>
            <SearchForm form={searchForm} onSearch={refreshTableData} onReset={reset}>
                <Form.Item name="name" label="文件名">
                    <Input allowClear placeholder="请输入文件名"/>
                </Form.Item>
            </SearchForm>

            <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                <Tooltip title="刷新">
                    <Button icon={<ReloadOutlined/>} onClick={refreshTableData}/>
                </Tooltip>
            </div>

            <Table
                rowKey="id"
                loading={loading}
                columns={columns}
                dataSource={data}
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
        </CrudLayout>
    );
};

export default FileManagement;
