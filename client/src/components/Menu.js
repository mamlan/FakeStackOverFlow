import Questions from "./Questions";
import Tag from "./Tag";
import { useState } from 'react';
import ShowSearch from "./ShowSearch";
import UserProfile from './UserProfile'

export default function Menu(props){
    const { newModel, selectedQuestion, setSelectedQuestion, searchResults, firstText, currentPage,
         setCurrentPage, setQuestions, setShowAnswerComponent, showAnswerComponent, fetchModel, mainText,questions,
          isLoggedIn, username,userID, user } = props;
    const [upperHeading, setUpperHeading] = useState(false);
    const [showTags, setShowTags] = useState(false)

    // console.log(user)
    if(user===null){
        fetchModel()
    }
    const displayQuestionsPage =  () =>  {
        setQuestions(newModel.questions)
        setSelectedQuestion(null);
        setShowAnswerComponent(false);
        setUpperHeading(true);
        setShowTags(false)
        document.getElementById('tags-link').style.backgroundColor='white'
        document.getElementById('questions-link').style.backgroundColor='lightgrey'
                document.getElementById('userprofile-link').style.backgroundColor='white'

        setCurrentPage('questions');
        ;
    }
    
    const displayTagsPage =  () => {
        setSelectedQuestion(null);
        setShowAnswerComponent(false);
        setUpperHeading(false);
        setShowTags(true)
        document.getElementById('tags-link').style.backgroundColor='lightgrey'
        document.getElementById('questions-link').style.backgroundColor='white'
        document.getElementById('userprofile-link').style.backgroundColor='white'

        setCurrentPage('tags');

    };
    
    const displayAskPage = () => {
        setSelectedQuestion(null);
        setShowAnswerComponent(null);
        setCurrentPage('ask-question');
    };
    const displayUserPage = () => {
        setSelectedQuestion(null);
        setShowAnswerComponent(null);
        setCurrentPage('profile');
        document.getElementById('tags-link').style.backgroundColor='white'
        document.getElementById('questions-link').style.backgroundColor='white'
        document.getElementById('userprofile-link').style.backgroundColor='lightgrey'

    };


    return (
        <>
            <div className="menu">
                <ul className="menu-link">

                    <li>
                        <button className="menu-link" id="questions-link" onClick={displayQuestionsPage}>Questions</button>
                    </li>
                    <li>
                        <button className="menu-link" id="tags-link" onClick={displayTagsPage} >Tags</button>
                    </li>
                    <li>
                        <button className="menu-link" id="userprofile-link" onClick={displayUserPage} >Profile</button>
                    </li>
                </ul>

            </div>

            {currentPage ==='profile' && <UserProfile  userID={userID} setCurrentPage={setCurrentPage} isLoggedIn={isLoggedIn} user={user} newModel={newModel} fetchModel={fetchModel}/>}
            
            {currentPage==='searchPage' && 
            <ShowSearch selectedQuestion={selectedQuestion}
            newModel={newModel}
            fetchModel={fetchModel}
             setSelectedQuestion={setSelectedQuestion}
              askPage={displayAskPage} showAnswerComponent={showAnswerComponent} 
              setShowAnswerComponent={setShowAnswerComponent}
              questions={searchResults}
              displayQuestionsPage={displayQuestionsPage} displayAskPage={displayAskPage}
              upperHeading={upperHeading} setUpperHeading={setUpperHeading}
             showUpperHeader={true} showTags={false}
             currentPage={currentPage} setCurrentPage={setCurrentPage}
             />
            }
            {currentPage === 'questions' && 
            <Questions newModel={newModel}  selectedQuestion={selectedQuestion}
            fetchModel={fetchModel} isLoggedIn={isLoggedIn}
             setSelectedQuestion={setSelectedQuestion} user={user}
              askPage={displayAskPage} showAnswerComponent={showAnswerComponent} 
              setShowAnswerComponent={setShowAnswerComponent}
             displayQuestionsPage={displayQuestionsPage} questions={questions}
              upperHeading={upperHeading} setUpperHeading={setUpperHeading}
             showUpperHeader={true} showTags={false}
             firstText={!firstText? 'All Questions' : firstText}
             secondText={''}
             mainText={mainText} currentPage={currentPage} setCurrentPage={setCurrentPage} username={username} userID= {userID}
              />}

            {currentPage === 'tags' && <Tag newModel={newModel} 
            fetchModel={fetchModel} selectedQuestion={selectedQuestion}
            tags={newModel.tags}
            showTags={true} setQuestions={setQuestions} setCurrentPage={setCurrentPage}
             setSelectedQuestion={setSelectedQuestion} 
             displayQuestionsPage={displayQuestionsPage}
             askPage={displayAskPage} showAnswerComponent={showAnswerComponent}
             setShowAnswerComponent={setShowAnswerComponent} />}


         </>
    );
}