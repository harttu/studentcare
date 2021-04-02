/*

Form element for changing password

TODO:
http://localhost:3000/changepassword change to dynamic

*/


import React from 'react';
import Axios from 'axios';

export default class ChangePassword extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = { 
            username:'',
            oldPassword:'',
            newPassword:'',
            newPasswordRetype:'',
            info:'',
            infoColour:'',
            isAdmin:false
        };

        this.token = '';
        this.username = '';
        this.isAdmin = false;

        this.onChangeNewPassword = this.onChangeNewPassword.bind(this);
        this.onChangeNewPasswordRetype = this.onChangeNewPasswordRetype.bind(this);
        this.onChangeOldPassword = this.onChangeOldPassword.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.sendPasswordsToServer = this.sendPasswordsToServer.bind(this);
    }
    componentWillReceiveProps(props){
        this.isAdmin = props.isAdmin;
        this.token = props.token;
        this.username = props.username;
        this.setState({isAdmin:props.isAdmin})
        console.log("ChangePassword component will receiveprops")
        console.dir(props)
        console.dir(this.state)

    }

    //componentDidUpdate(){  }
    componentDidMount(){    }

    sendPasswordsToServer() {        
        let that = this;
        console.log("SendingData");
        console.dir(this)
            var config = { headers: {'Authorization': "Bearer " + this.token } };
            console.log(config.headers.Authorization);
            var bodyParameters = { 
                username: this.username, 
                oldPassword:this.state.oldPassword,
                newPassword:this.state.newPassword
            }
            Axios.post( 'http://localhost:3000/privileges',bodyParameters,config)
            .then((response) => {
                console.log("Got response")
                console.log(response)
            }).catch((error) => {
                console.log(error)
            }); 
    }
    onChangeOldPassword(e){ this.setState({  oldPassword:e.target.value }); }
    onChangeNewPassword(e){ this.setState({   newPassword:e.target.value }); }
    onChangeNewPasswordRetype(e){ this.setState({ newPasswordRetype:e.target.value }); }
    onChangeUsername(e) { this.setState( { username: e.target.value }); }

    handleChangePassword(e){
        e.preventDefault();

        if( this.state.newPassword !== this.state.newPasswordRetype ) {
            this.setState({info:"New passwords does not match", infoColour:"red-info"})
            return;
        }

        let that = this;
        console.log("SendingData");
        console.dir(this)

        var config = { headers: {'Authorization': "Bearer " + this.token } };
        console.log(config.headers.Authorization);
        var bodyParameters = { 
            username: this.state.username ? this.state.username : this.username, 
            oldPassword:this.state.oldPassword,
            newPassword:this.state.newPassword
        }                                          
        Axios.post( 'http://localhost:3000/changepassword',bodyParameters,config)
        .then((response) => {
            console.log("Got response")
            that.setState(
                { 
                    info:response.data.message, 
                    infoColour: response.status === 200 ? 'green-info' : 'red-info'
                })
            console.log(that)
            console.log(response)
        }).catch((error) => {
            console.log(error)
            that.setState(
                { 
                    info:error.response.data.message, 
                    infoColour: error.response.status === 200 ? 'green-info' : 'red-info'
                })
                
        }); 
    }
    render() { 
            return (
                <form>
                    <div className={ this.state.isAdmin ? 'visible' : 'hidden'  }>
                        <label>Käyttäjänimi:</label>
                        <input type="text" value={this.state.username} onChange={this.onChangeUsername}></input><br />
                    </div>
                    <div className={ this.state.isAdmin ? 'hidden' : 'visible'  }>
                        <label>Vanha salasana:</label>
                        <input type="password" value={this.state.oldPassword} onChange={this.onChangeOldPassword}></input><br />
                    </div>
                    <label>Uusi salasana:</label>
                    <input type="password" value={this.state.newPassword} onChange={this.onChangeNewPassword}></input><br />
                    <label>Salasana uudestaan:</label>
                    <input type="password" value={this.state.newPasswordRetype} onChange={this.onChangeNewPasswordRetype}></input><br />
                    <button disabled={this.state.sendButtonDisabled} onClick={this.handleChangePassword}>Vaihda salasana</button>
                    <div className={this.state.infoColour}>{this.state.info}</div>
                </form>
                );
    }
    
}