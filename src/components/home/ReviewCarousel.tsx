'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';
import styles from '../../app/review-carousel.module.css';

interface Review {
    petName: string;
    photo: string;
    author: string;
    text: string;
}

const reviews: Review[] = [
    {
        petName: 'Снежок',
        photo: '/demo/corgi.png',
        author: 'Анна К.',
        text: 'Отводили своего корги на экспресс-линьку. Места себе не находил от радости, когда забирали! Шерсть идеальная, пахнет премиально. Ребята мастера своего дела.'
    },
    {
        petName: 'Ляля',
        photo: '/demo/poodle.png',
        author: 'Мария В.',
        text: 'Лялечка всегда так боится новых людей, но грумер нашел к ней подход с первых минут. Стрижка модельная, как мы и просили. Очень нежное отношение к животным!'
    },
    {
        petName: 'Гектор',
        photo: '/demo/husky.png',
        author: 'Дмитрий С.',
        text: 'У нас хаски, и вычесать его дома — это испытание для всей семьи. Привели сюда, забрали пушистое облако. Никакого стресса, отличный и доброжелательный сервис.'
    },
    {
        petName: 'Симба',
        photo: '/demo/mainecoon.png',
        author: 'Елена П.',
        text: 'Наш мейн-кун Симба обычно не дается чужим, но тут прям мурчал во время процедуры! Идеально вычесали колтуны, теперь шерсть гладкая и шелковистая. Спасибо огромое!'
    }
];

// Duplicate the array to create a seamless infinite loop
const infiniteReviews = [...reviews, ...reviews, ...reviews];

export default function ReviewCarousel() {
    return (
        <div className={styles.carouselContainer}>
            <div className={styles.scrollMask}>
                <motion.div
                    className={styles.carouselTrack}
                    animate={{ x: ["0%", "-33.333%"] }} // scroll exactly one set of the 3 arrays
                    transition={{
                        ease: "linear",
                        duration: 35, // slow, gentle reading speed
                        repeat: Infinity,
                    }}
                >
                    {infiniteReviews.map((review, i) => (
                        <div key={i} className={`glass ${styles.reviewCard}`}>
                            <div className={styles.reviewHeader}>
                                <div className={styles.reviewAvatar}>
                                    <Image
                                        src={review.photo}
                                        alt={review.petName}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                                <div>
                                    <h4 className={styles.reviewAuthor}>{review.author}</h4>
                                    <p className={styles.reviewPet}>Питомец: {review.petName}</p>
                                </div>
                            </div>
                            <div className={styles.reviewBody}>
                                <p>«{review.text}»</p>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
