import { ChevronsUpDown, LogOutIcon, User } from "lucide-react";
import AxiosInstance from "@/utils/axiosInstance";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@/context/user.context";

export default function UserProfile() {
  const { user } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await AxiosInstance.post("/api/v1/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
      if (response.data.success === true) {
        router.push('/login')
        toast(response.data.message);
      }
    } catch (err: unknown) {
      console.error(err);
    }
  };
  return (
    <>
      {!user ? (
        <div className="flex justify-center items-center w-full">
            Loading...
        </div>
      ) : (
        <div className="flex justify-between items-center px-1">
          <div className="flex gap-2 items-center">
            <div>
              <Avatar className="rounded-md border w-11 h-11">
                <AvatarImage src={user?.userMetadata.avatarUrl} />
                <AvatarFallback className="rounded-md uppercase text-xl font-semibold">
                  {user?.userMetadata.name[0]
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold truncate">{user?.userMetadata.name}</span>
              <span className="text-sm">Free plan</span>
            </div>
          </div>
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="cursor-pointer hover:bg-transparent">
                  <ChevronsUpDown />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-50 py-2 px-1">
                <div>
                  <Button
                    onClick={() => router.push("/profile")}
                    variant={"ghost"}
                    className="w-full justify-start text-base"
                    disabled
                  >
                    <User />
                    Profile
                  </Button>
                </div>
                <div>
                  <Button
                    variant={"ghost"}
                    className="w-full justify-start text-base text-red-500 hover:text-red-500"
                    onClick={handleLogout}
                  >
                    <LogOutIcon />
                    Logout
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}
    </>
  );
}