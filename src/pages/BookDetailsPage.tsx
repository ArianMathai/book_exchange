import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCurrentUser, type GetCurrentUserOutput } from 'aws-amplify/auth';
import { client } from '@/lib/amplifyClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, BookOpen } from 'lucide-react';
import type { BookType } from '@/components/book/bookTypes';
import { getUrl } from 'aws-amplify/storage';
import LoanRequestDialog from '@/components/loan/LoanRequestDialog.tsx';

const BookDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<BookType | null>(null);
  const [currentUser, setCurrentUser] = useState<GetCurrentUserOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resolvedImageUrl, setResolvedImageUrl] = useState<string | null>(null);
  const [isResolvingUrl, setIsResolvingUrl] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (err) {
        console.log('No authenticated user');
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchBook = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const result = await client.models.Book.get({ id });

        if (result.errors && result.errors.length > 0) {
          setError(result.errors[0].message);
          setLoading(false);
          return;
        }

        const data = result.data;
        if (data) {
          const transformed: BookType = {
            id: data.id,
            title: data.title,
            author: data.author,
            isbn: data.isbn,
            ownerId: data.ownerId,
            ownerEmail: data.ownerEmail,
            createdAt: data.createdAt,
            loanedOut: data.loanedOut,
            loanedTo: data.loanedTo,
            imageUrl: data.imageUrl ?? undefined,
            imageSource: data.imageSource === 'manual' || data.imageSource === 'google_books' ? data.imageSource : null,
            isOriginalCopy: data.isOriginalCopy,
            borrowStatus: data.borrowStatus,
          };
          setBook(transformed);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  useEffect(() => {
    const resolveImage = async () => {
      if (!book?.imageUrl) {
        setResolvedImageUrl(null);
        return;
      }
      try {
        if (book.imageSource === 'google_books') {
          setResolvedImageUrl(book.imageUrl);
        } else if (book.imageSource === 'manual') {
          setIsResolvingUrl(true);
          try {
            const { url } = await getUrl({
              path: book.imageUrl,
              options: {
                validateObjectExistence: true,
                expiresIn: 3600,
              },
            });
            setResolvedImageUrl(url.toString());
          } catch {
            setResolvedImageUrl(null);
          }
          setIsResolvingUrl(false);
        } else {
          setResolvedImageUrl(book.imageUrl);
        }
      } catch {
        setResolvedImageUrl(null);
      }
    };
    resolveImage();
  }, [book]);

  const handleLoanRequestSuccess = () => {
    // Optionally refresh book data or show additional UI feedback
    console.log('Loan request sent successfully!');
  };

  // Check if current user is the owner of the book
  const isOwner = currentUser && book && (
      currentUser.userId === book.ownerId ||
      currentUser.signInDetails?.loginId === book.ownerEmail
  );

  // Determine if we should show the request loan button
  const shouldShowRequestButton = book && currentUser && !isOwner &&
      book.isOriginalCopy && !book.loanedOut;

  if (loading || isResolvingUrl) {
    return (
        <div className="flex justify-center items-center h-full py-20">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
    );
  }

  if (error || !book) {
    return (
        <div className="p-4 text-red-600">Failed to load book details.</div>
    );
  }

  return (
      <div className="max-w-6xl mx-auto p-4">
        <Card className="overflow-hidden">
          <div className="lg:flex lg:gap-6">
            {/* Image Section */}
            <div className="flex justify-center lg:justify-start lg:flex-shrink-0 pb-5">
              {resolvedImageUrl ? (
                  <img
                      src={resolvedImageUrl}
                      alt={`Cover of ${book.title}`}
                      className="w-48 h-64 lg:w-56 lg:h-72 object-cover rounded-lg shadow-md"
                  />
              ) : (
                  <div className="w-48 h-64 lg:w-56 lg:h-72 bg-slate-100 flex items-center justify-center rounded-lg shadow-md">
                    <BookOpen className="w-16 h-16 text-slate-400" />
                  </div>
              )}
            </div>

            {/* Content Section */}
            <div className="lg:w-2/3 lg:flex lg:flex-col">
              <CardHeader>
                <CardTitle className="text-2xl lg:text-3xl font-bold text-slate-900 truncate">
                  {book.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 text-slate-700 lg:flex-1">
                <p className="text-lg">
                  <span className="font-medium">Author:</span> {book.author}
                </p>

                {book.isbn && (
                    <p>
                      <span className="font-medium">ISBN:</span> {book.isbn}
                    </p>
                )}

                <p>
                  <span className="font-medium">Owner:</span> {book.ownerEmail}
                </p>

                <div className="flex items-center gap-2">
                  <span className="font-medium">Status:</span>
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                      book.loanedOut
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                  }`}>
                  {book.loanedOut ? (
                      book.loanedTo ? `Loaned to ${book.loanedTo}` : 'Loaned out'
                  ) : 'Available'}
                </span>
                </div>

                {/* Request Loan Dialog */}
                {shouldShowRequestButton && (
                    <div className="pt-4">
                      <LoanRequestDialog
                          book={book}
                          onSuccess={handleLoanRequestSuccess}
                      >
                      </LoanRequestDialog>
                    </div>
                )}

                {/* Show message if user is owner */}
                {isOwner && (
                    <div className="pt-4">
                      <p className="text-sm text-slate-500 italic">
                        This is your book
                      </p>
                    </div>
                )}

                {/* Show message if book is already loaned */}
                {!isOwner && book.loanedOut && (
                    <div className="pt-4">
                      <p className="text-sm text-red-600">
                        This book is currently loaned out
                      </p>
                    </div>
                )}
              </CardContent>
            </div>
          </div>
        </Card>
      </div>
  );
};

export default BookDetailsPage;