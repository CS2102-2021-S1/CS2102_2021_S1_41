import React, { Component } from "react";
import "css/styles.css";
import icon from "img/icon.png";
import { isLoggedIn, getDisplayName, logOut } from "./ClientAuth";
import { FaSearch } from "react-icons/fa";

class Navbar extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	renderLogin() {
		return (
			<ul className="navbar-nav ml-auto">
				<li className="nav-item">
					<a className="nav-link" href="/login">
						Log In
					</a>
				</li>
				<li className="nav-item">
					<a className="nav-link" href="/register">
						Register
					</a>
				</li>
			</ul>
		);
	}
	renderUser() {
		return (
			<ul className="navbar-nav ml-auto">
				<li className="nav-item">
					<a className="nav-link" href="">
						<b>{getDisplayName()}</b>
					</a>
				</li>
				<li className="nav-item">
					<a className="nav-link" onClick={this.clickLogout}>
						Log Out
					</a>
				</li>
			</ul>
		);
	}
	renderSearch() {
		return (
			<li className="nav-item">
				<a className="nav-link" href="/bidding">
					<FaSearch /> Search for Caretaker
				</a>
			</li>
		);
	}
	clickLogout() {
		logOut();
		window.location.href = "/";
	}
	render() {
		return (
			<nav className="navbar navbar-expand-sm navbar-dark bg-dark mx-0">
				<a className="navbar-brand thick" href="/">
					<img src={icon} width="25px" alt="" /> PetCare
				</a>
				<ul className="navbar-nav">
					{isLoggedIn() ? this.renderSearch() : null}
					<li className="nav-item">
						<a className="nav-link" href="/caretakers">
							Services and Pricing
						</a>
					</li>
				</ul>
				{isLoggedIn() ? this.renderUser() : this.renderLogin()}
			</nav>
		);
	}
}

export default Navbar;
