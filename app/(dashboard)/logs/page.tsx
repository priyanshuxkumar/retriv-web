"use client";

import clsx from "clsx";
import { Loader } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { useEffect, useState } from "react";
import AxiosInstance from "@/utils/axiosInstance";
import { timeAgo } from "@/helper/time";
import NoDataFound from "@/components/NoDataFound";

export interface ApiKeyLogProps {
  id: string;
  method: string;
  endpoint: string;
  responseStatus: number;
  createdAt: Date | string;
}

const useFetchApiKeyLogs = () => {
  const [data, setData] = useState<ApiKeyLogProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await AxiosInstance.get(`/api/v1/apikey/logs`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
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
  }, []);

  return {
    logs: data,
    isLoading,
  };
};

export default function Page() {
  const { logs, isLoading } = useFetchApiKeyLogs();
  return (
    <div className="flex items-center justify-between mx-26 mt-12">
      <div className="w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <p className="font-semibold text-2xl">Logs</p>
          </div>
        </div>

        {/* Body  */}
        <div className="mt-12">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent cursor-pointer">
                <TableHead className="w-[100px]">Endpoint</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Creation Date</TableHead>
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
                (logs.length > 0) &&
                (logs.map((item: ApiKeyLogProps) => (
                  <TableRow
                    key={item.id}
                    className="text-base hover:bg-transparent cursor-pointer"
                  >
                    <TableCell className="underline decoration-dashed text-ellipsis pr-8 py-4">
                      <Link href={`/logs/${item.id}`}>{item.endpoint}</Link>
                    </TableCell>
                    <TableCell className="py-4">
                      <span
                        className={clsx(
                          "px-2 py-1 rounded-sm text-sm",
                          item.responseStatus == 200
                            ? "bg-green-300"
                            : "bg-yellow-500"
                        )}
                      >
                        {item.responseStatus}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 truncate">
                      {item.method}
                    </TableCell>
                    <TableCell className="text-right py-4">
                      {timeAgo(item.createdAt as Date)}
                    </TableCell>
                  </TableRow>
                )))
              )}
            </TableBody>
          </Table>
          {/* No logs found component  */}
          {logs.length == 0 && <NoDataFound />}
        </div>
      </div>
    </div>
  );
}
