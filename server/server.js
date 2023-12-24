// Application server
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose= require('mongoose')
const bcrypt= require('bcrypt')
const jwt = require('jsonwebtoken'); //jwt
const session = require("express-session");
const cookieParser= require('cookie-parser')




// const MongoDBStore = require("connect-mongodb-session")(session);








const port = 8000;
const User = require('./models/users')
const Answer = require('./models/answers')
const Tag = require('./models/tags')
const Question = require('./models/questions')
const Comments = require('./models/comments.js')








const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:8000'],
  methods: ['POST', 'GET', 'PUT', 'POST', 'DELETE'],
  credentials: true,
};
app.use(cookieParser())
app.use(express.json(), express.urlencoded({extended: false}));




app.use(session({
  secret: 'secrey_key',
  resave: false,
  saveUninitialized: true,
  cookie: {
      httpOnly: true,
      secure: false, // Set to true in production if using HTTPS
      maxAge: 24 * 60 * 60 * 1000, // Session lasts for 1 day (adjust as needed)
    },
}));




app.listen(port, ()=>{
  console.log('listening on port '+port)
})








const mongoDB ='mongodb://127.0.0.1/fake_so'
mongoose.connect(mongoDB);




const db = mongoose.connection;      //default connection




//Bind   to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDb connection error'))








