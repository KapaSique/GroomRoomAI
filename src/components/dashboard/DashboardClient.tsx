'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../../app/dashboard/page.module.css';

interface RequestModel {
    id: number;
    petName: string;
    status: string;
    beforePhoto: string;
    reviewText: string | null;
}

export default function DashboardClient({ initialRequests }: { initialRequests: RequestModel[] }) {
    const router = useRouter();
    const [petName, setPetName] = useState('');
    const [photo, setPhoto] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [reviewLoadings, setReviewLoadings] = useState<Record<number, boolean>>({});

    const handleAddReview = async (e: React.FormEvent, id: number) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const reviewText = (form.elements.namedItem('reviewText') as HTMLInputElement).value;
        if (!reviewText.trim()) return;

        setReviewLoadings(prev => ({ ...prev, [id]: true }));
        try {
            const formData = new FormData();
            formData.append('reviewText', reviewText);
            const res = await fetch(`/api/requests/${id}`, {
                method: 'PATCH',
                body: formData,
            });
            if (res.ok) {
                router.refresh();
            } else {
                alert('Ошибка: ' + (await res.json()).error);
            }
        } catch (err) {
            alert('Ошибка сети');
        } finally {
            setReviewLoadings(prev => ({ ...prev, [id]: false }));
        }
    };

    const handleAddRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!petName || !photo) {
            setError('Заполните все поля');
            return;
        }

        setIsSubmitting(true);
        setError('');

        const formData = new FormData();
        formData.append('petName', petName);
        formData.append('photo', photo);

        try {
            const res = await fetch('/api/requests', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || 'Ошибка создания заявки');
            } else {
                setPetName('');
                setPhoto(null);
                const fileInput = document.getElementById('photoInput') as HTMLInputElement;
                if (fileInput) fileInput.value = '';
                router.refresh();
            }
        } catch (err) {
            setError('Ошибка сети');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            if (confirm('Удалить заявку?')) {
                await fetch(`/api/requests/${id}`, { method: 'DELETE' });
                router.refresh();
            }
        } catch (err) {
            alert('Ошибка удаления');
        }
    };

    const getStatusClass = (status: string) => {
        if (status === 'Новая') return styles.statusНовая;
        if (status === 'Обработка данных') return styles.statusОбработка;
        if (status === 'Услуга оказана') return styles.statusОказана;
        return '';
    };

    return (
        <div className={styles.content}>
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <div className={`glass ${styles.formCard}`}>
                    <h2 style={{ marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>Новая заявка</h2>
                    <form onSubmit={handleAddRequest} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', position: 'relative', zIndex: 1 }}>
                        <Input
                            label="Кличка питомца"
                            value={petName}
                            onChange={(e) => setPetName(e.target.value)}
                            testInputClass="test-i-name"
                        />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginLeft: '0.25rem' }}>Фото питомца</label>
                            <div style={{
                                position: 'relative',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid var(--border)',
                                borderRadius: '12px',
                                padding: '1rem',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center'
                            }} className="file-input-wrapper">
                                <input
                                    id="photoInput"
                                    type="file"
                                    accept=".jpg,.jpeg,.bmp"
                                    onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                                    className="test-c-photo"
                                    style={{ color: 'var(--text-primary)', width: '100%', outline: 'none' }}
                                />
                            </div>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.span
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    style={{ color: 'var(--error)', fontSize: '0.875rem', marginBottom: '1rem', fontWeight: 500 }}
                                >
                                    {error}
                                </motion.span>
                            )}
                        </AnimatePresence>

                        <Button type="submit" testBtnClass="test-b-new" isLoading={isSubmitting}>
                            Создать
                        </Button>
                    </form>
                </div>
            </motion.div>

            <div className={styles.requestsList}>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ marginBottom: '1.5rem', fontSize: '1.75rem' }}
                >
                    Мои заявки
                </motion.h2>

                <AnimatePresence mode="popLayout">
                    {initialRequests.length === 0 && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}
                        >
                            У вас пока нет заявок.
                        </motion.p>
                    )}
                    {initialRequests.map((req, i) => (
                        <motion.div
                            layout
                            key={req.id}
                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            transition={{ duration: 0.4, delay: i * 0.05 }}
                            className={`glass ${styles.requestItem}`}
                        >
                            <div className={styles.requestInfo} style={{ flexDirection: 'row', alignItems: 'center', gap: '1.25rem' }}>
                                {/* Small Thumbnail Widget */}
                                <div style={{
                                    width: '64px', height: '64px', borderRadius: '16px', overflow: 'hidden',
                                    border: '2px solid rgba(255,255,255,0.8)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', flexShrink: 0
                                }}>
                                    <img src={req.beforePhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <h3 className={`test-t-name`} style={{ fontSize: '1.35rem', fontWeight: 600 }}>{req.petName}</h3>
                                    <span className={`test-t-status ${styles.status} ${getStatusClass(req.status)}`}>
                                        {req.status}
                                    </span>
                                </div>
                            </div>
                            {req.status === 'Новая' && (
                                <Button
                                    testBtnClass="test-b-remove"
                                    onClick={() => handleDelete(req.id)}
                                    style={{
                                        background: 'rgba(239, 68, 68, 0.05)',
                                        border: '1px solid rgba(239, 68, 68, 0.3)',
                                        color: 'var(--error)',
                                        width: 'auto',
                                        boxShadow: 'none'
                                    }}
                                    whileHover={{
                                        backgroundColor: 'rgba(239, 68, 68, 0.15)',
                                        borderColor: 'rgba(239, 68, 68, 0.6)',
                                        scale: 1.05
                                    }}
                                >
                                    Удалить
                                </Button>
                            )}

                            {req.status === 'Услуга оказана' && (
                                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                                    {req.reviewText ? (
                                        <div style={{ background: 'rgba(255,255,255,0.5)', padding: '1rem', borderRadius: '12px' }}>
                                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Ваш отзыв:</p>
                                            <p style={{ fontStyle: 'italic', color: 'var(--text-primary)' }}>«{req.reviewText}»</p>
                                        </div>
                                    ) : (
                                        <form onSubmit={(e) => handleAddReview(e, req.id)} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                                                Оставить отзыв о работе:
                                            </label>
                                            <textarea
                                                name="reviewText"
                                                placeholder="Всё прошло отлично, питомец счастлив!"
                                                rows={2}
                                                required
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem 1rem',
                                                    borderRadius: '12px',
                                                    border: '1px solid var(--border)',
                                                    background: 'rgba(255,255,255,0.7)',
                                                    outline: 'none',
                                                    fontFamily: 'inherit',
                                                    fontSize: '0.95rem',
                                                    resize: 'vertical'
                                                }}
                                            />
                                            <Button type="submit" isLoading={reviewLoadings[req.id]} style={{ alignSelf: 'flex-start', padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}>
                                                Отправить отзыв
                                            </Button>
                                        </form>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
