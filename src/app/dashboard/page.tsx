import { redirect } from 'next/navigation';
import { getUserFromCookies } from '@/lib/auth';
import { prisma } from '@/lib/db';
import DashboardClient from '@/components/dashboard/DashboardClient';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const user = await getUserFromCookies();

    if (!user) {
        redirect('/');
    }

    const requests = await prisma.request.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className={`container ${styles.page}`}>
            <h1 className={styles.title}>Личный кабинет</h1>
            <DashboardClient initialRequests={requests as any} />
        </div>
    );
}
