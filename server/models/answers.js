


// Answer Document Schema
const mongoose = require('mongoose')
const {Schema, model}= mongoose;




const answerSchema= new Schema({
   text: {
       type: String,
       required: true,
   },
   ans_by:{
       type: String,
       required: true,
   },
   ans_date_time:{
       type: Date,
       default: Date.now
   },
   voteCount:{
       type: Number,
       default: 0,
   },
   comments:
       {
       type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
      
       }
   ,
   votes:[{
       user: { type: Schema.Types.ObjectId, ref: 'User' },
   }],
});


answerSchema.virtual('url').get(()=>{
   return `posts/answer/${this._id}`
})




module.exports= model('Answer', answerSchema)