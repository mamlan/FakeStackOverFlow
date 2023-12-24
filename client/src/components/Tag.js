import { useState } from 'react';
export default function Tag(props){
    const {newModel, askPage, tags, showTags, setQuestions, setCurrentPage} = props;
    
    // const {questions}= newModel.data
    const [showQuestions, setShowQuestions] = useState(false);
    const [selectedTagQuestions, setSelectedTagQuestions] = useState([]);
    
     function returnAllTags() {
        const buttonsPerRow = 3;
        const rows = [];
        
        for (let i = 0; i < tags.length; i += buttonsPerRow) {
            const rowTags = tags.slice(i, i + buttonsPerRow);
            const rowButtons = rowTags.map((tag, index) => {
                console.log(tag)
                const tagQuestions =  getQuestionsBytID(tag._id);
                console.log(tagQuestions)
                return (
                    <button
                        key={i + index}
                        className="tags-btn"
                        onClick={() => HandleTagBtnClick(tagQuestions)}
                    >
                        <h3>{tag.name}</h3>
                        <h4>{tagQuestions.length} Questions</h4>
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
    
    function HandleTagBtnClick( tagQuestions){
        setSelectedTagQuestions(tagQuestions)
        setShowQuestions(true)
    }
     function getQuestionsBytID(tid){
        let ans=[]
        for (let i = 0; i < newModel.questions.length; i++) {
            let q = newModel.questions[i];
            const result = q.tags.filter((tag) => tag===tid);
            if (result.length > 0) ans.push(q);
        }
        return ans;     //returns
      }
    
    function showUpperHeader(){
        const tagsLen= tags.length;
        return(
            <div className="main-header">
            <div className="upper-heading" id="upper-heading">
                <h1>{tagsLen} Tags</h1>
                <h2 id='empty'>All Tags</h2>
                <button onClick={askPage} id="ask-button">Ask Question</button>
            </div>
            </div>
        )
    }
    if(showQuestions){
        setQuestions(selectedTagQuestions)
        setCurrentPage('questions')
    }
    // {showQuestions &&(setQuestions(selectedTagQuestions) && setCurrentPage('questions'))}
    return(
        <>
        <div>
            <>{showUpperHeader()}

            {showTags && !showQuestions && returnAllTags()}
            
             </>

        </div>
        </>
    );
    
}