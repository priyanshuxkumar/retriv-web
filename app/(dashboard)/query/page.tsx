'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEffect, useState } from 'react';
import AxiosInstance from '@/utils/axiosInstance';
import { timeAgo } from '@/helper/time';
import { useUser } from '@/context/user.context';
import NoDataFound from '@/components/NoDataFound';
import Link from 'next/link';
import Loader from '@/components/Loader';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import BuySubscription from '@/components/BuySubscription';

interface QueryProp {
    id: string;
    agentId: string;
    userQuery: string;
    time: Date | string;
}

const useFetchQueries = (agentId: string) => {
    const [data, setData] = useState<QueryProp[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [userHasSubscription, setUserHasSubscription] = useState<boolean | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await AxiosInstance.get(`/api/v1/agent/queries/${agentId}`, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.data.success === true) {
                    setData(response.data.data || []);
                } else if (response.data.success === false) {
                    setUserHasSubscription(false);
                }
            } catch (err: unknown) {
                const error = err as AxiosError;

                if (error.response) {
                    toast.error('Failed to fetch queries', {
                        description: (error.response.data as AxiosError)?.message || 'An error occurred',
                    });
                } else if (error.request) {
                    toast.error('Network error', {
                        description: 'No response from server. Please check your connection.',
                    });
                } else {
                    toast.error('Unexpected error', {
                        description: error.message,
                    });
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [agentId]);

    return {
        queries: data,
        isLoading,
        userHasSubscription,
    };
};

export default function Page() {
    const { user } = useUser();
    const { queries, isLoading, userHasSubscription } = useFetchQueries(user?.userMetadata.agentId as string);
    return (
        <div className="flex items-center justify-between mx-4 md:mx-26 md:mt-12">
            <div className="w-full">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-4 gap-4">
                    <div>
                        <p className="font-semibold text-2xl">User query&apos;s</p>
                    </div>
                </div>

                {/* Body  */}
                <div className="mt-6">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent cursor-pointer">
                                <TableHead>Query</TableHead>
                                <TableHead className="w-[100px]">Time</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5}>
                                        <div className="flex justify-center items-center py-4">
                                            <Loader size="30" strokeWidth="2" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                queries.length > 0 &&
                                queries.map((item: QueryProp) => (
                                    <TableRow key={item.id} className="text-base hover:bg-transparent cursor-pointer">
                                        <TableCell className="underline decoration-dashed text-ellipsis pr-8 py-4 truncate">
                                            <Link href={`/query/${item.id}`}>
                                                {' '}
                                                <span className="cursor-pointer">{item.userQuery}</span>
                                            </Link>
                                        </TableCell>
                                        <TableCell className="text-right py-4">{timeAgo(item.time as Date)}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {/* No Subcription */}
                    {!isLoading && !userHasSubscription && <BuySubscription />}

                    {/* No query found component  (Subscription Buy) */}
                    {!isLoading && userHasSubscription && queries.length === 0 && <NoDataFound />}
                </div>
            </div>
        </div>
    );
}
