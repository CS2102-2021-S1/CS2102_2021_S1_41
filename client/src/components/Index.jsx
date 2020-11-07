import React, { Component } from "react";
import "css/styles.css";
import Navbar from "./Navbar";
import { getAccessToken, getDisplayName, isLoggedIn, logOut, isAdmin, isPartTime, isCareTaker } from "./ClientAuth";
import AdminDashboard from "./AdminDashboard";
import ParttimeCaretakerDashboard from "./ParttimeCaretakerDashboard";
import FulltimeCaretakerDashboard from "./FulltimeCaretakerDashboard";
import dog from "img/dog.jpg";
import cat from "img/cat.jpg";
import hamster from "img/hamster.jpg";
import { FaPlus, FaTrash, FaCheck, FaTimes } from "react-icons/fa";

class Index extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showAddPet: false,
			pets: [],
			new_pet_name: "",
			new_pet_type: "",
			new_pet_special_req: "",
			new_pet_error: "",
			bids: [],
			showRating: false,
			reviewing_bid: {
				pet_name: "",
				care_taker: "",
				start_date: "",
				end_date: "",
			},
			rating: 5,
			review: "",
		};
	}

	componentDidMount() {
		this.getOwnerPets();
		this.getOwnerBids();
	}
	getOwnerPets = () => {
		if (isLoggedIn()) {
			fetch(window.location.protocol + "//" + window.location.host + "/getOwnerPets", {
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
						this.setState({ pets: data });
					}
				});
		}
	};
	getOwnerBids = () => {
		this.setState({ bids: [] });
		if (isLoggedIn()) {
			fetch(window.location.protocol + "//" + window.location.host + "/getOwnerBids", {
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
	renderIndex() {
		return (
			<div>
				<h2>Welcome to PetCare</h2>
				<p>PetCare provides reputable, well trained care takers for your pets, to give you a peace of mind</p>
				<img src={dog} width="33%" alt="" />
				<img src={cat} width="33%" alt="" />
				<img src={hamster} width="33%" alt="" />
				<br />
				<br />
				<h3>What we provide</h3>
				<p>
					PetCare connects <i>you</i>, with care takers for your pets, when and where you need them
				</p>
				<p>
					To view currently available care takers and rates, visit <a href="/caretakers">services</a>
				</p>
				<p>
					Please <a href="/login">log in</a> or <a href="/register">register</a> an account to make bookings
				</p>
			</div>
		);
	}
	addPet = (e) => {
		e.preventDefault();
		if (this.state.new_pet_name.length === 0) {
			this.setState({ new_pet_error: "Please provide a pet name" });
			return;
		} else if (this.state.new_pet_type.length === 0) {
			this.setState({ new_pet_error: "Please provide a pet type" });
			return;
		} else {
			this.setState({ new_pet_error: "" });
		}
		fetch(window.location.protocol + "//" + window.location.host + "/addPet", {
			method: "POST",
			headers: { "Content-Type": "application/json", "Access-Token": getAccessToken() },
			body: JSON.stringify({
				pet_name: this.state.new_pet_name,
				pet_type: this.state.new_pet_type,
				special_req: this.state.new_pet_special_req,
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.error === "Not Authenticated") {
					logOut();
					window.location.href = "/";
				}
				if (data.status === "success") {
					alert("Pet Added!");
					this.setState({
						new_pet_name: "",
						new_pet_type: "",
						new_pet_special_req: "",
						showAddPet: false,
						new_pet_error: "",
					});
					this.getOwnerPets();
				} else {
					this.setState({ new_pet_error: "Invalid pet type" });
				}
			});
	};
	payBid = (bid) => {
		fetch(window.location.protocol + "//" + window.location.host + "/payBid", {
			method: "POST",
			headers: { "Content-Type": "application/json", "Access-Token": getAccessToken() },
			body: JSON.stringify({
				care_taker: bid.care_taker,
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
					alert("Paid succesfully");
					this.getOwnerBids();
				} else if (data.error) {
					alert(data.error);
				} else {
					alert("Unable to pay");
				}
			});
	};
	deletePet(e, pet) {
		e.preventDefault();
		fetch(window.location.protocol + "//" + window.location.host + "/deletePet", {
			method: "POST",
			headers: { "Content-Type": "application/json", "Access-Token": getAccessToken() },
			body: JSON.stringify({
				pet_name: pet.pet_name,
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.error === "Not Authenticated") {
					logOut();
					window.location.href = "/login";
				}
				if (data.status === "success") {
					this.getOwnerPets();
				} else {
					alert("Failed to remove pet");
				}
			});
	}
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
	isPastToday(date) {
		let today = new Date();
		today.setHours(0, 0, 0, 0);
		let ref_date = new Date(date);
		return ref_date < today;
	}
	showRating = (bid) => {
		this.setState({ showRating: true, reviewing_bid: bid });
	};
	submitRating = (e) => {
		e.preventDefault();
		fetch(window.location.protocol + "//" + window.location.host + "/submitRating", {
			method: "POST",
			headers: { "Content-Type": "application/json", "Access-Token": getAccessToken() },
			body: JSON.stringify({
				care_taker: this.state.reviewing_bid.care_taker,
				pet_name: this.state.reviewing_bid.pet_name,
				start_date: this.formatYear(this.state.reviewing_bid.start_date),
				end_date: this.formatYear(this.state.reviewing_bid.end_date),
				rating: this.state.rating,
				review: this.state.review,
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.error === "Not Authenticated") {
					logOut();
					window.location.href = "/";
				}
				if (data.status === "success") {
					alert("Review submitted!");
					this.setState({ showRating: false });
					this.getOwnerBids();
				} else if (data.error) {
					alert(data.error);
				} else {
					alert("Unable to process review");
				}
			});
	};
	renderAddPet() {
		return (
			<div className="modal" role="dialog">
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<form onSubmit={this.addPet}>
							<div className="modal-header">
								<h5 className="modal-title">Add New Pet</h5>
								<button
									type="button"
									className="close"
									aria-label="Close"
									onClick={() => this.setState({ showAddPet: false })}
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
										placeholder="Pet Name"
										value={this.state.new_pet_name}
										onChange={(e) => this.setState({ new_pet_name: e.target.value })}
									/>
								</div>
								<div className="form-group">
									<input
										className="form-control"
										type="text"
										placeholder="Pet Type"
										value={this.state.new_pet_type}
										onChange={(e) => this.setState({ new_pet_type: e.target.value })}
									/>
								</div>
								<div className="form-group">
									<input
										className="form-control"
										type="text"
										placeholder="Special Requirements"
										value={this.state.new_pet_special_req}
										onChange={(e) => this.setState({ new_pet_special_req: e.target.value })}
									/>
								</div>
								<div className="error">{this.state.new_pet_error}</div>
							</div>
							<div className="modal-footer">
								<input className="btn btn-primary" type="submit" value="Add Pet" />
								<button
									type="button"
									className="btn btn-secondary"
									onClick={() => this.setState({ showAddPet: false })}
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
	renderRatingButton(bid) {
		const show = this.isPastToday(bid.end_date) && bid.paid && bid.rating === null;
		if (show)
			return (
				<button className="btn btn-primary" onClick={() => this.showRating(bid)}>
					Review
				</button>
			);
		else if (bid.rating !== null)
			return (
				<button disabled className="btn btn-secondary">
					Done
				</button>
			);
		else
			return (
				<button disabled className="btn btn-secondary">
					Review
				</button>
			);
	}
	renderDashboard() {
		return (
			<div>
				{this.state.showRating ? this.renderRating() : null}
				<h2>Welcome {getDisplayName()}</h2>
				<div className="row">
					<div className="rounded col-6">
						<div className="dashboard-card pet-display">
							<div className="flex-fixed">
								<h5 className="d-inline-block">Your Pets</h5>
								<button className="add-btn" onClick={() => this.setState({ showAddPet: true })}>
									<FaPlus />
								</button>
							</div>
							<div className="pet-box">
								<div className="row pet-row-header">
									<div className="col-6">
										<b>Name</b>
									</div>
									<div className="col-5">
										<b>Type</b>
									</div>
									<div className="col-1" />
								</div>
								<div className="pet-box-scroll">
									{this.state.pets.map((pet) => (
										<div className="row pet-row" key={pet.pet_name}>
											<div className="col-6">{pet.pet_name}</div>
											<div className="col-5">{pet.pet_type}</div>
											<div className="col-1">
												<button className="del-btn" onClick={(e) => this.deletePet(e, pet)}>
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
								<h5 className="d-inline-block">Quick Access</h5>
							</div>
							<div className="pet-box admin-controls">
								<a href="/bidding">Find a Caretaker</a>
							</div>
						</div>
					</div>
				</div>
				<div className="row mt-3">
					<div className="rounded col-12">
						<div className="dashboard-card pet-display">
							<div className="flex-fixed">
								<h5 className="d-inline-block">Your Bids</h5>
							</div>
							<div className="pet-box">
								<div className="row pet-row-header">
									<div className="col-2">
										<b>Pet</b>
									</div>
									<div className="col-2">
										<b>Care Taker</b>
									</div>
									<div className="col-2">
										<b>Start</b>
									</div>
									<div className="col-2">
										<b>End</b>
									</div>
									<div className="col-1">
										<b>Confirmed</b>
									</div>
									<div className="col-1">
										<b>Price</b>
									</div>
									<div className="col-1">
										<b>Payment</b>
									</div>
									<div className="col-1">
										<b>Review</b>
									</div>
								</div>
								<div className="pet-box-scroll">
									{this.state.bids.map((bid) => (
										<div
											className="row pet-row"
											key={bid.pet_name + bid.care_taker + bid.start_date + bid.end_date}
										>
											<div className="col-2">{bid.pet_name}</div>
											<div className="col-2">{bid.care_taker}</div>
											<div className="col-2">{this.formatDate(bid.start_date)}</div>
											<div className="col-2">{this.formatDate(bid.end_date)}</div>
											<div className="col-1">{bid.selected ? <FaCheck /> : <FaTimes />}</div>
											<div className="col-1">{bid.daily_price}</div>
											<div className="col-1">
												<button
													onClick={() => this.payBid(bid)}
													className={bid.paid ? "btn btn-secondary" : "btn btn-primary"}
													disabled={bid.paid}
												>
													{bid.paid ? "Paid" : "Pay"}
												</button>
											</div>
											<div className="col-1">{this.renderRatingButton(bid)}</div>
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
	renderRating() {
		return (
			<div className="modal" role="dialog">
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<form onSubmit={this.submitRating}>
							<div className="modal-header">
								<h5 className="modal-title">Review and Rating</h5>
								<button
									type="button"
									className="close"
									aria-label="Close"
									onClick={() => this.setState({ showRating: false })}
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
										value={this.state.reviewing_bid.care_taker}
										readOnly
									/>
								</div>
								<div className="form-group">
									<h5>Rating</h5>
									<input
										className="form-control"
										type="number"
										placeholder="Rating"
										value={this.state.rating}
										onChange={(e) => this.setState({ rating: e.target.value })}
										max="5"
										min="0"
										autoFocus
									/>
								</div>
								<div className="form-group">
									<h5>Review</h5>
									<textarea
										className="form-control"
										rows="5"
										maxLength="200"
										placeholder="How was your experience?"
										value={this.state.review}
										onChange={(e) => this.setState({ review: e.target.value })}
									/>
								</div>
								<div className="error">{this.state.review_error}</div>
							</div>
							<div className="modal-footer">
								<input className="btn btn-primary" type="submit" value="Submit" />
								<button
									type="button"
									className="btn btn-secondary"
									onClick={() => this.setState({ showRating: false })}
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
			<div className="container">
				{this.state.showAddPet ? this.renderAddPet() : null}
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
									{isLoggedIn() ? this.renderDashboard() : this.renderIndex()}
									{isCareTaker() ? (
										isPartTime() ? (
											<ParttimeCaretakerDashboard />
										) : (
											<FulltimeCaretakerDashboard />
										)
									) : null}
									{isAdmin() ? <AdminDashboard /> : null}
								</main>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Index;
