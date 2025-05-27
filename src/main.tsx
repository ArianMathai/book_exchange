import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {routes} from "@/routes/routes.tsx";


Amplify.configure(outputs);

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Authenticator>
            <RouterProvider router={router} />
        </Authenticator>
    </React.StrictMode>
);
