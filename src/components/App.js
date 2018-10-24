import React from 'react';

import '../styles/App.scss';

class App extends React.Component {
  constructor(){
    super();

    this.state = {menu: {}};
  }

  componentDidMount(){
    fetch('/api/menu')
      .then(res => res.json())
      .then( menu => this.setState({menu}))
  }

  render(){
    return (
      <div>
        Delivereat app
        <ul>
          {Object.values(this.state.menu).map( item => (
            <li key={item.id}>{item.name}</li>
          ))}
      </ul>
      </div>
    )
  }
}

export default App;
