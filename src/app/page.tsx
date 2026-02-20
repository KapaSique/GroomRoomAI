import { getUserFromCookies } from '@/lib/auth';
import { prisma } from '@/lib/db';
import LoginForm from '@/components/forms/LoginForm';
import RegisterForm from '@/components/forms/RegisterForm';
import AnimatedCard from '@/components/home/AnimatedCard';
import Image from 'next/image';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const user = await getUserFromCookies();

  const finishedRequests = await prisma.request.findMany({
    where: { status: 'Услуга оказана' },
    orderBy: { createdAt: 'desc' },
    take: 4,
  });

  return (
    <div className="container" style={{ padding: '2rem 1rem', position: 'relative' }}>
      {/* Decorative Blobs */}
      <div className={styles.blob1} />
      <div className={styles.blob2} />

      <section className={styles.hero}>
        <h1 className={styles.mainTitle}>
          Премиум сервис для <br />
          <span style={{
            background: 'var(--accent-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            ваших питомцев
          </span>
        </h1>
        <p className={styles.subtitle}>
          Оставьте заявку онлайн, и наши грумеры профессионально позаботятся о красоте и здоровье вашего любимца.
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
        <h2 className={styles.sectionTitle}>Наши последние работы</h2>
        {finishedRequests.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
            Пока нет завершенных работ
          </p>
        ) : (
          <div className={styles.grid}>
            {finishedRequests.map((req, i) => (
              <AnimatedCard key={req.id} index={i}>
                <div className={`glass ${styles.card}`}>
                  <div className={styles.imageContainer}>
                    {req.afterPhoto && (
                      <Image
                        src={req.afterPhoto}
                        alt={req.petName}
                        fill
                        className={`test-t-photo ${styles.image}`}
                        style={{ objectFit: 'cover' }}
                      />
                    )}
                  </div>
                  <div className={styles.cardContent}>
                    <h3 className={`test-t-name ${styles.petName}`}>{req.petName}</h3>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
