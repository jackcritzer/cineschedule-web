import { Suspense } from 'react';
import LoginForm from '@/components/auth/login-form';
import PageShell from '@/components/layout/page-shell';

export default function LoginPage() {
    return (
        <PageShell className="flex min-h-[60vh] items-center justify-center">
            <Suspense fallback={<div className="text-sm text-muted-foreground">Loading…</div>}>
                <LoginForm />
            </Suspense>
        </PageShell>
    );
}