var express = require("express");
var fileupload = require("express-fileupload");
var app = express();
var path = require("path");
var mysql2 = require("mysql2");
var bcrypt = require("bcrypt");
var nodemailer = require("nodemailer");

const saltRounds = 10;


// ==========================================================


app.use(express.static("public"));
app.use(express.urlencoded(true));
app.use(fileupload());


// ==========================================================


app.listen(2005, function(){

    console.log("Server Started");    
    
});


// ==========================================================


app.get("/", function(req, resp)
{
    resp.sendFile(__dirname + "/Public/index.html");
})

app.get("/resetPass", (req, resp) => {
    resp.sendFile(__dirname + "/Public/resetPass.html");
})

app.get("/Areas", (req, resp) => {
    resp.sendFile(__dirname + "/Public/allAreas.html");
})

app.get("/Area-Details", (req, resp) => {
    resp.sendFile(__dirname + "/Public/AreaDetails.html");
})

app.get("/Test-Dustbins", (req, resp) => {
    resp.sendFile(__dirname + "/Public/Dustbins.html");
})


// ==========================================================


const config={
    host:"127.0.0.1",
    user:"root",
    password:"@Kunal.SQL2601",
    database:"bin_Control",
    dateStrings: true
}

var mysqldb = mysql2.createConnection(config);

mysqldb.connect(function(err)
{
    
    if(err==null)
        console.log("DB Connected!");
    else
        console.log(err.message);

})


// ==========================================================


var transporter = nodemailer.createTransport
({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "mails.kunalbhatia@gmail.com",
      pass: "tfyl klhz wxjz hhou",
    },
});


var sendMail = async (transporter, mailOptions) => {
    try{
        await transporter.sendMail(mailOptions)
        console.log("Email Sent !");
    }
    catch(error)
    {
        console.log(error);
    }
}


// ==========================================================


app.get("/loginAuth", function(req, resp)
{

    var uEmail = req.query.uEmail;
    var uPass = req.query.uPwd;

    mysqldb.query("select * from Admins where AdmEmail=?", [uEmail], function(err, result)
    {

        if(err == null)
        {

            if(result.length == 1 && result[0].AdmStatus == 1)
            {

                bcrypt.compare(uPass.toString(), result[0].AdmPass, function(errr, passRes)
                {

                    if(errr)
                        resp.send("Some Error !");

                    else if(passRes)
                        resp.send("!yesLogin!");

                    else
                        resp.send("Wrong Password !");
                })

            }
            else if(result.length != 1)
                resp.send("User Account Not Found !");
            else
                resp.send("Your Account is Blocked !");

        }

        else
            resp.send(err);

    })

})


app.get("/frgtPass", (req, resp) => {

    var uEmail = req.query.uEmail;

    mysqldb.query("select * from Admins where AdmEmail=?", [uEmail], (err, result) => {

        if(!err)
        {

            if(result.length==1)
            {

                var mailOptions = {
  
                    from: {
                        name: "Kunal Bhatia",
                        address: "mails.kunalbhatia@gmail.com"
                    },
                    to: uEmail,
                    subject: "Reset Password !",
                    text: "Reset Your Password To Login Again !",
                    html: "<p>Your Temporary Password : " + result[0].AdmPass + "</p><br>Use This To Reset Your Password. <br><a href='/resetPass'>Click Here</a> To Reset Your Password.",
                
                }

                sendMail(transporter, mailOptions);

                resp.send("Email Sent !");

            }

        }

    })

})


app.get("/reset", (req, resp) => {
    
    var uEmail = req.query.uEmail;
    var tPass = req.query.tempPass;
    var nPass = req.query.newPass;
    
    mysqldb.query("select * from Admins where AdmEmail=?", [uEmail], function(err, result)
    {

        if(!err)
        {
            if(result.length == 1)
            {
                if(result[0].AdmPass == tPass)
                {

                    bcrypt.hash(nPass.toString(), saltRounds, function(passerr, hash)
                    {

                        if(!passerr)
                        {
                            mysqldb.query("update Admins set AdmPass=? where AdmEmail=?", [hash, uEmail], (errr) => {
                            
                                if(!err)
                                    resp.send("Password Updated !");
                                else
                                    resp.send(errr);
                                
                            })
                        }
                        else
                            resp.send(passerr);

                    });

                }
                else
                    resp.send("Wrong Temporary Password !");
            }
            else
                resp.send("Invalid User !");
        }
        else
            resp.send(err);


    })
    
})


app.get("/cngPass", (req, resp) => {

    var Email = req.query.Email;
    var cPass = req.query.cPass;
    var nPass = req.query.nPass;


    mysqldb.query("select * from Admins where AdmEmail=?", [Email], function(err, result)
    {

        if(err == null)
        {

            if(result.length == 1)
            {

                bcrypt.compare(cPass.toString(), result[0].AdmPass, function(errr, passRes)
                {

                    if(errr)
                        resp.send("Some Error !");

                    else if(passRes)
                    {

                        bcrypt.hash(nPass.toString(), saltRounds, function(passerr, hash) {
        
                            if(passerr)
                            {
                                console.log(passerr);
                            }
                            else
                            {
                    
                                mysqldb.query("update Admins set AdmPass=? where AdmEmail=?", [hash, Email], function(err)
                                {
                    
                                    if(err == null)
                                        resp.send("Password Updated !");
                                    
                                    else
                                        resp.send(err);
                    
                                })
                            }
                    
                        });

                    }

                    else
                        resp.send("Wrong Password !");
                })

            }

        }

        else
            resp.send(err);

    })

})


// ==========================================================


app.get("/fetchAreas", (req, resp) => {

    var email = req.query.email;

    mysqldb.query("select * from Areas where AdmEmail=?", [email], (err, result) => {
        
        if(!err)
            resp.send(result);
        else
            resp.send(err);

    })

})

app.get("/getWorkerData", (req, resp) => {

    var areaName = req.query.Area;

    mysqldb.query("select * from Workers where WArea=?", [areaName], (err, result) => {

        if(!err)
            resp.send(result);
        else
            resp.send(err);

    })

})

app.get("/getDustBinData", (req, resp) => {

    var area = req.query.area;

    mysqldb.query("select * from Dustbins where DB_Area=?", [area], (err, result) => {

        if(!err)
            resp.send(result);
        else
            resp.send(err);

    })

})

app.get("/getDustBinFilled", (req, resp) => {

    var area = req.query.area;

    mysqldb.query("select * from Dustbins where DB_Area=? and DB_Status=?", [area, "Filled"], (err, result) => {

        if(!err)
            resp.send(result);
        else
            resp.send(err);

    })

})

app.get("/AddNewWorker", (req, resp) => {

    var areaName = req.query.area;
    var Name = req.query.name;
    var number = req.query.number;

    mysqldb.query("insert into Workers values(?, ?, ?, ?, ?, ?)", [Name, areaName, "P", "1", "agent.jpg", number], (err, result) => {

        if(!err)
            resp.send("DONE");
        else
            resp.send(err);

    })

})

// ==========================================================