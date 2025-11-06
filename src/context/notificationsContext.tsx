import React, { createContext, useContext, useEffect, useState } from 'react';
import { client } from '@/lib/amplifyClient';
import type { Schema } from '@/amplify/data/resource';

type NotificationModel = Schema['Notification']['type'];

interface NotificationContextType {
    notifications: NotificationModel[];
    unreadCount: number;
    loading: boolean;
    markRead: (notificationId: string) => Promise<void>;
    markAllRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<NotificationModel[]>([]);
    const [loading, setLoading] = useState(true);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    useEffect(() => {
        const setupSubscription = async () => {
            try {
                // Single subscription for all notifications
                const subscription = client.models.Notification.observeQuery().subscribe({
                    next: (data) => {
                        const items = data.items ?? [];
                        // Sort by creation date, newest first
                        items.sort((a, b) => {
                            if (!a.createdAt || !b.createdAt) return 0;
                            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                        });
                        setNotifications(items);
                        setLoading(false);
                    },
                    error: (e) => {
                        console.error('Notification subscription error:', e);
                        setLoading(false);
                    }
                });

                return () => subscription.unsubscribe();
            } catch (e) {
                console.error('Failed to setup notification subscription:', e);
                setLoading(false);
            }
        };

        let cleanup: (() => void) | undefined;
        setupSubscription().then(cleanupFn => {
            cleanup = cleanupFn;
        });

        return () => {
            if (cleanup) cleanup();
        };
    }, []);

    const markRead = async (notificationId: string) => {
        try {
            await client.models.Notification.update({ id: notificationId, isRead: true });
            // Subscription will automatically update the state
        } catch (e) {
            console.error('Failed to mark notification as read:', e);
        }
    };

    const markAllRead = async () => {
        const unread = notifications.filter(n => !n.isRead);
        try {
            await Promise.all(unread.map(n =>
                client.models.Notification.update({ id: n.id, isRead: true })
            ));
            // Subscription will automatically update the state
        } catch (e) {
            console.error('Failed to mark all as read:', e);
        }
    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            loading,
            markRead,
            markAllRead
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within NotificationProvider');
    }
    return context;
};