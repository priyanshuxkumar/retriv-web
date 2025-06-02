'use client';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTheme } from 'next-themes';
import { ChevronDown, LogOut, Moon, Sun, Laptop, SunDim, UserCircle } from 'lucide-react';
import { User } from '@/context/user.context';

interface UserProfileProps {
    user: User;
    handleLogout: () => void;
}

export default function UserProfile({ user, handleLogout }: UserProfileProps) {
    const router = useRouter();
    const { setTheme } = useTheme();

    if (!user) {
        return (
            <div className="flex h-14 w-full items-center justify-center">
                <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <span className="text-sm text-muted-foreground">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between gap-4 rounded-lg bg-muted p-3">
            <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 rounded-md border">
                    <AvatarImage src={user?.userMetadata.avatarUrl || '/placeholder.svg'} />
                    <AvatarFallback className="rounded-md bg-primary/10 text-primary">
                        {user?.userMetadata.name[0].toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="font-medium leading-none">{user?.userMetadata.name}</span>
                    <span className="text-xs text-muted-foreground">Free plan</span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ChevronDown className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={() => router.push('/profile')}>
                                <UserCircle className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <SunDim className="mr-2 h-4 w-4" />
                                <span>Theme</span>
                                <TooltipProvider delayDuration={300}>
                                    <div className="flex items-center rounded-2xl border bg-background">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-2xl"
                                                    onClick={() => setTheme('light')}
                                                >
                                                    <Sun className="h-4 w-4" />
                                                    <span className="sr-only">Light theme</span>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent side="bottom">Light</TooltipContent>
                                        </Tooltip>

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-2xl"
                                                    onClick={() => setTheme('dark')}
                                                >
                                                    <Moon className="h-4 w-4" />
                                                    <span className="sr-only">Dark theme</span>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent side="bottom">Dark</TooltipContent>
                                        </Tooltip>

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-2xl"
                                                    onClick={() => setTheme('system')}
                                                >
                                                    <Laptop className="h-4 w-4" />
                                                    <span className="sr-only">System theme</span>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent side="bottom">System</TooltipContent>
                                        </Tooltip>
                                    </div>
                                </TooltipProvider>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
