'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import styles from './Forms.module.css';

export default function RegisterForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullname: '',
        login: '',
        email: '',
        password: '',
        passwordRepeat: '',
        agree: false,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) {
                if (data.errors) setErrors(data.errors);
            } else {
                // Auto-login or redirect
                router.refresh();
                alert('Регистрация успешна! Теперь вы можете войти.');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className={styles.formContainer} onSubmit={handleSubmit}>
            <h2 className={styles.title}>Регистрация</h2>

            <Input
                label="ФИО"
                type="text"
                value={formData.fullname}
                onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                error={errors.fullname}
                testInputClass="test-1-i-fio"
                testErrorClass="test-1-e-fio"
            />

            <Input
                label="Логин"
                type="text"
                value={formData.login}
                onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                error={errors.login}
                testInputClass="test-1-i-login"
                testErrorClass="test-1-e-login"
            />

            <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
                testInputClass="test-1-i-email"
                testErrorClass="test-1-e-email"
            />

            <Input
                label="Пароль"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={errors.password}
                testInputClass="test-1-i-pass"
                testErrorClass="test-1-e-pass"
            />

            <Input
                label="Повтор пароля"
                type="password"
                value={formData.passwordRepeat}
                onChange={(e) => setFormData({ ...formData, passwordRepeat: e.target.value })}
                error={errors.passwordRepeat}
                testInputClass="test-1-i-pass2"
                testErrorClass="test-1-e-pass2"
            />

            <div className={styles.checkboxWrapper}>
                <input
                    type="checkbox"
                    id="agree"
                    checked={formData.agree}
                    onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
                    className="test-1-i-agree"
                />
                <div style={{ flex: 1 }}>
                    <label htmlFor="agree" className={styles.label}>
                        Согласие на обработку персональных данных
                    </label>
                    {errors.agree && (
                        <span className={`test-1-e-agree ${styles.checkboxError}`}>
                            {errors.agree}
                        </span>
                    )}
                </div>
            </div>

            <Button testBtnClass="test-1-b-reg" type="submit" isLoading={isLoading}>
                Зарегистрироваться
            </Button>
        </form>
    );
}
