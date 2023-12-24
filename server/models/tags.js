// Tag Document Schema

const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const tagsSchema= new Schema({
    name: {
        type: String,
        required: true,
    },
    usedBy: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
})
const Tag =mongoose.model('Tag', tagsSchema)
module.exports= Tag

// tagsSchema.virtual('url').get(()=>{
//     return `posts/tag/${this._id}`
// })



