var express = require('express');
var sqlite3 = require('sqlite3').verbose();
const app = express();
var db = new sqlite3.Database('value4life.db');
const port = 3000;

const bodyParser = require('body-parser');
const jsonwebtoken = require('jsonwebtoken');

const config = { secret: "palipaliaaaapatia" };

// support parsing of application/json type post data
app.use(bodyParser.json());
app.use(express.static('react-boilerplate/dist'))

//support parsing of application/x-www-form-urlencoded post data
//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(exbodyParser());

var cors = require('cors');
app.use(cors());

app.listen(port, () => console.log(`Pyörimässä portissa ${port}`))

let checkToken = ( req,res, next ) => {
    // Capture following headers
    let token = req.headers['x-access-token'] || req.headers['authorization']; 
    // if the token syntax includes word Bearer then remove it
    if( token.startsWith('Bearer ') ) {
        // Remove 'Bearer  ' from the string
        token = token.slice(7,token.length);
    }
    console.log("Verifiyng Token "+token)
  
    // token exists
    if( token ) {
        jsonwebtoken.verify(token, config.secret, (err, decoded) => {
            if( err) {
                console.log("   Token is not valid")
                return res.status(401).json({ success: false, message: 'Token is not valid' });
            }
            else {
                console.log("   Token OK")
                req.decoded = decoded;
                // go to the next app state
                next();
            }
        });
    } // if ( token ) 
    else {
        console.log("Token is not valid");
        return res.status(401).json( {success: false, message: 'Authentication token is not supplied'});
    }
 
} // checkToken
/*
app.get('/', (req,res) => {
   // let indexPath = "/react-boilerplate/dist/";
   // res.sendFile( __dirname + indexPath + "index.html");
    res.send
})
*/
//
// 
app.post('/exercises', checkToken, (req,res) => {
    console.log("/exercises called")
    let username = req.decoded.username;
    var query = 
    "SELECT c.name,c.shortname,ci.instanceId,ci.courseId,ci.gradingRule FROM personnel AS p, coursestudents AS cs, courseinstances AS ci, courses AS c " +
    `WHERE p.username = "${username}" ` +
    "AND p.id = cs.studentId AND cs.instanceId = ci.instanceId AND c.shortName = ci.courseId";

    db.all( query, function(err,rows) {
        if(err) {
            console.log("Error in reading the database")
            console.log(err);
            res.status(500).json({success:false,message:"Internal error."})
        }
        else {
          //  console.dir(rows)
            res.status(200).json({data:rows})
        }
    }) // db.all
}) // app.post()

// Retrieve all student grades based on username  
app.post('/grades', checkToken, (req,res) => {
    console.log("/grades called")

    let username = req.decoded.username;

    var query = "SELECT * FROM personnel AS p, coursegrades AS cg, courseinstances AS ci, courses AS c " +
    "WHERE p.username = \"" + username + "\" " +
    "AND p.id = cg.studentId AND ci.instanceId = cg.instanceId AND c.shortName = ci.courseId ";
    
    db.all( query, function(err,rows) {
        if(err) {
            console.log("Error in reading the database")
            console.log(err);
            res.status(500).json({success:false,message:"Internal error."})
        }
        else {
          //  console.dir(rows)
            res.status(200).json({data:rows})
        }
    }) // db.all
})

//
// Retrieves usernames roles, privileges 
app.post('/privileges', checkToken, (req,res) => {
    let username = req.decoded.username;
    console.log("/privileges called");
    var query = "SELECT DISTINCT username,isTeacher,isAdmin,isStudent FROM personnel " +
                "WHERE username = \"" + username + "\"";
    console.log(query);
    db.all( query, function(err,rows){
        if(err) {
            console.log("Error in reading the database")
            console.log(err);
            res.status(500).json({success:false,message:"Internal error."})
        }
        else {
            res.status(200).json({data:rows})
        }
    }) // db.all
});


app.post('/test', checkToken, (req,res) => {
    console.log("Token ok")
    console.dir(req.decoded)
})


