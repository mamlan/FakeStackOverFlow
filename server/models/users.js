const mongoose = require('mongoose');
const {Schema, model}= mongoose;

const userSchema = new Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    admin: {
        type: Boolean, 
        default: false
    },
    reputation: {
        type: Number, 
        default: 0
    },
    joined: {
        type: Date, 
        default: new Date()
    },
    tags:{
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'tagsSchema'
        }], 
    },
    // tagsUsed:{
    //     type: [{
    //         type: Schema.Types.ObjectId,
    //         ref: 'tagsSchema'
    //     }], 
    // },
    questions:{
            type: [{
            type: Schema.Types.ObjectId,
            ref: 'questionsSchema'
        }], 
    },
    answers:{
        type: [{
        type: Schema.Types.ObjectId,
        ref: 'answerSchema'
    }], 
},


});

userSchema.virtual('url').get(function(){
    return '/posts/user/' + this._id;
});


module.exports = model('User', userSchema);