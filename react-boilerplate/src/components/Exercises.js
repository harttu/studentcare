/*
User can return exercises to a course. Course list will be retrieved first

TODO:
SQL is not implemented yet

*/

import React from 'react';
import Axios from 'axios';

export default class Exercises extends React.Component {
    constructor(props) {
      super(props);
      console.log(props)
        this.state = {
            data: [],
            selectedCourse:0,
            numberOfExercises:0
        }
        this.token = '';

        this.handleSelectChange = this.handleSelectChange.bind(this);
    }
  componentWillReceiveProps(props) {
    let that = this;
    console.log("Exercises - component will receive props ")
    console.log(props.token)
    this.token = props.token;
    let config = { headers: {'Authorization': "Bearer " + this.token } };
    let bodyParameters = { }
    console.log(config.headers.Authorization);
    Axios.post( 'http://localhost:3000/exercises', bodyParameters, config)

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

handleSelectChange(e){
    let v = event.target.value;
    this.setState({
        selectedCourse:v,
        numberOfExercises: this.state.data[v] ? (this.state.data[v].gradingRule.match(/DEF/g) || []).length : 0
    })
}

    render() {

       let items = this.state.data.map( (item,i) =>
           <option value={i}>{item.name}</option>
        );
        console.log("exercises render")
        console.dir(this)
  
        let textAreas = '';
        textAreas = Array.apply(null, {length: this.state.numberOfExercises}).map(Number.call, Number).map( (item,i) => <div><label>Tehtävä {i + 1}</label><textarea key={i}></textarea><br/></div>)
            
        if( items.length === 0){
            return(<h2>Sinulla ei ole valittuna kursseja.</h2>)
        }
        else{
            return (
            <div>
                <select onClick={this.handleSelectChange}>
                    {items}
                </select>
                <form>
                    {textAreas}
                    <button onClick={ (e)=> {e.preventDefault(); alert("Under construction"); } }>Lähetä vastaus</button>
                </form>
            </div>   
            );
        } // else
} // render
}