'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Header.module.css';

interface User {
    id: number;
    login: string;
    role: string;
    fullname: string;
}

export default function Header({ user }: { user: User | null }) {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/');
        router.refresh();
    };

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link href="/" className={`test-t-logo ${styles.logo}`}>
                    <span style={{ color: 'var(--accent)' }}>Groom</span>Room
                </Link>

                <nav className={styles.nav}>
                    {user ? (
                        <>
                            <Link href={user.role === 'ADMIN' ? '/admin' : '/dashboard'} className={styles.link}>
                                ЛК ({user.login})
                            </Link>
                            <button
                                onClick={handleLogout}
                                className={`test-b-logout ${styles.logoutBtn}`}
                            >
                                Выход
                            </button>
                        </>
                    ) : (
                        <Link href="/" className={styles.link}>Вход / Регистрация</Link>
                    )}
                </nav>
            </div>
        </header>
    );
}
