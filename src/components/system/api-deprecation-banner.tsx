'use client';

import { useSyncExternalStore, useMemo } from 'react';
import { getSnapshot, subscribe } from '@/lib/api-announcements';
import { AlertTriangle } from 'lucide-react';

export default function ApiDeprecationBanner() {
    const info = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

    const text = useMemo(() => {
            if (!info?.deprecated) return null;

            let msg = `Heads up: API ${info.version || ''} is deprecated.`;
            if (info.sunset) {
                const d = new Date(info.sunset);
                const fmt = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' });
                if (!isNaN(d.getTime())) msg += ` Sunset on ${fmt.format(d)}.`;
            }
            if (info.successor) {
                msg += ` We're switching to ${info.successor}.`;
            }
            return msg;
    }, [info]);

    if (!text) return null;

    return (
            <div className="w-full border-b border-secondary/40 bg-secondary/15">
                <div className="container mx-auto max-w-6xl px-4 py-2">
                    <div className="flex items-start gap-2 text-muted-foreground">
                        <AlertTriangle className="h-4 w-4 mt-0.5" />
                        <p className=" text-sm">{text}</p>
                    </div>
                </div>
            </div>
    );
}
