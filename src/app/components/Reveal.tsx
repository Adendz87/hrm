"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type RevealProps = {
    children: ReactNode;
    delay?: number;
    duration?: number;
    y?: number;
    once?: boolean;
    className?: string;
};

export default function Reveal({
    children,
    delay = 0,
    duration = 0.7,
    y = 28,
    once = true,
    className = "",
}: RevealProps) {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once, amount: 0.2 }}
            transition={{
                duration,
                delay,
                ease: [0.22, 1, 0.36, 1],
            }}
        >
            {children}
        </motion.div>
    );
}