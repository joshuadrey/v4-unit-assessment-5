const bcrypt = require('bcryptjs')

module.exports = {
    register: async (req, res) => {
        const db = req.app.get('db')
        const { username, password } = req.body
        const profile_pic = `https://robohash.org/${username}.png`
        console.log(req.body)
        const [existingUser] = await db.user.check_username(username)
        if (existingUser) {
            return res.status(420).send('Username Unavailable')
        }
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)
        const [user] = await db.user.create_user(username, profile_pic, hash)
        delete user.password
        req.session.user = user
        console.log(req.session.user)
        return res.status(200).send(req.session.user)
    },
    login: async (req, res) => {
        const db = req.app.get('db')
        const { username, password } = req.body
        const [user] = await db.user.check_username(username)
        console.log(user)
        if (!user) {
            return res.status(401).send('User not found. Try Again or Create an Account.')
        }
        const isAuthenticated = bcrypt.compareSync(password, user.password)
        if (!isAuthenticated) {
            return res.status(403).send('Incorrect Password')
        }
        delete user.password
        req.session.user = user
        return res.status(200).send(req.session.user)
    },
    logout: (req, res) => {
        req.session.destroy()
        return res.sendStatus(200)
    },
    getUser: (req, res) => {
        if (!req.session.user) {
            return res.status(401).send('User Not Found')
        }
        return res.status(200).send(req.session.user)
    }

}