/*
Show privileges of a user
 
*/ 

import React from 'react';
import Axios from 'axios';

export default class PrivilegesViewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            token : props.token,
            username:'', 
            isStudent:false,
            isAdmin:false,
            isTeacher:false
        };
        
        this.fetchData = this.fetchData.bind(this);
        console.dir(props)
    }
    componentWillReceiveProps(props){
        console.log("PrivilegesViewer - componenWillReceiveProps")
        console.dir(props)
        /*
        this.setState({
            token : props.token,
            username:'', 
            isStudent:false,
            isAdmin:false,
            isTeacher:false
        });
        console.log(this)
        */
       this.fetchData(props.token);
    }

    //componentDidUpdate(){  }
    componentDidMount(){    }
    fetchData(token){
        let that = this;
        console.log("Fetching Data");
        console.dir(this)
//        if( this.state.token ) {
            console.log("componentDidUpdate componentDidUpdate")
            var config = { headers: {'Authorization': "Bearer " + token } };
            console.log(config.headers.Authorization);
            var bodyParameters = { key: "value"}
            Axios.post( 'http://localhost:3000/privileges',bodyParameters,config)
            .then((response) => {
                console.log("Got response")
                console.log(response)
                that.setState(
                    {
                        username: response.data.data[0].username,
                        isStudent: response.data.data[0].isStudent,
                        isTeacher: response.data.data[0].isTeacher,
                        isAdmin: response.data.data[0].isAdmin,
                    });
            }).catch((error) => {
                console.log(error)
            }); 
  //      } // if    
    //    else {
    //        console.log("Token not set" +  this.state.token )
     //   }
    }
    render () { 
    //*/
        console.log("Rendering PrivilegesViewer")
        console.dir(this)
     //   console.log("")
        if( this.state.username) {
            return (<div className={this.state.token ? 'block':'hidden'}>
                {this.state.username} - 
                Rooli : { this.state.isStudent ? 'Opiskelija' : '' } |
                        { this.state.isTeacher ? ' Opettaja' : '' } |
                        { this.state.isAdmin ? ' Admin' : '' }
            </div>);
        }
        return (<div>Et ole kirjautunut sisään</div>);
    }
}