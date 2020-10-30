import React, { Component } from "react";
import "css/styles.css";
import Navbar from "./Navbar";
import { getAccessToken, getDisplayName, isLoggedIn, logOut } from "./ClientAuth";
import dog from "img/dog.jpg";
import cat from "img/cat.jpg";
import hamster from "img/hamster.jpg";
import { FaPlus, FaTrash } from "react-icons/fa";

class Index extends Component {
	constructor(props) {
		super(props);
		this.state = {
<<<<<<< HEAD
			example_state: "-",
			caretakers: [],
=======
			showAddPet: false,
			pets: [],
			new_pet_name: "",
			new_pet_type: "",
			new_pet_special_req: "",
			new_pet_error: "",
>>>>>>> master
		};
	}

	componentDidMount() {
<<<<<<< HEAD
		//Initialize component
		fetch('/caretakers/list')
			.then(response => {
				if (!response.ok) {
					throw Error('GET request failed.');
				}
				return response;
			})
			.then(data => data.json())
			.then(data => {
				this.setState({
					caretakers: data
				});
				console.log('parsed json', data);
			}, (ex) => {
				this.setState({
					requestError: true
				});
				console.log('parsing failed', ex);
			})
=======
>>>>>>> master
		window.addEventListener("focus", this.handleOnFocus);
		this.getOwnerPets();
	}

	handleOnFocus() {
		//On focus handler
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
	renderDashboard() {
		return (
			<div>
				<h2>Welcome {getDisplayName()}</h2>
				<div className="row">
					<div className="rounded col-4 dashboard-card m-2 pet-display">
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
									<div className="row pet-row">
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
					<div className="rounded col-4 dashboard-card m-2">
						<h5>Your Bids</h5>
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
<<<<<<< HEAD
								<main className="col-12 bg-faded py-3 rounded">
									<div class="card">
										<div class="card-header">
											Current Care Taker Information
										</div>
										<div class="table-responsive">
											<table class="table table-bordered">
												<thead>
													<tr>
														<td>Care Taker</td>
														<td>Employee Type</td>
														<td>Pet Type</td>
														<td>Price (S$)</td>
														<td>Area/Region</td>
														<td>Start Date</td>
														<td>End Date</td>
													</tr>
												</thead>
												<tbody>
												{this.state.caretakers.map(care =>
													<tr>
														<td>{care.care_taker}</td>
														<td>{care.employee_type}</td>
														<td>{care.pet_type}</td>
														<td>{care.price}</td>
														<td>{care.area}</td>
														<td>{care.start_date}</td>
														<td>{care.end_date}</td>
													</tr>)}
												</tbody>
											</table>
										</div>
									</div>
=======
								<main className="col-12 bg-faded p-4 rounded">
									{isLoggedIn() ? this.renderDashboard() : this.renderIndex()}
>>>>>>> master
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
