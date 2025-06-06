const express = require('express')
const Task = require("../models/task");
const router = express.Router()
const auth = require("../middleware/auth");

router.post('/',auth, async (req, res) => {
    // const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})



// Reading all tasks from the model
router.get('/',auth ,  async (req,res) => {
    // parseInt makes string into integer
    const limit = parseInt(req.query.limit) || 0;
    try {
        const match = {}

        if (req.query.completed) {
            match.completness = req.query.completed === 'true';
        }

        const tasks = await Task.find({owner: req.user._id, ...match}).limit(limit)
        res.status(200).send(tasks)
    } catch(e) {
        res.status(400).send(e)
    }
    })

// Reading one task from the model by id
router.get('/:id', auth ,async (req,res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findOne({_id, owner: req.user._id})
            if(!task) {
                res.status(404).send()
            }
            res.status(200).send(task)
    } catch(e) {
        res.status(500).send()
    }
})

router.patch('/:id', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const validProperties = ['name', 'processor', 'description', 'completness']
    const isValidProperties = updates.every((update) => validProperties.includes(update))

    
    if (!isValidProperties) {
        return res.status(400).send({error: 'Invalid updates!'})
    }

    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id});

        if(!task){
            return res.status(404).send()
        }

        updates.forEach((update) => {
            task[update] = req.body[update]
        })

        if(updates.includes('processor')){
            task.markModified('processor')
        }
        await task.save();

        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})


router.delete('/:id',auth,  async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})

        if(!task) {
            return res.status(404).send()
        }

        res.status(200).send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router