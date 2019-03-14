import React from "react";
import MenuItem from "./MenuItem";

class Menu extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="menu">
        <title>Menu</title>
        {this.props.menuArray.map(menuItem => {
          const id = `${menuItem.course}-${menuItem.id}`;
          return <MenuItem menu={menuItem} key={id} />;
        })}
        {/* getOrder={this.props.getOrder} */}
      </div>
    );
  }
}

export default Menu;
