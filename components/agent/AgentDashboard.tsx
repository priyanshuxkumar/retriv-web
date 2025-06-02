'use client';

import AxiosInstance from '@/utils/axiosInstance';
import { useEffect, useState } from 'react';
import { CreateAgentForm } from './CreateAgentForm';
import { AgentDetails } from './AgentDetails';
import { ArrowRight, Bot, Globe, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export interface AgentProps {
    id: string;
    name: string;
    userId: string;
    sourceUrl: string;
    status: 'Running' | 'Error' | 'Pending';
    metadata: {
        sourceSubUrls: string[];
    };
    totalQueries: number;
    thisMonthQueries: number;
    avgResponseTime: string;
    lastUpdated: Date;
}

const cardData = [
    {
        icon: <Globe className="h-5 w-5 text-emerald-600" />,
        heading: 'Website Crawler',
        description: 'Automatically crawls your website to gather information and learn about your content.',
        bgColor: 'emerald-100',
    },
    {
        icon: <Sparkles className="h-5 w-5 text-amber-600" />,
        heading: 'AI-Powered',
        description: 'Uses advanced AI to understand your content and provide helpful responses to visitors.',
        bgColor: 'amber-100',
    },
    {
        icon: <ArrowRight className="h-5 w-5 text-sky-600" />,
        heading: 'Easy Integration',
        description: 'Simple to set up and integrate with your existing website with minimal configuration.',
        bgColor: 'sky-100',
    },
];

const useGetAgent = (): { agent: AgentProps | undefined; loading: boolean } => {
    const [data, setData] = useState<AgentProps>();
    const [loading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        setIsLoading(true);
        const fetchData = async () => {
            try {
                const response = await AxiosInstance.get('/api/v1/agent', {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.data.success == true) {
                    setData(response.data.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);
    return {
        agent: data,
        loading,
    };
};

export default function AgentDashboard() {
    const { agent, loading } = useGetAgent();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [agentStatus, setAgentStatus] = useState<'Running' | 'Error' | 'Pending'>();

    useEffect(() => {
        setAgentStatus(agent?.status);
    }, [agent?.status]);
    return (
        <>
            {loading ? (
                <div className="h-[300px] flex items-center justify-center">Loading...</div>
            ) : agent ? (
                <AgentDetails agent={agent as AgentProps} />
            ) : (
                <div className="w-full min-h-[80vh] flex flex-col items-center justify-center px-4">
                    <div className="max-w-3xl w-full text-center space-y-8">
                        <div className="relative">
                            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-40 h-40 bg-violet-100 rounded-full blur-3xl opacity-30" />
                            <div className="relative">
                                <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-full mb-6">
                                    <Bot className="h-8 w-8 text-emerald-600" />
                                </div>
                                <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
                                    Register your Agent
                                </h1>
                                <p className="text-xl text-slate-600 dark:text-neutral-200  max-w-2xl mx-auto">
                                    You haven&apos;t created an agent yet. Create one to help visitors navigate your
                                    website.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                            {cardData.map((item, idx) => (
                                <div key={idx} className="bg-white dark:bg-muted p-6 rounded-xl shadow-lg">
                                    <div className={`bg-${item.bgColor} p-2 rounded-lg w-fit mb-4`}>{item.icon}</div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{item.heading}</h3>
                                    <p className="text-slate-600 dark:text-white text-sm">{item.description}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-12">
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        disabled={agentStatus == 'Pending'}
                                        size="lg"
                                        className="bg-[#556B2F] hover:bg-[#4A5F25] text-white px-8 py-6 rounded-lg text-lg font-medium cursor-pointer"
                                    >
                                        {agentStatus == 'Pending'
                                            ? 'Your agent is getting prepared'
                                            : 'Create your agent'}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md dark:bg-muted">
                                    <DialogTitle></DialogTitle>
                                    <CreateAgentForm onSuccess={() => setIsDialogOpen(false)} />
                                </DialogContent>
                            </Dialog>

                            <p className="text-sm text-slate-500 mt-4">
                                Your agent will help visitors find information on your website more efficiently.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
