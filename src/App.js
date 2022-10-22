import './App.css';
import React, {Fragment} from 'react';
import WalletDashboard from './App/pages/WalletDashboard';
import { BrowserRouter as Router,  Route, Routes, Navigate, Outlet } from 'react-router-dom';
import {PrivateRoute, LogOut} from "./App/components/PrivateRoute";
import Login from "./App/pages/Login";

function App() {
  return (
    <Router>
        <Fragment>
            <Routes>
                <Route path='/admin' element={<PrivateRoute />}>
                    <Route path='/admin/dashboard' element={<WalletDashboard />} />
                </Route>
                <Route path='/login' element={<Login />} />
                <Route path='/logout' element={<LogOut />} />} />
            </Routes>
        </Fragment>
    </Router>
  );
}

export default App;
