import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { client } from '@/lib/amplifyClient';
import {fetchUserAttributes, getCurrentUser} from 'aws-amplify/auth';
import type { BookType } from '@/components/book/bookTypes';
import { toast } from 'sonner';

interface LoanRequestDialogProps {
    book: BookType;
    onSuccess?: () => void;
}

interface LoanRequestForm {
    message: string;
    proposedDuration: number | '';
}

const LoanRequestDialog: React.FC<LoanRequestDialogProps> = ({
         book,
         onSuccess
}) => {

    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [form, setForm] = useState<LoanRequestForm>({
        message: '',
        proposedDuration: 14 // Default to 2 weeks
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // Get current user
            const currentUser = await getCurrentUser();
            const attributes = await fetchUserAttributes();
            const currentUserEmail = attributes.email ?? 'Someone';

            if (!book.ownerId) {
                console.error("Book ownerId is missing");
                throw new Error("Book ownerId is missing");
            }
            console.log("Cur user: ", currentUserEmail);

            // Create loan request
            const result = await client.models.LoanRequest.create({
                requesterId: currentUser.userId,
                lenderId: book.ownerId,
                bookId: book.id,
                status: 'pending',
                message: form.message || undefined,
                proposedDuration: form.proposedDuration ? Number(form.proposedDuration) : undefined,
                requestedAt: new Date().toISOString()
            });
            console.log("LoanRequestResult: ", result);

            if (result.data && result.data.id) {
                const notification = await client.models.Notification.create({
                    userId: book.ownerId,
                    type: 'loan_request',
                    title: 'New loan request',
                    message: `"${currentUserEmail}" wants to borrow "${book.title}"!`, //TODO: change currentUserEmail to username when username feature is added
                    loanRequestId: result.data.id,
                    bookId: book.id,
                })
                console.log("Notification: ", notification);
            }

            if (result.errors && result.errors.length > 0) {
                throw new Error(result.errors[0].message);
            }

            // Success!
            setOpen(false);
            setForm({ message: '', proposedDuration: 14 });
            onSuccess?.();

            // Show success message
            toast.success("📖 Request Sent!", {
                description: "The book owner will be notified and can approve or decline your request."
            });

        } catch (err) {
            console.error('Failed to create loan request:', err);
            setError(err instanceof Error ? err.message : 'Failed to send loan request');
        } finally {
            setIsSubmitting(false);
        }
    };

    const durationOptions = [
        { value: 7, label: '1 week' },
        { value: 14, label: '2 weeks' },
        { value: 21, label: '3 weeks' },
        { value: 30, label: '1 month' },
        { value: 60, label: '2 months' },
        { value: 'NO DURATION', label: 'No specific duration' }
    ];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button asChild className="w-full lg:w-auto" size="lg">
                    <span>Request Loan</span>
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        Request to Borrow
                    </DialogTitle>
                    <DialogDescription>
                          <span className="text-sm text-gray-600 mt-2 block">
                            <span className="font-medium">“{book.title}”</span> by {book.author} — owner: {book.ownerEmail}
                          </span>
                    </DialogDescription>
                    <div className="text-sm text-gray-600 mt-2">
                        <p className="font-medium">"{book.title}"</p>
                        <p>by {book.author}</p>
                        <p>from {book.ownerEmail}</p>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Message Field */}
                    <div className="space-y-2">
                        <Label htmlFor="message">
                            Message to Owner <span className="text-gray-400">(optional)</span>
                        </Label>
                        <Textarea
                            id="message"
                            placeholder="Hi! I'd love to borrow this book..."
                            value={form.message}
                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                            rows={3}
                            className="resize-none"
                        />
                        <p className="text-xs text-gray-500">
                            Introduce yourself or explain why you're interested in this book
                        </p>
                    </div>

                    {/* Duration Field */}
                    <div className="space-y-2">
                        <Label htmlFor="duration">
                            Proposed Loan Duration <span className="text-gray-400">(optional)</span>
                        </Label>
                        <Select
                            value={form.proposedDuration.toString()}
                            onValueChange={(value) =>
                                setForm({ ...form, proposedDuration: value === '' ? '' : Number(value) })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent>
                                {durationOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value.toString()}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500">
                            The owner can approve a different duration if needed
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-3">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isSubmitting}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                'Send Request'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default LoanRequestDialog;