import React, {useState} from 'react';
import {App, Form, Input, Button, Card} from 'antd';
import {UserOutlined, LockOutlined} from '@ant-design/icons';
import {useSearchParams, Link} from 'react-router-dom';
import authApi, {type LoginForm} from '@/api/auth';
import {useAuth} from '@/store/auth/AuthContext';

const Login: React.FC = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const {login} = useAuth();
    const {message} = App.useApp();

    const redirectUrl = searchParams.get('redirect') || '/welcome';

    const onFinish = async (values: LoginForm) => {
        setLoading(true);
        try {
            const res = await authApi.login(values);
            if (res.success) {
                message.success('登录成功！');
                await login(res.data?.token as string, redirectUrl);
            } else {
                message.error(res.message || '登录失败，请稍后重试');
            }
        } catch {
            message.error('登录失败，请稍后重试');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                overflow: 'hidden',
                backgroundColor: '#f0f2f5',
            }}
        >
            <Card
                title="系统登录"
                style={{
                    width: 380,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
                styles={{
                    header: {
                        textAlign: 'center',
                        fontSize: '20px',
                        fontWeight: 'bold',
                    },
                }}
            >
                <Form
                    form={form}
                    name="login_form"
                    onFinish={onFinish}
                    autoComplete="off"
                    size="large"
                >
                    <Form.Item
                        name="username"
                        rules={[{required: true, message: '用户名不能为空'}]}
                    >
                        <Input
                            prefix={<UserOutlined style={{color: 'rgba(0,0,0,0.25)'}}/>}
                            placeholder="用户名"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{required: true, message: '密码不能为空'}]}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{color: 'rgba(0,0,0,0.25)'}}/>}
                            placeholder="密码"
                        />
                    </Form.Item>

                    <Form.Item style={{marginBottom: 0}}>
                        <Button type="primary" htmlType="submit" block loading={loading}>
                            登 录
                        </Button>
                    </Form.Item>

                    <Form.Item style={{marginBottom: 0, textAlign: 'center', marginTop: 16}}>
                        没有账号？ <Link to="/register">邮箱注册</Link>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Login;
