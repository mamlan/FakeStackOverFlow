import React from "react";
import { formatQuestionMetadata, formatAnswerDate, renderAnswerText, renderQuestionText
} from "./Questions";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
export default function ShowAnswer(props) {
console.log('inside showanswer')
const { newModel, selectedQuestion, fetchModel, setIsProfile,isProfile, openEditAnswer, setOpenEditAnswer, setSelectedAnsweredQ, userID, isLoggedIn, setCurrentPage, user } = props;
const [currentPageNumber, setCurrentPageNumber] = useState(1);
const [selectedAnswer, setSelectedAnswer] = useState(null)
const answersPerPage = 5; // Set the number of answers per page
console.log(selectedQuestion)
const totalPages = Math.ceil(selectedQuestion.answers.length / answersPerPage);




const [commentText, setCommentText] = useState('');
const [commentTextA, setCommentTextA] = useState({});




const [comments, setComments] = useState([]);




//for questions
const [currentPageNumberQ, setCurrentPageNumberQ] = useState(1);
const commentsPerPage = 3; // Set the number of comments per page
const totalCommentPages = Math.ceil(comments.length / commentsPerPage);




//for answers=============================================================================================================
const [answerComments, setAnswerComments] = useState({});
const [currentPageNumberAnswer, setCurrentPageNumberAnswer] = useState({});
const answerCommentsPerPage = 3;

function findUserAsked(selectedQuestion){
  console.log("FINDING USER WHO ASKED")
  const asker = selectedQuestion.asked_by;
  const user = newModel.users.find((user) => user.username === asker);
  console.log("USER ID: "+ user._id);
  return user._id;

}




const fetchAnswerComments = async (answerId) => {
  try {
    const response = await axios.get(`http://localhost:8000/comments/answer/${answerId}`);
    setAnswerComments((prevComments) => ({ ...prevComments, [answerId]: response.data }));
  } catch (error) {
    console.error('Error fetching answer comments:', error);
  }
};




useEffect(() => {
  if (selectedQuestion.answers.length > 0) {
    // Fetch comments for each answer
    selectedQuestion.answers.forEach((answerId) => fetchAnswerComments(answerId));

    // Initialize state for pagination for all answers
    setCurrentPageNumberAnswer((prevPage) => {
      const updatedState = { ...prevPage };

      selectedQuestion.answers.forEach((answerId) => {
        updatedState[answerId] = 1;
      });

      return updatedState;
    });
  }
}, [selectedQuestion.answers]);




const handleNextAnswerCommentPage = (answerId) => {
  setCurrentPageNumberAnswer((prevPage) => ({
    ...prevPage,
    [answerId]: Math.min(prevPage[answerId] + 1, Math.ceil(answerComments[answerId].length / answerCommentsPerPage)),
  }));
};
 const handlePrevAnswerCommentPage = (answerId) => {
  setCurrentPageNumberAnswer((prevPage) => ({
    ...prevPage,
    [answerId]: Math.max(prevPage[answerId] - 1, 1),
  }));
};




const handleCommentSubmitA = async (answerId) => {
  let user1 = usersList.find((user) => user._id === userID);

  if(user1.reputation < 50){
    document.getElementById("invalid-commentA").innerHTML = "Reputation not high enough to add a comment!";
    return;
  }




  if(commentText.length > 140){
    document.getElementById("invalid-commentA").innerHTML = "Comment must not be longer than 140 characters!";
    return;
  }
   try {
    const response = await axios.post('http://localhost:8000/addcomment', {
      text: commentTextA[answerId] || '',
      ans_By: user1,
      upVotesComments: [],
      date: new Date(),
    });
   
    console.log("added comment!");




    console.log('Data being sent to server:', {
      answerID: answerId,
      commentId: response.data._id,
    });
     await axios.put('http://localhost:8000/addcommentstoanswer', {
      answerID: answerId,
      commentId: response.data._id,
    }, { withCredentials: true });




    console.log("put comment in answer!");



    setAnswerComments((prevComments) => ({
      ...prevComments,
      [answerId]: [response.data, ...(prevComments[answerId] || [])],
    }));




    console.log("set answer comments");




     setCommentTextA((prevComments) => ({
      ...prevComments,
      [answerId]: '',
    }));

    console.log("set comment text!");

  } catch (error) {
    console.error('Error adding comment:', error);
  }
};


function renderAnswerComments(answerId) {
  const comments = answerComments[answerId];
  const currentPageNumber = currentPageNumberAnswer[answerId];
  console.log("Current Page Number of "+ answerId + ": " + currentPageNumber);
   if (!comments || comments.length === 0) {
    return <p>No comments for this answer yet.</p>;
  }




  const startIndex = (currentPageNumber - 1) * answerCommentsPerPage;
  const endIndex = startIndex + answerCommentsPerPage;
  // Slice the array to get the comments for the current page
  const commentsToShow = comments.slice(startIndex, endIndex);

   return (
    <div className="comment-list">
      {commentsToShow.map((comment) => {
        const commentUser = usersList.find((user) => user._id === comment.ans_By);
        const formattedDate = formatDate(comment.date);
         return (
          <div key={comment._id} className="comment-item">
            <div className="comment-metadata">
              <strong className="username">{commentUser ? commentUser.username : 'Unknown User'}</strong> <strong>{formattedDate}</strong>
            </div>
            <div className="comment-text">{comment.text}</div>
            <div className="voting-container">
              <button
                className="voting-button1"
                onClick={() => handleUpvoteComment(comment._id)}
              >
                Upvote
              </button>
              {/* Display the number of upvotes for the comment */}
              <span>{comment.upVotesComments ? comment.upVotesComments.length : 0}</span>
            </div>
          </div>
        );
      })}
      <div className="comment-buttons">
        <button className="comment-button" onClick={() => handlePrevAnswerCommentPage(answerId)} disabled={currentPageNumber === 1}>
          Prev
        </button>
        <span>{`Page ${currentPageNumber} of ${Math.ceil(comments.length / answerCommentsPerPage)}`}</span>
        <button className="comment-button"
          onClick={() => handleNextAnswerCommentPage(answerId)}
          disabled={currentPageNumber === Math.ceil(comments.length / answerCommentsPerPage)}
        >
          Next
        </button>
      </div>
    </div>
  );
}








const handleNextPageQ = () => {
    setCurrentPageNumberQ((prevPage) => Math.min(prevPage + 1, totalCommentPages));
};




const handlePrevPageQ = () => {
    setCurrentPageNumberQ((prevPage) => Math.max(prevPage - 1, 1));
};




const startIndexQ = (currentPageNumberQ - 1) * 3;
const endIndex = startIndexQ + 3;
const commentsToShow = comments.slice(startIndexQ, endIndex);




 console.log(commentsToShow);




let [usersList, setUsersList] = useState([]);
useEffect(() => {
      axios.get('http://localhost:8000/users').then(res => { setUsersList(res.data) });
  }, []);
//Voting stuff
const [voteCount, setVoteCount] = useState(selectedQuestion.voteCount);
const [hasVoted, setHasVoted] = useState(selectedQuestion.votes.includes(userID));




const handleUpvote = async () => {
  console.log("Handling upvote");




  let user1 = usersList.find((user) => user._id === userID);
  console.log("FINDING USER IN UPVOTE " + userID + " " + user1);




  if(user1.reputation < 50){
    document.getElementById('voting-error').innerHTML = 'Reputation not high enough!';
    return;
  }

  try {
    //update vote count in questions db and also add the user to the votes list of question
    let askingUserId = findUserAsked(selectedQuestion);
    console.log(" ASKING USER IS : " + askingUserId);
    await axios.put(`http://localhost:8000/upvotequestion/${selectedQuestion._id}/${askingUserId}`);

    //get the updated vote count for proper print out
    const updatedQuestion = await axios.get(`http://localhost:8000/questions/${selectedQuestion._id}`);
    setVoteCount(updatedQuestion.data.voteCount);
    console.log("new vote count: " + updatedQuestion.data.voteCount);

    setHasVoted(true);

  } catch (error) {
    console.error('Error upvoting question:', error);
  }
};
 const handleDownvote = async () => {
  console.log("Handling downvote");

  let user1 = usersList.find((user) => user._id === userID);
  console.log("FINDING USER IN downvote " + userID + " " + user1);

  if(user1.reputation < 50){
    document.getElementById('voting-error').innerHTML = 'Reputation not high enough!';
    return;
  }
  
  try {




    //update vote count in questions db and also add the user to the votes list of question
    let askingUserId = findUserAsked(selectedQuestion);
    console.log(" ASKING USER IS : " + askingUserId);
    await axios.put(`http://localhost:8000/downvotequestion/${selectedQuestion._id}/${askingUserId}`);








    //get the updated vote count for proper print out
    const updatedQuestion = await axios.get(`http://localhost:8000/questions/${selectedQuestion._id}`);
    setVoteCount(updatedQuestion.data.voteCount);
    console.log("new vote count: " + updatedQuestion.data.voteCount);








    setHasVoted(true);




  } catch (error) {
    console.error('Error upvoting question:', error);
  }
};




const fetchComments = async () => {
  console.log("Fetching comments");




  try {
    const response = await axios.get(`http://localhost:8000/comments/question/${selectedQuestion._id}`);
    setComments(response.data);
    console.log('Fetched comments from client:', response.data);




  } catch (error) {
    console.error('Error fetching comments:', error);
  }
};




useEffect(() => {
  console.log("useEffect is running");




  fetchComments(); // Fetch comments when the component mounts
}, [selectedQuestion._id]);








const handleNextPage = () => {
    setCurrentPageNumber((prevPage) => Math.min(prevPage + 1, totalPages));
};
const handleAnswerButtonClick = () => {
  setCurrentPage('answer');
};
const handlePrevPage = () => {
    setCurrentPageNumber((prevPage) => Math.max(prevPage - 1, 1));
};








const handleCommentSubmit = async () => {




  //commentText is the text
  let user1 = usersList.find((user) => user._id === userID);
  // console.log("this is the user"+user1);
  // console.log("this is the user name"+user1.username);
  // console.log("this is the user rep"+user1.reputation);
  // console.log("this is the user id"+user1._id);

  if(user1.reputation < 50){
    document.getElementById("invalid-comment").innerHTML = "Reputation not high enough to add a comment!";
    return;
  }




  if(commentText.length > 140){
    document.getElementById("invalid-comment").innerHTML = "Comment must not be longer than 140 characters!";
    return;
  }




  try {
    const response = await axios.post('http://localhost:8000/addcomment', {
      text: commentText,
      ans_By: user1,
      upVotesComments: [],
      date: new Date(),
    });
   
    setComments((prevComments) => [response.data, ...prevComments]);
   
    await axios.put('http://localhost:8000/addcommentstoquestion', {
      questionId: selectedQuestion._id,
      commentId: response.data._id,
    }, { withCredentials: true });
    setCommentText('');
    fetchComments();




  } catch (error) {
    console.error('Error adding comment in put:', error);
  }
};








const startIndex = (currentPageNumber - 1) * answersPerPage;
const currentPageAnswers = selectedQuestion.answers.slice(startIndex, startIndex + answersPerPage);








//Answer Voting Section
const handleUpvoteAnswer = async (answerId) => {




  let user1 = usersList.find((user) => user._id === userID);
   console.log(answerId); //this works fine
  console.log(userID); //this too




  if(user1.reputation < 50){
    document.getElementById('voting-error-ans').innerHTML = 'Reputation not high enough!';
    return;
  }
  try {
    console.log('User ID:', userID);
    console.log('Answer ID:', answerId);



    let askingUserId = findUserAsked(selectedQuestion);
    console.log(" ASKING USER IS : " + askingUserId);
    await axios.put(`http://localhost:8000/upvoteanswer/${answerId}/${askingUserId}`);
    //const updatedAnswer = await axios.get(`http://localhost:8000/answers/${answerId}`);
  } catch (error) {
    console.error('Error upvoting answer:', error);
  }
};
 const handleDownvoteAnswer = async (answerId) => {




  let user1 = usersList.find((user) => user._id === userID);




  if(user1.reputation < 50){
    document.getElementById('voting-error-ans').innerHTML = 'Reputation not high enough!';
    return;
  }




  try {
    let askingUserId = findUserAsked(selectedQuestion);
    console.log(" ASKING USER IS : " + askingUserId);
    await axios.put(`http://localhost:8000/downvoteanswer/${answerId}/${askingUserId}`);
    //const updatedAnswer = await axios.get(`http://localhost:8000/answers/${answerId}`);
  } catch (error) {
    console.error('Error downvoting answer:', error);
  }
};


//for comment voting
const handleUpvoteComment = async (commentId) => {
 try {
   // Call the server API to upvote the comment
   let askingUserId = findUserAsked(selectedQuestion);
   console.log(" ASKING USER IS : " + askingUserId);
   await axios.put(`http://localhost:8000/upvotecomment/${commentId}/${askingUserId}`);
 } catch (error) {
   console.error('Error upvoting comment:', error);
 }
};

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}
const updateFieldValue = (ref) => {
  return ref.current.value;
};

