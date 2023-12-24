// Question Document Schema

const mongoose = require('mongoose')
const {Schema, model}= mongoose;

const questionsSchema= new Schema({
    title:{
    type: String, 
    required: true,
    maxLength: 100,
    
    },
    text:{
        type: String, 
        required: true,
    },
    summary:{
        type: String,
        required: true,
    },
    tags:{
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'tagsSchema'
        }], 
        required: true,

    },
    answers:{
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'answerSchema'
        }],
    },
    asked_by: {
        type: String,
        required: true,
        default: 'Anonymous'
    },
    ask_date_time: {
        type: Date,
        default: Date.now, //should this be changed
    },
    views:{
        type: Number,
        default: 0,
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    voteCount: {
        type: Number,
        default: 0,
      },
    votes: [{
        user: { type: Schema.Types.ObjectId, ref: 'User' },

    }],


})
questionsSchema.virtual('url').get(()=>{
    return `posts/question/${this._id}`
})
module.exports= model('Question', questionsSchema)
