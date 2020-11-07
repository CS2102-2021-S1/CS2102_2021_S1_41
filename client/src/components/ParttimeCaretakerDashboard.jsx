import React, { Component } from "react";
import "css/styles.css";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { getAccessToken, isLoggedIn, logOut } from "./ClientAuth";
import { FaCheck, FaTimes } from "react-icons/fa";
import { BACKEND_SUBDIR } from "../Constants";

class ParttimeCaretakerDashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			pricelist: [],
			new_price_pet_type: "",
			new_price_price: "",
			new_price_error: "",
			showAddPrice: false,
			showEditPrice: false,
			editting_pet_type: "",
			editting_new_price: "",
			editting_error: "",
			bids: [],
			salary: "-",
			availabilities: [],
			showAddAvailability: false,
			availability_start_date: "",
			availability_end_date: "",
			availability_error: "",
		};
	}
	addNewPrice = (e) => {
		e.preventDefault();
		if (this.state.new_price_pet_type.length === 0) {
			this.setState({ new_price_error: "Please provide a pet type" });
			return;
		} else if (this.state.new_price_price.length === 0) {
			this.setState({ new_price_error: "Please provide a price" });
			return;
		} else {
			this.setState({ new_price_error: "" });
		}
		fetch(window.location.protocol + "//" + window.location.host + BACKEND_SUBDIR + "/addNewPrice", {
			method: "POST",
			headers: { "Content-Type": "application/json", "Access-Token": getAccessToken() },
			body: JSON.stringify({
				pet_type: this.state.new_price_pet_type,
				new_price: this.state.new_price_price,
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
						new_price_price: "",
						showAddPrice: false,
						new_price_error: "",
					});
					this.getPartTimePriceList();
				} else {
					this.setState({ new_price_error: "Invalid input" });
				}
			});
	};
	addAvailability = (e) => {
		e.preventDefault();
		if (this.state.availability_start_date.length === 0 || this.state.availability_end_date.length === 0) {
			this.setState({ leave_error: "Provide both dates" });
			return;
		} else {
			this.setState({ leave_error: "" });
		}
		fetch(window.location.protocol + "//" + window.location.host + BACKEND_SUBDIR + "/addAvailability", {
			method: "POST",
			headers: { "Content-Type": "application/json", "Access-Token": getAccessToken() },
			body: JSON.stringify({
				start_date: this.state.availability_start_date,
				end_date: this.state.availability_end_date,
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.error === "Not Authenticated") {
					logOut();
					window.location.href = "/";
				} else if (data.error) {
					this.setState({
						availability_error: data.error,
					});
				} else if (data.status === "success") {
					alert("Added new availability");
					this.setState({
						availability_start_date: "",
						availability_end_date: "",
						availability_error: "",
						showAddAvailability: false,
					});
					this.getAvailabilities();
				} else {
					this.setState({ availability_error: "Invalid input" });
				}
			});
	};
	formatDate(date) {
		let d = new Date(date),
			month = "" + (d.getMonth() + 1),
			day = "" + d.getDate(),
			year = d.getFullYear();

		if (month.length < 2) month = "0" + month;
		if (day.length < 2) day = "0" + day;

		return [day, month, year].join("-");
	}
	formatYear(date) {
		let d = new Date(date),
			month = "" + (d.getMonth() + 1),
			day = "" + d.getDate(),
			year = d.getFullYear();

		if (month.length < 2) month = "0" + month;
		if (day.length < 2) day = "0" + day;

		return [year, month, day].join("-");
	}
	getMonthSalary() {
		if (isLoggedIn()) {
			fetch(window.location.protocol + "//" + window.location.host + BACKEND_SUBDIR + "/getMonthSalary", {
				method: "GET",
				headers: { "Content-Type": "application/json", "Access-Token": getAccessToken() },
			})
				.then((response) => response.json())
				.then((data) => {
					if (data.error === "Not Authenticated") {
						logOut();
						window.location.href = "/";
					}
					this.setState({ salary: data.salary });
				});
		}
	}
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
								<div className="form-group">
									<input
										className="form-control"
										type="number"
										placeholder="New Price"
										value={this.state.new_price_price}
										onChange={(e) => this.setState({ new_price_price: e.target.value })}
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
	renderAddAvailability() {
		return (
			<div className="modal" role="dialog">
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<form onSubmit={this.addAvailability}>
							<div className="modal-header">
								<h5 className="modal-title">Add Availability</h5>
								<button
									type="button"
									className="close"
									aria-label="Close"
									onClick={() => this.setState({ showAddAvailability: false })}
								>
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
							<div className="modal-body">
								<div className="form-group">
									<h5>Start Date</h5>
									<input
										className="form-control"
										autoFocus
										type="date"
										placeholder=""
										value={this.state.availability_start_date}
										onChange={(e) => this.setState({ availability_start_date: e.target.value })}
									/>
								</div>
								<div className="form-group">
									<h5>End Date</h5>
									<input
										className="form-control"
										type="date"
										placeholder=""
										value={this.state.availability_end_date}
										onChange={(e) => this.setState({ availability_end_date: e.target.value })}
									/>
								</div>
								<div className="error">{this.state.availability_error}</div>
							</div>
							<div className="modal-footer">
								<input className="btn btn-primary" type="submit" value="Submit" />
								<button
									type="button"
									className="btn btn-secondary"
									onClick={() => this.setState({ showAddAvailability: false })}
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
		this.getPartTimePriceList();
		this.getCaretakerBids();
		this.getMonthSalary();
		this.getAvailabilities();
	}
	getPartTimePriceList() {
		if (isLoggedIn()) {
			fetch(window.location.protocol + "//" + window.location.host + BACKEND_SUBDIR + "/getPriceList", {
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
	getCaretakerBids = () => {
		this.setState({ bids: [] });
		if (isLoggedIn()) {
			fetch(window.location.protocol + "//" + window.location.host + BACKEND_SUBDIR + "/getCaretakerBids", {
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
						this.setState({ bids: data });
					}
				});
		}
	};
	getAvailabilities() {
		this.setState({ availabilities: [] });
		if (isLoggedIn()) {
			fetch(window.location.protocol + "//" + window.location.host + BACKEND_SUBDIR + "/getAvailabilities", {
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
						this.setState({ availabilities: data });
					}
				});
		}
	}
	showEditPrice(e, price) {
		e.preventDefault();
		this.setState({
			editting_pet_type: price.pet_type,
			editting_new_price: price.price,
			showEditPrice: true,
		});
	}
	editPrice = (e) => {
		e.preventDefault();
		fetch(window.location.protocol + "//" + window.location.host + BACKEND_SUBDIR + "/editPrice", {
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
				} else if (data.error) {
					this.setState({ editting_error: data.error });
				} else if (data.status === "success") {
					alert("Updated price.");
					this.setState({ showEditPrice: false });
					this.getPartTimePriceList();
				} else {
					alert("Failed to edit price");
				}
			});
	};
	deletePrice(e, price) {
		e.preventDefault();
		if (!window.confirm("Delete price?")) return;
		fetch(window.location.protocol + "//" + window.location.host + BACKEND_SUBDIR + "/deletePrice", {
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
	deleteAvailability(e, availability) {
		e.preventDefault();
		if (!window.confirm("Delete availability?")) return;
		fetch(window.location.protocol + "//" + window.location.host + BACKEND_SUBDIR + "/deleteAvailability", {
			method: "POST",
			headers: { "Content-Type": "application/json", "Access-Token": getAccessToken() },
			body: JSON.stringify({
				start_date: this.formatYear(availability.start_date),
				end_date: this.formatYear(availability.end_date),
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
					alert("Failed to remove availability");
				}
			});
	}
	confirmBid = (bid) => {
		fetch(window.location.protocol + "//" + window.location.host + BACKEND_SUBDIR + "/confirmBid", {
			method: "POST",
			headers: { "Content-Type": "application/json", "Access-Token": getAccessToken() },
			body: JSON.stringify({
				pet_owner: bid.pet_owner,
				pet_name: bid.pet_name,
				start_date: this.formatYear(bid.start_date),
				end_date: this.formatYear(bid.end_date),
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.error === "Not Authenticated") {
					logOut();
					window.location.href = "/";
				}
				if (data.status === "success") {
					alert("Confirmed!");
					this.getCaretakerBids();
				} else {
					alert("Unable to confirm");
				}
			});
	};
	renderEditPrice() {
		return (
			<div className="modal" role="dialog">
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<form onSubmit={this.editPrice}>
							<div className="modal-header">
								<h5 className="modal-title">Edit Price</h5>
								<button
									type="button"
									className="close"
									aria-label="Close"
									onClick={() => this.setState({ showEditPrice: false })}
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
										placeholder="New Price"
										value={this.state.editting_new_price}
										onChange={(e) => this.setState({ editting_new_price: e.target.value })}
										autoFocus
									/>
								</div>
								<div className="error">{this.state.editting_error}</div>
							</div>
							<div className="modal-footer">
								<input className="btn btn-primary" type="submit" value="Update Price" />
								<button
									type="button"
									className="btn btn-secondary"
									onClick={() => this.setState({ showEditPrice: false })}
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
			<div className="mt-4">
				{this.state.showAddPrice ? this.renderAddPrice() : null}
				{this.state.showEditPrice ? this.renderEditPrice() : null}
				{this.state.showAddAvailability ? this.renderAddAvailability() : null}
				<h2>Part-time Caretaker Dashboard</h2>
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
											<div className="col-1">
												<button
													className="del-btn"
													onClick={(e) => this.showEditPrice(e, price)}
												>
													<FaEdit />
												</button>
											</div>
											<div className="col-1">
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
						<div className="dashboard-card pet-display">
							<div className="flex-fixed">
								<h5>
									<b>Your Salary (this month): ${this.state.salary}</b>
								</h5>
							</div>
							<div className="flex-fixed">
								<h5 className="d-inline-block">Your Availabilities</h5>
								<button
									className="add-btn"
									onClick={() => this.setState({ showAddAvailability: true })}
								>
									<FaPlus />
								</button>
							</div>
							<div className="pet-box">
								<div className="row pet-row-header">
									<div className="col-6">
										<b>Start Date</b>
									</div>
									<div className="col-5">
										<b>End Date</b>
									</div>
									<div className="col-1" />
								</div>
								<div className="pet-box-scroll">
									{this.state.availabilities.map((availability) => (
										<div
											className="row pet-row"
											key={availability.start_date + availability.end_date}
										>
											<div className="col-6">{this.formatDate(availability.start_date)}</div>
											<div className="col-4">{this.formatDate(availability.end_date)}</div>
											<div className="col-2">
												<button
													className="del-btn"
													onClick={(e) => this.deleteAvailability(e, availability)}
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
				</div>
				<div className="row mt-3">
					<div className="rounded col-12">
						<div className="dashboard-card pet-display">
							<div className="flex-fixed">
								<h5 className="d-inline-block">Bids placed for you</h5>
							</div>
							<div className="pet-box">
								<div className="row pet-row-header">
									<div className="col-2">
										<b>Owner</b>
									</div>
									<div className="col-2">
										<b>Pet Name</b>
									</div>
									<div className="col-2">
										<b>Start</b>
									</div>
									<div className="col-2">
										<b>End</b>
									</div>
									<div className="col-1">
										<b>Price</b>
									</div>
									<div className="col-1">
										<b>Payment</b>
									</div>
									<div className="col-1">
										<b>Confirmed</b>
									</div>
									<div className="col-1" />
								</div>
								<div className="pet-box-scroll">
									{this.state.bids.map((bid) => (
										<div
											className="row pet-row"
											key={bid.pet_name + bid.pet_owner + bid.start_date + bid.end_date}
										>
											<div className="col-2">{bid.pet_owner}</div>
											<div className="col-2">{bid.pet_name}</div>
											<div className="col-2">{this.formatDate(bid.start_date)}</div>
											<div className="col-2">{this.formatDate(bid.end_date)}</div>
											<div className="col-1">{bid.daily_price}</div>
											<div className="col-1">{bid.paid ? <FaCheck /> : <FaTimes />}</div>
											<div className="col-1">
												<button
													onClick={() => this.confirmBid(bid)}
													className={bid.selected ? "btn btn-secondary" : "btn btn-primary"}
													disabled={bid.selected}
												>
													{bid.selected ? "Confirmed" : "Confirm"}
												</button>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default ParttimeCaretakerDashboard;
