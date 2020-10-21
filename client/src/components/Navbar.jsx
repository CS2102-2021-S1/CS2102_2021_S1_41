import React, { Component } from "react";
import "css/styles.css";
import icon from "img/icon.png";

class Navbar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			example_state: "-",
		};
	}
	render() {
		return (
			<nav className="navbar navbar-expand-sm navbar-dark bg-dark mx-0">
				<a className="navbar-brand thick" href="/">
					<img src={icon} width="25px" alt="" /> PetCare
				</a>
				<ul className="navbar-nav">
					<li className="nav-item">
						<a className="nav-link" href="/">
							Services
						</a>
					</li>
				</ul>
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
			</nav>
		);
	}
}

export default Navbar;