const onInputChange = () => {
  // Access and update the values when input changes
  updateFieldValue(ansRef);
}
const ansRef = useRef();

const editAnswer= async (ans) => {
  setOpenEditAnswer(true);

}
const submitEdit = async () =>{
  const newAns= ansRef.current.value
  console.log('inside submitedit', newAns)
  const res = await axios.put('http://localhost:8000/updateanswer', {id: selectedAnswer._id, text: newAns})
  if(res){
    console.log('inside res')
  setOpenEditAnswer(null)
  setIsProfile(false)
  setSelectedAnsweredQ(null)
  setSelectedAnswer(null)
  fetchModel()
  }
}
const deleteAnswer= async (ans) => {
  console.log('inside delete')
  const res = await axios.delete('http://localhost:8000/answer/delete', { data: { id: selectedAnswer._id } });
  if(res){
    console.log('inside res')
  setOpenEditAnswer(null)
  setIsProfile(false)
  setSelectedAnsweredQ(null)
  setSelectedAnswer(null)
  fetchModel()
}
}

if(openEditAnswer===true){
  return (
    <form >
    <div className="question-form">
        <label htmlFor="text">Answer Text*</label>

        <div className="form-group">
            <textarea
                id="text"
                name="text"
                defaultValue={selectedAnswer.text}
                onChange={onInputChange}
                placeholder="Answer Text"
                ref={ansRef}
            />
        </div>
        <button type="text" className="btn" id="editAnswer"  onClick={() => submitEdit()}>Edit</button>
        {/* <button onClick={deleteAnswer(holdingAns)} className="btn" id="deleteAnswer">Delete</button> */}

    </div>   
</form>
  )
}

