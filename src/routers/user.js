const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/authentication')

const router = new express.Router()

// cretas a new user in the database
router.post('/users', async (req, res)=>{
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (error) {
        res.status(400).send(error)
    }
})

// route for user login
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (error) {
        res.status(400).send(error)
    }

})


// returns all the users in the database
router.get('/users/me', auth, async (req, res)=>{
    res.send(req.user)
})

// returns the users with the specific id
router.get('/users/:id', async (req, res)=>{
    const _id = req.params.id

    try {
        const users = await User.findById(_id)
        if(!users) {
            return res.status(404).send()
        }
        res.status(201).send(users)
    } catch (error) {
        res.status(400).send(error)
    }
})

// update the user with the specific id
router.patch('/users/:id', async (req, res)=>{
    const _id = req.params.id
    const update = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'email', 'password']
    const isValidUpdate = update.every((update)=> allowedUpdates.includes(update))

    if(!isValidUpdate) {
        return res.status(400).send({error: 'Invalid Updates!'})
    }
    try {
        const user = await User.findById(_id)
        update.forEach((update)=> user[update] = req.body[update])
        await user.save()

        if(!user) {
            return res.status(404).send()
        }
        res.status(201).send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})

// deletes the user with the specific id
router.delete('/users/:id', async (req, res)=>{
    const _id = req.params.id

    try {
        const user = await User.findByIdAndDelete(_id)
        if(!user) {
            return res.status(404).send()
        }
        res.status(201).send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router