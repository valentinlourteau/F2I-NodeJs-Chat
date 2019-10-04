const express = require('express')
const chat = express()
const helmet = require('helmet')
const jwt = require('jsonwebtoken')

const { server: { port }, jwtSecret } = require('./config')
const { decodeJWT } = require('./middlewares')

const server = require('http').createServer(chat)
const io = require('socket.io')(server)

//Middleware utilisé pour les fausses routes
const deadEnd = (req, res) => {
    res.sendFile(`${__dirname}/html/404.html`)
}

chat.use(helmet())

io.use(function (socket, next) {
    if (socket.handshake.query && socket.handshake.query.token) {
        jwt.verify(socket.handshake.query.token, jwtSecret, function (err, decoded) {
            if (err) return next(new Error('Authentication error'));
            socket.clientName = decoded.name;
            next();
        });
    } else {
        next(new Error('Authentication error'));
    }
})
.on('connection', socket => {

    socket.emit('chat', {
        from: 'Serveur',
        msg: 'Bienvenue sur le chat'
    })

    socket.broadcast.emit('chat', {
        from: 'Serveur',
        msg: `${socket.clientName} vient de se connecter !`
    })

    socket.on('chat', data => {
        const { msg, token } = data

        console.log(token);


        jwt.verify(token, jwtSecret, (err, decodedToken) => {

            if (err) {
                socket.disconnect(true);
            } else {
                socket.broadcast.emit('chat', {
                    from: socket.clientName,
                    msg
                })
                socket.emit('chat', {
                    from: socket.clientName + " (moi)",
                    msg
                })
            }
        })

    })
    socket.on('disconnect', () => {
        socket.broadcast.emit('chat', {
            from: 'Serveur',
            msg: `${socket.clientName} vient de se déconnecter !`
        })
    })
})

chat.get('/401', (req, res) => {
    res.sendFile(`${__dirname}/html/401.html`)
})
chat.get('/', (req, res) => {
    console.log('ça')
    res.sendFile(`${__dirname}/html/chat.html`)
})
chat.get('/signin', (req, res) => {
    res.sendFile(`${__dirname}/html/signin.html`)
})
chat.get('/signup', (req, res) => {
    res.sendFile(`${__dirname}/html/signup.html`)
})
chat.get('/admin', (req, res) => {
    res.sendFile(`${__dirname}/html/backoffice_admin_lists.html`)
})
chat.get('/admin/:_id', (req, res) => {
    res.sendFile(`${__dirname}/html/backoffice_admin_edit_user.html`)
})


chat.get('*', deadEnd)
chat.post('*', deadEnd)
chat.put('*', deadEnd)
chat.delete('*', deadEnd)

server.listen(port.chat, () => console.log(`Chat lancé sur le port ${port.chat}`))