'use client';

import { type FormEvent, useState } from 'react';
import { Globe, Bot, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import AxiosInstance from '@/utils/axiosInstance';

interface CreateAgentFormProps {
    onSuccess?: () => void;
}

export function CreateAgentForm({ onSuccess }: CreateAgentFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState<string>('');
    const [sourceUrl, setSourceUrl] = useState<string>('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(false);
        try {
            const response = await AxiosInstance.post(
                '/api/v1/agent',
                {
                    name,
                    sourceUrl,
                },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );
            if (response.data.success === true) {
                setSuccess(true);
                setName('');
                setSourceUrl('');
                if (onSuccess) {
                    setTimeout(() => {
                        onSuccess();
                    }, 2000);
                }
            }
        } catch (err: unknown) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md w-full">
            <Card className="overflow-hidden pt-1 gap-2 bg-white border-none shadow-none">
                <CardHeader className="pb-4 px-0">
                    <CardDescription className="text-slate-500 px-0">
                        Fill in the details below to create a custom AI agent for your website
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                    {success && (
                        <div className="mb-6 bg-green-50 border-green-200 text-green-800">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            <div>Agent created successfully! Your website will be crawled automatically.</div>
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 bg-red-50 border-red-200 text-red-800">
                            <div>{error}</div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                                Agent Name
                            </Label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Bot className="h-5 w-5" />
                                </div>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Support Assistant"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="pl-10 py-6 border-slate-200 focus:border-violet-500 focus:ring-violet-500"
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                                Choose a descriptive name for your AI assistant
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="source-url" className="text-sm font-medium text-slate-700">
                                Website URL
                            </Label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Globe className="h-5 w-5" />
                                </div>
                                <Input
                                    id="source-url"
                                    placeholder="https://yourwebsite.com"
                                    value={sourceUrl}
                                    onChange={(e) => setSourceUrl(e.target.value)}
                                    required
                                    className="pl-10 py-6 border-slate-200 focus:border-violet-500 focus:ring-violet-500"
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                                We will automatically crawl this website to train your AI agent
                            </p>
                        </div>

                        <Button
                            type="submit"
                            className="w-full py-6 bg-black hover:bg-black/80 text-white font-medium transition-all"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                    Creating your agent...
                                </span>
                            ) : (
                                'Create Agent'
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="bg-slate-50 border-t border-slate-100 px-6 py-4 mt-3">
                    <p className="text-xs text-slate-500 text-center w-full">
                        Your agent will be ready to answer questions about your website content after crawling is
                        complete
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
