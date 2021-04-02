/*
Experimental: Not in productions yet

*/

import React from 'react';
import axios from 'axios';

export default class PersonInput extends React.Component {
    constructor(props) {
      super(props);
        this.state = {
          name:''
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
      event.preventDefault();
      const user = {
        name : this.state.name
      }
      axios.post(`https://jsonplaceholder.typicode.com/users`, {user }).then(res => {
        console.log(res);
        console.log(res.data);
      })
    }

  componentDidMount() {
    axios.get(`https://jsonplaceholder.typicode.com/users`)
      .then(res => {
        const persons = res.data;
        this.setState({ persons });
      })
  }

handleChange(event) {
  this.setState( {name: event.target.value});
}
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>Person Name:
        <input type="text" name="name" onChange={this.handleChange}/>
        </label>
        <button type="submit">Add</button>
        
      </form>

    )
  }
}

/*
<ul>
        { this.state.persons.map(person => <li key={person.id}>{person.name}</li>)}
      </ul>
*/