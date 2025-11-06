import React, {  useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Check, Bell } from 'lucide-react';
import {useNotifications} from "@/context/notificationsContext.tsx";
import { useNavigate } from 'react-router-dom';


const Inbox: React.FC = () => {
    const { notifications, unreadCount, loading, markRead, markAllRead } = useNotifications();
    const [tab, setTab] = useState<'all' | 'unread'>('unread');
    const navigate = useNavigate();

    const filteredItems = useMemo(() => {
        return tab === 'unread'
            ? notifications.filter(item => !item.isRead)
            : notifications;
    }, [notifications, tab]);

    const handleMarkRead = async (notificationId: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        await markRead(notificationId);
    };

    const handleNotificationClick = (notification: typeof notifications[0]) => {
        // Navigate based on notification type
        switch (notification.type) {
            case 'loan_request':
            case 'loan_rejected':
                // Navigate to loan request detail page
                if (notification.loanRequestId) {
                    navigate(`/app/loan-request/${notification.loanRequestId}`);
                }
                break;
                
            case 'handoff_ready':
                // Navigate to handoff coordination page
                if (notification.handoffId) {
                    navigate(`/app/handoff/${notification.handoffId}`);
                }
                break;
                
            case 'loan_approved':
                // For approved loans, go to handoff page if available, otherwise loan request
                if (notification.handoffId) {
                    navigate(`/app/handoff/${notification.handoffId}`);
                } else if (notification.loanRequestId) {
                    navigate(`/app/loan-request/${notification.loanRequestId}`);
                }
                break;
                
            default:
                // For other notification types, try to navigate to loan request if available
                if (notification.loanRequestId) {
                    navigate(`/app/loan-request/${notification.loanRequestId}`);
                }
                break;
        }
    };

    return (

        <div className="max-w-3xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 120px)' /* -120px to account for BurgerMenu*/ }}>
            {/* Fixed Header Section */}
            <div className="flex-shrink-0">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-emerald-100">
                            <Bell className="w-5 h-5 text-emerald-700" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Inbox</h2>
                            <p className="text-sm text-slate-600">Messages & notifications about loans</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setTab('all')}
                                className={tab === 'all' ? 'border-emerald-600 text-emerald-700' : ''}>
                            All
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setTab('unread')}
                                className={tab === 'unread' ? 'border-emerald-600 text-emerald-700' : ''}>
                            Unread
                            {unreadCount > 0 && (
                                <Badge className="ml-2 bg-red-500 text-white">{unreadCount}</Badge>
                            )}
                        </Button>
                        {unreadCount > 0 && (
                            <Button size="sm" onClick={markAllRead}>
                                <Check className="w-4 h-4 mr-2" />
                                Mark all read
                            </Button>
                        )}
                    </div>
                </div>

                <Separator className="mb-4" />
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto min-h-0">
                {loading && (
                    <div className="flex items-center justify-center py-16 text-slate-500">
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Loading…
                    </div>
                )}

                {!loading && filteredItems.length === 0 && (
                    <div className="text-center py-16 text-slate-500">
                        No {tab === 'unread' ? 'unread ' : ''}notifications.
                    </div>
                )}

                <div className="space-y-3 pb-6">
                    {filteredItems.map(n => (
                        <div
                            key={n.id}
                            className={`rounded-lg border p-4 bg-white transition-all cursor-pointer hover:shadow-md hover:border-emerald-300 ${n.isRead ? 'opacity-80' : 'border-emerald-200'}`}
                            onClick={() => handleNotificationClick(n)}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-slate-900 truncate">{n.title}</h3>
                                        {!n.isRead && <Badge className="bg-emerald-600 text-white">New</Badge>}
                                    </div>
                                    <p className="text-slate-700 mt-1 whitespace-pre-wrap">{n.message}</p>
                                    {n.createdAt && (
                                        <p className="text-xs text-slate-500 mt-2">
                                            {new Date(n.createdAt).toLocaleString()}
                                        </p>
                                    )}
                                </div>
                                {!n.isRead && (
                                    <Button size="sm" variant="outline" onClick={(e) => handleMarkRead(n.id, e)}>
                                        <Check className="w-4 h-4 mr-2" />
                                        Mark read
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Inbox;