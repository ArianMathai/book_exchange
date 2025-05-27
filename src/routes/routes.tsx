import { RouteObject } from 'react-router-dom';



import BurgerMenu from '../components/BurgerMenu.tsx';
import Profile from "@/pages/Profile.tsx";
//import BookList from "@/pages/BookList.tsx";
import Home from "@/pages/Home.tsx"; // BurgerMenu component with Outlet

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <BurgerMenu/>,
        children: [
            { path: '/', element: <Home /> },
            { path: '/profile', element: <Profile /> },
        ],
    },
];