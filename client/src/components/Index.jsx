import React, { Component } from "react";
import "css/styles.css";
import Navbar from "./Navbar";

class Index extends Component {
	constructor(props) {
		super(props);
		this.state = {
			example_state: "-",
		};
	}
	componentDidMount() {
		//Initialize component
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
								<main className="col-12 bg-faded py-3 rounded" />
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Index;
