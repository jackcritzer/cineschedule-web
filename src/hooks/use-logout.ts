'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';

export function useLogout() {
    const { logout, user } = useAuth();
    const router = useRouter();

    return () => {
        const email = user?.email;
        logout();
        toast.success(email ? `Signed out: ${email}` : 'Signed out');
        router.replace('/login');
    };
}
