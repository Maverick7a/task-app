require('../src/db/mongoose');
const User = require('../src/models/user');

// "67f0483f076b935cd2d8196b"

// User.findByIdAndUpdate("67f0483f076b935cd2d8196b", {age: 31}).then((user) => {
//     console.log(user)
//     return User.countDocuments({age: 31})
// }).then((user1) => {
//     console.log(user1)
// }).catch((e) => {
//     console.log(e)
// })

const updateAgeAndCount = async(id, age) => {
    const user = await User.findByIdAndUpdate(id, {age})
    const count = await User.countDocuments({age})
    return count
}

updateAgeAndCount('67f0483f076b935cd2d8196b', 2).then((count) =>{
    console.log(count)
}).catch((e) =>{
    console.log(e)
})