const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mailer = require('nodemailer');
const sql = require('mssql');

const config = {
    server: '169.254.65.190:\\WHATSUP',
    database: "Store",
    user: 'SOFTSERVE\\mkons',
    password: '',
    port: '59411'
};

let connetcToDB = () => {
    sql.connect(config, err => {
        if (err) {
            console.log(err);
        } else {
            new sql.Request().query('SELECT* FROM phones', (err, result) => {
                console.dir(result);
            });
        }
    });
};

let urlencodedParser = bodyParser.urlencoded({extended: false});

let sendEmail = (to) => {
    mailer.createTestAccount((err, account) => {
        let transporter = mailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'mikykonst@gmail.com',
                pass: ''
            }
        });
        let mailOptions = {
            from: '"Fred Foo 👻" <mikykonst@gmail.com>', // sender address
            to: to, // list of receivers
            subject: 'Hello ✔', // Subject line
            text: 'Hello world?', // plain text body
            html: '<b>Hello world?</b>' // html body
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
    });

};


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
    connetcToDB();
});

app.post('/about', urlencodedParser, (req, res) => {
    sendEmail(req.body.mail);
    res.sendFile(__dirname + '/about.html');
});

app.listen(3000);