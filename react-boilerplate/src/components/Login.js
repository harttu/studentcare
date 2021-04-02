/*
  Login element

  TODO: Delete debug options


*/


import React from 'react';
import Axios from 'axios';

export default class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            username : '',
            password:'',
            infoText:'',
//            debugModeIsOn:false
        }
  
        this.sendDataToParent = props.logInHandler;
  
        // this will in fact overwrite the existing method by a new one
        this.submitHandler = this.submitHandler.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleDebugModeChange = this.handleDebugModeChange.bind(this);

    }
    handleUsernameChange(e) {
        this.setState(
            {
                username:e.target.value,
                password:this.state.password,
                infoText:"",
                debugModeIsOn:this.state.debugModeIsOn
            })
    }
    handlePasswordChange(e)
    {
        this.setState(
            {
                username:this.state.username,
                password:e.target.value,
                infoText:"",
                debugModeIsOn:this.state.debugModeIsOn
            });
    }
    handleDebugModeChange(e) {
        this.setState(
            {
                username: "mijami",
                password: "mr1234",
                infoText:this.state.infoText,
                debugModeIsOn:e.target.checked
            });
    }
    submitHandler(e){
        e.preventDefault();
        console.log("submitHandler called")

        console.log("New username is "+this.state.username+" and password "+this.state.password+" debugMode "+this.state.debugModeIsOn);
        var that = this; // old trick, TODO rewrite
        Axios.post('http://localhost:3000/login', {password:this.state.password, username:this.state.username} )
            .then((res)=>{
                console.log("LogIn successfull"); 
                // This needs to be done, so that catch is not executed
                try {
                    that.sendDataToParent(res.data.username,res.data.token,res.data.isStudent,res.data.isTeacher,res.data.isAdmin)();                
                }
                catch(err) {
                  //  console.log("Errori")
                  //  console.dir(err);    
                }
            })
            .catch((res) => {  
                console.log("LogIn Failed"); 
                console.dir(res)
                that.setState({username:'',password:'',infoText: "Virhe sisäänkirjautumisessa."})            
            })
            .then((res)=>{
                //console.log("then 2"); console.dir(res)
            })  
    }
    render() {
        return (

            <form>
                <table>
                    <tr>
                        <td>
                            <label>Username</label>
                        </td>
                        <td>
                            <input type="text" value={this.state.username} onChange={this.handleUsernameChange}></input>    
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label>Password</label>
                        </td>
                        <td>
                            <input type="password" value={this.state.password} onChange={this.handlePasswordChange}></input>   
                        </td>
                    </tr>
                    <tr>
                        <td>
                        <label>Debug Mode</label>
                        <button onClick={(e)=>{e.preventDefault();this.setState({username:"eehaju",password:"ey1234"})}}>Debug Student</button>
                        <button onClick={(e)=>{e.preventDefault();this.setState({username:"mijami",password:"mr1234"})}}>Debug Admin</button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <button onClick={this.submitHandler}>Log In</button>
                            {' '}
                            <button onClick={(e)=>{e.preventDefault();alert('HINT: Try every word in a dictionary.')}}>Forgot Password</button>
                        </td>
                    </tr>
                </table>
            </form>
        );

    }
}