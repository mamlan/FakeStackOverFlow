import Menu from './Menu.js';
import { useState } from 'react';
import axios from 'axios';
export default function Header(props){

    //here is where the search functionality would go

    const { newModel, questions, fetchModel, setShowAnswerComponent, setQuestions, currentPage, setCurrentPage,
         selectedQuestion, setSelectedQuestion, user, isLoggedIn, setIsLoggedIn, username, userID} = props;
    const [filteredQuestions, setFilteredQuestions]=useState([]);
    const[searchValue, setSearchValue]= useState("");
    const[clicked, setClicked]= useState(false);
    function handleInputChange(e){
        setSearchValue(e.target.value)
    }
    let mainText=''


    function handleKeyDown(e){
        if(e.key==='Enter'){
            setClicked(true)
            setCurrentPage('searchPage')
            var tags= getTags(searchValue); //gets all tids found in search input
            console.log(tags)
            let temp = searchValue.replace(/\[[^\]]*\]/g, '');
            temp = temp.split(/\s+/)
            let words= temp.filter(word => word !==""); //returns all words in search input
            const tempQuestions = filterQuestions(words, tags);
            console.log(tempQuestions)
            // setQuestions(filteredQuestions)
            setFilteredQuestions(tempQuestions)
            
        }
    }
    function filterQuestions(words, tags){
        var allQuestions =[]
        for(let i=0;i<questions.length;i++){
            let question = questions[i];
            let matches=false;
            for(let j=0;j<words.length;j++){
                const regex= new RegExp(words[j], 'i')
                if(regex.test(question.title)){
                    console.log("if statement entered")
                    matches=true;
                    break;
                }
            }
            if(matches===false){
                for(let j=0;j<tags.length;j++){
                    for(let k=0;k<question.tags.length;k++){
                        console.log(question.tags)
                        if(tags[j].toLowerCase()===question.tags[k].toLowerCase()){
                            matches=true;
                            break;
                        }
                    }
                }

            }
            if(matches){
                allQuestions.push(question)
                console.log(allQuestions.length)
            }
            matches=false;
    }
    mainText= (allQuestions.length===1? `${allQuestions.length} Result` : `${allQuestions.length} Results`)
    return allQuestions;

}

    async function logout(){

        await axios.get(
            'http://localhost:8000/logout',{
                withCredentials: true}
        )
        setCurrentPage('welcome');


    }

    function getTags(s){  //function searches for tag names and returns the tagid 
        const regex= /\[([^\]]+)\]/g;
        let temp=[]
        let match;
      
      while((match=regex.exec(s))!==null){
          temp.push(match[1])
      }
      var tags=[]
      for(let i=0;i<temp.length; i++){
        console.log(temp[i])
          const val=newModel.tags.find(temp[i])
          console.log(val)
          if(val!=null){
              tags.push(val);
          }
      }
        return tags;
      }


    return (
        <>
        <div className='header'>
            <div className="irr"></div>
            {isLoggedIn&&<div className='user-stuff'>
                <button id='logout' onClick={logout}>Logout</button>
            </div>}
            <div className="title">
                <h1>Fake Stack Overflow</h1>
            </div>
            <div className="searchbar">
                <input type="text" id="searchQuery" onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder="Search..." /> 
            </div>
            
        </div>
        {clicked?<Menu hide={true} user = {user} setShowAnswerComponent={setShowAnswerComponent} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setSelectedQuestion= {setSelectedQuestion} selectedQuestion={selectedQuestion} setQuestions={setQuestions} questions={questions} fetchModel={fetchModel} currentPage={currentPage}searchResults={filteredQuestions} newModel={newModel} setCurrentPage={setCurrentPage} username={username} userID= {userID}/>
        : 
         <Menu hide={false} user = {user} isLoggedIn={isLoggedIn} setShowAnswerComponent={setShowAnswerComponent} setIsLoggedIn={setIsLoggedIn} setQuestions={setQuestions} setSelectedQuestion= {setSelectedQuestion} selectedQuestion={selectedQuestion}questions={questions} fetchModel={fetchModel} currentPage={currentPage} searchResults={null} newModel={newModel} setCurrentPage={setCurrentPage} username={username} userID= {userID}/>}
        </>
    );
}