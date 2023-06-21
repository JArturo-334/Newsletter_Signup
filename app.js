const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
require('dotenv').config();

const apiKey = process.env.API_KEY;
const audience = process.env.AUDIENCE_ID;
const mailDC = process.env.MAIL_DC;

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended : true}));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/signup.html');
});

app.post('/', function(req, res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.Email;

    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = 'https://'+mailDC+'.api.mailchimp.com/3.0/lists/'+audience;

    const options = {
        method: 'POST',
        auth: apiKey
    }

    const request = https.request(url, options, function(response){

        if (response.statusCode === 200){
            res.sendFile(__dirname + '/success.html');
        }
        else{
            res.sendFile(__dirname + '/failure.html');
        }

        response.on('data', function(data){
            console.log(JSON.parse(data));
        })
    });

    request.write(jsonData);
    request.end();
});


app.post('/failure', function(req, res){
    res.redirect('/');
});

app.post('/success', function(req, res){
    res.redirect('/');
});

app.listen(process.env.PORT || 3000, function(){
    console.log('Server started at port 3000');
});