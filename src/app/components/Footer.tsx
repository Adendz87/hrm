"use client";

import ThemeToggle from "./ThemeToggle";

const technologyLinks = [
    "Cono LLM",
    "Vision Language Model",
    "Proprietary OCR",
];

const solutionLinks = [
    "Government & Legal",
    "Education",
    "Banking & Finance",
    "Platform & Workspace",
];

const companyLinks = ["About", "News", "Contact"];

export default function Footer() {
    return (
        <footer className="border-t border-zinc-200 dark:border-zinc-800">
            <div className="mx-auto max-w-7xl px-6 py-10">
                <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div className="flex h-full flex-col">
                        <h2 className="text-lg font-medium text-zinc-900 dark:text-white">
                            <img
                                className="w-22 pl-2 invert transition-all duration-300 dark:invert-0"
                                src="/image/Arcanic-logo-white.png"
                                alt="Hero"
                            />
                        </h2>

                        <div className="mt-4 pl-2 pt-3 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-500">
                            © 2026 Arcanic AI. All rights reserved.
                        </div>

                        <div className="max-w-7xl px-2 py-10">
                            <ThemeToggle />
                        </div>
                    </div>

                    {/* Product */}
                    <nav
                        aria-labelledby="footer-product"
                        className="w-fit sm:mx-0 lg:mx-auto lg:border-l lg:border-dashed lg:border-zinc-200 lg:pl-12 xl:pl-20 dark:lg:border-zinc-800"
                    >
                        <h3
                            id="footer-product"
                            className="text-sm font-medium text-zinc-900 dark:text-white"
                        >
                            Product
                        </h3>
                        <ul className="mt-4 space-y-3">
                            {technologyLinks.map((link) => (
                                <li key={link}>
                                    <a
                                        href="#"
                                        className="text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                                    >
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Company */}
                    <nav aria-labelledby="footer-company" className="w-fit sm:mx-0 lg:mx-auto">
                        <h3
                            id="footer-company"
                            className="text-sm font-medium text-zinc-900 dark:text-white"
                        >
                            Company
                        </h3>
                        <ul className="mt-4 space-y-3">
                            {companyLinks.map((link) => (
                                <li key={link}>
                                    <a
                                        href="#"
                                        className="text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                                    >
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Resources */}
                    <nav
                        aria-labelledby="footer-resources"
                        className="w-fit sm:mx-0 lg:mx-auto"
                    >
                        <h3
                            id="footer-resources"
                            className="text-sm font-medium text-zinc-900 dark:text-white"
                        >
                            Resources
                        </h3>
                        <ul className="mt-4 space-y-3">
                            {solutionLinks.map((link) => (
                                <li key={link}>
                                    <a
                                        href="#"
                                        className="text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                                    >
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
        </footer>
    );
}