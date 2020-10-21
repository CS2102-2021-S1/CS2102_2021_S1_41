import React, { Component } from "react";
import "css/styles.css";
import icon from "img/icon.png";

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			example_state: "-",
		};
	}
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
								<form action="/login" method="post">
									<div className="form-group">
										<input
											autoFocus
											className="form-control"
											type="text"
											name="username"
											placeholder="Username"
										/>
									</div>
									<div className="form-group">
										<input
											className="form-control"
											type="password"
											name="password"
											placeholder="Password"
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
