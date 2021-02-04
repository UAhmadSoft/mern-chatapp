const express = require('express');
const app = express();
const port = 5000;
const middleware = require('./middleware')
const path = require('path')
const session = require('express-session')
const bodyParser = require("body-parser")
const HashMap = require('hashmap')
const mongoose = require('./database')
var MongoDBStore = require('connect-mongodb-session')(session);
const cors = require('cors')

var map = new HashMap();

const config = {
    origin: 'https://inspiring-poitras-e77f4e.netlify.app',
    preflightContinue: true,
    credentials: true,
};
app.use(cors(config))

const server = app.listen(process.env.PORT || 5000, () => console.log("Server listening on port " + port));
const io = require('socket.io')(server, { pingTimeout: 25000, wsEngine: 'ws' });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "/client/build")));

var store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'mySessions'
});

app.set('trust proxy', 1)
app.use(session({
    key: "userId",
    secret: 'potatoe chips',
    resave: true,
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + (30 * 86400 * 1000),
        httpOnly: true
    },
    store: store
}))

// Routes
const loginRoute = require('./routes/loginRoutes');
const registerRoute = require('./routes/registerRoutes');
const logoutRoute = require('./routes/logoutRoutes');


// Api routes
const usersApiRoute = require('./routes/api/users');
const chatsApiRoute = require('./routes/api/chats');
const messagesApiRoute = require('./routes/api/messages')
const notificationsApiRoute = require('./routes/api/notifications')


// Assign socket object to every request
app.use(function (req, res, next) {
    req.io = io;
    req.onlineUsers = map;
    next();
});

app.use("/login", loginRoute);
app.use("/register", registerRoute);
app.use("/logout", logoutRoute);

app.use("/api/users", usersApiRoute);
app.use("/api/chats", chatsApiRoute);
app.use('/api/messages', messagesApiRoute)
app.use('/api/notifications', notificationsApiRoute)


app.get("/", middleware.requireLogin, (req, res, next) => {

    let payload = {
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
    }

    res.status(200).json(payload)
})


io.on('connection', (socket) => {
    socket.on('setup', (userData) => {
        map.set(socket.id, userData._id);
        io.sockets.emit('online', map);
        socket.emit('connected', map);
        socket.join(userData._id);
    })

    socket.on('join room', room => {
        socket.leave(room);
        socket.join(room)
    })

    socket.on('typing', room => socket.to(room).emit("typing"))
    socket.on('stop typing', room => socket.to(room).emit('stop typing'))
    socket.on('notification received', room => socket.to(room).emit('notification received'))

    socket.on('disconnect', function () {
        map.delete(socket.id);
        io.sockets.emit('offline', map);
    });
})


