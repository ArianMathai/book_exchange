/**
 * Google Books API Service - Enhanced with Live Search
 * Provides functions to search for books and extract cover images
 */

// Base URL for Google Books API
const GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1/volumes';

// Interface for Google Books API Volume Info
export interface GoogleBooksVolumeInfo {
  title: string;
  authors?: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  industryIdentifiers?: Array<{
    type: string;
    identifier: string;
  }>;
  pageCount?: number;
  imageLinks?: {
    smallThumbnail?: string;
    thumbnail?: string;
    small?: string;
    medium?: string;
    large?: string;
    extraLarge?: string;
  };
  language?: string;
}

// Interface for Google Books API Item
export interface GoogleBooksItem {
  id: string;
  volumeInfo: GoogleBooksVolumeInfo;
  selfLink: string;
}

// Interface for Google Books API Response
export interface GoogleBooksResponse {
  kind: string;
  totalItems: number;
  items?: GoogleBooksItem[];
}

// Interface for book suggestions
export interface BookSuggestion {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  publishedDate?: string;
  coverUrl?: string | null;
  volumeInfo: GoogleBooksVolumeInfo;
}

// Custom error class for Google Books API errors
export class GoogleBooksApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'GoogleBooksApiError';
  }
}

/**
 * Search for books by ISBN
 * @param isbn - The ISBN to search for (10 or 13 digits)
 * @returns Promise with book data or null if not found
 */
