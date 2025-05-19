import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { Navigate, Outlet } from "react-router-dom";
import React from "react";

export const PrivateRoutes = () => {
    const {instance} = useMsal()

    const accounts = instance.getAllAccounts()

    return (
        accounts[0]? <Outlet></Outlet> : <Navigate to='/'/>
    )
}