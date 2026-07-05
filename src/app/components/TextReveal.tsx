"use client";

import { motion } from "framer-motion";

type TextRevealProps = {
    text: string;
    className?: string;
    delay?: number;
    SeparateLetters?: number;
};

export default function TextReveal({
    text,
    className = "",
    delay = 0,
    SeparateLetters = 0.08,
}: TextRevealProps) {
    const words = text.split(" ");

    return (
        <span className={`inline-flex flex-wrap items-center ${className}`}>
            {words.map((word, wordIndex) => (
                <span
                    key={wordIndex}
                    className="relative inline-flex items-center"
                    style={{
                        marginRight: wordIndex === words.length - 1 ? 0 : "0.28em",
                        height: "1.08em", // chiều cao box của từng word
                    }}
                >
                    <span className="relative inline-flex h-full items-center overflow-hidden">
                        {/* anchor giữ width + height */}
                        <span className="invisible inline-block whitespace-nowrap">
                            {word}
                        </span>

                        <motion.span
                            className="absolute inset-0 flex items-center whitespace-nowrap"
                            initial={{ y: "110%", opacity: 0 }}
                            animate={{ y: "0%", opacity: 1 }}
                            transition={{
                                duration: 0.45,
                                delay: delay + wordIndex * SeparateLetters,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                        >
                            {word}
                        </motion.span>
                    </span>
                </span>
            ))}
        </span>
    );
}