import React, { Component } from "react";
import "css/styles.css";
import Navbar from "./Navbar";
import { getAccessToken, isLoggedIn, logOut, isAdmin } from "./ClientAuth";
import Table from "react-bootstrap/Table";
import { BACKEND_SUBDIR } from "../Constants";

class Users extends Component {
	constructor(props) {
		super(props);
		this.state = {
			users: [],
		};
	}
	getUsers() {
		if (isLoggedIn()) {
			if (!isAdmin()) {
				window.location.href = "/";
				return;
			}
			fetch(window.location.protocol + "//" + window.location.host + BACKEND_SUBDIR + "/getUsers", {
				method: "GET",
				headers: { "Content-Type": "application/json", "Access-Token": getAccessToken() },
			})
				.then((response) => response.json())
				.then((data) => {
					if (data.error === "Not Authenticated") {
						logOut();
						window.location.href = "/";
					}
					if (Array.isArray(data)) {
						console.log(data);
						this.setState({ users: data });
					}
				});
		}
	}
	componentDidMount() {
		this.getUsers();
	}
	toggleType = (e, user, type) => {
		if (!window.confirm("Are you sure?")) {
			e.target.checked = !e.target.checked;
			return;
		}
		if (isLoggedIn()) {
			if (!isAdmin()) {
				window.location.href = "/";
				return;
			}
			fetch(window.location.protocol + "//" + window.location.host + BACKEND_SUBDIR + "/toggleAccType", {
				method: "POST",
				headers: { "Content-Type": "application/json", "Access-Token": getAccessToken() },
				body: JSON.stringify({
					username: user.username,
					type: type,
					insert: e.target.checked,
				}),
			})
				.then((response) => response.json())
				.then((data) => {
					if (data.status === "not admin") {
						window.location.href = "/";
					} else {
						this.getUsers();
					}
				});
		}
	};
	renderAccountTypes(user) {
		return (
			<div>
				<input
					type="checkbox"
					name="isOwner"
					defaultChecked={user.is_owner}
					onClick={(e) => this.toggleType(e, user, "owner")}
				/>
				<label htmlFor="isOwner">&nbsp;Pet Owner</label>
				<br />
				<input
					type="checkbox"
					name="isCareTaker"
					defaultChecked={user.is_care_taker}
					onClick={(e) => this.toggleType(e, user, "care_taker")}
				/>
				<label htmlFor="isCareTaker">&nbsp;Care Taker</label>
				<br />
				<input
					type="checkbox"
					name="isAdmin"
					defaultChecked={user.is_admin}
					onClick={(e) => this.toggleType(e, user, "admin")}
				/>
				<label htmlFor="isAdmin">&nbsp;Admin</label>
			</div>
		);
	}
	render() {
		return (
			<div className="container">
				<div className="d-flex flex-column min-vh-100">
					<div className="row">
						<div className="col-12 px-0">
							<Navbar />
						</div>
					</div>
					<div className="row page">
						<div className="col-12">
							<div className="row wrapper flex-column flex-sm-row nav-size">
								<main className="col-12 bg-faded p-4 rounded">
									<h3>All Users</h3>
									<Table striped bordered>
										<thead>
											<tr>
												<td>Username</td>
												<td>Display Name</td>
												<td>Account Type</td>
											</tr>
										</thead>
										<tbody>
											{this.state.users.map((user) => (
												<tr>
													<td>{user.username}</td>
													<td>{user.display_name}</td>
													<td>{this.renderAccountTypes(user)}</td>
												</tr>
											))}
										</tbody>
									</Table>
								</main>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Users;
