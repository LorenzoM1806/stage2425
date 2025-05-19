import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/charts/styles.css'
import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import {StrictMode, useEffect} from "react";
import Routing from "./navigation/Routing.jsx";
import {GameProvider} from "./context/gameContext.jsx";
import {msalInstance} from "./authentication/authConfig.jsx";
import {MsalProvider} from "@azure/msal-react";
import {AnalyticProvider} from "./context/analyticContext.jsx";
import {MantineProvider} from "@mantine/core";
import {TornooiProvider} from "./pages/tornooi/tornooiContext.jsx";
import { DatabaseProvider } from './context/databaseContext.jsx';

createRoot(document.getElementById('root')).render(
        <StrictMode>
                <BrowserRouter>
                    <DatabaseProvider>
                        <TornooiProvider>
                            <GameProvider>
                                <AnalyticProvider>
                                    <MantineProvider>
                                        <MsalProvider instance={msalInstance}>
                                            <Routing/>
                                        </MsalProvider>
                                    </MantineProvider>
                                </AnalyticProvider>
                            </GameProvider>
                        </TornooiProvider>
                    </DatabaseProvider>
                </BrowserRouter>
        </StrictMode>

)
