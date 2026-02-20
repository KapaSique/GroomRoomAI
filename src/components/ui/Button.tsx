'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import styles from './Button.module.css';

interface ButtonProps extends Omit<HTMLMotionProps<"button">, 'ref'> {
    isLoading?: boolean;
    testBtnClass?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ children, isLoading, testBtnClass, className, disabled, ...props }, ref) => {
        return (
            <motion.button
                ref={ref}
                className={`${styles.button} ${testBtnClass || ''} ${className || ''}`}
                disabled={isLoading || disabled}
                whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
                whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
                {...props}
            >
                {isLoading ? <span className={styles.loader} /> : children}
            </motion.button>
        );
    }
);

Button.displayName = 'Button';
