'use client';

import ChatInterfaceAgent from '@/components/agent/AgentChat';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function EmbedChatPage() {
    const searchParams = useSearchParams();
    const agentId = searchParams.get('agent_id');
    const [isOpen, setIsOpen] = useState<boolean>(false);

    useEffect(() => {
        setTimeout(() => setIsOpen(true), 1500);
    }, []);

    return (
        <div className="w-full h-full">
            {!isOpen && (
                <div className="flex flex-col items-center justify-center min-h-screen p-4">
                    <div className="w-full max-w-md space-y-6">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold tracking-tight">Hello!</h1>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 bg-clip-text text-transparent">
                                How can I help?
                            </h2>
                        </div>

                        <div className="flex justify-start text-xs mt-2">
                            Powered by <span className="font-semibold ml-1">Retriv</span>
                        </div>
                    </div>
                </div>
            )}
            <ChatInterfaceAgent agentId={agentId as string} isOpen={isOpen} />
        </div>
    );
}
