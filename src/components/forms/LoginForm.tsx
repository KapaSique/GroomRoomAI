'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import styles from './Forms.module.css';

export default function LoginForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({ login: '', password: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) {
                if (data.errors) setErrors(data.errors);
            } else {
                router.push(data.role === 'ADMIN' ? '/admin' : '/dashboard');
                router.refresh();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className={styles.formContainer} onSubmit={handleSubmit}>
            <h2 className={styles.title}>Вход</h2>
            <Input
                label="Логин"
                type="text"
                value={formData.login}
                onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                error={errors.login}
                testInputClass="test-2-i-login"
                testErrorClass="test-2-e-login"
            />
            <Input
                label="Пароль"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={errors.password}
                testInputClass="test-2-i-pass"
                testErrorClass="test-2-e-pass"
            />
            <Button testBtnClass="test-2-b-log" type="submit" isLoading={isLoading}>
                Войти
            </Button>
        </form>
    );
}
