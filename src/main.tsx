import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {routes} from "@/routes/routes.tsx";
import { loadGoogleMapsScript } from "@/services/googleMapsApi";


loadGoogleMapsScript(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);



Amplify.configure(outputs);

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Authenticator>
            <RouterProvider router={router} />
        </Authenticator>
    </React.StrictMode>
);
