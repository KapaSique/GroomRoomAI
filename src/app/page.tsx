import { getUserFromCookies } from '@/lib/auth';
import { prisma } from '@/lib/db';
import LoginForm from '@/components/forms/LoginForm';
import RegisterForm from '@/components/forms/RegisterForm';
import ReviewCarousel from '@/components/home/ReviewCarousel';
import Image from 'next/image';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const user = await getUserFromCookies();

  // If we don't have enough finished requests, let's mix in the beautiful demo photos
  const finishedRequests = await prisma.request.findMany({
    where: { status: 'Услуга оказана' },
    orderBy: { createdAt: 'desc' },
    take: 4,
  });

  const demoPhotos = [
    { petName: 'Снежок', photo: '/demo/dog1.png' },
    { petName: 'Ричи', photo: '/demo/dog2.png' },
    { petName: 'Ляля', photo: '/demo/dog3.png' }
  ];

  return (
    <div className="container" style={{ padding: '2rem 1rem', position: 'relative' }}>
      {/* Decorative Pastel Blobs */}
      <div className={styles.blob1} />
      <div className={styles.blob2} />
      <div className={styles.blob3} />

      <section className={styles.hero}>
        <div className={styles.heroBadge}>Новый уровень заботы ✨</div>
        <h1 className={styles.mainTitle}>
          Премиум сервис для <br />
          <span className={styles.gradientText}>
            ваших питомцев
          </span>
        </h1>
        <p className={styles.subtitle}>
          Оставьте заявку онлайн, и наши грумеры бережно и профессионально позаботятся о красоте и здоровье вашего любимца.
        </p>
      </section>

      {!user && (
        <section className={styles.formsSection}>
          <div className={`glass ${styles.formBox}`}>
            <LoginForm />
          </div>
          <div className={`glass ${styles.formBox}`}>
            <RegisterForm />
          </div>
        </section>
      )}

      <section className={styles.requestsSection}>
        <h2 className={styles.sectionTitle}>Отзывы наших счастливых клиентов</h2>
        <ReviewCarousel />
      </section>
    </div>
  );
}
