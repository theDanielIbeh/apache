import React from "react";
import { Route, Routes } from "react-router-dom";
//import Settings from '../containers/Settings';
import { TO_DASHBOARD, TO_LOGIN, TO_SIGNUP } from "../helpers/constants";
import SignUp from "../components/signUp";
import LogIn from "../components/logIn";
import Dashboard from "../components/Dashboard";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path={TO_DASHBOARD} element={<Dashboard />} />
      <Route path={TO_LOGIN} element={<LogIn />} />
      <Route path={TO_SIGNUP} element={<SignUp />} />
    </Routes>
  );
};

export default AllRoutes;
