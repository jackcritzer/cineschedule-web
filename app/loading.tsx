import { Spinner } from '@/components/ui/spinner';

export default function Loading() {
    return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <Spinner size={28} />
                <div className="text-sm text-muted-foreground">Loading…</div>
            </div>
        </div>
    );
}