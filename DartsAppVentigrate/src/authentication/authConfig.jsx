import { PublicClientApplication } from "@azure/msal-browser";

const baseUrl = import.meta.env.VITE_BASE_URL

const msalConfig = {
    auth: {
        clientId: "ec3b0c30-0bfc-4f76-a078-b3ec466008f4",
        authority: "https://login.microsoftonline.com/fc699687-50ce-4e72-b09d-0f2d9c7b725c",
        redirectUri: baseUrl + "/home",
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: true,
    },
};

export const msalInstance = new PublicClientApplication(msalConfig);
