'use client';

import { motion } from 'framer-motion';
import React from 'react';

export default function AnimatedCard({ children, index }: { children: React.ReactNode; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: index * 0.1
            }}
            whileHover={{ y: -12, scale: 1.03 }}
            style={{ height: '100%', cursor: 'pointer' }}
        >
            {children}
        </motion.div>
    );
}
