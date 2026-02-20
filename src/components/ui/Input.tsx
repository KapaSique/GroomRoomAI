'use client';

import React, { forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    testInputClass?: string;
    testErrorClass?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, testInputClass, testErrorClass, className, ...props }, ref) => {
        return (
            <div className={`${styles.wrapper} ${className || ''}`}>
                <label className={styles.label}>{label}</label>
                <input
                    ref={ref}
                    className={`${styles.input} ${error ? styles.error : ''} ${testInputClass || ''}`}
                    {...props}
                />
                <AnimatePresence mode="wait">
                    {error && (
                        <motion.span
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={`${styles.errorMessage} ${testErrorClass || ''}`}
                        >
                            {error}
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>
        );
    }
);

Input.displayName = 'Input';
