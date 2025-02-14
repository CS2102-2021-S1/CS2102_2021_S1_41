import React, { Component } from "react";
import "css/styles.css";
import Navbar from "./Navbar";
import Table from "react-bootstrap/Table";
import "react-dropdown/style.css";
import icon_ex1 from "img/expensive_1.png";
import icon_ex2 from "img/expensive_2.png";
import available from "img/available.png";
import unavailable from "img/unavailable.png";
import { BACKEND_SUBDIR } from "../Constants";

class Caretakers extends Component {
	constructor(props) {
		super(props);
		this.state = {
			caretakers: [],
			priceInfo: [],
			areas: [],
		};
	}
	componentDidMount() {
		fetch(BACKEND_SUBDIR + "/getAreas")
			.then((response) => {
				if (!response.ok) {
					throw Error("GET request failed");
				}
				return response;
			})
			.then((data) => data.json())
			.then(
				(data) => {
					this.setState({
						areas: data.map((area) => area.area),
					});
					this.state.areas.push("All");
					console.log("parsed json", data);
				},
				(ex) => {
					this.setState({
						requestError: true,
					});
					console.log("parsing failed", ex);
				}
			);
		fetch(BACKEND_SUBDIR + "/caretakers")
			.then((response) => {
				if (!response.ok) {
					throw Error("GET request failed.");
				}
				return response;
			})
			.then((data) => data.json())
			.then(
				(data) => {
					this.setState({
						caretakers: data,
					});
					console.log("parsed json", data);
				},
				(ex) => {
					this.setState({
						requestError: true,
					});
					console.log("parsing failed", ex);
				}
			);
		fetch(BACKEND_SUBDIR + "/getAveragePrice")
			.then((response) => {
				if (!response.ok) {
					throw Error("GET request failed.");
				}
				return response;
			})
			.then((data) => data.json())
			.then(
				(data) => {
					this.setState({
						priceInfo: data,
					});
					console.log("parsed avg price info json", data);
				},
				(ex) => {
					this.setState({
						requestError: true,
					});
					console.log("parsing failed", ex);
				}
			);
		window.addEventListener("focus", this.handleOnFocus);
	}
	handleOnFocus() {
		//On focus handler
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
								<div className="card-page mb-3">
									<div className="card-header">Current Available Services</div>
									<div className="class-body">
										care taker available: <img src={available} alt="" /> care taker unavailable:{" "}
										<img src={unavailable} alt="" />
										<br />
										{/* <table>
                                            <tr>
                                                <td>Filter by Area: </td>
                                                <td><Dropdown options={this.state.areas} onChange={this.filterList} value='All' placeholder="Select an option" /></td>
                                            </tr>
                                        </table> */}
										<div className="table-responsive">
											<Table striped bordered hover>
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
													{this.state.caretakers.map((care) => (
														<tr>
															<td>
																{this.check_avail(care.start_date, care.end_date)}
																{care.care_taker}
															</td>
															<td>{care.employee_type}</td>
															<td>{care.pet_type}</td>
															<td>{care.price}</td>
															<td>{care.area}</td>
															<td>{care.start_date}</td>
															<td>{care.end_date}</td>
														</tr>
													))}
												</tbody>
											</Table>
										</div>
									</div>
								</div>
								<div className="card-page mb-3">
									<div className="card-header">Average Price based on Pet Type and Area</div>
									<div className="class-body">
										<p>
											Average price based on offered price by care takers for each pet type and
											available service area. <br />
											Base price set by default by PetCare system.
										</p>
										<div className="table-responsive">
											<Table striped bordered hover>
												<thead>
													<tr>
														<td>Pet Type</td>
														<td>Area</td>
														<td>Average Price (S$)</td>
														<td>Base Price (S$)</td>
														{/* <td>Expensive/Low</td> */}
													</tr>
												</thead>
												<tbody>
													{this.state.priceInfo.map((info) => (
														<tr>
															<td>{info.pet_type}</td>
															<td>{info.area}</td>
															<td>{info.average_price}</td>
															<td>{info.base_price}</td>
															{/* <td>{this.replace_ishigh_image(info.ishigh)}</td> */}
														</tr>
													))}
												</tbody>
											</Table>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
	replace_ishigh_image(val) {
		if (val === 1) {
			return <img src={icon_ex2} width="50px" alt="" />;
		} else {
			return <img src={icon_ex1} width="50px" alt="" />;
		}
	}
	check_avail(start, end) {
		var today = new Date();
		console.log(today);
		start = new Date(start);
		end = new Date(end);
		if (today >= start && today <= end) {
			return <img src={available} alt="" />;
		} else {
			return <img src={unavailable} alt="" />;
		}
	}
}

export default Caretakers;
