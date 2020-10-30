import React, { Component } from "react";
import "css/styles.css";
import Navbar from "./Navbar";
import icon_ex1 from "img/expensive_1.png";
import icon_ex2 from "img/expensive_2.png";

class Caretakers extends Component {
	constructor(props) {
		super(props);
		this.state = {
            caretakers: [],
            priceInfo: [],
		};
	}
	componentDidMount() {
		fetch("/caretakers")
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
        fetch("/getAveragePrice")
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
            )
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
                                <div class="card mb-3">
                                    <div class="card-header">
                                        Current Available Services
                                    </div>
                                    <div class="class-body">
                                        <div class="table-responsive">
                                            <table className="table table-bordered">
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
                                                            <td>{care.care_taker}</td>
                                                            <td>{care.employee_type}</td>
                                                            <td>{care.pet_type}</td>
                                                            <td>{care.price}</td>
                                                            <td>{care.area}</td>
                                                            <td>{care.start_date}</td>
                                                            <td>{care.end_date}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div class="card mb-3">
                                    <div class="card-header">
                                        Average Price based on Pet Type and Area
                                    </div>
                                    <div class="class-body">
                                        <div class="table-responsive">
                                            <table className="table table-bordered">
                                                <thead>
                                                    <tr>
                                                        <td>Pet Type</td>
                                                        <td>Area</td>
                                                        <td>Average Price (S$)</td>
                                                        <td>Base Price (S$)</td>
                                                        <td>Expensive/Low</td>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.priceInfo.map((info) => (
                                                        <tr>
                                                            <td>{info.pet_type}</td>
                                                            <td>{info.area}</td>
                                                            <td>{info.average_price}</td>
                                                            <td>{info.base_price}</td>
                                                            <td>{this.replace_ishigh_image(info.ishigh)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
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
        if (val == 1) {
            return <img src={icon_ex2} width="50px" />;
        } else {
            return <img src={icon_ex1} width="50px" />;
        }
    }
}

export default Caretakers;
