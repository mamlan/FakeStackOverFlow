import { useState } from 'react';
import Answer from "./Answer.js";
import ShowAnswer from './ShowAnswer.js';
import axios from 'axios'
import { useEffect } from 'react';
export default function Questions(props){
    //need the props for the current state of the page, since this page will facilitate tags/questions/asking
    const { newModel, questions, showUpperHeader, hide, firstText, secondText, mainText, 
        askPage, displayQuestionsPage,showAnswerComponent, selectedQuestion, setSelectedQuestion,
        user, isLoggedIn, fetchModel,setCurrentPage, currentPage, userID } = props; // Destructure the newModel prop
    
    const [sortType, setSortType] = useState("newest");
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const questionsPerPage = 5;
    const totalPages = Math.ceil(questions.length / questionsPerPage);
    const displayedQuestions = displayQuestions(questions,sortType, setSelectedQuestion, newModel, currentPageNumber, questionsPerPage);
    const handleNextPage = () => {
        setCurrentPageNumber((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const handlePrevPage = () => {
        setCurrentPageNumber((prevPage) => Math.max(prevPage - 1, 1));
    };

    useEffect(() => {
        setCurrentPageNumber(1); //reset to first page
    }, [questions]);
    
    let content = null;

    if (selectedQuestion !== null) {
        console.log(selectedQuestion)
        // selectedQuestion.views++;
        const updateIncrement= async (q)=>{
            console.log(q._id)
            await axios.put('http://localhost:8000/updateincrement', {_id:q._id})
        }
         updateIncrement(selectedQuestion)
        selectedQuestion.views++;

        content=<ShowAnswer newModel={newModel} user={user} selectedQuestion={selectedQuestion} userID={userID} isLoggedIn={isLoggedIn} setCurrentPage={setCurrentPage} />
        
    } else {
        content = (
            <>
            {(!hide)&&showUpperHeader&&
                    <div className="main-header">
                    <div className="upper-heading" id="upper-heading">
                        <h1>{firstText}</h1>
                        <h2 id='empty'>{secondText}</h2>
                        {isLoggedIn&&<button onClick={askPage} id="ask-button">Ask Question</button>}
                    </div>
        
                    <div className="filter-buttons" id="upper-heading">
                        <p id="question-counter"> {!mainText ? questions.length+ '  Questions': mainText}</p>
                        <button onClick={() => setSortType("newest")} id="newest-button">Newest</button>
                        <button onClick={() => setSortType("active")} id="active-button">Active</button>
                        <button onClick={() => setSortType("unanswered")} id="unanswered-button">Unanswered</button>
                    </div>
                {/* <Questions questions={sortedQuestions}/> */}
                </div>
            }

            <div id="questions-container">
                {displayedQuestions}
            </div>
            <div className="page-buttons">
                    <button className='prev-button' onClick={handlePrevPage} disabled={currentPageNumber === 1}>Prev</button>
                    <span id='page-buttons'>{`Page ${currentPageNumber} of ${totalPages}`}</span>
                    <button className='next-button' onClick={handleNextPage} disabled={currentPageNumber === totalPages}>Next</button>
            </div>

        </>
    );
  }
    
    if(!showAnswerComponent){
        
        return(
            <>
                {content}
        
            </>
        );
    }

    else{
        return(
            <> 
               {isLoggedIn&& <Answer newModel={newModel} fetchModel={fetchModel} question={selectedQuestion} 
                questions={questions} displayQuestionsPage={displayQuestionsPage} setCurrentPage={setCurrentPage} currentPage={currentPage}/>}
            </>
        )
    }

}
export function formatQuestionMetadata(question) {
    // console.log("format questions entered")
    // console.log(question)
    const now = new Date();
    const questionDate= new Date(question.ask_date_time)

    const timeDifference = now - questionDate;
    if (timeDifference < 60000) {
        return "Posted less than a minute ago";
    } else if (timeDifference < 3600000) {
        const minutes = Math.floor(timeDifference / 60000);
        return `Posted ${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (timeDifference < 86400000) {
        const hours = Math.floor(timeDifference / 3600000);
        return `Posted ${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
        // console.log(typeof question.ask_date_time)
        // return `${question.asked_by} asked ${question.ask_date_time} at ${question.ask_date_time}`
        return `${question.asked_by} asked ${questionDate.toLocaleString("default", {
            month: "short",
            day: "numeric",
        })} at ${question.ask_date_time}`;
    }

}

export function formatAnswerDate(answer) {
    const now = new Date();
    const answerDate= new Date(answer.ans_date_time)

    const timeDifference = now - answerDate;
    if (timeDifference < 60000) {
        return "Posted less than a minute ago";
    } else if (timeDifference < 3600000) {
        const minutes = Math.floor(timeDifference / 60000);
        return `Answered ${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (timeDifference < 86400000) {
        const hours = Math.floor(timeDifference / 3600000);
        return `Answered ${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
        return `${answer.ans_by} answered ${answerDate.toLocaleString("default", {
            month: "short",
            day: "numeric",
        })} at ${answerDate.toISOString([], { hour: "2-digit", minute: "2-digit" })}`;
    // })} at ${answerDate}`;

    }
}

export function renderQuestionTitleButton(question, setSelectedQuestion) {
    // console.log(question)
    return (
        <button className="question-button" onClick={() => { 
             
            setSelectedQuestion(question)
        }}>
            {question.title}
        </button>
    );
}


export function renderTagList(question, tags) {

    const tagElements = question.tags.map((tagId) => {
        const tagInfo = tags.find((tag) => tag._id === tagId);
        return (
            <span key={tagId} className="tag" style={{ border: "1px solid #000", backgroundColor: "skyblue", padding: "3px", marginRight: "5px" }}>
                {tagInfo.name}
            </span>
        );
    });

    return (
        <div className="tag-list">
            {tagElements}
        </div>
    );
}
export function displayQuestions(questions, sort, setSelectedQuestion, newModel, currentPageNumber, questionsPerPage){ 

    const startIndex = (currentPageNumber - 1) * questionsPerPage;
    let currentPageQuestions = questions.slice(startIndex, startIndex + questionsPerPage);


    if (sort === "newest") {
        currentPageQuestions.sort((a, b) => {
            const b1= new Date(b.ask_date_time)
            const a1= new Date(a.ask_date_time)
            return b1 - a1});
    } else if (sort === "active") {
        currentPageQuestions.sort((a, b) => {
            const lastAnswerIdA = a.answers.length > 0 ? a.answers[a.answers.length - 1] : "a0";
            const lastAnswerIdB = b.answers.length > 0 ? b.answers[b.answers.length - 1] : "a0";
            return parseInt(lastAnswerIdB.slice(1)) - parseInt(lastAnswerIdA.slice(1));
        });
    } else if (sort === "unanswered") {
        currentPageQuestions = currentPageQuestions.filter((q) => q.answers.length === 0);

}

    //display the questions

    
    return currentPageQuestions.map((question) => (
        
        <div key={question.qid} className="metadata-container" style={{ borderBottom: "dotted", paddingBottom: "10px" }}>
            <div className="left-section">
                <p>{question.answers.length} Answers <br /> {question.views} Views</p>
            </div>
            <div className="middle-section">
                {renderQuestionTitleButton(question,setSelectedQuestion)}
                <div className="tag-list" style={{ marginTop: "20px" }}>
                    {renderTagList(question, newModel.tags)}
                </div>
            </div>
            <div className="right-section">
                {formatQuestionMetadata(question)}
            </div>
            
        </div>
    ));

}
export function processQuestionText(text) {
    
    const regex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;

    const processedText = text.replace(regex, (match, name, url) => {
        return `<a href="${url}" target="_blank">${name}</a>`;
    });

    return processedText;
}

export function renderQuestionText(question) {
    return <p className="middle-text" dangerouslySetInnerHTML={{ __html: question.text }} />;
}

export function processAnswerText(text) {
    
    const regex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;

    const processedText = text.replace(regex, (match, name, url) => {
        return `<a href="${url}" target="_blank">${name}</a>`;
    });

    return processedText;
}

export function renderAnswerText(answer) {
    const processedText = processAnswerText(answer.text);
    return <p dangerouslySetInnerHTML={{ __html: processedText }} />;
}