else
return (
  <div className="expanded-view">
    <div className="ansTitle">
      <div className="answers-count-container">
      <h3>{selectedQuestion.answers.length} Answers</h3>
      </div>
      <h2 className="Qtitle">{selectedQuestion.title}</h2>
    </div>
    <div className="description">
      <div className="views-cont">
      <h3>{selectedQuestion.views} Views</h3>
      </div>
      <div className="middle-text">
        <p>{renderQuestionText(selectedQuestion)}</p>
        <h3 className="comment-title">Comments</h3>
        <p id="comment-error"></p>
        <div className="comment-list">
        {commentsToShow.map((comment) => {
            // Find the user who wrote the comment
              const commentUser = usersList.find((user) => user._id === comment.ans_By);
              const formattedDate = formatDate(comment.date);

              return (
                <div key={comment._id} className="comment-item">
                  <div className="comment-metadata">
                    <strong className="username">{commentUser ? commentUser.username : 'Unknown User'}</strong> <strong>{formattedDate}</strong>
                  </div>
                  <div className="comment-text">{comment.text}</div>
                  <div className="voting-container">
                    <button
                      className="voting-button1"
                      onClick={() => handleUpvoteComment(comment._id)}
                    >
                      Upvote
                    </button>
                    {/* Display the number of upvotes for the comment */}
                    <span>{comment.upVotesComments ? comment.upVotesComments.length : 0}</span>
                  </div>
                </div>
              );
            })}
        </div>
          <div className="comment-buttons">
            <button className="comment-button" onClick={handlePrevPageQ} disabled={currentPageNumberQ === 1}>
              Prev
            </button>
            <span >{`Page ${currentPageNumberQ} of ${totalCommentPages}`}</span>
            <button className="comment-button" onClick={handleNextPageQ} disabled={currentPageNumberQ === totalCommentPages}>
              Next
            </button>
          </div>
          <div className="comment-input-container">
        <input
          type="text"
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button className="add-comment-button"  onClick={handleCommentSubmit}>Add Comment</button>
        <p id="invalid-comment"></p>
        </div>




      </div>
      <div className="metadata-cont">
      <p>{formatQuestionMetadata(selectedQuestion)}</p>
        <div className="voting-container">
          <button className="voting-button" disabled={hasVoted} onClick={handleUpvote}>Upvote</button>
          <span>{voteCount}</span>
          <button className="voting-button" disabled={hasVoted} onClick={handleDownvote}>Downvote</button>
          <p id="voting-error"></p>
        </div>
      </div>
    </div>
    <div className="answers">
      {currentPageAnswers.map((ansID) => {
        const answer = newModel.answers.find((answer) => answer._id === ansID);
        return (
          (answer)&&(<div key={ansID} className="answer-cont">
            <div className="right-side">
                  <p>{answer.ans_by}</p>
                  <p>{formatAnswerDate(answer)}</p>
                  <div className="voting-container">
                <button
                  className="voting-button"
                  onClick={() => handleUpvoteAnswer(ansID)}
                >
                Upvote
                </button>
                <span>{answer.voteCount}</span>
                <button
                  className="voting-button"
                  onClick={() => handleDownvoteAnswer(ansID)}
                >
                  Downvote
                </button>
                <p id="voting-error-ans"></p>
            </div>
            </div>
            <div className="left-side">
              <p>{renderAnswerText(answer)}</p>
              <h3 className="comment-title">Comments</h3>
              {renderAnswerComments(ansID)}
              <div className="comment-input-container">
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentTextA[ansID] || ''}
                onChange={(e) => setCommentTextA((prevComments) => ({ ...prevComments, [ansID]: e.target.value }))}
               />
              <button className="add-comment-button" onClick={() =>handleCommentSubmitA(ansID)}>Add Comment</button>
              <p id="invalid-commentA"></p>
              </div>
              {isProfile && answer.ans_by===user.username &&!user.admin &&
            <div>
            <button onClick={() => { editAnswer(answer); setSelectedAnswer(answer); }} id="editAnswer">Edit</button>
            <button onClick={() =>{ deleteAnswer(answer); setSelectedAnswer(answer);}} id="deleteAnswer">Delete</button>
          </div>
            }
            {isProfile &&user.admin &&
            <div>
            <button onClick={() => { editAnswer(answer); setSelectedAnswer(answer); }} id="editAnswer">Edit</button>
            <button onClick={() =>{ deleteAnswer(answer); setSelectedAnswer(answer);}} id="deleteAnswer">Delete</button>
          </div>
            }
            </div>
            
          </div>
  
          )
          
        );
      })}
    </div>
    {isLoggedIn && <div className="answer-button">
              <button onClick={handleAnswerButtonClick} id="answer-button">Answer Question</button>
          </div>}
    <div className="page-buttons">
      <button className="prev-button" onClick={handlePrevPage} disabled={currentPageNumber === 1}>Prev</button>
      <span >{`Page ${currentPageNumber} of ${totalPages}`}</span>
      <button className="next-button" onClick={handleNextPage} disabled={currentPageNumber === totalPages}>Next</button>
    </div>
  </div>
);
}



