/*
 Show grades of passed courses


*/

import React from 'react';
import Axios from 'axios';

export default class Grades extends React.Component {
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
    console.log("GRADES - component will receive props ")
    console.log(props.token)
    this.token = props.token;
    let config = { headers: {'Authorization': "Bearer " + this.token } };
    let bodyParameters = { }
    console.log(config.headers.Authorization);
    Axios.post( 'http://localhost:3000/grades', bodyParameters, config)
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
        <td>{item.gradedate} </td> 
        <td>{item.name}</td>
        <td>{item.courseId}</td>
        <td>{item.grade}</td>
        </tr>);
       
       //for (let [key, value] of Object.entries(this.state.data)) {

    
        if( items.length === 0){
            return(<h2>Sinulla ei ole arvioituja suorituksia.</h2>)
        }
        else{
            return (
            <div>
                <table>
                    <thead>
                        <th>Päivämäärä</th>
                        <th>Nimi</th>
                        <th>Koodi</th>
                        <th>Arvosana</th>
                    </thead>
                    {items}
                </table>
            </div>   
            );
        } // else
} // render
}