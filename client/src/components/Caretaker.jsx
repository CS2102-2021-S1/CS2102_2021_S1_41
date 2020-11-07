import React, { Component } from "react";
import "css/styles.css";
import Navbar from "./Navbar";
import { BACKEND_SUBDIR } from "../Constants";
import Table from "react-bootstrap/Table";

class Caretaker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			rating: "-/5",
			reviews: [],
		};
	}

	componentDidMount() {
		const username = localStorage.getItem("cusername");
		this.getRating(username);
		this.getReviews(username);
	}
	getRating(username) {
		fetch(window.location.protocol + "//" + window.location.host + BACKEND_SUBDIR + "/getUserRating", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				username: username,
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.rating) this.setState({ rating: data.rating });
			});
	}
	getReviews(username) {
		fetch(window.location.protocol + "//" + window.location.host + BACKEND_SUBDIR + "/getUserReviews", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				username: username,
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				if (Array.isArray(data)) {
					this.setState({ reviews: data });
				}
			});
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
									<h2>{localStorage.getItem("cusername")}</h2>
									<h3>
										Average Rating:{" "}
										<b>
											<i>{this.state.rating}</i>
										</b>
									</h3>
									<h3 className="mt-4">Reviews</h3>
									<Table striped bordered>
										<tbody>
											{this.state.reviews.map((review) => (
												<tr>
													<td>
														<h5>
															<b>{review.pet_owner}</b>
														</h5>
														<h6>Rating: {review.rating}</h6>
														<p>{review.review}</p>
													</td>
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

export default Caretaker;
