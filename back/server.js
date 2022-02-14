let advertisements = require('./data.js')
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
const PORT = 8080;
const mongoose = require('mongoose');
const MONGO_URL = "mongodb://localhost:27017/mydatabase";

const AdminBro = require('admin-bro');
const mongooseAdminBro = require('@admin-bro/mongoose');
const expressAdminBro = require('@admin-bro/express');

const webSocketServer = require('websocket').server;
const http = require('http');
const server = http.createServer();
server.listen(8000);
const wsServer = new webSocketServer({
    httpServer: server
});
let screenNumber;
const clients = {};
const getUniqueID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4();
};
wsServer.on('request', function (request) {
    console.log("connected");
    var userID = getUniqueID();
    const connection = request.accept(null, request.origin);
    wsServer.on("close",() => {
        console.log("disconnected")
        const filter = { _id: userID };
        const update = { status: "disconnect", releaseDate: new Date() };
        Client.findByIdAndUpdate(userID,{ status: "disconnect", releaseDate: new Date() }, (err,docs) => {
            if(err){
                console.log(err);
            }else{
                console.log("update");
            }
        });
    })
    connection.on('message', function(message) {(
        screenNumber = JSON.parse(message.utf8Data.toString()).screenNumber);
        console.log('Screen number:',screenNumber,userID);
        insertClient(screenNumber,userID);
    })
});
const run = async (req,res) => {
    await app.listen(PORT, () => {
        console.log(`Listening at port:${PORT}`);
    })
    const connection = await mongoose.connect(MONGO_URL)
    .then(
        async () => {
            //erase db
            const isErase = await mongoose.connection.db.dropDatabase();
            if(!isErase) {throw new Error('Remove collections failed')}
            console.log("DB connected successfully");
            Admin.insertMany(({
                email: 'admin@example.com',
                password: 'lovejs'
            }))   
            insertCommercials();   
    })
    .catch((err) => {
        console.log("DB connection failed");
        console.log(err);
        process.exit(1);
    })
}

const Commercial = mongoose.model('Commercial', mongoose.Schema({
    title: { type: String },
    content: { type: [String] },
    images: { type: [String] },
    template: { type: Number },
    clientList: { type: [Number] },
    durationTime: { type: Number },
    frameTime: {
        startDate: { type: Date },
        endDate:{ type: Date },
        days: { type: [Number] }
    }
}));
const Client = mongoose.model('Client', mongoose.Schema({
    _id: {type: String},
    screenId: {type: Number},
    status: { type: String },
    enrtyDate: { type: Date },
    releaseDate: { type: Date }
}));

const insertCommercials = () => {
    Commercial.insertMany(advertisements)
        .then(()=> console.log("Data inserted"))
        .catch(function(error){
            console.log(error)   
    });
}
const insertClient = (id,userID) => {
    Client.insertMany({
            _id: userID,
            screenId: id,
            status: "connect",
            enrtyDate: new Date()
        }, (err) => {
        if (err) throw err;
    })
}
app.get('/clients/:id', (req, res) => {
    return Commercial.find({
        clientList: Number(req.params.id%3 +1)
    }).then(docs => {
        res.send(docs)
    })
});

const Admin = mongoose.model('Admin', mongoose.Schema({
    email: { type: String },
    password: { type: String },
  }));
  
  AdminBro.registerAdapter(mongooseAdminBro);
  const AdminBroOptions = {
    resources: [Client, Commercial, {resource: Admin, options:{actions: {bulkDelete: {isVisible: false},new: {isVisible:false}, delete: {isVisible:false}}}} ],
    branding: {
        logo: "https://logos.textgiraffe.com/logos/logo-name/Nam-designstyle-summer-m.png",
        companyName: "Commercials"
    }
  }
  
  const adminBro = new AdminBro(AdminBroOptions);

  const router = expressAdminBro.buildAuthenticatedRouter(adminBro, {
    coookieName : 'admin-bro',
    cookiePassword: 'supersecret',
    authenticate: (email,password) => {
        const ADMIN = Admin.find().then(docs => {
            if(email === docs[0].email && password === docs[0].password){
                return { email, password};
            } 
        });
        return ADMIN;
    }
  });
  app.use(adminBro.options.rootPath,router);

run();
