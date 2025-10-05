'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/lib/errors';
// Update this import to your actual auth context path:
import { useAuth } from '@/lib/auth-context';
// If you have a centralized API wrapper, import it here:
import { apiFetch } from '@/lib/api-fetch';
import { LoginResponse } from '@/types/auth';

function InlineError({ message }: { message: string }) {
    if (!message) return null;
    return (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {message}
        </div>
    );
}

export default function LoginForm() {
    const router = useRouter();
    const search = useSearchParams();
    const next = search.get('next') || '/watchlist';

    const { token, login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string>('');

    // Redirect if already logged in
    useEffect(() => {
        if (token) {
            router.replace(next);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, next]);

    async function onSubmit(e: FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            // Adjust URL/body to match your backend
            const res = await apiFetch<LoginResponse>('/auth/login', {
                method: 'POST',
                body: { email, password },
            });

            // Expecting { token, user } or similar
            const accessToken = res?.token;
            if (!accessToken) {
                throw new Error('Invalid server response. No token returned.');
            }
            
            login(res, { persist: false }); // Ensure your context supports user
            toast.success('Welcome back!');
            router.replace(next);
        } catch (err) {
            const msg = getApiErrorMessage(err);
            setError(msg);
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="mx-auto w-full max-w-sm space-y-4 rounded-xl border bg-card p-6">
            <div className="space-y-1">
                <h1 className="text-xl font-semibold">Sign in</h1>
                <p className="text-sm text-muted-foreground">Use your CineSchedule account.</p>
            </div>

            {error ? <InlineError message={error} /> : null}

            <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <input
                    id="email"
                    type="email"
                    className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    disabled={submitting}
                    required
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <input
                    id="password"
                    type="password"
                    className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    disabled={submitting}
                    required
                />
            </div>

            <button
                type="submit"
                disabled={submitting}
                aria-busy={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground transition-opacity hover:opacity-95 disabled:opacity-70"
            >
                {submitting ? (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/70 border-t-transparent" />
                ) : null}
                <span>{submitting ? 'Signing in…' : 'Sign in'}</span>
            </button>
        </form>
    );
}