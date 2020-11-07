import React, { Component } from "react";
import "css/styles.css";
import { FaPlus, FaTrash } from "react-icons/fa";
import { getAccessToken, isLoggedIn, logOut } from "./ClientAuth";

class FulltimeCaretakerDashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			pricelist: [],
			new_price_pet_type: "",
			new_price_error: "",
			showAddPrice: false,
			showEditPrice: false,
			editting_pet_type: "",
			editting_new_price: "",
			editting_error: "",
		};
	}
	addNewPrice = (e) => {
		e.preventDefault();
		if (this.state.new_price_pet_type.length === 0) {
			this.setState({ new_price_error: "Please provide a pet type" });
			return;
		} else {
			this.setState({ new_price_error: "" });
		}
		fetch(window.location.protocol + "//" + window.location.host + "/addNewPrice", {
			method: "POST",
			headers: { "Content-Type": "application/json", "Access-Token": getAccessToken() },
			body: JSON.stringify({
				pet_type: this.state.new_price_pet_type,
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.error === "Not Authenticated") {
					logOut();
					window.location.href = "/";
				} else if (data.error) {
					this.setState({
						new_price_error: data.error,
					});
				} else if (data.status === "success") {
					alert("New Price Added!");
					this.setState({
						new_price_pet_type: "",
						showAddPrice: false,
						new_price_error: "",
					});
					this.getFullTimePriceList();
				} else {
					this.setState({ new_price_error: "Invalid input" });
				}
			});
	};
	renderAddPrice() {
		return (
			<div className="modal" role="dialog">
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<form onSubmit={this.addNewPrice}>
							<div className="modal-header">
								<h5 className="modal-title">Add New Price</h5>
								<button
									type="button"
									className="close"
									aria-label="Close"
									onClick={() => this.setState({ showAddPrice: false })}
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
										value={this.state.new_price_pet_type}
										onChange={(e) => this.setState({ new_price_pet_type: e.target.value })}
									/>
								</div>
								<div className="error">{this.state.new_price_error}</div>
							</div>
							<div className="modal-footer">
								<input className="btn btn-primary" type="submit" value="Add New Price" />
								<button
									type="button"
									className="btn btn-secondary"
									onClick={() => this.setState({ showAddPrice: false })}
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
	componentDidMount() {
		this.getFullTimePriceList();
	}
	getFullTimePriceList() {
		if (isLoggedIn()) {
			fetch(window.location.protocol + "//" + window.location.host + "/getPriceList", {
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
						this.setState({ pricelist: data });
					}
				});
		}
	}
	deletePrice(e, price) {
		e.preventDefault();
		if (!window.confirm("Delete price?")) return;
		fetch(window.location.protocol + "//" + window.location.host + "/deletePrice", {
			method: "POST",
			headers: { "Content-Type": "application/json", "Access-Token": getAccessToken() },
			body: JSON.stringify({
				pet_type: price.pet_type,
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
					alert("Failed to remove price");
				}
			});
	}
	render() {
		return (
			<div className="mt-4">
				{this.state.showAddPrice ? this.renderAddPrice() : null}
				<h2>Full-time Caretaker Dashboard</h2>
				<div className="row">
					<div className="rounded col-6">
						<div className="dashboard-card pet-display">
							<div className="flex-fixed">
								<h5 className="d-inline-block">Your Price List</h5>
								<button className="add-btn" onClick={() => this.setState({ showAddPrice: true })}>
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
									{this.state.pricelist.map((price) => (
										<div className="row pet-row" key={price.pet_type}>
											<div className="col-6">{price.pet_type}</div>
											<div className="col-4">{price.price}</div>
											<div className="col-2">
												<button className="del-btn" onClick={(e) => this.deletePrice(e, price)}>
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
						<div className="dashboard-card">
							<h5>Your Leaves</h5>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default FulltimeCaretakerDashboard;
