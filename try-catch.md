# Transformer une callback en promesse

En **ES5**, l’asynchronicité était traitée avec les fonctions **callbacks**. Mais trop de *callbacks* qui font appel à des *callbacks* qui font appel à des *callbacks* font basculer notre code dans le *callback hell* (“l’enfer de la *callback*”).

Les promesses font partie d’**ES6** et permettent parfois d’écrire un code plus lisible parce que cela permet de lire du code asynchrone à la manière d’un code syncrhone.

Pour transformer une fonction *callback* en promesse, nous utiliserons `async...await` et `try...catch`. Voici par exemple notre reqête get :
```js
app.get('/user', (req, res) => {
	User.find({}, (err, users) => {
		if (err) {
			return res.status(500).send('Erreur du serveur')
		}
		return res.send(users)
	}).select('_id name')
})
```

Pour transformer la fonction *callback* en promesse, nous la précédons du mot-clé `async`. Dans cette promesse, nous écrivons :
1. une déclaration `try` qui traitera le résultat de la promesse,
1. une déclaration `catch` qui capturera une éventuelle erreur de la promesse.

Dans le `try` :
1. nous initialisons la constante `users` avec le mot-clé `await` indiquant que cette constante sera le résultat de la promesse,
1. le code qui suivra cette constante ne sera exécuté que quand le résultat de la promesse sera parvenu.

```js
app.get('/user', async (req, res) => {
	try {
		const users = await User.find({}).select('_id name')
		return res.send(users)
	} catch (err) {
		return res.status(500).send('Erreur du serveur')
	}
})
```

Voici la totalité de `server.js` après avoir remplacé les fonctions *callbacks* des routes en promesses :
```js
const express = require('express')
const app = express()
const helmet = require('helmet')
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })

const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)
mongoose.connect('<taper-ici-l-adresse-et-le-mot-de-passe-de-la-base-de-données>', {useNewUrlParser: true})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'ERROR: CANNOT CONNECT TO MONGO-DB'))
db.once('open', () => {
	console.log('SUCCESS: CONNECTED TO MONGO-DB')
})

const User = require('./models/user')

app.use(helmet())
app.use(express.static('public'))

app.post('/signup', urlencodedParser, async (req, res) => {
	const { name, password } = req.body
	const newUser = new User({ name, password })
	try {
		const existingUser = await User.findOne({ name })
		if (existingUser) {
			return res.status(400).send(`Le nom ${existingUser.name} est déjà utilisé`)
		}
	} catch (err) {
		return res.status(500).send('Erreur du serveur')
	}
	try {
		const savedUser = await newUser.save()
		res.status(201).send(`${savedUser.name} enregistré avec succès avec l’ID ${savedUser._id} !`)
	} catch (err) {
		return res.status(500).send('Erreur du serveur')
	}
})

app.get('/user', async (req, res) => {
	try {
		const users = await User.find({}).select('_id name')
		return res.send(users)
	} catch (err) {
		return res.status(500).send('Erreur du serveur')
	}
})

app.get('/user/:_id', async (req, res) => {
	const { _id } = req.params
	try {
		const user = await User.findById(_id).select('_id name created')
		return res.send(user)
	} catch (err) {
		console.log(err)
		return res.status(500).send('Erreur du serveur')
	}
})

app.put('/user/:_id', urlencodedParser, async (req, res) => {
	const { _id } = req.params
	const { name, password } = req.body
	try {
		const user = await User.findByIdAndUpdate(_id,  { $set: { name, password } }, { new: true })
		if (!user)  {
			return res.status(404).send(`Il n’y a pas d’utilisateur ${_id}`)
		}
		return res.send(`Utilisateur ${user._id} modifié`)
	} catch (err) {
		return res.status(500).send('Erreur du serveur')
	}
})

app.delete('/user/:_id', async (req, res) => {
	const { _id } = req.params
	try {
		const user = await User.findByIdAndDelete(_id)
		if (!user) {
			return res.status(404).send(`Il n’y a pas d’utilisateur ${_id}`)
		}
		return res.send(`L’utilisateur ${user._id} a bien été supprimé`)
	} catch (err) {
		return res.status(500).send('Erreur du serveur')
	}
})

app.get('*', (req, res) => {
	res.status(404).send('Cette page n’existe pas !')
})

app.listen(3000, () => console.log('Serveur lancé sur le port 3000'))
```