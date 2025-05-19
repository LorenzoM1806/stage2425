import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/homePage.jsx";
import StartPage from "../pages/startPage.jsx";
import GamePage from "../pages/gamePage.jsx";
import InputThrowX01 from "../pages/inputThrowX01.jsx";
import LoginPage from "../authentication/loginPage.jsx";
import ProfilePage from "../authentication/profilePage.jsx";
import CutThroatPage from "../pages/cutThroatPage.jsx";
import AroundWorldPage from "../pages/aroundWorldPage.jsx";
import TornooiPage from "../pages/tornooi/tornooiPage.jsx";
import TornooiOverviewPage from "../pages/tornooi/tornooiOverviewPage.jsx";
import TornooiGamePage from "../pages/tornooi/tornooiGamePage.jsx";
import { PrivateRoutes } from "./PrivateRoutes.jsx";
import StatisticsProfile from "../pages/statistics/statisticsProfile.jsx";
import StatisticsHome from "../pages/statistics/statisticsHome.jsx";
import StatisticsTournament from "../pages/statistics/statisticsTournament.jsx";
import AdminPage from "../pages/adminPage.jsx";

function Routing() {
  return (
    <Routes>
      <Route path={"/"} element={<LoginPage />}></Route>
      <Route path={"/login"} element={<LoginPage></LoginPage>}></Route>
      <Route element={<PrivateRoutes/>}>
        <Route path={"/home"} element={<HomePage />}></Route>
        <Route path={"/start"} element={<StartPage />}></Route>
        <Route path={"/game"} element={<GamePage />}></Route>
        <Route path={"/cutThroat"} element={<CutThroatPage />}></Route>
        <Route path={"/aroundWorld"} element={<AroundWorldPage />}></Route>
        <Route path={"/input"} element={<InputThrowX01 />}></Route>
        <Route path={"/profile"} element={<ProfilePage />}></Route>
        <Route path={"/tornooi"} element={<TornooiPage />}></Route>
        <Route
          path={"/tornooiOverview"}
          element={<TornooiOverviewPage />}
        ></Route>
        <Route path={"/tornooiGamePage"} element={<TornooiGamePage />}></Route>
        <Route path={"/statProfile"} element={<StatisticsProfile/>}/>
        <Route path={"/statHome"} element={<StatisticsHome/>}/>
        <Route path={"/statTornooi"} element={<StatisticsTournament/>}/>
        <Route path={"/admin"} element={<AdminPage/>}/>
      </Route>
    </Routes>
  );
}

export default Routing;
