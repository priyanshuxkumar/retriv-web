'use client';

import { useCallback, useState } from 'react';
import { timeAgo } from '@/helper/time';
import { Badge } from './ui/badge';
import { Bot } from 'lucide-react';

interface ResponseEntry {
    query: string;
    timestamp: string | Date;
}

export default function MonitorQueries() {
    const [responses, setResponses] = useState<ResponseEntry[]>([
        { query: 'How to add Retriv on my website ?', timestamp: '2025-06-02T09:37:44.209Z' },
        { query: 'How to add Retriv on my website ?', timestamp: '2025-06-02T09:37:44.209Z' },
        { query: 'How to add Retriv on my website ?', timestamp: '2025-06-02T09:37:44.209Z' },
        { query: 'How to add Retriv on my website ?', timestamp: '2025-06-02T09:37:44.209Z' },
    ]);

    const handleSend = useCallback(() => {
        const newLog: ResponseEntry = {
            query: 'How to add Retriv on my website ?',
            timestamp: new Date().toISOString(),
        };
        setResponses((prev) => [newLog, ...prev]);
    }, []);
    return (
        <div className="relative z-10 h-[324px] overflow-hidden">
            <div className="h-full w-full overflow-hidden">
                {/* Main Control Panel */}
                <div className="w-full md:max-w-2/3 lg:max-w-1/2">
                    <div className="w-full sm:max-w-2/3 px-4">
                        <div className="mt-5">
                            <div
                                className="relative inline-flex rounded-lg border border-slate-600 p-3 w-full items-center justify-between"
                                style={{
                                    background:
                                        'border-box linear-gradient(to bottom, rgba(255,255,255,0.12), rgba(255,255,255,0))',
                                }}
                            >
                                <Badge
                                    variant="secondary"
                                    className="bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20 px-4 py-2 text-sm font-medium"
                                >
                                    User&apos;s queries
                                </Badge>

                                {/* Send Button */}
                                <button
                                    onClick={handleSend}
                                    className="py-1 flex items-center gap-2 rounded-full border border-slate-600 px-3 text-sm outline-none transition-transform duration-150 ease-in-out hover:scale-105 focus-visible:ring-2 focus-visible:ring-slate-600 active:scale-100 bg-black text-white"
                                >
                                    <Bot size={15} />
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Response Log */}
                    <div className="mt-8 h-[200px] w-full overflow-hidden px-4 md:h-[120px] md:w-auto">
                        <div className="flex flex-col">
                            {responses.map((response, idx) => (
                                <div
                                    key={idx}
                                    className="mb-2 flex gap-4 text-slate-400"
                                    style={{
                                        opacity: 1,
                                        transform: 'none',
                                        transformOrigin: '50% 50% 0px',
                                    }}
                                >
                                    <pre>{timeAgo(response.timestamp as Date)}:</pre>
                                    <pre className="truncate">
                                        {`{ "query": "`}
                                        <span className="text-slate-500">{response.query}</span>
                                        {`" }`}
                                    </pre>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
