import LoginForm from '@/components/auth/login-form';

export default function LoginPage() {
    return (
        <div className="mx-auto flex min-h-[70vh] w-full max-w-5xl items-center justify-center p-4">
            <LoginForm />
        </div>
    );
}