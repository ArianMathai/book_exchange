import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, Calendar, User, BookOpen, MessageSquare, Clock } from 'lucide-react';
import { client } from '@/lib/amplifyClient';
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotifications } from '@/context/notificationsContext';


const LoanRequestDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { markRead } = useNotifications();
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    // Get current user
    useEffect(() => {
        getCurrentUser().then(user => {
            setCurrentUserId(user.userId);
        }).catch(console.error);
    }, []);

    // Fetch loan request data
    const { data: loanRequest, isLoading: loanRequestLoading, error: loanRequestError } = useQuery({
        queryKey: ['loanRequest', id],
        queryFn: async () => {
            if (!id) throw new Error('No loan request ID provided');
            
            const result = await client.models.LoanRequest.get({ id });
            if (!result.data) throw new Error('Loan request not found');
            
            // Mark related notification as read
            const notifications = await client.models.Notification.list({
                filter: { loanRequestId: { eq: id } }
            });
            
            if (notifications.data && notifications.data.length > 0) {
                const notification = notifications.data[0];
                if (!notification.isRead) {
                    await markRead(notification.id);
                }
            }
            
            return result.data;
        },
        enabled: !!id
    });

    // Fetch book data
    const { data: book, isLoading: bookLoading } = useQuery({
        queryKey: ['book', loanRequest?.bookId],
        queryFn: async () => {
            if (!loanRequest?.bookId) throw new Error('No book ID');
            
            const result = await client.models.Book.get({ id: loanRequest.bookId });
            if (!result.data) throw new Error('Book not found');
            
            return result.data;
        },
        enabled: !!loanRequest?.bookId
    });

    // Determine user roles first
    const isLender = currentUserId === loanRequest?.lenderId;
    const isRequester = currentUserId === loanRequest?.requesterId;
    
    // Fetch requester's public profile
    const { data: requesterProfile } = useQuery({
        queryKey: ['publicProfile', loanRequest?.requesterId],
        queryFn: async () => {
            if (!loanRequest?.requesterId) throw new Error('No requester ID');
            
            const result = await client.models.PublicProfile.list({
                filter: { userId: { eq: loanRequest.requesterId } }
            });
            
            if (result.data && result.data.length > 0) {
                return result.data[0];
            }
            return null;
        },
        enabled: !!loanRequest?.requesterId && !isRequester
    });

    // Approve mutation
    const approveMutation = useMutation({
        mutationFn: async (duration: number) => {
            if (!loanRequest || !currentUserId) throw new Error('Missing data');
            
            const userAttributes = await fetchUserAttributes();
            const currentUserEmail = userAttributes.email ?? 'The lender';
            
            // Update loan request status
            await client.models.LoanRequest.update({
                id: loanRequest.id,
                status: 'approved',
                approvedDuration: duration,
                respondedAt: new Date().toISOString(),
                dueDate: new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString()
            });

            // Create LoanHandoff record to initiate handoff process
            const handoffResult = await client.models.LoanHandoff.create({
                loanRequestId: loanRequest.id,
                requesterId: loanRequest.requesterId,
                lenderId: loanRequest.lenderId,
                lenderConfirmed: false,
                borrowerConfirmed: false
            });

            if (!handoffResult.data) {
                throw new Error('Failed to create handoff record');
            }

            // Update loan request status to meeting_arranged
            await client.models.LoanRequest.update({
                id: loanRequest.id,
                status: 'meeting_arranged'
            });
            
            // Send handoff_ready notifications to both users
            await Promise.all([
                // Notification to borrower
                client.models.Notification.create({
                    userId: loanRequest.requesterId,
                    type: 'handoff_ready',
                    title: 'Loan approved - Arrange pickup!',
                    message: `${currentUserEmail} has approved your request to borrow "${book?.title}". Click to coordinate the book handoff.`,
                    loanRequestId: loanRequest.id,
                    handoffId: handoffResult.data.id,
                    bookId: loanRequest.bookId
                }),
                // Notification to lender
                client.models.Notification.create({
                    userId: loanRequest.lenderId,
                    type: 'handoff_ready',
                    title: 'Loan approved - Arrange handoff!',
                    message: `You've approved the loan request for "${book?.title}". Click to coordinate the book handoff with the borrower.`,
                    loanRequestId: loanRequest.id,
                    handoffId: handoffResult.data.id,
                    bookId: loanRequest.bookId
                })
            ]);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['loanRequest', id] });
            alert('Loan request approved! Both parties have been notified to coordinate the book handoff.');
            navigate('/inbox');
        },
        onError: (error) => {
            console.error('Failed to approve loan request:', error);
            alert('Failed to approve loan request. Please try again.');
        }
    });

    // Deny mutation
    const denyMutation = useMutation({
        mutationFn: async () => {
            if (!loanRequest || !currentUserId) throw new Error('Missing data');
            
            const userAttributes = await fetchUserAttributes();
            const currentUserEmail = userAttributes.email ?? 'The lender';
            
            // Update loan request status
            await client.models.LoanRequest.update({
                id: loanRequest.id,
                status: 'rejected',
                respondedAt: new Date().toISOString()
            });
            
            // Send notification to requester
            await client.models.Notification.create({
                userId: loanRequest.requesterId,
                type: 'loan_rejected',
                title: 'Loan request declined',
                message: `${currentUserEmail} has declined your request to borrow "${book?.title}".`,
                loanRequestId: loanRequest.id,
                bookId: loanRequest.bookId
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['loanRequest', id] });
            alert('Loan request denied. The borrower has been notified.');
            navigate('/inbox');
        },
        onError: (error) => {
            console.error('Failed to deny loan request:', error);
            alert('Failed to deny loan request. Please try again.');
        }
    });

    const handleApprove = () => {
        const duration = loanRequest?.proposedDuration || 14; // Default to 14 days
        approveMutation.mutate(duration);
    };

    const handleDeny = () => {
        if (confirm('Are you sure you want to deny this loan request?')) {
            denyMutation.mutate();
        }
    };


    const isPending = loanRequest?.status === 'pending';
    const isProcessing = approveMutation.isPending || denyMutation.isPending;

    if (loanRequestLoading || bookLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    if (loanRequestError || !loanRequest) {
        return (
            <div className="max-w-2xl mx-auto p-6">
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-center text-red-600">Failed to load loan request details.</p>
                        <Button 
                            variant="outline" 
                            onClick={() => navigate('/inbox')}
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

    const getDurationLabel = (days?: number) => {
        if (!days) return 'No specific duration';
        if (days === 7) return '1 week';
        if (days === 14) return '2 weeks';
        if (days === 21) return '3 weeks';
        if (days === 30) return '1 month';
        if (days === 60) return '2 months';
        return `${days} days`;
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
            case 'approved':
                return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
            case 'rejected':
                return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            {/* Header */}
            <div className="mb-6">
                <Button 
                    variant="ghost" 
                    onClick={() => navigate('/inbox')}
                    className="mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Inbox
                </Button>
                
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Loan Request Details</h1>
                    {loanRequest.status && getStatusBadge(loanRequest.status)}
                </div>
            </div>

            {/* Book Information */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        Book Information
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                        {book?.imageUrl && (
                            <div>
                                <img 
                                    src={book.imageUrl} 
                                    alt={book.title}
                                    className="w-full max-w-[200px] rounded-lg shadow-md"
                                />
                            </div>
                        )}
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-600">Title</p>
                                <p className="font-semibold">{book?.title || 'Unknown'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Author</p>
                                <p className="font-semibold">{book?.author || 'Unknown'}</p>
                            </div>
                            {book?.isbn && (
                                <div>
                                    <p className="text-sm text-gray-600">ISBN</p>
                                    <p className="font-mono text-sm">{book.isbn}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Request Information */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Request Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                                <User className="w-4 h-4" />
                                {isLender ? 'Requested by' : 'Requester'}
                            </p>
                            <p className="font-semibold">
                                {isRequester ? 'You' : (requesterProfile?.username || requesterProfile?.email || `User ${loanRequest.requesterId.slice(0, 8)}...`)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                                <Calendar className="w-4 h-4" />
                                Requested on
                            </p>
                            <p className="font-semibold">
                                {loanRequest.requestedAt 
                                    ? new Date(loanRequest.requestedAt).toLocaleDateString()
                                    : 'Unknown'}
                            </p>
                        </div>
                    </div>

                    {loanRequest.message && (
                        <div>
                            <p className="text-sm text-gray-600 flex items-center gap-1 mb-2">
                                <MessageSquare className="w-4 h-4" />
                                Message from requester
                            </p>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-800 whitespace-pre-wrap">{loanRequest.message}</p>
                            </div>
                        </div>
                    )}

                    <div>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                            <Clock className="w-4 h-4" />
                            Proposed loan duration
                        </p>
                        <p className="font-semibold">
                            {getDurationLabel(loanRequest.proposedDuration ?? undefined)}
                        </p>
                    </div>

                    {loanRequest.status === 'approved' && loanRequest.approvedDuration && (
                        <div>
                            <p className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                                <Clock className="w-4 h-4" />
                                Approved loan duration
                            </p>
                            <p className="font-semibold">
                                {getDurationLabel(loanRequest.approvedDuration)}
                            </p>
                        </div>
                    )}

                    {loanRequest.dueDate && (
                        <div>
                            <p className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                                <Calendar className="w-4 h-4" />
                                Due date
                            </p>
                            <p className="font-semibold">
                                {new Date(loanRequest.dueDate).toLocaleDateString()}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Actions for lender */}
            {isLender && isPending && (
                <Card>
                    <CardHeader>
                        <CardTitle>Actions</CardTitle>
                        <CardDescription>
                            Respond to this loan request
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4">
                            <Button 
                                onClick={handleApprove}
                                disabled={isProcessing}
                                className="flex-1"
                            >
                                {approveMutation.isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Approving...
                                    </>
                                ) : (
                                    'Approve Request'
                                )}
                            </Button>
                            <Button 
                                variant="destructive"
                                onClick={handleDeny}
                                disabled={isProcessing}
                                className="flex-1"
                            >
                                {denyMutation.isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Denying...
                                    </>
                                ) : (
                                    'Deny Request'
                                )}
                            </Button>
                        </div>
                        <p className="text-sm text-gray-600 mt-4 text-center">
                            {loanRequest.proposedDuration 
                                ? `Approving will set the loan duration to ${getDurationLabel(loanRequest.proposedDuration)}`
                                : 'Approving will set no specific return date'}
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Status message for non-pending requests */}
            {!isPending && (
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-center text-gray-600">
                            This loan request has been {loanRequest.status}.
                            {loanRequest.respondedAt && (
                                <span className="block mt-2 text-sm">
                                    Responded on {new Date(loanRequest.respondedAt).toLocaleDateString()}
                                </span>
                            )}
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default LoanRequestDetail;