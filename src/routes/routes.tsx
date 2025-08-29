import { RouteObject } from 'react-router-dom';

import BurgerMenu from '../components/BurgerMenu.tsx';
import Profile from "@/pages/Profile.tsx";
import Home from "@/pages/Home.tsx";
import LibraryPage from "@/pages/LibraryPage.tsx";
import AddBookForm from "@/pages/AddBookForm.tsx";
import SetupLocationPage from "@/pages/setup/SetupLocationPage.tsx";
import BookDetailsPage from "@/pages/BookDetailsPage.tsx";
import Inbox from "@/pages/Inbox.tsx";

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <BurgerMenu/>,
        children: [
            { path: '/', element: <Home /> },
            { path: '/profile', element: <Profile /> },
            { path: '/library', element: <LibraryPage /> },
            { path: '/add-book', element: <AddBookForm /> },
            { path: '/book/:id', element: <BookDetailsPage /> },
            { path: '/setup', element: <SetupLocationPage /> },
            { path: '/inbox', element: <Inbox /> },
        ],
    },
];