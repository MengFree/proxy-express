const roles = require('./role')
const users = require('./user')

module.exports = (router) => {
    roles.concat(users).forEach((role) => {
        console.log('load', role.url)
        router[role.type](role.url, (req, res) => {
            res.json(role.response(req))
        })
    })

    return router
}