import { Bebas_Neue, Inter, Cinzel } from 'next/font/google';

export const fontDisplay = Bebas_Neue({
    subsets: ['latin'],
    weight: '400',
    variable: '--font-display',
});

export const fontSans = Inter({
    subsets: ['latin'],
    variable: '--font-sans',
});

export const fontSerif = Cinzel({
    subsets: ['latin'],
    weight: ['400','600','700'],
    variable: '--font-serif',
});