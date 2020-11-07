import React, { Component } from "react";
import "css/styles.css";
import icon from "img/icon.png";
import { saveLoginCredentials } from "./ClientAuth";
import { BACKEND_SUBDIR } from "../Constants";

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: "",
			password: "",
			error: "",
		};

		this.onChangeUsername = this.onChangeUsername.bind(this);
		this.onChangePassword = this.onChangePassword.bind(this);
	}
	onChangeUsername(event) {
		this.setState({ username: event.target.value });
	}
	onChangePassword(event) {
		this.setState({ password: event.target.value });
	}
	login = (e) => {
		e.preventDefault();
		if (this.state.username.length === 0) {
			this.setState({ error: "Please enter your username" });
			return;
		}
		if (this.state.password.length === 0) {
			this.setState({ error: "Please enter your password" });
			return;
		}
		this.setState({ error: "" });
		fetch(window.location.protocol + "//" + window.location.host + BACKEND_SUBDIR + "/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				username: this.state.username,
				password: this.state.password,
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.status === "Success") {
					saveLoginCredentials(
						this.state.username,
						data.displayName,
						data.accessToken,
						data.isPetOwner,
						data.isCareTaker,
						data.isAdmin,
						data.isPartTime
					);
					window.location.href = "/";
				} else {
					this.setState({ error: data.status });
				}
			});
	};
	render() {
		return (
			<div className="container">
				<div className="d-flex flex-column min-vh-100">
					<div className="row mt-5 mb-3">
						<div className="col-12 px-0">
							<nav className="navbar navbar-dark">
								<a className="navbar-brand thick mx-auto logo" href="/">
									<img src={icon} width="35px" alt="" className="icon" />
									Pet Care
								</a>
							</nav>
						</div>
					</div>
					<div className="row">
						<div className="col-12 col-sm-9 col-md-7 col-lg-5 mx-auto">
							<div className="card">
								<h3 className="card-title">Login</h3>
								<div className="error">{this.state.error}</div>
								<form onSubmit={this.login}>
									<div className="form-group">
										<input
											className="form-control"
											type="text"
											name="username"
											placeholder="Username"
											value={this.state.username}
											onChange={this.onChangeUsername}
											autoFocus
										/>
									</div>
									<div className="form-group">
										<input
											className="form-control"
											type="password"
											name="password"
											placeholder="Password"
											value={this.state.password}
											onChange={this.onChangePassword}
										/>
									</div>
									<input className="btn btn-primary" type="submit" value="Login" />
									<a className="btn btn-secondary" href="/">
										Guest
									</a>
									<br />
									New user? <br />
									<a href="/register">Register here</a>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Login;
