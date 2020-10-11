import React, { Component } from "react";
import "css/App.css";

class App extends Component {
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
	renderDemo = () => {
		let welcomeMessage = "Welcome to pet care!";
		return <div className="Main">{welcomeMessage}</div>;
	};
	clickDemo = () => {
		alert("Button Demo!");
	};
	render() {
		return (
			<div
				className="App"
				ref={(node) => {
					this.refs = node;
				}}
				style={{ width: "100%", height: "100%" }}
			>
				<div>{this.renderDemo()}</div>
				<button className="demoButton" onClick={this.clickDemo}>
					Demo Button
				</button>
			</div>
		);
	}
}

export default App;
