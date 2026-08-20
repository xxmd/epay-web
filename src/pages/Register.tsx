import React, {useCallback, useEffect, useRef, useState} from 'react';
import {App, Button, Card, Form, Input, Modal} from 'antd';
import {MailOutlined, LockOutlined, SafetyOutlined} from '@ant-design/icons';
import {Link} from 'react-router-dom';
import registerApi, {type EmailRegisterForm} from '@/api/register';

const Register: React.FC = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [captchaLoading, setCaptchaLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [redirectCountdown, setRedirectCountdown] = useState(5);
    const redirectTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const {message} = App.useApp();

    const goToLogin = useCallback(() => {
        window.location.href = '/login';
    }, []);

    useEffect(() => {
        if (!successModalOpen) return;
        setRedirectCountdown(5);
        redirectTimerRef.current = setInterval(() => {
            setRedirectCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(redirectTimerRef.current!);
                    goToLogin();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => {
            if (redirectTimerRef.current) {
                clearInterval(redirectTimerRef.current);
            }
        };
    }, [successModalOpen, goToLogin]);

    const handleSendCaptcha = async () => {
        try {
            const email = form.getFieldValue('email');
            if (!email) {
                form.validateFields(['email']);
                return;
            }
            await form.validateFields(['email']);
        } catch {
            return;
        }

        setCaptchaLoading(true);
        try {
            const res = await registerApi.sendEmailCaptcha(form.getFieldValue('email'));
            if (res.success) {
                message.success('验证码已发送至邮箱');
                setCountdown(60);
                const timer = setInterval(() => {
                    setCountdown((prev) => {
                        if (prev <= 1) {
                            clearInterval(timer);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            } else {
                message.error(res.message || '验证码发送失败');
            }
        } catch {
            message.error('验证码发送失败，请稍后重试');
        } finally {
            setCaptchaLoading(false);
        }
    };

    const onFinish = async (values: EmailRegisterForm) => {
        setLoading(true);
        try {
            const res = await registerApi.byEmail(values);
            if (res.success) {
                setSuccessModalOpen(true);
            } else {
                message.error(res.message || '注册失败，请稍后重试');
            }
        } catch {
            message.error('网络请求失败，请稍后重试');
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
                title="邮箱注册"
                style={{
                    width: 420,
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
                    name="register_form"
                    onFinish={onFinish}
                    autoComplete="off"
                    size="large"
                >
                    <Form.Item
                        name="email"
                        rules={[
                            {required: true, message: '请输入邮箱'},
                            {type: 'email', message: '邮箱格式错误'},
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined style={{color: 'rgba(0,0,0,0.25)'}}/>}
                            placeholder="邮箱"
                        />
                    </Form.Item>

                    <Form.Item
                        name="emailCaptcha"
                        rules={[{required: true, message: '请输入邮箱验证码'}]}
                    >
                        <div style={{display: 'flex', gap: 8}}>
                            <Input
                                prefix={<SafetyOutlined style={{color: 'rgba(0,0,0,0.25)'}}/>}
                                placeholder="验证码"
                                style={{flex: 1}}
                            />
                            <Button
                                loading={captchaLoading}
                                disabled={countdown > 0}
                                onClick={handleSendCaptcha}
                                style={{width: 120}}
                            >
                                {countdown > 0 ? `${countdown}s` : '获取验证码'}
                            </Button>
                        </div>
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            {required: true, message: '请输入密码'},
                            {min: 6, message: '密码长度不能少于6位'},
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{color: 'rgba(0,0,0,0.25)'}}/>}
                            placeholder="密码"
                        />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            {required: true, message: '请确认密码'},
                            ({getFieldValue}) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('两次输入的密码不一致'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{color: 'rgba(0,0,0,0.25)'}}/>}
                            placeholder="确认密码"
                        />
                    </Form.Item>

                    <Form.Item style={{marginBottom: 0}}>
                        <Button type="primary" htmlType="submit" block loading={loading}>
                            注 册
                        </Button>
                    </Form.Item>

                    <Form.Item style={{marginBottom: 0, textAlign: 'center', marginTop: 16}}>
                        已有账号？ <Link to="/login">去登录</Link>
                    </Form.Item>
                </Form>
            </Card>

            <Modal
                title="注册成功"
                open={successModalOpen}
                closable={false}
                footer={[
                    <Button
                        key="goLogin"
                        type="primary"
                        onClick={goToLogin}
                        block
                    >
                        前往登录（{redirectCountdown}s）
                    </Button>,
                ]}
            >
                <p style={{textAlign: 'center', margin: '16px 0'}}>
                    注册成功，将在 <strong>{redirectCountdown}</strong> 秒后自动跳转到登录页面...
                </p>
            </Modal>
        </div>
    );
};

export default Register;
