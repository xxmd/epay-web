import {useEffect, useRef, useState} from 'react';
import {Button, message, Upload} from 'antd';
import {PlusOutlined, UploadOutlined} from '@ant-design/icons';
import type {UploadFile, UploadProps} from 'antd';
import request from '@/utils/request';
import {getFileUrl} from '@/api/resource/file';

export interface FileValue {
    id: number;
    name: string;
    path: string;
}

interface FileUploadProps {
    value?: FileValue | null;
    onChange?: (file: FileValue | null) => void;
    accept?: string;
    listType?: 'text' | 'picture-card';
}

interface FileUploadResult {
    success: boolean;
    message?: string;
    data: FileValue;
}

export function FileUpload({value, onChange, accept, listType = 'text'}: FileUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const prevValueRef = useRef<FileValue | null | undefined>(undefined);

    useEffect(() => {
        if (value !== prevValueRef.current) {
            prevValueRef.current = value;
            if (value) {
                setFileList([{
                    uid: '-1',
                    name: value.name,
                    status: 'done' as const,
                    url: getFileUrl(value.path),
                    thumbUrl: getFileUrl(value.path),
                }]);
            } else {
                setFileList([]);
            }
        }
    }, [value]);

    const uploadProps: UploadProps = {
        accept,
        listType,
        maxCount: 1,
        fileList,
        customRequest: async ({file, onSuccess, onError}) => {
            setUploading(true);
            const formData = new FormData();
            formData.append('file', file);
            try {
                const res = await request.post('/resource/file/upload', formData) as FileUploadResult;
                if (res.success) {
                    onChange?.(res.data);
                    onSuccess?.(res);
                    void message.success('上传成功');
                } else {
                    void message.error(res.message || '上传失败');
                    onError?.(new Error(res.message));
                }
            } catch (e) {
                onError?.(e as Error);
            } finally {
                setUploading(false);
            }
        },
        onChange({fileList: newList, file}) {
            setFileList(newList);
            if (file.status === 'removed') {
                onChange?.(null);
            }
        },
    };

    if (listType === 'picture-card') {
        return (
            <Upload {...uploadProps}>
                {fileList.length < 1 && (
                    <div>
                        <PlusOutlined/>
                        <div style={{marginTop: 8}}>上传</div>
                    </div>
                )}
            </Upload>
        );
    }

    return (
        <Upload {...uploadProps}>
            <Button icon={<UploadOutlined/>} loading={uploading}>
                上传文件
            </Button>
        </Upload>
    );
}
