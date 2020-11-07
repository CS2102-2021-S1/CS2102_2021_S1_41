import React, { Component } from "react";
import "css/styles.css";
import icon from "img/icon.png";
import { saveLoginCredentials } from "./ClientAuth";
import { BACKEND_SUBDIR } from "../Constants";

class Register extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: "",
			display_name: "",
			password: "",
			confirm: "",
			error: "",
		};

		this.onChangeUsername = this.onChangeUsername.bind(this);
		this.onChangeDisplayName = this.onChangeDisplayName.bind(this);
		this.onChangePassword = this.onChangePassword.bind(this);
		this.onChangeConfirm = this.onChangeConfirm.bind(this);
	}
	onChangeUsername(event) {
		this.setState({ username: event.target.value });
	}
	onChangeDisplayName(event) {
		this.setState({ display_name: event.target.value });
	}
	onChangePassword(event) {
		this.setState({ password: event.target.value });
	}
	onChangeConfirm(event) {
		this.setState({ confirm: event.target.value });
	}
	register = (e) => {
		e.preventDefault();
		if (this.state.username.length === 0) {
			this.setState({ error: "Please provide a username" });
			return;
		} else if (this.state.display_name.length === 0) {
			this.setState({ error: "Please provide a display name" });
			return;
		} else if (this.state.password.length === 0) {
			this.setState({ error: "Please provide a password" });
			return;
		} else if (this.state.password !== this.state.confirm) {
			this.setState({ error: "Passwords do not match!" });
			return;
		} else {
			this.setState({ error: "" });
		}
		fetch(window.location.protocol + "//" + window.location.host + BACKEND_SUBDIR + "/register", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				username: this.state.username,
				display_name: this.state.display_name,
				password: this.state.password,
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.status === "registered") {
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
								saveLoginCredentials(this.state.username, data.displayName, data.accessToken);
								window.location.href = "/";
							} else {
								this.setState({ error: data.status });
							}
						});
				} else {
					this.setState({ error: "Failed to register." });
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
								<h3 className="card-title">Register</h3>
								<div className="error">{this.state.error}</div>
								<form onSubmit={this.register}>
									<div className="form-group">
										<input
											className="form-control"
											autoFocus
											type="text"
											placeholder="Username"
											value={this.state.username}
											onChange={this.onChangeUsername}
										/>
									</div>
									<div className="form-group">
										<input
											className="form-control"
											type="text"
											name="display_name"
											placeholder="Display Name"
											value={this.state.display_name}
											onChange={this.onChangeDisplayName}
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
									<div className="form-group">
										<input
											className="form-control"
											type="password"
											name="confirmation"
											placeholder="Confirm Password"
											value={this.state.confirm}
											onChange={this.onChangeConfirm}
										/>
									</div>
									<input className="btn btn-primary" type="submit" value="Register" />
									<a className="btn btn-secondary" href="/">
										Guest
									</a>
									<br />
								</form>
								Already have an account? <a href="/login">Login here.</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Register;
