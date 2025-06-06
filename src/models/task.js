const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');

const taskSchema = new mongoose.Schema({
    name: {
        type: String
    },
    processor: {
        type: String
    },
    description: {
        type: String, 
        required: true,
        trim: true
    },
    completness: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},
{
    timestamps: true
})

taskSchema.pre('save', async function (next) {
    const task = this;

    if(task.isModified('processor')) {
        task.processor = await bcrypt.hash(task.processor, 8);
    }

    next();
})
const Task = mongoose.model('Task', taskSchema);

module.exports = Task 