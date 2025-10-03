import { Suspense } from 'react';
import LoginForm from '@/components/auth/login-form';


export default function LoginPage() {
    return (
        <div className="mx-auto flex min-h-[70vh] w-full max-w-5xl items-center justify-center p-4">
            <Suspense fallback={<div className="text-sm text-muted-foreground">Loading…</div>}>
                <LoginForm />
            </Suspense>
        </div>
    );
}