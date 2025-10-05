import { ReactNode } from 'react';

type EmptyStateProps = {
    title?: string;
    children?: ReactNode;
};

export default function EmptyState({ title = 'Nothing here yet', children }: EmptyStateProps) {
    return (
        <div className="mx-auto flex max-w-md flex-col items-center gap-2 rounded-xl border bg-card p-8 text-center">
            <div className="text-lg font-semibold">{title}</div>
            {children ? <div className="text-sm text-muted-foreground">{children}</div> : null}
        </div>
    );
}