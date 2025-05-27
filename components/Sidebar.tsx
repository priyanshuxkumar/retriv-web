"use client";

import clsx from "clsx";
import Link from "next/link";
import { Bot, Lock, Settings2, UserRoundSearch } from "lucide-react";
import { usePathname } from "next/navigation";
import UserProfile from "./UserProfile";
import { alegreya } from "./fonts/fonts";

const item = [
  {
    icon: <Bot />,
    title: "Agent",
    link: "/agent",
  },
  {
    icon: <Lock />,
    title: "API keys",
    link: "/apikeys",
  },
  {
    icon: <UserRoundSearch />,
    title: "Query",
    link: "/query",
  },
  {
    icon: <Settings2 />,
    title: "Settings",
    link: "/settings",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <>
      <nav className="mt-2 flex-1">
        <div className={`flex justify-between px-2 mb-8 ${alegreya.className}`}>
          <span className="text-2xl font-semibold">Retriv</span>
        </div>
        <UserProfile />
        <ul className="mt-8">
          {item.map((item) => (
            <li key={item.title}>
              <Link
                href={item.link}
                className={clsx(
                  "flex h-10 items-center my-2 gap-2 rounded-md px-2 text-sm hover:bg-[#F5F5F7]",
                  pathname === item.link && "bg-[#F5F5F7] font-bold" 
                )}
              >
                <div className="text-sm opacity-80">{item?.icon}</div>
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
