import { Link, useLocation } from "react-router-dom";
import { MessageSquare, FileText, Library, CheckSquare, Layout, Settings, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { logoutUser } from "../apis/auth"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import useAuth from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const NavigationBar = () => {
    const location = useLocation();
    const { user, isLoading, isError, error, invalidate } = useAuth();
    const { toast } = useToast();

    const isActive = (path: string) => location.pathname === path;

    function handlelogout() {
        logoutUser()
            .then(() => {
                invalidate();
                toast({
                    title: "logged out successfully",
                    description: "you have been logged out of your account.",
                });
            })
            .catch((error) => {
                console.error("logout failed:", error);
                toast({
                    title: "logout failed",
                    description: "an error occurred while logging out. please try again.",
                    variant: "destructive",
                });
            });
    }



    return (
        <div className="w-full max-w-5xl mx-auto rounded-full mb-6 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 shadow-sm">
            <nav className="flex items-center justify-between px-6 py-3">
                <div className="flex items-center space-x-4">
                    {[
                        { to: "/chat", label: "Chat", icon: MessageSquare },
                        { to: "/docs", label: "Docs", icon: FileText },
                        { to: "/library", label: "Library", icon: Library },
                        { to: "/tasks", label: "Tasks", icon: CheckSquare },
                        { to: "/board", label: "Board", icon: Layout }
                    ].map(({ to, label, icon: Icon }) => (
                        <Link
                            key={to}
                            to={to}
                            className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${isActive(to)
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/60'
                                }`}
                        >
                            <Icon size={18} />
                            <span className="hidden sm:inline">{label}</span>
                        </Link>
                    ))}
                </div>

                <div className="flex items-center">
                    {isLoading ? (
                        <p className="text-gray-600 dark:text-gray-300">Loading...</p>
                    ) : user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center justify-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
                                    <Avatar className="h-9 w-9 cursor-pointer hover:opacity-80">
                                        <AvatarImage src={user.pfp || "/placeholder.svg"} alt={user.name} />
                                        <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-400">
                                            {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                                        </AvatarFallback>
                                    </Avatar>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium">{user.name}</p>
                                        <p className="text-xs text-muted-foreground">{user.email || "No email provided"}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Link to="/profile" className="flex w-full items-center">Profile</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link to="/settings" className="flex w-full items-center">
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Settings</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handlelogout} className="text-red-600 cursor-pointer">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link to="/login" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
                            Log in
                        </Link>
                    )}
                </div>
            </nav>
        </div>
    );
};

export default NavigationBar;

