import React, { Component } from "react";
import "css/styles.css";
import Navbar from "./Navbar";
import { getAccessToken, isLoggedIn, logOut } from "./ClientAuth";
import Table from "react-bootstrap/Table";
import { BACKEND_SUBDIR } from "../Constants";

class Bidding extends Component {
	constructor(props) {
		super(props);
		this.state = {
			step: 0,
			search_pet_type: "",
			search_price_min: 0,
			search_price_max: 100,
			results: [],
			chosen_caretaker: {
				care_taker: "",
				price: 0,
			},
			bid_pet: "",
			bid_price: "",
			bid_transfer: "PCS Meet-up",
			bid_error: "",
			bid_start_date: "",
			bid_end_date: "",
		};
	}
	componentDidMount() {
		if (!isLoggedIn()) {
			logOut();
			window.location.href = "/login";
		}
	}
	renderSwitch = () => {
		switch (this.state.step) {
			case 0:
				return this.renderSearch();
			case 1:
				return this.renderResults();
			case 2:
				return this.renderBidding();
			default:
				return null;
		}
	};
	search = (e) => {
		e.preventDefault();
		if (isLoggedIn()) {
			fetch(window.location.protocol + "//" + window.location.host + BACKEND_SUBDIR + "/searchCaretaker", {
				method: "POST",
				headers: { "Content-Type": "application/json", "Access-Token": getAccessToken() },
				body: JSON.stringify({
					pet_type: this.state.search_pet_type,
					min_price: this.state.search_price_min,
					max_price: this.state.search_price_max,
				}),
			})
				.then((response) => response.json())
				.then((data) => {
					if (data.error === "Not Authenticated") {
						logOut();
						window.location.href = "/login";
					}
					if (Array.isArray(data)) {
						this.setState({ results: data, step: 1 });
						if (data.length === 0) {
							alert("No Caretakers Found!");
							this.setState({ step: 0 });
						}
					}
				});
		}
	};
	bid = (e) => {
		e.preventDefault();
		if (this.state.bid_pet === "") {
			this.setState({ bid_error: "Please enter all fields." });
			return;
		}
		if (this.state.bid_price === "") {
			this.setState({ bid_error: "Please enter all fields." });
			return;
		}
		if (this.state.bid_start_date === "") {
			this.setState({ bid_error: "Please enter all fields." });
			return;
		}
		if (this.state.bid_end_date === "") {
			this.setState({ bid_error: "Please enter all fields." });
			return;
		}
		this.setState({ bid_error: "" });

		if (isLoggedIn()) {
			fetch(window.location.protocol + "//" + window.location.host + BACKEND_SUBDIR + "/bid", {
				method: "POST",
				headers: { "Content-Type": "application/json", "Access-Token": getAccessToken() },
				body: JSON.stringify({
					pet_name: this.state.bid_pet,
					pet_type: this.state.search_pet_type,
					care_taker: this.state.chosen_caretaker.care_taker,
					price: this.state.bid_price,
					start_date: this.state.bid_start_date,
					end_date: this.state.bid_end_date,
					transfer: this.state.bid_transfer,
				}),
			})
				.then((response) => response.json())
				.then((data) => {
					if (data.error === "Not Authenticated") {
						logOut();
						window.location.href = "/login";
					} else if (data.error) {
						this.setState({ bid_error: data.error });
					} else {
						console.log(data);
					}
				});
		}
	};
	showBid = (caretaker) => {
		this.setState({ step: 2, chosen_caretaker: caretaker });
	};
	goToCaretaker = (caretaker) => {
		localStorage.setItem("cusername", caretaker.care_taker);
		window.location.href = "/Caretaker";
	};
	renderSearch() {
		return (
			<form onSubmit={this.search}>
				<h4>Firstly, please search by pet type</h4>
				<div className="form-group mt-3">
					<h5>Pet Type</h5>
					<input
						className="form-control"
						type="text"
						name="search-pet-type"
						placeholder="E.g. dog, cat, etc"
						value={this.state.search_pet_type}
						onChange={(e) => this.setState({ search_pet_type: e.target.value })}
						autoFocus
					/>
				</div>
				<div className="form-group">
					<h5>Min Price</h5>
					<input
						className="form-control"
						type="number"
						name="search-min-price"
						placeholder="Min Price"
						value={this.state.search_price_min}
						onChange={(e) => this.setState({ search_price_min: e.target.value })}
					/>
				</div>
				<div className="form-group">
					<h5>Max Price</h5>
					<input
						className="form-control"
						type="number"
						name="search-max-price"
						placeholder="Max Price"
						value={this.state.search_price_max}
						onChange={(e) => this.setState({ search_price_max: e.target.value })}
					/>
				</div>
				<input className="btn btn-primary" type="submit" value="Search" />
			</form>
		);
	}
	renderResults() {
		return (
			<div>
				<h4>Please select a care taker</h4>
				<Table striped bordered>
					<thead>
						<tr>
							<td>Care Taker</td>
							<td>Price ($)</td>
							<td>Apply</td>
						</tr>
					</thead>
					<tbody>
						{this.state.results.map((caretaker) => (
							<tr key={caretaker.care_taker}>
								<td>
									<a href="#" onClick={() => this.goToCaretaker(caretaker)}>
										{caretaker.care_taker}
									</a>
								</td>
								<td>{caretaker.price}</td>
								<td>
									<button className="btn btn-primary" onClick={() => this.showBid(caretaker)}>
										Bid
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
				<button className="btn btn-primary" onClick={() => this.setState({ step: 0 })}>
					Back
				</button>
			</div>
		);
	}
	renderBidding() {
		return (
			<div>
				<form onSubmit={this.bid}>
					<h4>Enter your bid info</h4>
					<h5 className="mb-4">
						<b>
							{this.state.chosen_caretaker.care_taker}'s rate: ${this.state.chosen_caretaker.price}
						</b>
					</h5>
					<div className="error">{this.state.bid_error}</div>
					<div className="form-group">
						<h5>Your Pet Name</h5>
						<input
							className="form-control"
							type="text"
							name="bid-pet"
							placeholder="Name"
							value={this.state.bid_pet}
							onChange={(e) => this.setState({ bid_pet: e.target.value })}
							autoFocus
						/>
					</div>
					<div className="form-group">
						<h5>Pet Type</h5>
						<input
							className="form-control"
							type="text"
							name="search-pet-type"
							placeholder="Pet Type"
							value={this.state.search_pet_type}
							readOnly
						/>
					</div>
					<div className="form-group">
						<h5>Your Bid</h5>
						<input
							className="form-control"
							type="number"
							name="bid-price"
							placeholder="Bid Price"
							value={this.state.bid_price}
							onChange={(e) => this.setState({ bid_price: e.target.value })}
						/>
					</div>
					<div className="form-group">
						<h5>Pet Transfer Method</h5>
						<select
							value={this.state.bid_transfer}
							onChange={(e) => this.setState({ bid_transfer: e.target.value })}
						>
							<option value="PCS Meet-up">PCS Meet-up</option>
							<option value="Pick-up by Caretaker">Pick-up by Caretaker</option>
							<option value="Deliver to Caretaker">Deliver to Caretaker</option>
						</select>
					</div>
					<div className="form-group">
						<h5>Start Date</h5>
						<input
							className="form-control"
							type="date"
							name="bid-start-date"
							value={this.state.bid_start_date}
							onChange={(e) => this.setState({ bid_start_date: e.target.value })}
						/>
					</div>
					<div className="form-group">
						<h5>End Date</h5>
						<input
							className="form-control"
							type="date"
							name="bid-start-date"
							value={this.state.bid_end_date}
							onChange={(e) => this.setState({ bid_end_date: e.target.value })}
						/>
					</div>
					<input className="btn btn-primary" type="submit" value="Submit Bid" />
					<button className="btn btn-secondary" onClick={() => this.setState({ step: 1 })}>
						Back
					</button>
				</form>
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
									<h2>Apply for new caretaker</h2>
									{this.renderSwitch()}
								</main>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Bidding;
