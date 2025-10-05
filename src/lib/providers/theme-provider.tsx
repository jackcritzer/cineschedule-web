'use client';
import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    return (
		<NextThemesProvider
			attribute="class"         // adds 'class="dark"' on <html>
			defaultTheme="system"     // follow OS by default
			enableSystem
			enableColorScheme
			disableTransitionOnChange
		>
			{children}
		</NextThemesProvider>
    );
}