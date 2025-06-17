'use client';

import { useRef, useState } from 'react';
import { Globe, BarChart, Bot, Hammer, Clock9 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { alegreya } from '../fonts/fonts';
import { timeAgo } from '@/helper/time';
import { AgentProps } from './AgentDashboard';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco, darcula } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { getLocalStorage } from '@/lib/storage';

interface IntegrationCodeProp {
    title: string;
    code: string;
}

const nextjsCode = `<!-- Place this inside your layout.tsx -->
<Script
  src='https://retriv.xyz/agent-widget.js'
  data-agent-id='111223334445555'
  data-api-key='rt_1234456789'
  data-name='YourAgentName'
  strategy='afterInteractive'
  async
/>`;

const reactjsCode = `<!-- Place inside public/index.html -->
<script
  src="https://retriv.xyz/agent-widget.js"
  data-agent-id="111223334445555"
  data-api-key="rt_1234456789"
  data-name="YourAgentName"
  async
></script>`;

const javascriptCode = `<!-- Vanilla JS - Place before </body> tag -->
<script
  src="https://retriv.xyz/agent-widget.js"
  data-agent-id="111223334445555"
  data-api-key="rt_1234456789"
  data-name="YourAgentName"
  async
></script>`;

const integrationCode: IntegrationCodeProp[] = [
    {
        title: 'Next.js',
        code: nextjsCode,
    },
    {
        title: 'React.js',
        code: reactjsCode,
    },
    {
        title: 'Javascript',
        code: javascriptCode,
    },
];

export function AgentDetails({ agent }: { agent: AgentProps }) {
    const isCurrentThemeDark = getLocalStorage('isDarkTheme');
    const codeRef = useRef<HTMLDivElement | null>(null);
    const [copied, setCopied] = useState<number | null>(null);

    const handleCopyCode = (code: string, idx: number) => {
        if (codeRef.current) {
            navigator.clipboard.writeText(code).then(() => {
                setCopied(idx);
            });
        }
    };
    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <h2 className={`uppercase text-3xl font-bold ${alegreya.className}`}>{agent.name}</h2>
                        <Bot size={30} />
                        <Badge
                            variant={agent.status === 'Running' ? 'outline' : 'secondary'}
                            className="bg-[#556B2F] text-white py-1 px-2 font-medium"
                        >
                            {agent.status}
                        </Badge>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="h-12 pb-0 grid w-full grid-cols-3 bg-transparent border-none shadow-none rounded-none">
                    <TabsTrigger value="overview" className="border-b cursor-pointer">
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value="training" className="border-b cursor-pointer">
                        Training Data
                    </TabsTrigger>
                    <TabsTrigger value="integration" className="border-b cursor-pointer">
                        Integration
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 pt-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                        <Card className="border shadow-none bg-[#EEECE8] dark:bg-muted">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-lg font-semibold">Total Queries</CardTitle>
                                <BarChart className="h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{agent.totalQueries}</div>
                            </CardContent>
                        </Card>

                        <Card className="border shadow-none bg-[#EEECE8] dark:bg-muted">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-lg font-semibold">Last Updated</CardTitle>
                                <Globe className="h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{timeAgo(agent.lastUpdated)}</div>
                                <p className="text-xs text-muted-foreground">
                                    Website crawled on {new Date(agent?.lastUpdated).toLocaleDateString()}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border shadow-none bg-[#EEECE8] dark:bg-muted">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-lg font-semibold">Avg. Response Time</CardTitle>
                                <Clock9 className="h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{agent.avgResponseTime}</div>
                            </CardContent>
                        </Card>

                        <Card className="border shadow-none bg-[#EEECE8] dark:bg-muted">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-lg font-semibold">This Month Queries</CardTitle>
                                <BarChart className="h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{agent.thisMonthQueries}</div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="training" className="pt-4">
                    <Card className="border shadow-none bg-[#EEECE8] dark:bg-muted">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Hammer className="h-5 w-5" />
                                <CardTitle className="text-xl">Training Data</CardTitle>
                            </div>
                            <CardDescription>Sources your agent uses to answer questions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Globe className="h-5 w-5" />
                                        <div className="font-semibold text-xl">Website</div>
                                    </div>
                                    <div className="mb-3 mt-2">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">{agent.sourceUrl}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {agent.metadata.sourceSubUrls.length} pages crawled
                                                </p>
                                            </div>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className="rounded-full bg-white hover:bg-white border-none cursor-pointer shadow-none"
                                                            size="sm"
                                                            disabled
                                                        >
                                                            Recrawl
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Coming soon</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="integration" className="pt-4">
                    <Card className="bg-[#EEECE8] dark:bg-muted">
                        <CardHeader>
                            <CardTitle>Website Integration</CardTitle>
                            <CardDescription>Add your agent to your website</CardDescription>
                        </CardHeader>
                        <CardContent className="bg-transparent">
                            <h3 className="text-xl font-medium mb-2">Add this script to your website</h3>
                            {integrationCode.map((item: IntegrationCodeProp, idx: number) => (
                                <div key={idx} className="mb-5 bg-transparent">
                                    <div className="rounded-md pt-4">
                                        <div
                                            ref={codeRef}
                                            className="bg-background rounded-xl font-mono text-sm overflow-x-auto"
                                        >
                                            <SyntaxHighlighter
                                                language="javascript"
                                                style={isCurrentThemeDark ? darcula : docco}
                                                customStyle={{
                                                    padding: '12px',
                                                    fontSize: '15px',
                                                    borderRadius: '12px',
                                                }}
                                                wrapLongLines={true}
                                            >
                                                {item.code}
                                            </SyntaxHighlighter>
                                        </div>
                                        <Button
                                            onClick={() => handleCopyCode(item.code, idx)}
                                            variant="outline"
                                            className="w-full mt-4"
                                        >
                                            {copied === idx ? 'Copied!' : 'Copy'}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
