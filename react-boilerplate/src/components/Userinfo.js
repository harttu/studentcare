/*
 Show all users. 
 For admin
*/


import React from 'react';
import Axios from 'axios';

export default class Userinfo extends React.Component {
    constructor(props) {
      super(props);
      console.log(props)
        this.state = {
            data: [],
        }
        this.token = '';
    }
  componentWillReceiveProps(props) {
    let that = this;
    console.log("UESRINFO - component will receive props ")
    console.log(props.token)
    this.token = props.token;
    let config = { headers: {'Authorization': "Bearer " + this.token } };
    let bodyParameters = { }
    console.log(config.headers.Authorization);
    Axios.post( 'http://localhost:3000/userinfo', bodyParameters, config)
    .then((response) => {
        console.log("Got response")
        console.log(response.data)
        window.d = response.data
    //    let result = Object.keys(response.data).map(function(key) { return response[key]; });
  //      let results = Object.keys(response.data).map( (key) => d[key] ) // tramsfrom from dictionary to an array
        //console.log(results)
        that.setState({data : response.data.data } )
        console.dir(that.state)
    }).catch((error) => {
        console.log(error)
    }); 
}

    render() {

       let items = this.state.data.map( (item,i) => <tr key={i}>
        <td>{item.firstNames} </td> 
        <td>{item.familyName}</td>
        <td>{item.program}</td>
        <td>{item.username}</td>
        </tr>);
       
       //for (let [key, value] of Object.entries(this.state.data)) {

    
        if( items.length === 0){
            return(<h2>Oppilaitoksessa ei ole opiskelijoita.</h2>)
        }
        else{
            return (
            <div>
                <table>
                    <thead>
                        <th>Etunimi</th>
                        <th>Sukunimi</th>
                        <th>Koulutusohjelma</th>
                        <th>käyttäjätunnus</th>
                    </thead>
                    {items}
                </table>
            </div>   
            );
        } // else
} // render
}