import React, { Component } from 'react';


class App extends Component {
  state = { contacts_list:[] }
  componentDidMount(){
    const getList = async()=>{
        const response = await fetch('//localhost:8080/photo/list')
        const data = await response.json()
        this.setState({contacts_list:data})
    }
    getList();
  }
  

  render() {
    const { contacts_list } = this.state

    return (
      
      <div className="App">
           { contacts_list.map( contact => 
      <div key={contact.id}>
        <p>{contact.id} -  {contact.name}</p>
      </div>
  )
}


      </div>
    );
  }
}

export default App;