db.on('connected', function() {




app.use(cors(corsOptions));








app.get('/questions', async (req, res)=>{
  const questions = await Question.find().sort({ask_date_time:1});
   res.send(questions)
})
app.get('/questions/:questionId', async (req, res)=>{
const ques= req.params.questionId;








const question = await Question.findById(ques);




 res.send(question)
})

app.get('/onetag', async (req,res)=>{
  const {id: id} =req.body
  
})

app.get('/tags', async (req, res)=>{
  const tags= await Tag.find({}).sort({name:1});
  res.send(tags);
})
app.get('/answers', async (req, res) => {
  const answers = await Answer.find().sort({ans_date_time:1})
  res.send(answers)
})


app.delete('/question/delete', async (req, res)=>{
  const {id} = req.body
  try{
      const deletedQuestion = await Question.findByIdAndDelete(id);
      if (!deletedQuestion) {
        return res.status(404).send('Question not found');
      }
      res.send('Question deleted successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }

})

app.delete('/answer/delete', async (req, res)=>{
  const {id} = req.body
  console.log(id)
  try{
      const deletedAnswer = await Answer.findByIdAndDelete(id);
      if (!deletedAnswer) {
        return res.status(404).send('Question not found');
      }
      console.log('deleted')
      res.send('answer deleted successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }

})

app.delete('/tag/delete', async (req, res)=>{
  const {id} = req.body
  console.log(id)
  try{
      const deletedTag = await Tag.findByIdAndDelete(id);
      if (!deletedTag) {
        return res.status(404).send('Question not found');
      }
      console.log('deleted')
      res.send('tag deleted successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }

})

app.get('/tags/:id', async (req,res)=>{
  const tid= req.params.id
  try{
  const questions = await Question.find({ tags: tid})
  .populate('tags') // Replace 'tags' with the actual field name in your Question schema
  .exec();
  res.send(questions);
  }
  catch(e){
      console.log('server.js: '+e)
  }
})
app.get('/users', async(req, res)=>{
  try{
      const users = await User.find({}).sort({name: 1})
      
      res.send(users)
  }
  catch(e){
      console.log(e, 'error fetching users')
  }
})
app.post('/newquestion', async (req, res)=>{
  try
 { console.log("Adding question !");
  let q=req.body;
  const newQuestion = Question({
      qid: q.qid,
      title: q.title,
      summary: q.summary,
      text: q.text,
      tags: q.tagIds,
      asked_by: q.askedBy,
      ask_date_time: q.askDate,
      answers: q.ansIds,  
      views: q.views,
  });
  await newQuestion.save()
  console.log("New Question: "+ newQuestion);
  res.send(newQuestion)
}catch(e){
  console.log('error in new question', e)
}
})








app.post('/addcomment', async (req, res) => {

  const addComment = new Comments({
    text: req.body.text,
    ans_By: req.body.ans_By,
    upVotesComments: req.body.upVotesComments,
    date: req.body.date,

  });
  await addComment.save();
  res.send(addComment);
})








app.get('/auth', async (req, res)=>{
  if(req.session.id){
      // console.log(" response " , req.session.user)
  res.json({ message: 'success', id: req.session.id, user: req.session.user });
  }




  else{
      res.status(401).json({error: 'not auth'})
  }
})




app.post('/newUsers', async (req, res)=>{
  let q = req.body;
  try{
      bcrypt.hash(q.password, 10, async (err, hash) =>{
      if(err){
          console.error(err);
      }
      else{
          const newUser = new User({
              username: q.username,
              password: hash,
              email: q.email,
          })
          await newUser.save();
          res.send('user created')
      }
  })}
  catch(e){
      console.log(e)
  }
})
app.put("/updateincrement", async (req, res) => {
    await Question.findOne({ _id: req.body._id }).then((result) => {
      result.views += 1;
       result.save();
    });
  });

  app.put('/updatetag', async (req, res)=>{
    const {id, name}=req.body
    try{
    await Tag.findOneAndUpdate(
      {
      _id: id},
      {
        $set: {name}
      },
      {new: true}
    ).then((result)=>{
      res.send(result)
    });
  }catch(e){
    console.log('error updating tag', e)
    res.status(401).send(e.message)
  }
    })

    app.put('/updatetag', async (req, res)=>{
      const {id, text}=req.body
      try{
      await Answer.findOneAndUpdate(
        {
        _id: id},
        {
          $set: {text}
        },
        {new: true}
      ).then((result)=>{
        res.send(result)
      });
    }catch(e){
      console.log('error updating tag', e)
      res.status(401).send(e.message)
    }
      })

    app.put('/addanswertouser', async (req, res) => {
      const { answer, id } = req.body;
      console.log('answer', answer._id)
      try {
        const user = await User.findOne({ _id: id }).exec();
        user.answers.push(answer._id);
        await user.save(); // Save the user after modifying the answers array
        res.send(user);
      } catch (e) {
        console.log('error adding answer to user', e);
        res.status(500).send('Internal Server Error');
      }
    });
    

    app.put('/updatetaguser', async (req, res)=>{
      const {tag, usedBy}=req.body
      console.log(tag)
      try{
      await Tag.findOneAndUpdate(
        {
        _id: tag},
        {
          $set: {usedBy}
        },
        {new: true}
      ).then((result)=>{
        res.send(result)
      });
    }catch(e){
      console.log('error updating tag', e)
      res.status(401).send(e.message)
    }
    })

  app.put("/updatequestion", async (req, res) => {
    const { title, text, summary, id } = req.body;
    console.log(id);
    try {
        await Question.findOneAndUpdate(
            { _id: id },
            { $set: { title, text, summary } },
            { new: true } // This option returns the modified document rather than the original
        ).then((result) => {
            console.log(result);
            res.send(result);
            console.log('success');
        });
    } catch (e) {
        console.log("error updating question,", e);
        res.status(401).send(e.message);
    }
});

app.put("/updateanswer", async (req, res) => {
  const {id, text} = req.body
  console.log(id);
  try {
      await Answer.findOneAndUpdate(
          { _id: id },
          { $set: {  text } },
          { new: true } // This option returns the modified document rather than the original
      ).then((result) => {
          console.log(result);
          res.send(result);
          console.log('success');
      });
  } catch (e) {
      console.log("error updating answer,", e);
      res.status(401).send(e.message);
  }
});

app.put("/addquestiontouser", async (req, res)=>{
    console.log("Adding Question to user");
    let { userID, questionID} = req.body
    try{
        await User.findOne({_id: userID}).then((result)=>{
          console.log("questionID: "+ questionID)
        result.questions.push(questionID)
         result.save();
    })
    console.log('success')
    res.json({ message: 'Question added to user successfully' });
    res.status(200)
    }
    catch(e){
        console.error(e)
        res.status(500).json({ error: 'Internal server error' });

    }
})
  
app.put("/addtagtouser", async (req, res) => {
  let { userID, tag } = req.body;
  try {
      const user = await User.findById(userID); // Use findById for better readability
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }
      user.tags.push(tag);
      await user.save();
      console.log('Tag added to user successfully');
      res.json({ message: 'Tag added to user successfully' }); // Send back a success message
  } catch (e) {
      console.log("error adding tag to user", e);
      res.status(500).json({ error: 'Internal server error' }); // Send back an error message
  }
});
app.put("/addquestionanswered", async (req, res)=>{
    let { userID, ansID} = req.body
    try{
        await User.findOne({_id: userID}).then((result)=>{
        result.answers.push(ansID)
         result.save();
    })
    console.log('success')
    res.status(200)
    }
    catch(e){
        console.error(e)
    }
})
  
app.post('/newanswer', async (req, res) => {
  const { answer } = req.body;  
  try{
  const newAnswer = new Answer({
    text: answer.text,            
    ans_by: answer.ansBy,
    ans_date_time: answer.ansDate,
    voteCount: 0,
    comments: [],
    votes: [],   
  });

  await newAnswer.save();
  console.log('successfully created')
  res.send({  newAnswer });
} catch(e){
  console.log('error from new answer', e)
}
});


app.post('/newtag', async (req,res)=>{
   const{ tag, user} = req.body
try{
    console.log("Adding new tag: ");
    const newTag=  new Tag({
      name: tag.name,
      usedBy:[user] 
  })
  console.log("new tag: " + newTag);

  await newTag.save()
  res.send(newTag)
}catch(e){
  console.log('error making new tag', e)
}
})


app.get('/getuserdetail', async(req, res)=>{
  try
  {
      const {email} =req.body;
  const user = await User.findOne({ email: email }).exec()
  res.send(user)
}
catch(e){
  console.error(e)
}
})

app.post('/login', async (req, res) => {
    const {emailInput, passwordInput, userPassword} = req.body;
    const user = await User.findOne({ email: emailInput }).exec()

    const check = await bcrypt.compare(passwordInput, userPassword)
        if(check){

            req.session.id = user._id;


            req.session.user=  user;
            res.json({message: 'success', id: user._id})
            
        }
    else{
      res.status(401).send('Invalid credentials')
    }
  });

  app.get('/logout', (req, res) => {
    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.json({ message: 'Logout successful' });
      }
    });
  });
app.get('/comments/question/:questionId', async (req, res) => {
  const questionId = req.params.questionId;
  try {




    const question = await Question.findById(questionId).populate('comments').exec();
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
     const comments = question.comments;
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/comments/answer/:answerId', async (req, res) => {
  const answerId = req.params.answerId;
   try {




    const answer = await Answer.findById(answerId).populate('comments').exec();
    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }
     const comments = answer.comments;
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




app.put('/addcommentstoquestion', async (req, res) => {
  try {
    const { questionId, commentId } = req.body;
    console.log(questionId);
    console.log(commentId);




    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).send('Question not found');
    }
     question.comments.unshift(commentId);
    await question.save();
     res.status(200).send('Comment added to question');




  } catch (error) {
    console.error('Error adding comment to question:', error);
    res.status(500).send('Internal Server Error');
  }
});
app.put('/addcommentstoanswer', async (req, res) => {
  try {
    const { answerID , commentId } = req.body;
   




    const answer = await Answer.findById(answerID);
    if (!answer) {
      return res.status(404).send('Answer not found');
    }
     answer.comments.unshift(commentId);




    console.log("added to list");
    await answer.save();
     res.status(200).send('Comment added to answer');




  } catch (error) {
    console.error('Error adding comment to question:', error);
    res.status(500).send('Internal Server Error');
  }
});




app.put('/upvotequestion/:questionId/:userId', async (req, res) => {
  try {
  
    const user1 = req.params.userId;
    console.log("Upvote user "+ user1);
    const questionId = req.params.questionId;




    const question = await Question.findById(questionId);
    const user = await User.findById(user1);

     // Check if the user has already upvoted
     const hasUpvoted = question.votes.some(vote => vote.equals(user));

    console.log("HAS VOTED"+ hasUpvoted);
     if (hasUpvoted) {
      console.log("alr voted");
      return res.status(400).json({ error: 'You have already upvoted this question.' });
    }
     // Add the upvote
     console.log("Pushing User into question votes array!");
    question.votes.push(user);
    question.voteCount++;

    await question.save();
     // Increment user's reputation by 5
    user.reputation += 5;
    await user.save();
     res.json({ message: 'Upvoted successfully.' });




  } catch (error) {
    console.error('Error upvoting question:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});
 // Downvote a question
app.put('/downvotequestion/:questionId/:userId', async (req, res) => {
  try {
    const user1 = req.params.userId;
    const questionId = req.params.questionId;




    const question = await Question.findById(questionId);
    const user = await User.findById(user1);
    const hasUpvoted = question.votes.some(vote => vote.equals(user));
    if (hasUpvoted) {
      return res.status(400).json({ error: 'You have already upvoted this question.' });
    }
     question.votes.push(user);
    question.voteCount--;
    await question.save();
     user.reputation -= 10;
    await user.save();
     res.json({ message: 'Upvoted successfully.' });




  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});




app.put('/upvoteanswer/:answerId/:userId', async (req, res) => {
  try {
    const user1 = req.params.userId;
    const answerId = req.params.answerId;
     const answer = await Answer.findById(answerId);
    const user = await User.findById(user1);




     // Check if the user has already upvoted
    const hasUpvoted = question.votes.some(vote => vote.equals(user));
  
     if (hasUpvoted) {
      return res.status(400).json({ error: 'You have already upvoted this answer.' });
    }
     // Add the upvote
    console.log("Pushing user into answer votes!");
    answer.votes.push({ user: user._id });
    answer.voteCount++;

    await answer.save();
     // Increment user's reputation by 5
    user.reputation += 5;
    await user.save();
     res.json({ message: 'Upvoted successfully.' });
   } catch (error) {
    console.error('Error upvoting answer:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});
 app.put('/downvoteanswer/:answerId/:userId', async (req, res) => {
  try {
    const user1 = req.params.userId;
    const answerId = req.params.answerId;
     const answer = await Answer.findById(answerId);
    const user = await User.findById(user1);
     // Check if the user has already downvoted
     const hasUpvoted = question.votes.some(vote => vote.equals(user));
     if (hasUpvoted) {
      return res.status(400).json({ error: 'You have already upvoted this answer.' });
    }
     // Add the upvote
    answer.votes.push(user);
    answer.voteCount--;
    await answer.save();
     // Decrement user's reputation by 10
    user.reputation -= 10;
    await user.save();
     res.json({ message: 'Downvoted successfully.' });
   } catch (error) {
    console.error('Error downvoting answer:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});


app.put('/upvotecomment/:commentId/:userId', async (req, res) => {
 try {

  console.log("Upvoting a comment!");
   const user1 = req.params.userId;
   const commentId = req.params.commentId;

   const comment = await Comments.findById(commentId);
   const user = await User.findById(user1);

   console.log("Checking if the user upvoted the comment already!" + comment);

   const hasUpvoted = comment.upVotesComments.includes(user1);
   if (hasUpvoted) {
     console.log("User has already voted on this comment!");
     return res.status(400).json({ error: 'You have already upvoted this comment.' });
   }


   comment.upVotesComments.push(user);
   console.log("Number of UpVotes: "+ comment.upVotesComments.length);
   comment.save();


   user.reputation += 1; // Adjust reputation as needed
   user.save();


   res.json({ message: 'Upvoted successfully.' });
 } catch (error) {
   console.error('Error upvoting comment:', error);
   res.status(500).json({ error: 'Internal server error.' });
 }
});

app.put('/addanswertoquestion', async (req, res) => {
  let { question, answer,userID } = req.body;
  console.log("here now");
  console.log(question._id)
  console.log("The Question: "+ question);

  try {
    const foundQuestion = await Question.findById(question._id);
    if (!foundQuestion) {
      return res.status(404).json({ error: 'Question not found.' });
    }
    console.log("Creating Answer");

    const newAnswer = await Answer.create({
      text: answer.text,
      ans_by: answer.ansBy,
      ans_date_time: answer.ansDate,
      voteCount: 0,
      comments:[],
      votes:[],
    });
    await newAnswer.save();
    foundQuestion.answers.push(newAnswer._id);
    await foundQuestion.save();

    const user = await User.findOne({ _id: userID }).exec();
    user.answers.push(newAnswer._id);
    await user.save(); // Save the user after modifying the answers array
    console.log("done");

    res.json({ message: 'Answer added to question successfully.' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal server error' });
  }
});


})
