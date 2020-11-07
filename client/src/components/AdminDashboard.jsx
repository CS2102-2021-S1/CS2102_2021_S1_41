import React, { Component } from "react";
import "css/styles.css";
import { getAccessToken, isLoggedIn, logOut } from "./ClientAuth";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";

class AdminDashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showAddBasePrice: false,
			base_prices: [],
			show_edit_base_price: false,
			editting_pet_type: "",
			editting_new_price: 0,
		};
	}

	componentDidMount() {
		this.getBasePrices();
	}
	getBasePrices = () => {
		if (isLoggedIn()) {
			fetch(window.location.protocol + "//" + window.location.host + "/getBasePrices", {
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
						this.setState({ base_prices: data });
					}
				});
		}
	};
	addBasePrice = (e) => {
		e.preventDefault();
		if (this.state.new_base_price_pet_type.length === 0) {
			this.setState({ new_base_price_error: "Please provide a base price pet type" });
			return;
		} else if (this.state.new_base_price_price.length === 0) {
			this.setState({ new_base_price_error: "Please provide a base price price" });
			return;
		} else {
			this.setState({ new_base_price_error: "" });
		}
		fetch(window.location.protocol + "//" + window.location.host + "/addBasePrice", {
			method: "POST",
			headers: { "Content-Type": "application/json", "Access-Token": getAccessToken() },
			body: JSON.stringify({
				base_price_pet_type: this.state.new_base_price_pet_type,
				base_price_price: this.state.new_base_price_price,
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.error === "Not Authenticated") {
					logOut();
					window.location.href = "/";
				}
				if (data.status === "success") {
					alert("BasePrice Added!");
					this.setState({
						new_base_price_pet_type: "",
						new_base_price_price: "",
						showAddBasePrice: false,
						new_base_price_error: "",
					});
					this.getBasePrices();
				} else {
					this.setState({ new_base_price_error: "Invalid input" });
				}
			});
	};
	deleteBasePrice(e, base_price) {
		e.preventDefault();
		if (!window.confirm("Delete base price? This will cascade through the whole database for this pet type!"))
			return;
		fetch(window.location.protocol + "//" + window.location.host + "/deleteBasePrice", {
			method: "POST",
			headers: { "Content-Type": "application/json", "Access-Token": getAccessToken() },
			body: JSON.stringify({
				pet_type: base_price.pet_type,
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.error === "Not Authenticated") {
					logOut();
					window.location.href = "/login";
				}
				if (data.status === "success") {
					window.location.href = "/";
				} else {
					alert("Failed to remove base_price");
				}
			});
	}
	showEditBasePrice(e, base_price) {
		e.preventDefault();
		this.setState({
			editting_pet_type: base_price.pet_type,
			editting_new_price: base_price.price,
			showEditBasePrice: true,
		});
	}
	editBasePrice = (e) => {
		e.preventDefault();
		console.log(this.state);
		fetch(window.location.protocol + "//" + window.location.host + "/editBasePrice", {
			method: "POST",
			headers: { "Content-Type": "application/json", "Access-Token": getAccessToken() },
			body: JSON.stringify({
				pet_type: this.state.editting_pet_type,
				new_price: this.state.editting_new_price,
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.error === "Not Authenticated") {
					logOut();
					window.location.href = "/login";
				}
				if (data.status === "success") {
					alert("Updated base price. All listed prices below this price has been adjusted.");
					this.setState({ showEditBasePrice: false });
					this.getBasePrices();
				} else {
					alert("Failed to edit base_price");
				}
			});
	};
	renderAddBasePrice() {
		return (
			<div className="modal" role="dialog">
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<form onSubmit={this.addBasePrice}>
							<div className="modal-header">
								<h5 className="modal-title">Add New BasePrice</h5>
								<button
									type="button"
									className="close"
									aria-label="Close"
									onClick={() => this.setState({ showAddBasePrice: false })}
								>
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
							<div className="modal-body">
								<div className="form-group">
									<input
										className="form-control"
										autoFocus
										type="text"
										placeholder="Pet Type"
										value={this.state.new_base_price_pet_type}
										onChange={(e) => this.setState({ new_base_price_pet_type: e.target.value })}
									/>
								</div>
								<div className="form-group">
									<input
										className="form-control"
										type="number"
										placeholder="Base Price"
										value={this.state.new_base_price_price}
										onChange={(e) => this.setState({ new_base_price_price: e.target.value })}
									/>
								</div>
								<div className="error">{this.state.new_base_price_error}</div>
							</div>
							<div className="modal-footer">
								<input className="btn btn-primary" type="submit" value="Add BasePrice" />
								<button
									type="button"
									className="btn btn-secondary"
									onClick={() => this.setState({ showAddBasePrice: false })}
								>
									Cancel
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		);
	}
	render() {
		return (
			<div className="admin-box">
				{this.state.showAddBasePrice ? this.renderAddBasePrice() : null}
				{this.state.showEditBasePrice ? this.renderEditBasePrice() : null}
				<h2> Admin Dashboard{"\n"}</h2>
				<div className="row">
					<div className="rounded col-6">
						<div className="dashboard-card pet-display">
							<div className="flex-fixed">
								<h5 className="d-inline-block">Current Base Price List</h5>
								<button className="add-btn" onClick={() => this.setState({ showAddBasePrice: true })}>
									<FaPlus />
								</button>
							</div>
							<div className="pet-box">
								<div className="row pet-row-header">
									<div className="col-6">
										<b>Pet Type</b>
									</div>
									<div className="col-5">
										<b>Price</b>
									</div>
									<div className="col-1" />
								</div>
								<div className="pet-box-scroll">
									{this.state.base_prices.map((base_price) => (
										<div className="row pet-row" key={base_price.pet_type}>
											<div className="col-6">{base_price.pet_type}</div>
											<div className="col-4">{base_price.price}</div>
											<div className="col-1">
												<button
													className="del-btn"
													onClick={(e) => this.showEditBasePrice(e, base_price)}
												>
													<FaEdit />
												</button>
											</div>
											<div className="col-1">
												<button
													className="del-btn"
													onClick={(e) => this.deleteBasePrice(e, base_price)}
												>
													<FaTrash />
												</button>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
					<div className="rounded col-6">
						<div className="dashboard-card pet-display">
							<div className="flex-fixed">
								<h5 className="d-inline-block">Admin Controls</h5>
							</div>
							<div className="pet-box admin-controls">
								<a href="/users">All Users</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
	renderEditBasePrice() {
		return (
			<div className="modal" role="dialog">
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<form onSubmit={this.editBasePrice}>
							<div className="modal-header">
								<h5 className="modal-title">Edit Base Price</h5>
								<button
									type="button"
									className="close"
									aria-label="Close"
									onClick={() => this.setState({ showEditBasePrice: false })}
								>
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
							<div className="modal-body">
								<div className="form-group">
									<input
										className="form-control"
										autoFocus
										type="text"
										value={this.state.editting_pet_type}
										readOnly
									/>
								</div>
								<div className="form-group">
									<input
										className="form-control"
										type="number"
										placeholder="New Base Price"
										value={this.state.editting_new_price}
										onChange={(e) => this.setState({ editting_new_price: e.target.value })}
										autoFocus
									/>
								</div>
								<div className="error">{this.state.new_base_price_error}</div>
							</div>
							<div className="modal-footer">
								<input className="btn btn-primary" type="submit" value="Update Base Price" />
								<button
									type="button"
									className="btn btn-secondary"
									onClick={() => this.setState({ showEditBasePrice: false })}
								>
									Cancel
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

export default AdminDashboard;
