import { RouteObject } from 'react-router-dom';

import ProtectedLayout from '../components/ProtectedLayout.tsx';
import LandingPage from "@/pages/LandingPage.tsx";
import Profile from "@/pages/Profile.tsx";
import Home from "@/pages/Home.tsx";
import LibraryPage from "@/pages/LibraryPage.tsx";
import AddBookForm from "@/pages/AddBookForm.tsx";
import SetupLocationPage from "@/pages/setup/SetupLocationPage.tsx";
import BookDetailsPage from "@/pages/BookDetailsPage.tsx";
import Inbox from "@/pages/Inbox.tsx";
import LoanRequestDetail from "@/pages/LoanRequestDetail.tsx";
import LoanHandoffPage from "@/pages/LoanHandoffPage.tsx";

export const routes: RouteObject[] = [
    // Public routes
    { path: '/', element: <LandingPage /> },

    // Protected routes
    {
        path: '/app',
        element: <ProtectedLayout />,
        children: [
            { path: 'home', element: <Home /> },
            { path: 'profile', element: <Profile /> },
            { path: 'library', element: <LibraryPage /> },
            { path: 'add-book', element: <AddBookForm /> },
            { path: 'book/:id', element: <BookDetailsPage /> },
            { path: 'setup', element: <SetupLocationPage /> },
            { path: 'inbox', element: <Inbox /> },
            { path: 'loan-request/:id', element: <LoanRequestDetail /> },
            { path: 'handoff/:id', element: <LoanHandoffPage /> },
        ],
    },
];