const mongoose = require('mongoose');


const commentSchema = new mongoose.Schema({
   text: {type: String},
   ans_By: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
   upVotesComments: [
       {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
       },
     ],
   date: {type: Date, default:Date.now},
  
});


commentSchema.virtual('url').get(function(){
   return '/posts/comments/' + this._id;
});




module.exports = mongoose.model('Comment', commentSchema);

