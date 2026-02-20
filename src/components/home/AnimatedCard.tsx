'use client';

import { motion } from 'framer-motion';
import React from 'react';

export default function AnimatedCard({ children, index }: { children: React.ReactNode; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
                duration: 0.7,
                delay: index * 0.15,
                ease: [0.21, 0.47, 0.32, 0.98]
            }}
            whileHover={{ y: -8, scale: 1.02 }}
            style={{ height: '100%' }}
        >
            {children}
        </motion.div>
    );
}
