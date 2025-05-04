"use client";

import { Loader } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import AxiosInstance from "@/utils/axiosInstance";
import { timeAgo } from "@/helper/time";
import { useUser } from "@/context/user.context";
import NoDataFound from "@/components/NoDataFound";

interface QueryProp {
  id: string;
  agentId: string;
  userQuery: string;
  time: Date | string;
}

const useFetchEmails = (agentId: string) => {
  const [data, setData] = useState<QueryProp[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await AxiosInstance.get(
          `/api/v1/agent/query/${agentId}`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data.success === true) {
          setData(response.data.data);
        }
      } catch (err: unknown) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [agentId]);

  return {
    query: data,
    isLoading,
  };
};

export default function Page() {
  const { user } = useUser();
  const { query, isLoading } = useFetchEmails(
    user?.userMetadata.agentId as string
  );

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
                      <Loader color="white" strokeWidth="2" size="30" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                (query.length) > 0 &&
                (query.map((item: QueryProp) => (
                  <TableRow
                    key={item.id}
                    className="text-base hover:bg-transparent cursor-pointer"
                  >
                    <TableCell className="underline decoration-dashed text-ellipsis pr-8 py-4 truncate">
                      <span className="cursor-pointer">{item.userQuery}</span>
                    </TableCell>
                    <TableCell className="text-right py-4">
                      {timeAgo(item.time as Date)}
                    </TableCell>
                  </TableRow>
                )))
              )}
            </TableBody>
          </Table>
          {/* No query found component  */}
          {query.length == 0 && <NoDataFound />}
        </div>
      </div>
    </div>
  );
}
