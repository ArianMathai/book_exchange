import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Button } from '@/components/ui/button';
import {Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Menu, Home, Book, Plus, User, LogOut, Sparkles } from 'lucide-react';

import {useEffect, useState} from 'react';
import {fetchUserAttributes} from "aws-amplify/auth";
import {client} from "@/lib/amplifyClient.ts";

// Collapsible menu on mobile and sticky menu on desktop
const BurgerMenu: React.FC = () => {
    const { signOut } = useAuthenticator();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [checkingProfile, setCheckingProfile] = useState(true);


    const menuItems = [
        { to: '/', icon: Home, label: 'Home', description: 'Dashboard & Overview' },
        { to: '/library', icon: Book, label: 'Library', description: 'Manage your library' },
        { to: '/add-book', icon: Plus, label: 'Add Book', description: 'Share a new book', badge: 'New' },
        { to: '/profile', icon: User, label: 'Profile', description: 'Account settings' },
    ];

    // Check if user has set up location, else -> redirect to setup page
    useEffect(() => {
        const checkUserProfile = async () => {
            try {
                const attributes = await fetchUserAttributes();
                const sub = attributes?.sub;

                if (!sub) {
                    console.error("❌ No Cognito user ID found. Signing out...");
                    signOut();
                    return;
                }

                const res = await client.models.User.get({ sub });

                if (!res?.data || !res.data.coordinates) {
                    navigate("/setup");
                    return;
                }
            } catch (err) {
                console.error("❌ Error checking user profile:", err);
                signOut(); // Optionally force logout if profile fetch fails
            } finally {
                setCheckingProfile(false);
            }
        };

        checkUserProfile();
    }, []);


    const handleSignOut = () => {
        setIsOpen(false);
        signOut();
    };

    const handleMenuItemClick = (path: string) => {
        setIsOpen(false);
        navigate(path);
    };

    const handleDesktopNavigation = (path: string) => {
        navigate(path);
    };

    if (checkingProfile) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-slate-500 text-sm">Checking your profile...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50">
            {/* Navigation Header */}
            <nav className="sticky top-0 z-50 border-b bg-gradient-to-r from-emerald-950/95 to-emerald-900/95 backdrop-blur-xl supports-[backdrop-filter]:bg-emerald-950/80">
                <div className="flex items-center justify-between max-w-7xl mx-auto px-4 lg:px-6 py-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-emerald-800/30 rounded-xl backdrop-blur-sm">
                            <Sparkles className="w-5 h-5 text-emerald-200" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-emerald-100 tracking-tight">Book Exchange</h1>
                            <p className="text-xs text-emerald-200/80 hidden sm:block">Share knowledge, discover stories</p>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-1">
                        {menuItems.map((item) => {
                            const IconComponent = item.icon;
                            return (
                                <Button
                                    key={item.to}
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDesktopNavigation(item.to)}
                                    className="text-emerald-100 hover:text-white hover:bg-emerald-800/40 transition-all duration-200 relative group cursor-pointer flex items-center space-x-2 px-4 py-2"
                                >
                                    <IconComponent className="w-4 h-4" />
                                    <span className="font-medium">{item.label}</span>
                                    {item.badge && (
                                        <Badge variant="secondary" className="ml-1 text-xs bg-emerald-200 text-emerald-900 hover:bg-emerald-100">
                                            {item.badge}
                                        </Badge>
                                    )}
                                    <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </Button>
                            );
                        })}
                        <Separator orientation="vertical" className="h-6 bg-emerald-700/30 mx-2" />
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={signOut}
                            className="text-emerald-200 hover:text-emerald-100 hover:bg-emerald-800/40 transition-colors duration-200 cursor-pointer"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                        </Button>
                    </div>

                    {/* Mobile Menu Trigger */}
                    <Sheet open={isOpen} onOpenChange={setIsOpen} >
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="lg:hidden text-emerald-100 hover:bg-emerald-800/40 p-2.5 relative group cursor-pointer"
                            >
                                <Menu className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                                <div className="absolute inset-0 rounded-md bg-emerald-700/20 scale-0 group-hover:scale-100 transition-transform duration-200" />
                            </Button>
                        </SheetTrigger>

                        <SheetContent
                            side="right"
                            className="w-full sm:max-w-md bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 border-emerald-800/30 text-emerald-100 p-0"
                        >
                            <div className="flex flex-col h-full">
                                {/* Header */}
                                <SheetHeader className="px-6 py-6 border-b border-emerald-800/30 bg-emerald-950/50">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2.5 bg-emerald-800/30 rounded-xl backdrop-blur-sm">
                                            <Sparkles className="w-6 h-6 text-emerald-200" />
                                        </div>
                                        <div>
                                            <SheetTitle className="text-left text-xl font-bold text-emerald-100">
                                                Book Exchange
                                            </SheetTitle>
                                            <SheetDescription className="text-emerald-200/80 text-sm mt-1">
                                                Navigate your library
                                            </SheetDescription>
                                        </div>
                                    </div>
                                </SheetHeader>

                                {/* Menu Items */}
                                <div className="flex-1 px-6 py-8 space-y-2 overflow-y-auto">
                                    {menuItems.map((item, index) => {
                                        const IconComponent = item.icon;
                                        return (
                                            <Button
                                                key={item.to}
                                                variant="ghost"
                                                size="lg"
                                                onClick={() => handleMenuItemClick(item.to)}
                                                className="w-full justify-start text-left h-auto p-4 hover:bg-emerald-800/30 transition-all duration-300 group relative overflow-hidden cursor-pointer"
                                                style={{
                                                    animationDelay: `${index * 100}ms`,
                                                    animation: isOpen ? 'slideInRight 0.4s ease-out forwards' : undefined
                                                }}
                                            >
                                                <div className="flex items-center space-x-4 w-full">
                                                    <div className="p-3 bg-emerald-800/40 rounded-xl group-hover:bg-emerald-700/50 transition-all duration-300 group-hover:scale-110">
                                                        <IconComponent className="w-5 h-5 text-emerald-100" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="font-semibold text-emerald-50 group-hover:text-white transition-colors duration-300">
                                                                {item.label}
                                                            </span>
                                                            {item.badge && (
                                                                <Badge variant="secondary" className="bg-emerald-200 text-emerald-900 text-xs">
                                                                    {item.badge}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-emerald-300/80 text-sm mt-1 group-hover:text-emerald-200/90 transition-colors duration-300">
                                                            {item.description}
                                                        </p>
                                                    </div>
                                                </div>
                                                {/* Hover effect */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-700/0 via-emerald-700/5 to-emerald-700/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            </Button>
                                        );
                                    })}
                                </div>

                                {/* Footer with Sign Out */}
                                <div className="px-6 py-6 border-t border-emerald-800/30 bg-emerald-950/30 backdrop-blur-sm">
                                    <Button
                                        variant="ghost"
                                        size="lg"
                                        onClick={handleSignOut}
                                        className="w-full justify-start h-auto p-4 hover:bg-emerald-800/40 transition-all duration-300 group text-emerald-200 hover:text-emerald-100 cursor-pointer"
                                    >
                                        <div className="flex items-center space-x-4 w-full">
                                            <div className="p-3 bg-emerald-800/40 rounded-xl group-hover:bg-emerald-700/50 transition-all duration-300 group-hover:scale-110">
                                                <LogOut className="w-5 h-5 text-emerald-200" />
                                            </div>
                                            <div className="flex-1 text-left">
                                                <span className="font-semibold">Sign Out</span>
                                                <p className="text-emerald-300/80 text-sm mt-1 group-hover:text-emerald-200/90 transition-colors duration-300">
                                                    End your session
                                                </p>
                                            </div>
                                        </div>
                                    </Button>

                                    <div className="mt-4 pt-4 border-t border-white-800/20">
                                        <p className="text-center text-emerald-400/60 text-xs">
                                            Made with ❤️ for book lovers
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default BurgerMenu;