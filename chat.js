const express = require('express')
const chat = express()
const helmet = require('helmet')

const { server: { port } } = require('./config')

const server = require('http').createServer(chat)
const io = require('socket.io')(server)

//Middleware utilisé pour les fausses routes
const deadEnd = (req, res) => {
    res.sendFile(`${__dirname}/html/404.html`)
}

chat.use(helmet())

io.on('connection', socket => {
    socket.emit('chat', {
        from: 'Serveur',
        msg: 'Bienvenue sur le chat'
    })
    socket.broadcast.emit('chat', {
        from: 'Serveur',
        msg: 'Un nouvel utilisateur est connecté'
    })
    socket.on('chat', data => {
        const msg = data
        socket.broadcast.emit('chat', {
            from: 'Un autre',
            msg
        })
        socket.emit('chat', {
            from: 'Moi',
            msg
        })
    })
    socket.on('disconnect', () => {
        socket.broadcast.emit('chat', {
            from: 'Serveur',
            msg: 'L’autre s’est déconnecté'
        })
    })
})

/* chat.get('/', decodeJWT, (req, res) => { */
chat.get('/', (req, res) => {
    /*
        if(role != 'member' || role != 'admin') {
            return res.sendFile(`${__dirname}/html/404.html`)
        }
    */
    res.sendFile(`${__dirname}/html/chat.html`)
})
chat.get('/signin', (req, res) => {
    res.sendFile(`${__dirname}/html/signin.html`)
})
chat.get('/signup', (req, res) => {
    res.sendFile(`${__dirname}/html/signup.html`)
})
chat.get('/admin', (req, res) => {
    /* if (role != 'admin') {
        return res.sendFile(`${__dirname}/html/404.html`)
    } */
    res.sendFile(`${__dirname}/html/users_lists.html`)
})
chat.get('*', deadEnd)
chat.post('*', deadEnd)
chat.put('*', deadEnd)
chat.delete('*', deadEnd)

server.listen(port.chat, () => console.log(`Chat lancé sur le port ${port.chat}`))