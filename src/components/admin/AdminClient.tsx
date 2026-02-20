'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../../app/admin/page.module.css';

interface RequestModel {
    id: number;
    petName: string;
    status: string;
}

export default function AdminClient({ requests }: { requests: RequestModel[] }) {
    const router = useRouter();
    const [loadingId, setLoadingId] = useState<number | null>(null);

    const handleSubmit = async (e: React.FormEvent, id: number, currentStatus: string) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const select = form.elements.namedItem('status') as HTMLSelectElement;
        const newStatus = select.value;

        if (newStatus === currentStatus) return;

        const formData = new FormData();
        formData.append('status', newStatus);

        if (newStatus === 'Услуга оказана') {
            const fileInput = form.elements.namedItem('photo') as HTMLInputElement;
            if (!fileInput.files?.[0]) {
                alert('Требуется фото для завершения');
                return;
            }
            formData.append('photo', fileInput.files[0]);
        }

        setLoadingId(id);
        try {
            const res = await fetch(`/api/requests/${id}`, {
                method: 'PATCH',
                body: formData,
            });

            if (!res.ok) {
                const data = await res.json();
                alert(data.error || 'Ошибка');
            } else {
                router.refresh();
            }
        } catch {
            alert('Ошибка сети');
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className={styles.requestsList}>
            {requests.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', textAlign: 'center', marginTop: '3rem' }}>
                    Заявок нет.
                </p>
            ) : (
                <AnimatePresence>
                    {requests.map((req, i) => (
                        <motion.div
                            layout
                            key={req.id}
                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20, delay: i * 0.1 }}
                            className={`glass ${styles.requestItem}`}
                        >
                            <div className={styles.info}>
                                <h3 className={`test-t-name`} style={{ fontSize: '1.75rem', marginBottom: '1rem', fontWeight: 800 }}>
                                    {req.petName}
                                </h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                                    Текущий статус:{' '}
                                    <span style={{
                                        color: req.status === 'Услуга оказана' ? 'var(--success)' :
                                            req.status === 'Обработка данных' ? 'var(--warning)' : 'var(--info)',
                                        fontWeight: 700,
                                        padding: '0.4rem 0.8rem',
                                        background: 'rgba(255,255,255,0.7)',
                                        borderRadius: '999px',
                                        marginLeft: '0.5rem',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                                    }}>
                                        {req.status}
                                    </span>
                                </p>
                            </div>

                            {req.status !== 'Услуга оказана' && (
                                <form className={styles.controls} onSubmit={(e) => handleSubmit(e, req.id, req.status)}>
                                    <label style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>
                                        Изменить статус:
                                    </label>
                                    <select name="status" className={`test-s-status ${styles.select}`} defaultValue={req.status}>
                                        {req.status === 'Новая' && <option value="Новая">Новая</option>}
                                        {req.status === 'Новая' && <option value="Обработка данных">Обработка данных</option>}
                                        {req.status === 'Обработка данных' && <option value="Обработка данных">Обработка данных</option>}
                                        {req.status === 'Обработка данных' && <option value="Услуга оказана">Услуга оказана</option>}
                                    </select>

                                    <AnimatePresence mode="popLayout">
                                        {req.status === 'Обработка данных' && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                                style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflow: 'hidden', marginTop: '0.5rem' }}
                                            >
                                                <label style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>
                                                    Фото результата
                                                </label>
                                                <div style={{
                                                    background: '#ffffff',
                                                    border: '2px solid transparent',
                                                    borderRadius: '24px',
                                                    padding: '1rem',
                                                    boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)'
                                                }}>
                                                    <input
                                                        name="photo"
                                                        type="file"
                                                        accept=".jpg,.jpeg,.bmp"
                                                        className="test-c-photo"
                                                        style={{ width: '100%', outline: 'none' }}
                                                    />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div style={{ marginTop: '0.75rem' }}>
                                        <Button type="submit" testBtnClass="test-b-change" isLoading={loadingId === req.id}>
                                            Сохранить
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            )}
        </div>
    );
}
