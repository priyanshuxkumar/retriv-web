'use client';

import { z } from 'zod';
import { Send, Sparkle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect, useRef } from 'react';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChatInputSchema } from '@/types';
import { ScrollArea } from '../ui/scroll-area';
import SkeletonBar from '../Skeleton/skeleton';
import { MarkdownRenderer } from '../Markdown';
import Link from 'next/link';
import { getSessionStorage, setSessionStorage } from '@/helper/storage';
import { golasText } from '../fonts/fonts';

interface Message {
    content: string;
    role: 'user' | 'assistant';
}

interface ChatDataProps {
    content: string;
    role: 'user' | 'assistant';
    sources?: string[];
}

interface ChatInterfaceAgentProps {
    agentId?: string | null;
    isOpen: boolean;
}

function useClearConversationIdOnRefresh() {
    useEffect(() => {
        const handleUnload = () => {
            sessionStorage.clear();
        };

        window.addEventListener('beforeunload', handleUnload);
        return () => {
            window.removeEventListener('beforeunload', handleUnload);
        };
    }, []);
}

export default function ChatInterfaceAgent({ agentId, isOpen }: ChatInterfaceAgentProps) {
    // Clear the conversation id on refresh
    useClearConversationIdOnRefresh();

    const [isStreaming, setIsStreaming] = useState(false);
    const [sourcesUrl, setSourcesUrl] = useState<string[]>([]);
    const [chatData, setChatData] = useState<ChatDataProps[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatData]);

    const form = useForm<z.infer<typeof ChatInputSchema>>({
        resolver: zodResolver(ChatInputSchema),
        defaultValues: {
            query: '',
        },
    });

    // Focus input when chat opens
    useEffect(() => {
        setTimeout(() => {
            inputRef.current?.focus();
        }, 300);
    }, []);

    async function onSubmit(data: z.infer<typeof ChatInputSchema>) {
        const userMessage: Message = {
            content: data.query,
            role: 'user',
        };

        setChatData((prev) => [...prev, userMessage]);
        setIsLoading(true);
        setSourcesUrl([]);

        try {
            const id = getSessionStorage('cnvid');
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/agent/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    agentId: agentId,
                    query: data.query,
                    conversationId: id || '',
                }),
                referrerPolicy: 'origin',
            });
            form.reset();

            if (!response.ok || !response.body) {
                throw new Error('Something went wrong. Please refresh');
            }

            const reader = response?.body.getReader();
            const decoder = new TextDecoder();

            let content = '';
            let buffer = '';

            while (true) {
                setIsStreaming(true);
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;

                while (buffer.includes('\n\n')) {
                    const message = buffer.substring(0, buffer.indexOf('\n\n'));
                    buffer = buffer.substring(buffer.indexOf('\n\n') + 2);

                    if (message.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(message.substring(6));
                            if (data.error) throw new Error(data.error);
                            if (data.sources) {
                                setSourcesUrl(data.sources);
                            }
                            if (data.content) {
                                content += data.content;
                                setChatData((prev) => {
                                    const lastMsg = prev[prev.length - 1];
                                    if (lastMsg?.role === 'assistant') {
                                        return [
                                            ...prev.slice(0, -1),
                                            { ...lastMsg, content: content, sources: sourcesUrl },
                                        ];
                                    }
                                    return [...prev, { content, role: 'assistant' }];
                                });
                            }
                        } catch (e) {
                            console.error('Parsing error:', e);
                        }
                    } else if (message.startsWith('event: id')) {
                        // Handle temp conversation Id
                        const msg = message.substring(10);
                        if (msg.startsWith('data: ')) {
                            const data = JSON.parse(msg.substring(6));
                            console.log(`id: ${data.conversationId}`);
                            setSessionStorage('cnvid', data.conversationId);
                        }
                    } else if (message.startsWith('event: error')) {
                        // Handle Error
                        const errMsg = message.substring(13);
                        if (errMsg.startsWith('data: ')) {
                            const data = JSON.parse(errMsg.substring(6));
                            console.log(`error: ${data.error}`);
                            const errorMessage: Message = {
                                content: data.error,
                                role: 'assistant',
                            };
                            setChatData((prev) => [...prev, errorMessage]);
                        }
                    }
                }
            }
        } catch (err: unknown) {
            console.error(err);
        } finally {
            setIsStreaming(false);
            setIsLoading(false);
            setIsLoading(false);
        }
    }
    return (
        <>
            {/* Chat Window */}
            {isOpen && (
                <div
                    className={`${golasText.className} backdrop-blur-xs p-4 md:p-8 bg-transparent fixed w-full h-full flex items-center flex-col rounded-3xl md:rounded-xl overflow-hidden shadow-2xl dark:bg-gray-900 border-gray-200 dark:border-gray-800 z-[99999] animate-fade-in`}
                >
                    <style jsx global>
                        {`
                            html,
                            body {
                                margin: 0;
                                padding: 0;
                                background: transparent !important;
                            }
                        `}
                    </style>
                    <div className="mt-8 border p-3 rounded-2xl w-full md:w-2/4 bg-white dark:bg-black">
                        <div className="w-full flex justify-center">
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="w-full flex justify-between items-center gap-3"
                                >
                                    <FormField
                                        control={form.control}
                                        name="query"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        ref={(e) => {
                                                            field.ref(e);
                                                            inputRef.current = e;
                                                        }}
                                                        className="h-13 w-full rounded-xl text-base placeholder:text-base"
                                                        placeholder="Enter your query..."
                                                        disabled={isLoading || isStreaming}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type="submit"
                                        size="icon"
                                        className="h-11 w-11 rounded-full bg-black/80 dark:bg-white text-white dark:text-black cursor-pointer"
                                        disabled={isLoading || isStreaming}
                                    >
                                        <Send size={30} />
                                        <span className="sr-only">Send message</span>
                                    </Button>
                                </form>
                            </Form>
                        </div>

                        {/* Chat Messages  */}
                        <div className="w-full flex justify-center">
                            {chatData.length > 0 && (
                                <ScrollArea className="mt-4 p-4 w-full max-h-[83vh] rounded-xl border">
                                    {chatData.map((item, idx) => (
                                        <div key={idx} className="space-y-3 mb-5">
                                            {/* User Message */}
                                            <div className="flex items-center gap-3">
                                                {item.role == 'user' && (
                                                    <div className="flex items-center justify-center w-5 h-5 bg-black/80 rounded-full">
                                                        <Sparkle className="h-3 w-3 text-primary-foreground" />
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    {item.role === 'assistant' ? (
                                                        <MarkdownRenderer content={item.content} />
                                                    ) : (
                                                        <p className="font-medium text-[17px]">{item.content}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                {/* Suggestion Buttons */}
                                                {item.sources && item?.sources?.length > 0 && (
                                                    <div className="flex flex-wrap gap-3 mb-6">
                                                        {item?.sources?.map((source, idx) => (
                                                            <Button
                                                                key={idx}
                                                                variant="outline"
                                                                className="h-auto py-2 px-3 text-sm rounded-lg shadow-none hover:bg-muted border"
                                                            >
                                                                <Link href={source} target="_blank">
                                                                    {source}
                                                                </Link>
                                                            </Button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {/* Show skeleton while the agent is responding. */}
                                    {isLoading && <SkeletonBar />}

                                    {/* Scroll at the bottom */}
                                    <div ref={messagesEndRef} />
                                </ScrollArea>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
