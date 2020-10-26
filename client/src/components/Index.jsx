import React, { Component } from "react";
import "css/styles.css";
import Navbar from "./Navbar";
import { getAccessToken, getDisplayName, isLoggedIn } from "./ClientAuth";
import dog from "img/dog.jpg";
import cat from "img/cat.jpg";
import hamster from "img/hamster.jpg";

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
	getPets() {
		if (isLoggedIn()) {
			fetch(window.location.protocol + "//" + window.location.host + "/getPets", {
				method: "GET",
				headers: { "Content-Type": "application/json", "Access-Token": getAccessToken() },
			})
				.then((response) => response.json())
				.then((data) => {
					console.log(data);
				});
		}
	}
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
	renderDashboard() {
		return (
			<h2>
				<b>Welcome {getDisplayName()}</b>
			</h2>
		);
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
									{isLoggedIn() ? this.renderDashboard() : this.renderIndex()}
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
