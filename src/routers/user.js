const express = require('express')
const User = require("../models/user");
const auth = require('../middleware/auth.js')
const router = express.Router()
const multer = require('multer'); // Importing multer library 
const sharp = require('sharp');
const sendEmail = require('../../email/sendMail.js');

// Set up multer configuration for handling image uploads
const upload = multer({
    // Limit the file size to 1MB (1 * 10^6 bytes)
    limits: {
        fileSize: 1000000 // 1MB max file size
    },

    // Filter to allow only image files (jpg, jpeg, png)
    fileFilter(req, file, cb) {
        // Check if the file extension is one of the allowed types
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            // If not an image, reject the file with a custom error message
            cb(new Error('Please provide Image'));
        } else {
            // If the file is valid, accept it
            cb(undefined, true);
        }
    }
});


router.post('/', async (req, res) => {
    const user = new User(req.body)
    try{
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/login', async(req,res) => {
    try {
        const user = await User.findbyCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (e) {
        res.status(400).send(e.message)
    }
})
//bokijchuk.v@gmail.com
router.post('/signup', async(req, res) => {
    try {
        const user = await new User(req.body)
        const token = await user.generateAuthToken()
        res.send({ user, token })
        const subject = `Dear ${user.name}, you've successfully signed up`
        const html = `<p>Welcome to our Node App ${user.name}</p>`
        await sendEmail(user.email, subject, html);
    } catch (e) {
        res.status(400).send(e.message)
    }
})

router.post('/logoutAll', auth, async(req, res) => {
    try {
        req.user.tokens  = [];
        await req.user.save()
        res.status(200).send()
    } catch (e) {
        res.status(500).send({error: 'Error of logging out all devices!'})
    }
})

router.post('/logout', auth , async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save();
        res.send()
    } catch(e) {
        res.status(500).send();
    }
})

// Reading all users from the model
router.get('/me', auth, async (req, res) => {
    res.send(req.user)
})

// Reading one user from the model by id
// router.get('/:id', async (req, res) => {
//     const _id = req.params.id;
//     try {
//         const user = await User.findById(_id)
//             if(!user) {
//                 return res.status(404).send();
//             }
//             res.status(200).send(user);
//     } catch (e) {
//         res.status(500).send();
//     }
//     console.log(req.params)
// })

router.patch('/me', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates!'})
    }
    try {
        
        if(!req.user){
            return res.status(404).send()
        }
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })

        if (updates.includes('password')) {
            req.user.markModified('password');
        }
        await req.user.save();
        
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/me', auth, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user._id)
        res.send({ message: 'User deleted' })
    } catch (e) {
        console.error('Delete user error:', e)
        res.status(500).send({ error: 'Internal server error' })
    }
})

// Using multer middleware , where single('avatar') is the file name created in Postman as key
router.post('/me/avatar', auth, upload.single('avatar'), async(req,res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.status(200).send({message: 'Photo is uploaded'})
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

router.delete('/me/avatar', auth, async(req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.status(200).send({message: 'Photo is deleted!'})
}, (error, req, res, next) => {
    req.status(400).send({error: error.message})
})

router.get('/:id/avatar', async(req,res) => {
    try {
        const user = await User.findById(req.params.id);

        if(!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (error) {
        res.status(400).send()
    }
})

router.post('/:id/sendEmail', async(req,res) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user) {
            res.status(400).send(error.message);
        }
        const subject = `Dear ${user.name}, you've successfully signed up`
        const html = `<p>Welcome to our Node App ${user.name}</p>`
        await sendEmail(user.email, subject, html);
        res.status(200).send({message: 'Email has been send !'})
    } catch (e) {
        res.status(400).send(e.message)
    }
})
module.exports = router