export async function searchByISBN(isbn: string): Promise<GoogleBooksItem | null> {
  try {
    // Clean the ISBN by removing hyphens and spaces
    const cleanedIsbn = isbn.replace(/[-\s]/g, '');

    // Construct the query URL with the ISBN
    const queryUrl = `${GOOGLE_BOOKS_API_URL}?q=isbn:${cleanedIsbn}`;

    const response = await fetch(queryUrl);

    if (!response.ok) {
      throw new GoogleBooksApiError(`API request failed with status ${response.status}`, response.status);
    }

    const data: GoogleBooksResponse = await response.json();

    // If no books found, return null
    if (!data.items || data.items.length === 0) {
      return null;
    }

    // Return the first matching book
    return data.items[0];
  } catch (error) {
    if (error instanceof GoogleBooksApiError) {
      throw error;
    }
    throw new GoogleBooksApiError(`Failed to search by ISBN: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Search for books by title and author
 * @param title - The book title
 * @param author - The book author
 * @returns Promise with array of matching books
 */
export async function searchByTitleAuthor(title: string, author: string): Promise<GoogleBooksItem[]> {
  try {
    // Construct the query URL with title and author
    // Using intitle: and inauthor: for more precise results
    const queryUrl = `${GOOGLE_BOOKS_API_URL}?q=intitle:${encodeURIComponent(title)}+inauthor:${encodeURIComponent(author)}&maxResults=5`;

    const response = await fetch(queryUrl);

    if (!response.ok) {
      throw new GoogleBooksApiError(`API request failed with status ${response.status}`, response.status);
    }

    const data: GoogleBooksResponse = await response.json();

    // If no books found, return empty array
    if (!data.items || data.items.length === 0) {
      return [];
    }

    return data.items;
  } catch (error) {
    if (error instanceof GoogleBooksApiError) {
      throw error;
    }
    throw new GoogleBooksApiError(`Failed to search by title and author: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Search for book suggestions by partial title
 * @param partialTitle - Partial title to search for
 * @param maxResults - Maximum number of results to return (default: 5)
 * @returns Promise with array of book suggestions
 */
export async function searchBooksByTitle(partialTitle: string, maxResults: number = 5): Promise<BookSuggestion[]> {
  try {
    if (partialTitle.trim().length < 2) {
      return [];
    }

    const queryUrl = `${GOOGLE_BOOKS_API_URL}?q=intitle:${encodeURIComponent(partialTitle)}&maxResults=${maxResults}&orderBy=relevance`;

    const response = await fetch(queryUrl);

    if (!response.ok) {
      throw new GoogleBooksApiError(`API request failed with status ${response.status}`, response.status);
    }

    const data: GoogleBooksResponse = await response.json();

    if (!data.items || data.items.length === 0) {
      return [];
    }

    return data.items.map(item => convertToBookSuggestion(item));
  } catch (error) {
    console.error('Error searching books by title:', error);
    return [];
  }
}

/**
 * Search for book suggestions by partial author name
 * @param partialAuthor - Partial author name to search for
 * @param maxResults - Maximum number of results to return (default: 5)
 * @returns Promise with array of book suggestions
 */
export async function searchBooksByAuthor(partialAuthor: string, maxResults: number = 5): Promise<BookSuggestion[]> {
  try {
    if (partialAuthor.trim().length < 2) {
      return [];
    }

    const queryUrl = `${GOOGLE_BOOKS_API_URL}?q=inauthor:${encodeURIComponent(partialAuthor)}&maxResults=${maxResults}&orderBy=relevance`;

    const response = await fetch(queryUrl);

    if (!response.ok) {
      throw new GoogleBooksApiError(`API request failed with status ${response.status}`, response.status);
    }

    const data: GoogleBooksResponse = await response.json();

    if (!data.items || data.items.length === 0) {
      return [];
    }

    return data.items.map(item => convertToBookSuggestion(item));
  } catch (error) {
    console.error('Error searching books by author:', error);
    return [];
  }
}

/**
 * Search for book suggestions by combined title and author
 * @param title - Title to search for
 * @param author - Author to search for
 * @param maxResults - Maximum number of results to return (default: 8)
 * @returns Promise with array of book suggestions
 */
export async function searchCombinedSuggestions(
    title: string,
    author: string,
    maxResults: number = 8
): Promise<BookSuggestion[]> {
  try {
    const suggestions = new Map<string, BookSuggestion>();

    // Search by title if provided
    if (title.trim().length >= 2) {
      const titleResults = await searchBooksByTitle(title, Math.ceil(maxResults / 2));
      titleResults.forEach(book => suggestions.set(book.id, book));
    }

    // Search by author if provided
    if (author.trim().length >= 2) {
      const authorResults = await searchBooksByAuthor(author, Math.ceil(maxResults / 2));
      authorResults.forEach(book => suggestions.set(book.id, book));
    }

    // If both title and author are provided, also search combined
    if (title.trim().length >= 2 && author.trim().length >= 2) {
      const combinedResults = await searchByTitleAuthor(title, author);
      combinedResults.forEach(item => {
        const book = convertToBookSuggestion(item);
        suggestions.set(book.id, book);
      });
    }

    // Convert to array and limit results
    return Array.from(suggestions.values()).slice(0, maxResults);
  } catch (error) {
    console.error('Error searching combined suggestions:', error);
    return [];
  }
}

/**
 * Convert GoogleBooksItem to BookSuggestion
 * @param item - Google Books API item
 * @returns BookSuggestion object
 */
function convertToBookSuggestion(item: GoogleBooksItem): BookSuggestion {
  const { volumeInfo } = item;
  const authors = volumeInfo.authors || [];
  const author = authors.length > 0 ? authors.join(', ') : 'Unknown Author';

  // Extract ISBN (prefer ISBN-13, fall back to ISBN-10)
  let isbn: string | undefined;
  if (volumeInfo.industryIdentifiers) {
    const isbn13 = volumeInfo.industryIdentifiers.find(id => id.type === 'ISBN_13');
    const isbn10 = volumeInfo.industryIdentifiers.find(id => id.type === 'ISBN_10');
    isbn = isbn13?.identifier || isbn10?.identifier;
  }

  return {
    id: item.id,
    title: volumeInfo.title || 'Unknown Title',
    author,
    isbn,
    publishedDate: volumeInfo.publishedDate,
    coverUrl: ensureHttps(getBookCoverUrl(volumeInfo)),
    volumeInfo
  };
}

/**
 * Get the best quality cover image URL from volume info
 * @param volumeInfo - The volume info from Google Books API
 * @returns The highest quality image URL or null if no image available
 */
export function getBookCoverUrl(volumeInfo: GoogleBooksVolumeInfo): string | null {
  if (!volumeInfo.imageLinks) {
    return null;
  }

  // Try to get the highest quality image, falling back to lower quality ones
  const { extraLarge, large, medium, small, thumbnail, smallThumbnail } = volumeInfo.imageLinks;

  // Return the highest quality image available
  return extraLarge || large || medium || small || thumbnail || smallThumbnail || null;
}

/**
 * Convert HTTP URLs to HTTPS
 * Google Books sometimes returns HTTP URLs which may cause mixed content warnings
 * @param url - The URL to convert
 * @returns The URL with HTTPS protocol
 */
export function ensureHttps(url: string | null): string | null {
  if (!url) return null;
  return url.replace(/^http:\/\//i, 'https://');
}

/**
 * Search for a book and get its cover image
 * @param isbn - ISBN to search (optional)
 * @param title - Book title (required if ISBN not provided)
 * @param author - Book author (required if ISBN not provided)
 * @returns Promise with the book cover URL or null if not found
 */
export async function findBookCover(
    isbn?: string | null,
    title?: string,
    author?: string
): Promise<string | null> {
  try {
    let bookItem: GoogleBooksItem | null = null;

    // Try to search by ISBN first if provided
    if (isbn) {
      bookItem = await searchByISBN(isbn);
    }

    // If no results from ISBN or no ISBN provided, try title+author
    if (!bookItem && title && author) {
      const results = await searchByTitleAuthor(title, author);
      if (results.length > 0) {
        bookItem = results[0];
      }
    }

    // If we found a book, extract the cover URL
    if (bookItem) {
      const coverUrl = getBookCoverUrl(bookItem.volumeInfo);
      return ensureHttps(coverUrl);
    }

    return null;
  } catch (error) {
    console.error('Error finding book cover:', error);
    return null;
  }
}