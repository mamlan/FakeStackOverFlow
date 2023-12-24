import React, {  } from "react";
import Questions from "./Questions";
export default function ShowSearch(props) {
  const { newModel, questions, displayQuestionsPage, displayAskPage,
     askPage,setSelectedQuestion, selectedQuestion, setShowAnswerComponent, showAnswerComponent } = props;
    let result = (questions.length===1? `1 Result` : ('${questions.length} Results'))
    console.log('inside showsearch')
    console.log(questions)

  return (
    <>
    <Questions questions={questions} displayAskPage={displayAskPage} showUpperHeader={true} 
    displayQuestionsPage={displayQuestionsPage} newModel={newModel} firstText={'Search Results'} secondText={''} mainText={result}
    askPage={askPage} setSelectedQuestion={setSelectedQuestion} selectedQuestion={selectedQuestion}
     setShowAnswerComponent={setShowAnswerComponent}
     showAnswerComponent={showAnswerComponent}/>

    </>
  );
}
