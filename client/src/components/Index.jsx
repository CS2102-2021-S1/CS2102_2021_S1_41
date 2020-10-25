import React, { Component } from "react";
import "css/styles.css";
import Navbar from "./Navbar";

class Index extends Component {
	constructor(props) {
		super(props);
		this.state = {
			example_state: "-",
			caretakers: [],
		};
	}

	componentDidMount() {
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
					<div className="row flex-grow-1">
						<div className="col-12">
							<div className="row wrapper flex-column flex-sm-row nav-size">
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
