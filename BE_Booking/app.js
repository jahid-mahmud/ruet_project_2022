const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const cors = require('cors');
const { Error } = require('./models/errorModel');
const { User } = require('./models/user.model');
const { OPTION } = require('./models/optionModel');
require('dotenv/config');
var http = require('http');
const { REQUEST } = require('./models/requestModel');
const server = http.createServer(app);

const api = process.env.API_URL;
const ENV = process.env


app.use(cors());
app.options('*', cors())

//middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));



app.post('/signup', async (req, res) => {
    var user = await User.findOne({ "email": req.body.email })
    if (!user) {
        const user = new User({
            email: req.body.email,
            password: req.body.password,
            role: 'appuser'
        })
        user.save().then((createdError => {
            res.status(201).json(createdError)
        })).catch((err) => {
            res.status(500).json({
                error: err,
                success: false
            })
        })
    }
    else {
        res.status(500).json({
            error: 'Email already exists',
            success: false
        })
    }


})

app.post('/login', async (req, res) => {
    var user = await User.findOne({ "email": req.body.email })
    if (user && user.password === req.body.password) {
        res.status(201).json(user)
    }
    else {
        res.status(500).json({
            error: 'Wrong elami or password',
            success: false
        })
    }

})

app.post('/options', async (req, res) => {
    const option = new OPTION({
        event: req.body.event,
        rating: req.body.rating
    })
    option.save().then((createdOption => {
        res.status(201).json(createdOption)
    })).catch((err) => {
        res.status(500).json({
            error: err,
            success: false
        })
    })

})

app.get('/options', async (req, res) => {
    let options = await OPTION.find()
    if (options.length) {
        res.status(201).json(options)
    }
    else {
        res.status(500).json({
            error: 'NOT_FOUND',
            success: false
        })
    }

})

app.post('/request', async (req, res) => {
    let body = req.body
    const request = new REQUEST({
        email: body.user.email,
        date: body.date,
        event: body.event,
        username: body.username,
        reference: body.reference,
        department: body.department,
        requeststatus: false,
        id: body.id
    })
    request.save().then((createdrequest => {
        res.status(201).json(createdrequest)
    })).catch((err) => {
        res.status(500).json({
            error: err,
            success: false
        })
    })

})

app.post('/get/request', async (req, res) => {
    if (req.body.role === 'admin') {
        let requests = await REQUEST.find()
        if (requests.length) {
            res.status(201).json(requests)
        }
        else {
            res.status(500).json({
                error: 'NOT_FOUND',
                success: false
            })
        }
    }
    if (req.body.role === 'appuser') {
        console.log(req.body)
        let requests = await REQUEST.find({ "email": req.body.email })
        if (requests.length) {
            res.status(201).json(requests)
        }
        else {
            res.status(500).json({
                error: 'NOT_FOUND',
                success: false
            })
        }
    }
})

app.post('/update/request', async (req, res) => {
    const filter = { "id": req.body.id };
    const update = { requeststatus: req.body.requeststatus };
    let doc = await REQUEST.findOneAndUpdate(filter, update, {
        returnOriginal: false
    });
    
    const query = {
        date: {
            $eq: new Date(doc.date)
        }
    }
    var createdReqs = await REQUEST.find(query).sort({ date:'desc' })
    let acceptedReq = []
    let notAcceptedReqs = []
    for(let i = 0;i<createdReqs.length;i++) {
        console.log(createdReqs[i].requeststatus)
        if(createdReqs[i].requeststatus) {
            acceptedReq.push(createdReqs[i]['email'])
        }
        else if(!createdReqs[i].requeststatus) {  
            notAcceptedReqs.push(createdReqs[i]['email'])
        }
    }
    console.log("accptd notaccptd",acceptedReq,notAcceptedReqs)
    if(acceptedReq.length) {
        sendSuccessMail(acceptedReq)
    }
    if(notAcceptedReqs.length) {
        sendnotSuccessMail(acceptedReq)
    }
    
    if (doc) {
        res.status(201).json('ok')
    }
})




app.get('/errors', async (req, res) => {
    let reqQuery = req.query
    let query = {}

    var dateFilter = new Date();
    if (Object.keys(reqQuery).length === 0) {
        dateFilter.setDate(dateFilter.getDate() - 1);
        query = {
            createDate: {
                $gte: new Date(dateFilter)
            }
        }
    }
    else {
        dateFilter.setDate(dateFilter.getDate() - 7);
        query = {
            createDate: {
                $gte: new Date(dateFilter)
            }
        }
        if (reqQuery.namespace) {
            query.namespace = { "$regex": reqQuery.namespace, "$options": "i" }
            delete reqQuery.namespace
        }
        Object.keys(reqQuery).forEach(k => {
            if (reqQuery[k]) {
                query[k] = reqQuery[k];
            }
        });

    }
    var createdErrors = await Error.find(query).sort({ createDate: 'desc' })
    if (createdErrors.length) {
        res.status(201).json(createdErrors)
    }
    else {
        res.status(500).json({
            error: 'NOT_FOUND',
            success: false
        })
    }

})


const sendMail = (error) => {
    var recepents = process.env.TO.split(' ')
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: ENV.EMAIL_ADDRESS,
            pass: ENV.PASSWORD
        }
    });

    var mailOptions = {
        from: ENV.EMAIL_ADDRESS,
        to: recepents,
        subject: 'Kubernetes Alert: ' + error.namespace,
        html:
            '<p>Podname: ' + error.name + '</p>'
            + '<p>Message: ' + error.message + '</p>'
            + '<p>Reason: ' + error.reason + '</p>'
            + '<p>Node: ' + error.source.host + '</p>'
            + '<p>Time: ' + error.time + '</p>'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

sendSuccessMail = (rcp) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: ENV.EMAIL_ADDRESS,
            pass: ENV.PASSWORD
        }
    });

    var mailOptions = {
        from: ENV.EMAIL_ADDRESS,
        to: rcp,
        subject: 'Your booking request has been confirmed',
        html:''
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
sendnotSuccessMail = (rcp) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: ENV.EMAIL_ADDRESS,
            pass: ENV.PASSWORD
        }
    });

    var mailOptions = {
        from: ENV.EMAIL_ADDRESS,
        to: rcp,
        subject: 'Your booking request has been rejected',
        html:''
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}



//Database
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'eshop-database'
})
    .then(() => {
        console.log('Database Connection is ready...')
    })
    .catch((err) => {
        console.log(err);
    })

server.listen(ENV.PORT, () => {

    console.log('server is running http://localhost:80');
})