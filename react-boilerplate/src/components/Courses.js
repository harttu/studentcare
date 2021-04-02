/*
Show All the courses and let user sign to a course

*/

import React from 'react';
import axios from 'axios';

export default class Courses extends React.Component {
    constructor(props) {
      super(props);
      console.log(props)
        this.state = {
            courses: [],
            username: props.username,
            info:''
        } 
        this.token = '';
        this.lisaaKurssi = this.lisaaKurssi.bind(this);
    }
  componentWillReceiveProps(props) {
    this.token = props.token;

    let config = { headers: {'Authorization': "Bearer " + this.token } };
    let bodyParameters = { }
    console.log("Courses ")
    console.dir(this)
    axios.post(`http://localhost:3000/courses`, bodyParameters, config)
      .then(res => {
        const courses = res.data.data;
        console.log(courses)
        this.setState({ courses });
      }).catch((error) => {
        console.log(error)
    }); 
  }

  lisaaKurssi(kurssinNimi) {
    console.log("Painettu lisaaKurssi")
   
   // this.token = props.token;
    let config = { headers: {'Authorization': "Bearer " + this.token } };
    let bodyParameters = { courseId : kurssinNimi }
    console.log("Courses ")
    console.dir(this)
    axios.post(`http://localhost:3000/courses/join`, bodyParameters, config)
      .then(res => {
        const courses = res.data.data;
        console.log(courses)
        this.setState({ info:"Kurssille liittyminen onnistui." });

      }).catch((error) => {
        console.log(error)
        this.setState({ info:"Ongelman kurssille liittymisessä" });

    }); 
  
  }
  render() {
    return (
      <div>
        <h3>{this.state.info}</h3>
    <table>
        <caption>Kurssit</caption>
        <thead>
            <tr>
                <th>Nimi</th>
                <th>Lyhenne</th>
                <th>Kuvaus</th>
                <th>Opintopisteet</th>
            </tr>
        </thead>
        <tbody>
            { this.state.courses.map(course => 
            <tr key={course.name}>
                <td>{course.name}</td> 
                <td>{course.shortName}</td> 
                <td>{course.description}</td> 
                <td>{course.credits}</td>
                <td><button onClick={ () => {this.lisaaKurssi(course.shortName)} }>Ilmoittaudu kurssille</button>
                </td>
            </tr>)}
        </tbody>
      </table>
      </div>


    )
  }
}

/*
*/