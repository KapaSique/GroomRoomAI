import { redirect } from 'next/navigation';
import { getUserFromCookies } from '@/lib/auth';
import { prisma } from '@/lib/db';
import AdminClient from '@/components/admin/AdminClient';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
    const user = await getUserFromCookies();

    if (!user || user.role !== 'ADMIN') {
        redirect('/');
    }

    const requests = await prisma.request.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className={`container ${styles.page}`}>
            <h1 className={styles.title}>Панель управления</h1>
            <AdminClient requests={requests as any} />
        </div>
    );
}
