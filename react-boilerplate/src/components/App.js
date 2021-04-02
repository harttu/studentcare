/*
 This is the index file


*/

import React, { Component } from "react";
import Axios from 'axios';

import '../styles/App.css';

import Courses from '../components/Courses.js';
import Login from '../components/Login.js';
import ChangePassword from '../components/ChangePassword';
import Userinfo from '../components/Userinfo';
import Grades from '../components/Grades';
import Exercises from '../components/Exercises';

// TODO: implement the following for admin
//import PersonList from '../components/PersonList.js';
//import PersonInput from '../components/PersonInput.js';
//import PrivilegesViewer from '../components/PrivilegesViewer.js';

class App extends Component {
    constructor(props){
        super(props);

        this.COMPONENT_STATES = {
            SELECTCOURSE:'SELECTCOURSE',
            GRADES:'GRADES',
            CHANGEPASSWORD:'CHANGEPASSWORD',
            LOGIN:'LOGIN',
            LOGOUT:'LOGOUT',
            USERINFO:'USERINFO',
            RETURNEXERCISES:'RETURNERXCISES',
            HOME:'HOME'
        }
    

        this.state = { 
            username: '',
            token:'',
            isLoggedIn:false,
            isStudent: false,
            isTeacher: false,
            isAdmin: false,
            appState:this.COMPONENT_STATES.HOME
        };
 
 //      this.test = this.test.bind(this);
       this.logInHandler = this.logInHandler.bind(this);
       this.logOutHandler = this.logOutHandler.bind(this);
        this.setPrimaryComponent = this.setPrimaryComponent.bind(this);

    }
    
    logInHandler(username,token,isStudent,isTeacher,isAdmin) {
        this.setState({username,token,isLoggedIn:true,isStudent,isTeacher,isAdmin});
        console.log("############ logInHandler called")
        console.dir(this.state)
    }
    logOutHandler() {
        let defaultState = { username: '', token:'', isLoggedIn:false, isStudent: false, isTeacher: false, isAdmin: false, appState:this.COMPONENT_STATES.HOME};
        this.setState(defaultState);
    }

    setPrimaryComponent(newState){
        console.log("Changing state to :"+newState)
        let C = this.COMPONENT_STATES;
        // when token is set, user has logged in
        if( ! this.state.token ) {

            this.setState({appState:this.COMPONENT_STATES.LOGIN})
        }
        else {
                this.setState({appState:newState})
        }
    }


    render() {
        return (
            //
            // Create header and menu
            //

            <div>
                <h1>StudentCare Web</h1>
                <nav class="menu">
                    <ul>
                        <li>
                            <button onClick={()=> this.setPrimaryComponent(this.COMPONENT_STATES.SELECTCOURSE)} >
                                Kirjaudu kurssille
                            </button>
                        </li>
                        <li>
                            <button onClick={()=> this.setPrimaryComponent(this.COMPONENT_STATES.RETURNEXERCISES)} >
                                Palauta tehtävä
                            </button>
                        </li>
                        <li>
                            <button onClick={()=> this.setPrimaryComponent(this.COMPONENT_STATES.GRADES)} >
                                Arvosanat
                            </button>
                        </li>
                        <li>
                            <button onClick={()=> this.setPrimaryComponent(this.COMPONENT_STATES.CHANGEPASSWORD)} >
                                Vaihda salasana
                            </button>
                        </li>
                        <li className={this.state.isAdmin?'visible':'hidden'}>
                            <button onClick={()=> this.setPrimaryComponent(this.COMPONENT_STATES.USERINFO)} >
                                Selaa Käyttäjätietoja
                            </button>
                        </li>
                        <li>
                            <button onClick={()=> this.setPrimaryComponent(this.COMPONENT_STATES.LOGIN)} >
                                Kirjaudu sisään
                            </button>
                        </li>
                        <li>
                            <button onClick={this.logOutHandler}>Kirjaudu Ulos</button>
                        </li>
                    </ul>
                </nav>
                <div className={this.state.token ? 'block' : 'hidden' } >
                    <hr />
                    <div className="header-info">
                        Kirjauduttu käyttäjänä {this.state.username} - 
                                { this.state.isStudent ? ' Opiskelija ' : '' } <b>|</b>
                                { this.state.isTeacher ? ' Opettaja ' : '' }  <b>|</b>
                                { this.state.isAdmin ? ' Admin ' : '' }
                                {'- '}
                    </div>                            
                </div>         
                <hr />

                //
                // Create content
                //

                <div className={this.state.appState == this.COMPONENT_STATES.SELECTCOURSE ? 'visible' : 'hidden'}>
                    <Courses token={this.state.token} />
                </div>
                <div className={this.state.appState == this.COMPONENT_STATES.LOGIN ? 'visible' : 'hidden'}>
                    <Login logInHandler={this.logInHandler} />
                </div>
                <div className={this.state.appState == this.COMPONENT_STATES.CHANGEPASSWORD ? 'visible' : 'hidden'}>
                    <ChangePassword token={this.state.token} username={this.state.username} isAdmin={this.state.isAdmin}/>
                </div>
                <div className={this.state.appState == this.COMPONENT_STATES.LOGOUT ? 'visible' : 'hidden' }>
                    <button onClick={this.logOutHandler}>Kirjaudu Ulos</button>
                </div>
                <div className={this.state.appState == this.COMPONENT_STATES.GRADES ? 'visible' : 'hidden' }>
                    <Grades token={this.state.token} /> 
                </div>
                <div className={this.state.appState == this.COMPONENT_STATES.USERINFO ? 'visible' : 'hidden' }>
                    <Userinfo token={this.state.token} /> 
                </div>
                <div className={this.state.appState == this.COMPONENT_STATES.RETURNEXERCISES ? 'visible' : 'hidden' }>
                    <Exercises token={this.state.token} /> 
                </div>
                <div className={this.state.appState == this.COMPONENT_STATES.HOME ? 'visible' : 'hidden' }>
                    <h3>Tervetuloa käyttämään StudentCarea. Kirjaudu ensin sisään.</h3>
                </div>
            </div> 

        );
    }
}

export default App;