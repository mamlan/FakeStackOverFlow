import React from "react";
import { useState } from "react";

export default function UpperHeader(props){
    const {questions, askPage, firstText, secondText}=props
        const [sortType, setSortType] = useState("newest");
        // props.sortType= sortType;
        let sortedQuestions= questions;

            if (sortType === "newest") {
                sortedQuestions=questions.sort((a, b) => b.askDate - a.askDate);
            } else if (sortType === "active") {
                questions.sort((a, b) => {
                    const lastAnswerIdA = a.ansIds.length > 0 ? a.ansIds[a.ansIds.length - 1] : "a0";
                    const lastAnswerIdB = b.ansIds.length > 0 ? b.ansIds[b.ansIds.length - 1] : "a0";
                    sortedQuestions= parseInt(lastAnswerIdB.slice(1)) - parseInt(lastAnswerIdA.slice(1));
                });
            } else if (sortType === "unanswered") {
                sortedQuestions = questions.filter((q) => q.ansIds.length === 0);
    
        }
    return(
        
        <div className="main-header">
            <div className="upper-heading" id="upper-heading">
                <h1>{firstText}</h1>
                <h2 id='empty'>{secondText}</h2>
                <button onClick={askPage} id="ask-button">Ask Question</button>
            </div>

            <div className="filter-buttons" id="upper-heading">
                ({console.log('buttons entered')})
                <p id="question-counter"> {questions.length} Questions</p>
                <button onClick={() => setSortType("newest")} id="newest-button">Newest</button>
                <button onClick={() => setSortType("active")} id="active-button">Active</button>
                <button onClick={() => setSortType("unanswered")} id="unanswered-button">Unanswered</button>
            </div>
        {/* <Questions questions={sortedQuestions}/> */}
        </div>
    )
}