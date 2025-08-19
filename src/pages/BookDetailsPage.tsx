import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { client } from '@/lib/amplifyClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import type { BookType } from '@/components/book/bookTypes';
import { getUrl } from 'aws-amplify/storage';

const BookDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<BookType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resolvedImageUrl, setResolvedImageUrl] = useState<string | null>(null);
  const [isResolvingUrl, setIsResolvingUrl] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const result = await client.models.Book.get({
          id,
          selectionSet: [
            'id',
            'title',
            'author',
            'isbn',
            'ownerEmail',
            'createdAt',
            'loanedOut',
            'loanedTo',
            'imageUrl',
            'imageSource'
          ]
        });

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
            ownerEmail: data.ownerEmail,
            createdAt: data.createdAt,
            loanedOut: data.loanedOut,
            loanedTo: data.loanedTo,
            imageUrl: data.imageUrl ?? undefined,
            imageSource: data.imageSource === 'manual' || data.imageSource === 'google_books' ? data.imageSource : null,
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
    <div className="max-w-3xl mx-auto p-4">
      <Card className="overflow-hidden">
        {resolvedImageUrl && (
          <img
            src={resolvedImageUrl}
            alt={`Cover of ${book.title}`}
            className="w-full h-64 object-cover"
          />
        )}
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-slate-900">{book.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-slate-700">
          <p><span className="font-medium">Author:</span> {book.author}</p>
          {book.isbn && (
            <p><span className="font-medium">ISBN:</span> {book.isbn}</p>
          )}
          <p><span className="font-medium">Owner:</span> {book.ownerEmail}</p>
          <p>
            <span className="font-medium">Status:</span>{' '}
            {book.loanedOut ? (
              book.loanedTo ? `Loaned to ${book.loanedTo}` : 'Loaned out'
            ) : 'Available'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookDetailsPage;
