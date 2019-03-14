import React from "react";
import Menu from "./Menu";

import "../styles/App.scss";

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      menu: null
    };

    this.getMenu = this.getMenu.bind(this);
    this.getMenuArray = this.getMenuArray.bind(this);
  }

  // initialize
  componentDidMount() {
    this.getMenu();
  }

  // get menu data
  getMenu() {
    fetch("/api/menu")
      .then(response => response.json())
      .then(menu => {
        this.setState({ menu });
      })
      .catch(error => res.json({ error: error.message }));
  }

  getMenuArray() {
    return Object.values(this.state.menu);
  }

  render() {
    console.log("this.state.menu:", this.state.menu);
    const menuItems = this.state.menu && (
      <Menu
        // returnMenu={this.returnMenu}
        menuArray={this.getMenuArray()}
        // getOrder={this.getOrder}
      />
    );
    return <React.Fragment>{menuItems}</React.Fragment>;
  }
}

export default App;