// Helper function for /changepasssword handler
function tryToChangePassword(res,req,username,oldPassword,newPassword,isAdmin) {
    console.log("Got following parameters")
    console.log("username"+username)
    console.log("newPassword"+newPassword)
    console.log("oldPassword"+oldPassword)
    console.log("isAdmin"+isAdmin)
    // Get old password for user
    var query = "SELECT DISTINCT password FROM personnel " +
    "WHERE username = \"" + username + "\"";
    console.log(query);

    db.all( query, function(err,rows){
        if(err) {
            console.log("Error in reading the database")
            console.log(err);
            res.status(500).json({success:false,message:"Internal error."})
        }
        else {
            console.log(rows);
            //let Username = username;
            let correctPassword = rows.length == 1 ? rows[0].password : undefined;
            console.log(correctPassword)
            if ( correctPassword ) {
                console.log("Found the user in database")

                // sends twice
                if (  correctPassword === oldPassword || isAdmin ) {
                    console.log("Passwords match or user is admin")

                    var query = "UPDATE personnel SET password = \""+newPassword+"\""+" WHERE username = \"" + username + "\"";
                    console.log(query);
                    db.all( query, function(err,rows){
                        if(err) {
                            console.log("Error in reading the database")
                            console.log(err);
                            res.status(500).json({success:false,message:"Internal error."})
                        }
                        else {
                            console.log("Password changed")
                            res.json({
                            success: true, 
                            //username:username,
                            message: 'Password changed successfully!',
                            });
                        } //else
                    }); // db.all - second
                }  // if ( correctPassword === oldPassword ) 
                else {
                    console.log("Passwords does not match.")
                    res.status(400).json({ success: false, message: 'Password is not correct.'});
                }
            } // if(correctPassword)
            else {
                console.log("Failed login attempt.")
                res.status(400).json({ success: false, message: 'No user found in the database.' });
            } // else
         } // else
    } ) // db.all
}

//
// User attempts to change password, each user can change their own password but admin any of them
app.post('/changepassword', checkToken, (req,res) => {
    console.log("/changepassword called");
    function validateNewPassword(password){
        let valid = true;
        if( password.length < 2)
            valid = false;
        return valid;
    }
    let usernameSupplier = req.decoded.username;
    let username = req.body.username;
    let oldPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword;

    if( ! validateNewPassword(newPassword) ) {
        console.log("Supplied password does not satisfy the given requirements")
        res.status(400).json({success:false,message:"Supplied password is not good enough."})
        return 0;        
    }

    let isAdmin = false;
    var query = `SELECT isAdmin FROM personnel WHERE username = "${usernameSupplier}"`
    
    db.all( query, function(err,rows){
        if(err) {
            console.log("Error in reading the database")
            console.log(err);
            res.status(500).json({success:false,message:"Internal error."})
        }
        else 
        {
            console.log("query returned")
            console.dir(rows)
            // user is admin
            console.log("Is the user admin?")
            if( rows[0].isAdmin === 1 ) {
                isAdmin = true;
                console.log("Yes")
            }
            else {
                console.log("No")
            }
            tryToChangePassword(res,req,username,oldPassword,newPassword,isAdmin)
        } //else
    }); // db.all
}); // app.post



