import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    Loader2, 
    ArrowLeft, 
    User, 
    BookOpen, 
    Clock, 
    CheckCircle2,
    AlertCircle,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { client } from '@/lib/amplifyClient';
import { getCurrentUser } from 'aws-amplify/auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotifications } from '@/context/notificationsContext';
import LoanChat from '@/components/chat/LoanChat';
import { toast } from 'sonner';

const LoanHandoffPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { markRead } = useNotifications();
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [safetyGuidelinesExpanded, setSafetyGuidelinesExpanded] = useState(false);
    const [realtimeHandoff, setRealtimeHandoff] = useState<any>(null);

    // Get current user
    useEffect(() => {
        getCurrentUser().then(user => {
            setCurrentUserId(user.userId);
        }).catch((error) => {
            console.error('Failed to get current user:', error);
        });
    }, []);

    // Fetch handoff data
    const { data: handoff, isLoading: handoffLoading, error: handoffError } = useQuery({
        queryKey: ['loanHandoff', id],
        queryFn: async () => {
            if (!id) throw new Error('No handoff ID provided');

            const result = await client.models.LoanHandoff.get({ id });
            if (!result.data) throw new Error('Handoff not found');

            return result.data;
        },
        enabled: !!id && !!currentUserId
    });

    // Fetch loan request data
    const { data: loanRequest, isLoading: loanRequestLoading } = useQuery({
        queryKey: ['loanRequest', handoff?.loanRequestId],
        queryFn: async () => {
            if (!handoff?.loanRequestId) throw new Error('No loan request ID');
            
            const result = await client.models.LoanRequest.get({ id: handoff.loanRequestId });
            if (!result.data) throw new Error('Loan request not found');
            
            return result.data;
        },
        enabled: !!handoff?.loanRequestId
    });

    // Fetch book data
    const { data: book } = useQuery({
        queryKey: ['book', loanRequest?.bookId],
        queryFn: async () => {
            if (!loanRequest?.bookId) throw new Error('No book ID');
            
            const result = await client.models.Book.get({ id: loanRequest.bookId });
            if (!result.data) throw new Error('Book not found');
            
            return result.data;
        },
        enabled: !!loanRequest?.bookId
    });

    // Fetch user profiles
    const { data: lenderProfile } = useQuery({
        queryKey: ['publicProfile', loanRequest?.lenderId],
        queryFn: async () => {
            if (!loanRequest?.lenderId) return null;
            
            const result = await client.models.PublicProfile.list({
                filter: { userId: { eq: loanRequest.lenderId } }
            });
            
            return result.data && result.data.length > 0 ? result.data[0] : null;
        },
        enabled: !!loanRequest?.lenderId
    });

    const { data: borrowerProfile } = useQuery({
        queryKey: ['publicProfile', loanRequest?.requesterId],
        queryFn: async () => {
            if (!loanRequest?.requesterId) return null;
            
            const result = await client.models.PublicProfile.list({
                filter: { userId: { eq: loanRequest.requesterId } }
            });
            
            return result.data && result.data.length > 0 ? result.data[0] : null;
        },
        enabled: !!loanRequest?.requesterId
    });

    // Use real-time data if available, otherwise fall back to query data
    const currentHandoff = realtimeHandoff || handoff;

    // Determine user roles
    const isLender = currentUserId === loanRequest?.lenderId;
    const isBorrower = currentUserId === loanRequest?.requesterId;

    // Function to mark related notifications as read when user takes action
    const markHandoffNotificationsAsRead = async () => {
        if (!currentUserId || !id) return;

        try {
            const notifications = await client.models.Notification.list({
                filter: {
                    handoffId: { eq: id },
                    userId: { eq: currentUserId },
                    isRead: { eq: false }
                }
            });

            if (notifications.data && notifications.data.length > 0) {
                await Promise.all(
                    notifications.data.map(notification => markRead(notification.id))
                );
            }
        } catch (error) {
            console.error('Failed to mark handoff notifications as read:', error);
        }
    };

    // Real-time subscription for handoff updates
    useEffect(() => {
        if (!id || !currentUserId) return;


        const subscription = client.models.LoanHandoff.onUpdate({
            filter: {
                id: { eq: id }
            }
        }).subscribe({
            next: (updatedHandoff) => {
                setRealtimeHandoff(updatedHandoff);

                // Check if both parties are now confirmed
                if (updatedHandoff.lenderConfirmed && updatedHandoff.borrowerConfirmed && !updatedHandoff.completedAt) {
                    // Show completion success message
                    // Active loan creation now happens automatically via server-side trigger
                    toast.success("🎉 Handoff Complete!", {
                        description: "The loan will be activated automatically. You'll receive a notification when it's ready."
                    });
                    navigate('/app/inbox');
                }
            },
            error: (error) => {
                // Subscription errors are expected during navigation
                if (error.message?.includes('NetworkError') || error.message?.includes('cancelled')) {
                    return; // Ignore network/cancellation errors
                }
                console.warn('LoanHandoff subscription error:', error);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [id, currentUserId, navigate]);
    const isCompleted = currentHandoff?.lenderConfirmed && currentHandoff?.borrowerConfirmed;


    // Confirm handoff mutation (simplified - backend handles completion detection)
    const confirmHandoffMutation = useMutation({
        mutationFn: async () => {
            if (!handoff || !currentUserId) throw new Error('Missing data');

            // Simple confirmation - just set own confirmation field
            const updateData: {
                id: string;
                lenderConfirmed?: boolean;
                lenderConfirmedAt?: string;
                borrowerConfirmed?: boolean;
                borrowerConfirmedAt?: string;
            } = {
                id: handoff.id
            };

            if (isLender) {
                updateData.lenderConfirmed = true;
                updateData.lenderConfirmedAt = new Date().toISOString();
            } else if (isBorrower) {
                updateData.borrowerConfirmed = true;
                updateData.borrowerConfirmedAt = new Date().toISOString();
            }

            // Backend will detect when both parties confirmed and set completedAt automatically
            await client.models.LoanHandoff.update(updateData);

            return {};
        },
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['loanHandoff', id] });
            queryClient.invalidateQueries({ queryKey: ['loanRequest'] });

            // Mark related notifications as read since user took meaningful action
            await markHandoffNotificationsAsRead();

            toast.success("Confirmation Received", {
                description: "Thank you for confirming. The system will automatically process the handoff when both parties confirm."
            });
            // Backend will handle completion detection and active loan creation automatically
        }
    });


    const handleConfirmHandoff = () => {
        if (confirm('Confirm that you have completed the book handoff?')) {
            confirmHandoffMutation.mutate();
        }
    };


    if (handoffLoading || loanRequestLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    if (handoffError || !handoff || !loanRequest) {
        return (
            <div className="max-w-2xl mx-auto p-6">
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-center text-red-600">Failed to load handoff details.</p>
                        <Button 
                            variant="outline" 
                            onClick={() => navigate('/app/inbox')}
                            className="mt-4 mx-auto block"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Inbox
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="mb-6">
                <Button 
                    variant="ghost" 
                    onClick={() => navigate('/app/inbox')}
                    className="mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Inbox
                </Button>
                
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Book Handoff</h1>
                    {isCompleted ? (
                        <Badge className="bg-green-100 text-green-800">Completed</Badge>
                    ) : (
                        <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
                    )}
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Book & Participants Info */}
                <div className="space-y-6">
                    {/* Book Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="w-5 h-5" />
                                Book Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-4">
                                {book?.imageUrl && (
                                    <img 
                                        src={book.imageUrl} 
                                        alt={book.title}
                                        className="w-20 h-28 object-cover rounded-lg shadow-md"
                                    />
                                )}
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-lg">{book?.title}</h3>
                                    <p className="text-gray-600">by {book?.author}</p>
                                    {loanRequest.dueDate && (
                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                            <Clock className="w-4 h-4" />
                                            Due: {new Date(loanRequest.dueDate).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Chat Section */}
                    <div className="lg:col-span-1">
                        <LoanChat loanRequest={loanRequest} />
                    </div>

                    {/* Participants */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Participants
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                <div>
                                    <p className="font-medium">Lender</p>
                                    <p className="text-sm text-gray-600">
                                        {isLender ? 'You' : lenderProfile?.username || lenderProfile?.email}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {currentHandoff.lenderConfirmed ? (
                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                                    )}
                                    <span className="text-sm">
                                        {currentHandoff.lenderConfirmed ? 'Confirmed' : 'Pending'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                <div>
                                    <p className="font-medium">Borrower</p>
                                    <p className="text-sm text-gray-600">
                                        {isBorrower ? 'You' : borrowerProfile?.username || borrowerProfile?.email}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {currentHandoff.borrowerConfirmed ? (
                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                                    )}
                                    <span className="text-sm">
                                        {currentHandoff.borrowerConfirmed ? 'Confirmed' : 'Pending'}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Actions */}
                <div className="space-y-6">

                    {/* Handoff Confirmation */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Confirm Handoff</CardTitle>
                            <CardDescription>
                                Both parties must confirm that the book has been handed over
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isCompleted ? (
                                <div className="text-center py-4">
                                    <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-2" />
                                    <p className="text-green-600 font-medium">Handoff completed!</p>
                                    <p className="text-sm text-gray-600">
                                        Completed on {currentHandoff.completedAt && new Date(currentHandoff.completedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {((isLender && !currentHandoff.lenderConfirmed) || (isBorrower && !currentHandoff.borrowerConfirmed)) && (
                                        <Button 
                                            onClick={handleConfirmHandoff}
                                            disabled={confirmHandoffMutation.isPending}
                                            className="w-full bg-emerald-600 hover:bg-emerald-700"
                                        >
                                            {confirmHandoffMutation.isPending ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Confirming...
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                                    Confirm Handoff
                                                </>
                                            )}
                                        </Button>
                                    )}
                                    
                                    {((isLender && currentHandoff.lenderConfirmed) || (isBorrower && currentHandoff.borrowerConfirmed)) && (
                                        <div className="text-center py-4">
                                            <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                            <p className="text-green-600 font-medium">You have confirmed</p>
                                            <p className="text-sm text-gray-600">Waiting for the other party to confirm</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Safety Guidelines */}
                    <Card>
                        <CardHeader 
                            className="cursor-pointer"
                            onClick={() => setSafetyGuidelinesExpanded(!safetyGuidelinesExpanded)}
                        >
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5" />
                                    Safety Guidelines
                                </div>
                                {safetyGuidelinesExpanded ? (
                                    <ChevronUp className="w-5 h-5" />
                                ) : (
                                    <ChevronDown className="w-5 h-5" />
                                )}
                            </CardTitle>
                        </CardHeader>
                        {safetyGuidelinesExpanded && (
                            <CardContent>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• Meet in a public, well-lit location</li>
                                    <li>• Bring a friend if you feel more comfortable</li>
                                    <li>• Verify the book condition before confirming</li>
                                    <li>• Keep communication respectful and friendly</li>
                                </ul>
                            </CardContent>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default LoanHandoffPage;