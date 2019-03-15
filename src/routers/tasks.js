const express = require('express')
const Task = require('../models/task')
const router = new express.Router()

// creates a new task in the database
router.post('/tasks', async (req, res)=>{
    const task = new Task(req.body)

    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }

})

// fetches all the tasks in the database
router.get('/tasks', async (req, res)=>{

    try {
        const tasks = await Task.find({})
        res.status(201).send(tasks)
    } catch (error) {
        res.status(400).send(error)
    }
})

// gets the task based on the id from the database
router.get('/tasks/:id', async (req, res)=>{
    const id = req.params.id

    try {
        const task = await Task.findById(id)
        if (!task) {
            return res.status(404).send()
        }

        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

// updates a task based on the id
router.patch('/tasks/:id', async (req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const validUpdates = ['complete', 'description']
    const isValidUpdate = updates.every((update) => validUpdates.includes(update))

    if(!isValidUpdate) {
        return res.status(400).send({error: "Not a valid method"})
    }
    try {
        const tasks = await Task.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true});
        if(!tasks) {
            return res.status(404).send()
        }
        res.status(201).send(tasks)
    } catch (error) {
        res.status(400).send(error)
    }
})

// deltes a task based on the id
router.delete('/tasks/:id', async (req, res)=>{
    const _id = req.params.id

    try {
        const task = await Task.findByIdAndDelete(_id)
        if(!task) {
            return res.status(404).send({error: "task not found with the id"})
        } 
        res.status(201).send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router