//
// User logs in 
app.post('/login', (req,res) => {
    let username = req.body.username;
    let givenPassword = req.body.password;
    // For the given username fetch user from DB
    // TODO: now vulnerable to sql injections, replace logic
    console.log("/login called");
    var query = "SELECT DISTINCT password,isStudent,isTeacher,isAdmin FROM personnel " +
                "WHERE username = \"" + username + "\"";
    //console.log(query);
    db.all( query, function(err,rows){
        if(err) {
            console.log("Error in reading the database")
            console.log(err);
            res.status(500).json({success:false,message:"Internal error."})
        }
        else {
            console.log(rows);
            //let Username = username;
            let correctPassword = rows.length == 1 ? rows[0].password : undefined;
            console.log(correctPassword)
            console.log(givenPassword)
            if ( correctPassword ) {
                console.log("Found the user in database")
                if (  correctPassword === givenPassword) {
                    console.log("Passwords match")
                    let token = jsonwebtoken.sign({username: username}, config.secret, { expiresIn: '24h' } );
                    let response = {
                        success: true, 
                        username:username,
                        message: 'Authentication successful!',
                        token: token,
                        isStudent:rows[0].isStudent,
                        isTeacher:rows[0].isTeacher,
                        isAdmin:rows[0].isAdmin

                    }
                    console.log("Sending the following response to client")
                    console.dir(response)
                    res.json(response);
                } // if
                else {
                    console.log("Passwords does not match.")
                    res.status(400).json({ success: false, message: 'Incorrect username or password'});
                }
            } // if (username && password )
            else {
                console.log("Failed login attempt")
                res.status(400).json({ success: false, message: 'Authentication failed! Please check the request' });
            } // else
         } // else
    //     console.log("lähetän")
      //   res.json({ success: false, message: 'Authentication failed! Please check the request' });
    } ) // db.all
}); // app.post

app.post('/courses', checkToken, (req,res) => {
    console.log("/courses called")
    let username = req.decoded.username;
   // let username = res.data.username;
    var query = "SELECT * FROM courses where shortName NOT IN " + 
    "(SELECT courseId FROM personnel AS p, coursestudents AS cs, courseinstances AS ci " + 
    "WHERE p.username = \"" + username + "\" " +
    "AND p.id = cs.studentId " + 
    "AND cs.instanceId = ci.instanceId )";
    console.log(query);
    db.all( query, function(err,rows){
        if(err) { 
            console.log("Error in reading the database")
            console.log(err);
            res.status(500).json({success:false,message:"Internal error."})
        }
        else {
//            console.log("Sending")
//            console.dir(rows)
            res.status(200).json({data : rows})
        }
    }) // db.all   
});

//
// Retrieves user personal info by username 
app.post('/userinfo', checkToken, (req,res) => {
    console.log("/userinfo called")
    let username = req.decoded.username;
   // let username = res.data.username;
    var query = `SELECT pd.firstNames,pd.familyName,pd.program,pd.username ` +
                `FROM personnel AS pd, personnel AS pa ` +
                `WHERE pa.username = "${username}" AND pa.isAdmin = 1` 
    console.log(query);
    db.all( query, function(err,rows){
        if(err) { 
            console.log("Error in reading the database")
            console.log(err);
            res.status(500).json({success:false,message:"Internal error."})
        }
        else {
//            console.log("Lähetän")
//            console.dir(rows)
            res.status(200).json({data : rows})
        }
    }) // db.all   
});

//
// Add user to a course
app.post('/courses/join', checkToken, (req,res) => {
    console.log("/courses/join called")
    let username = req.decoded.username;
    let courseId = req.body.courseId;
    //let latestInstance = `SELECT instanceid,courseId FROM courseinstances WHERE courseId = "${courseId}"`;
    let latestInstance = `SELECT instanceid,courseid,id FROM courseinstances AS ci, personnel AS p ` +  
                        `WHERE courseId = "${courseId}" AND username = "${username}"`;
    console.log("Executing query "+latestInstance)

    db.all( latestInstance, function(err,rows){
        if(err) { 
            console.log("Error in reading the database")
            console.log(err);
            res.status(500).json({success:false,message:"Internal error."})
        }
        else {
            console.log("Sending")
            console.dir(rows)
            let latestInstance = rows[rows.length - 1];
            console.log(latestInstance)
            let code = latestInstance.instanceid;
            let id = latestInstance.id;
            let joinToInstance = `INSERT INTO coursestudents (studentId,instanceId) VALUES ("${id}","${code}")`;
            console.log("Executing query:"+joinToInstance)

            db.all( joinToInstance, function(err,rows) {
                if(err) {
                    console.log("Error in reading the database")
                    console.log(err);
                    res.status(500).json({success:false,message:"Internal error."})        
                }
                else {
                    res.status(200).json({data : rows})
                }
            });
        }
    }) // db.all   

});

