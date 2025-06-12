import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {routes} from "@/routes/routes.tsx";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

Amplify.configure(outputs);

const router = createBrowserRouter(routes);

// create a client with whatever defaults you like
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // e.g. retry twice on failure
            retry: 2,
            // don't refetch on window focus
            refetchOnWindowFocus: false,
        },
    },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Authenticator>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
            </QueryClientProvider>
        </Authenticator>
    </React.StrictMode>
);