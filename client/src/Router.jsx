import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Index from "./components/Index";
import Login from "./components/Login";
import Register from "./components/Register";
import Caretakers from "./components/Caretakers";

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
				<Route path="/">
					<Index />
				</Route>
			</Switch>
		</BrowserRouter>
	);
};

export default Router;
