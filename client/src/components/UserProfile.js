import { useState, useRef } from "react";
import axios from 'axios'
import ShowAnswer from './ShowAnswer'
 export default function UserProfile(props){
    const { newModel, user, fetchModel, setCurrentPage, isLoggedIn, userID } = props
    /**
     * options to modify question (shows all existing fields)  
     * options to delete question(will delete all answers and comments with the question)
     * option to see all answers said
     * if deleted, tag must be deleted from all questions
     * make sure to input tags when a user updats a question
     */
    const [selectedQuestion, setSelectedQuestion] = useState(null)
    const [selectedTag, setSelectedTag] = useState(null)
    const [selectedAnsweredQ, setSelectedAnsweredQ] = useState(null)
    const [isProfile, setIsProfile] = useState(false)
    const [openEditAnswer, setOpenEditAnswer] = useState(null)

    // const [selectedAQuestion, setSelectedAQuestion] = useState(null)


    const titleRef = useRef();
    const textRef = useRef();
    // const tagsRef = useRef();
    const summaryRef = useRef();
    const tagNameRef = useRef();

    const updateFieldValue = (ref) => {
        return ref.current.value;
      };


    const now = new Date();
    const user_joined= new Date(user.joined)
    let activity= ''
    const timeDifference = now - user_joined;   //time user joined (bullet 1)
    const reputation = user.reputation          //reputation (bullet 2)
    const tempQuestions = user.questions
    const tags = user.tags                      //all users tags
    const answers = user.answers                //all users answers
    const admin = user.admin


    let questionsAnswered = [];
    let questions = []
    const allQuestions = newModel.questions;
    for (let i = 0; i < tempQuestions.length; i++) {
        const q = tempQuestions[i];
      
        for (let j = 0; j < allQuestions.length; j++) {
          const question = allQuestions[j];
        
      if(q===question._id) questions.push(question)
        }
    }

    console.log(answers)
    for (let i = 0; i < answers.length; i++) {
      const answer = answers[i];
        console.log(answer)
      for (let j = 0; j < allQuestions.length; j++) {
        const question = allQuestions[j];
        if (question.answers.includes(answer)) {
            console.log('inside question')
          questionsAnswered.push(question);
        }
      }
    }
    

    if (timeDifference < 60000) {
        activity = "Joined less than a minute ago";
    } else if (timeDifference < 3600000) {
        const minutes = Math.floor(timeDifference / 60000);
        activity = `Joined ${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (timeDifference < 86400000) {
        const hours = Math.floor(timeDifference / 3600000);
        activity = `Joined ${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (timeDifference < 2592000000) {  // 2592000000 milliseconds in a month
        const days = Math.floor(timeDifference / 86400000);
        activity = `Joined ${days} day${days > 1 ? "s" : ""} ago`;
    } else {
        activity = `${user.username} joined ${user_joined.toLocaleString("default", {
            month: "short",
            day: "numeric",
        })} at ${user.joined}`;
    }

    const renderQuestions = () =>{
      let returnedQuestions=[]
      if(admin) returnedQuestions= newModel.questions
      else returnedQuestions= questions
        return returnedQuestions.map((question) => (
            <>
                <div className="middle-section" key={question._id}>
                    <button className="question-button" onClick={() => { 
                 setSelectedQuestion(question)
             }}>
                 {question.title}
             </button>         
                </div>
                <br></br>
            </>
        ));
    }
    const renderAnsweredQuestions = () =>{
        console.log('inside render answers')
        if(admin)
        return newModel.questions.map((question) => (
          <div className="middle-section" key={question._id}>
            <button
              className="question-button"
              onClick={() => {
                setSelectedAnsweredQ(question);
              }}
            >
              {question.title}
            </button>
          </div>          
                
        ));
        else
        return questionsAnswered.map((question) => (
          <div className="middle-section" key={question._id}>
            <button
              className="question-button"
              onClick={() => {
                setSelectedAnsweredQ(question);
              }}
            >
              {question.title}
            </button>
          </div>          
                
        ));
    }
    const returnTags= () =>{
        const buttonsPerRow = 3;
        const rows = [];
        let findRealTag=[]
        if(admin) findRealTag= newModel.tags
        else
         findRealTag= newModel.tags.filter(tag => tags.includes(tag._id));
        //a function that goes through all of newModel.tags. if 
        // for each tag in that array, the _id is compared to the id of each tag in the tags array
        console.log('inside return all')
        for (let i = 0; i < findRealTag.length; i += buttonsPerRow) {
            const rowTags = findRealTag.slice(i, i + buttonsPerRow);
            const rowButtons = rowTags.map((tag, index) => {
                return (
                    <button
                        key={i + index}
                        className="tags-btn"
                        onClick={() => setSelectedTag(tag)}
                    >
                       <h3>{tag.name}</h3>
                    </button>
                );
            });
    
            rows.push(
                <div key={i / buttonsPerRow} className="tagsRow">
                    {rowButtons}
                </div>
            );
        }
    
        return <div className="tag-rows">{rows}</div>;
    }
    // const returnAllTags= () =>{
    //     const buttonsPerRow = 3;
    //     const rows = [];
    //     // let findRealTag= newModel.tags.filter(tag => tags.includes(tag._id));
    //     // console.log(findRealTag)
    //     console.log('inside return all')
    //     for (let i = 0; i < newModel.tags.length; i += buttonsPerRow) {
    //         const rowTags = newModel.tags.slice(i, i + buttonsPerRow);
    //         const rowButtons = rowTags.map((tag, index) => {
    //             return (
    //                 <button
    //                     key={i + index}
    //                     className="tags-btn"
    //                     onClick={() => setSelectedTag(tag)}
    //                 >
    //                    <h3>{tag.name}</h3>
    //                 </button>
    //             );
    //         });
    
    //         rows.push(
    //             <div key={i / buttonsPerRow} className="tagsRow">
    //                 {rowButtons}
    //             </div>
    //         );
    //     }
    
    //     return <div className="tag-rows">{rows}</div>;
    // }


    const onInputChange = () => {
        // Access and update the values when input changes
        updateFieldValue(titleRef);
        updateFieldValue(textRef);
        // updateFieldValue(tagsRef);
        updateFieldValue(summaryRef);
      };
      const onTagInputChange = () =>{
        updateFieldValue(tagNameRef);

      }
    const deleteQuestion = async(e) =>{
      e.preventDefault()
      const ans = selectedQuestion.answers
      for(let i=0;i<ans.length;i++){
        const answer= ans[i];
        await axios.delete('http://localhost:8000/answer/delete', { data: { id: answer._id } });
      }

      await axios.delete('http://localhost:8000/question/delete', { data: { id: selectedQuestion._id } });
      setSelectedQuestion(null)
      fetchModel()
    }
    const modifyQuestion =  async(e) => {
        e.preventDefault()
        let errorMessage=[]
        const modifiedTitle = titleRef.current.value;
        const modifiedText = textRef.current.value;        
        const modifiedSummary = summaryRef.current.value;
        console.log('beginning ')

        console.log('entering loop')
        console.log(errorMessage.length)

        if(errorMessage.length>0){
            document.getElementById('profileInputError')
            .value=errorMessage;
            errorMessage=''
            return;
        }
        console.log('after error case')

        const response = await axios.put('http://localhost:8000/updatequestion',
         {id: selectedQuestion._id,
            title: modifiedTitle,
          text: modifiedText,
        summary: modifiedSummary, 
        })
        console.log('post axios call')

        if(response){
            fetchModel();
            setSelectedQuestion(null)
        }
        else{
            //error handling
        }
    }
    const modifyTag = async (e)=>{
        e.preventDefault()
        const modifiedTag = tagNameRef.current.value;
        const id = selectedTag._id;
        //find if tag is used by someone else
        if(selectedTag.usedBy.length>1){
            document.getElementById('tagErrorInput').innerHTML= 'Tag cannot be modified as it is being used by others';
            return;
        }
        
        const response= await axios.put('http://localhost:8000/updatetag', {id: id, name: modifiedTag})
        if(response){
        fetchModel()
        setSelectedTag(null)
        }
        //display error
    }
    


    const cancel =  async() => {
        setSelectedQuestion(null)
        setSelectedTag(null)
        return;
    }
    const deleteTag =  async() => {
      const res = await axios.delete('http://localhost:8000/tag/delete', { data: { id: selectedTag._id } });
      if(res){
      setSelectedTag(null)
      fetchModel()
      }
      return;
  }


    if(selectedQuestion!==null){
        return (
            <>
    <form>
      <div className="question-form">
        <label htmlFor="title">Question Title*</label>
        <div className="form-group">
          <input
            type="text"
            id="title"
            name="title"
            defaultValue={selectedQuestion.title}
            placeholder="Title (up to 50 characters)"
            ref={titleRef}
            onChange={onInputChange}
          />
        </div>

        <label htmlFor="text">Question Text*</label>
        <div className="form-group">
          <textarea
            id="text"
            name="text"
            defaultValue={selectedQuestion.text}
            placeholder="Question Text"
            ref={textRef}
            onChange={onInputChange}
          />
        </div>

        {/* <label htmlFor="tags">Tags</label>
        <div className="form-group">
          <input
            type="text"
            id="tags"
            name="tags"
            placeholder="tags"
            ref={tagsRef}
            onChange={onInputChange}

          />
        </div> */}

        <label htmlFor="username">Summary*</label>
        <div className="form-group">
          <input
            type="text"
            id="summary"
            name="summary"
            defaultValue={selectedQuestion.summary}
            placeholder="Summary"
            ref={summaryRef}
            onChange={onInputChange}

          />
        </div>

        <button onClick={modifyQuestion} type="submit" className="btn" id="updateq">
          Update
        </button>
        <button onClick={deleteQuestion} type="submit" className="btn" id="deleteq">
          Delete
        </button>
        <button onClick={cancel} className="btn" id="cancelq">
          Cancel
        </button>
        <h5 style={{color: 'red'}} id="profileInputError"></h5>
      </div>
    </form>
    </>
        )
    }
    if(selectedAnsweredQ!==null){
        return(
        <ShowAnswer newModel={newModel} fetchModel={fetchModel} setIsProfile={setIsProfile} openEditAnswer={openEditAnswer}
        selectedQuestion= {selectedAnsweredQ} user={user} setSelectedAnsweredQ={setSelectedAnsweredQ} setOpenEditAnswer={setOpenEditAnswer}
         isProfile={true} userID={userID} iaLoggedIn={isLoggedIn} setCurrentPage={setCurrentPage}/> 
        )
    }
    if(selectedTag!==null){
        return(
        <form>
            <label htmlFor="title">Tag Name</label>
            <div className="form-group">
            <input
                type="text"
                id="tagName"
                name="tagName"
                placeholder="Name"
                ref={tagNameRef}
                onChange={onTagInputChange}
            />
            </div>
        <button onClick={modifyTag} type="submit" className="btn" id="updatet">
          Update
        </button>
        <button onClick={deleteTag} className="btn" id="deletet">
          Delete
        </button>
        <button onClick={cancel} className="btn" id="cancelt">
          Cancel
        </button>
        <h5 style={{color: 'red'}} id="tagErrorInput"></h5>

        </form>
        )
    }
    if(admin){
        return(
        <>       
         <div className="top">
            <h3> {user.name}</h3>
            <h4> {activity}</h4>
            <h4> reputation: {reputation}</h4>
        </div>
        <h4>{newModel.questions.length} Questions Asked</h4>
        {newModel.questions.length===0? <h4>No questions</h4> : renderQuestions()}
        <br></br>
        <h4>{tags.length} Tags Created</h4>
        {tags.length===0? <h4>No tags </h4> : returnTags()}
        <br></br>
        <h4>All Answers</h4>
        {newModel.answers.length===0? <h4>No Answers</h4> : renderAnsweredQuestions()}
        </>
        )
    }
    else
        return(
            <>       
            <div className="top">
               <h3> {user.name}</h3>
               <h4> {activity}</h4>
               <h4> reputation: {reputation}</h4>
           </div>
           <h4>{questions.length} Questions Asked</h4>
           {questions.length===0? <h4>No questions asked</h4> : renderQuestions()}
           <br></br>
           <h4>{tags.length} Tags Created</h4>
           {tags.length===0? <h4>No tags created</h4> : returnTags()}
           <br></br>
           <h4>All Answers</h4>
           {answers.length===0 ? <h4>No questions answered</h4> : renderAnsweredQuestions()}
           </>
        )
    }

