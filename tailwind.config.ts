import type { Config } from "tailwindcss";

export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                arabic: ["Tajawal", "sans-serif"],
                english: ["Poppins", "sans-serif"],
                sans: ["Tajawal", "Poppins", "sans-serif"],
            },
            fontSize: {
                // Custom font sizes using rem
                hero: ["4rem", { lineHeight: "1.1", fontWeight: "800" }],
                "hero-mobile": [
                    "3rem",
                    { lineHeight: "1.1", fontWeight: "800" },
                ],
                "section-title": [
                    "2.5rem",
                    { lineHeight: "1.2", fontWeight: "700" },
                ],
                "section-title-mobile": [
                    "2rem",
                    { lineHeight: "1.2", fontWeight: "700" },
                ],
                "section-subtitle": [
                    "1.25rem",
                    { lineHeight: "1.6", fontWeight: "400" },
                ],
                "body-large": [
                    "1.125rem",
                    { lineHeight: "1.6", fontWeight: "400" },
                ],
                body: ["1rem", { lineHeight: "1.6", fontWeight: "400" }],
                button: ["1rem", { lineHeight: "1.4", fontWeight: "600" }],
                small: ["0.875rem", { lineHeight: "1.5", fontWeight: "400" }],
                tiny: ["0.75rem", { lineHeight: "1.4", fontWeight: "400" }],
            },
            fontWeight: {
                light: "300",
                normal: "400",
                medium: "500",
                semibold: "600",
                bold: "700",
                extrabold: "800",
            },
            colors: {
                orange: {
                    50: "#EFF5FF",
                    100: "#DBEAFF",
                    200: "#BDD8FF",
                    300: "#94BFFF",
                    400: "#619DFF",
                    500: "#1B6EF3",
                    600: "#0D5DD9",
                    700: "#0947B0",
                    800: "#0E3B8F",
                    900: "#143776",
                },
                secondary: {
                    50: "#E5F7FD",
                    100: "#C0EEFB",
                    200: "#96E4F8",
                    300: "#3EB5EA",
                    400: "#1CA6E0",
                    500: "#3EB5EA",
                    600: "#2A8DC4",
                    700: "#1F6D9A",
                    800: "#1A5778",
                    900: "#1A4964",
                },
                white: {
                    DEFAULT: "#F9F9F9",
                },
            },
            spacing: {
                "18": "4.5rem",
                "88": "22rem",
                "128": "32rem",
            },
            borderRadius: {
                xl: "1rem",
                "2xl": "1.5rem",
                "3xl": "2rem",
            },
            boxShadow: {
                soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
                medium: "0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                strong: "0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 2px 10px -2px rgba(0, 0, 0, 0.05)",
            },
        },
    },
    plugins: [],
} satisfies Config;
