import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Index from "./components/Index";
import Login from "./components/Login";
import Register from "./components/Register";
import Caretakers from "./components/Caretakers";
import Users from "./components/Users";
import Bidding from "./components/Bidding";

const Router = () => {
	return (
		<BrowserRouter>
			<Switch>
				<Route path="/login">
					<Login />
				</Route>
				<Route path="/register">
					<Register />
				</Route>
				<Route path="/caretakers">
					<Caretakers />
				</Route>
				<Route path="/users">
					<Users />
				</Route>
				<Route path="/bidding">
					<Bidding />
				</Route>
				<Route path="/">
					<Index />
				</Route>
			</Switch>
		</BrowserRouter>
	);
};

export default Router;
