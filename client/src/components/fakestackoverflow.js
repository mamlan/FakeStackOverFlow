import React from 'react';
import axios from 'axios'
import Header from './Header.js'
import Welcome from './Welcome.js'
import SignUp from './SignUp.js';
import Login from './Login.js';
import AskQuestion from './AskQuestion.js';
import Answer from './Answer.js';

//import '../index.css'
export default class FakeStackOverflow extends React.Component {
  constructor(props){
    super(props)
    this.state={
      questions:[],
      tags: [],
      answers:[],
      users:[],
      comments:[],
      newModel:undefined,
      currentPage:'welcome',
      ID: '',      // <-- Add userId to state
      username: '',    // <-- Add username to state
      user: null,
      isLoggedIn: false,
      showAnswerComponent:false,
      selectedQuestion: null, //for answer component
      showTags: false,

    }
  }

  //not sure how these work but it should be the same as useState
  setID = (id) => {
    console.log("setting id! " + id)
    this.setState({ ID: id });
  };
  setUsername = (name) => {
    this.setState({ username: name });
  };
  setShowTags= (bool) => {
    this.setState({ showTags: bool });
  };
  setShowAnswerComponent = (bool) => {
    this.setState({ showAnswerComponent: bool });
  };
  setIsLoggedIn=(bool)=>{
    this.setState({isLoggedIn: bool})
  }
  setUser=(user)=>{
    this.setState({user: user})
  }
  componentDidMount() {
    this.fetchModel();
  }  

   fetchModel = async () => {
    console.log(this.state.isLoggedIn)

    let questions, users, tags, answers;

      try{
      questions = await axios.get('http://localhost:8000/questions');
      //console.log(questions.data)
      this.setState({ questions: questions.data });
      }catch(e){
        console.log('error getting questions', e)
      }

      try{
       tags = await axios.get('http://localhost:8000/tags');
      this.setState({ tags: tags.data });
      }catch(e){
        console.log('error getting tags', e)
      }
      try{
        users = await axios.get('http://localhost:8000/users');
       this.setState({ users: users.data });
       }catch(e){
         console.log('error getting users', e)
       }
      //  try{
      //   comments = await axios.get('http://localhost:8000/comments');
      //  this.setState({ comments: comments.data });
      //  }catch(e){
      //    console.log('error getting comments', e)
      //  }

      try{
       answers = await axios.get('http://localhost:8000/answers');
      this.setState({ answers: answers.data });
    }catch(e){
      console.log('error getting answers', e)
    }

    try {
      const response = await axios.get('http://localhost:8000/auth', {withCredentials: true});
    
      if ( response.data.user) {
        console.log(response.data)
        this.setState({
          isLoggedIn: true,
          user: response.data.user,
          currentPage: 'questions',
        });
      } else {
        this.setState({ isLoggedIn: false });
      }
    } catch (error) {
      console.error('Error fetching auth info:', error);
      this.setState({ isLoggedIn: false });

    } 

      const model = {
        questions: questions.data,
        tags: tags.data,
        answers:answers.data,
        users:users.data,
        //comments:comments.data
      }
      this.setState({newModel: model})

  };
  setQuestions = (newQuestions) => {
    this.setState({ questions: newQuestions });
  };

  setCurrentPage = (page) => {
    this.setState({ currentPage: page });
  };

  setSelectedQuestion = (question) => {
    this.setState({ selectedQuestion: question });
  };

  
  renderContent() {
    
    switch (this.state.currentPage) {
      case 'welcome': //handle the default welcome page
        return <Welcome setCurrentPage={this.setCurrentPage} />;
      case 'login': //handle the login page
        return <Login setCurrentPage={this.setCurrentPage} setUsername={this.setUsername} setIsLoggedIn={this.setIsLoggedIn} 
        setID={this.setID}/>
      case 'signup': //handle the signup page
        return <SignUp setCurrentPage={this.setCurrentPage} />
      case 'questions':
        return <Header user={this.state.user}  isLoggedIn={this.state.isLoggedIn} showAnswerComponent={this.state.showAnswerComponent} setShowAnswerComponent={this.setShowAnswerComponent} setIsLoggedIn={this.setIsLoggedIn} selectedQuestion= {this.state.selectedQuestion}
         setSelectedQuestion= {this.setSelectedQuestion} newModel= {this.state.newModel} setQuestions={this.setQuestions}currentPage={this.state.currentPage}
        fetchModel={this.fetchModel}  setCurrentPage={this.setCurrentPage} questions={this.state.questions} setID={this.setID} username={this.state.username} userID= {this.state.ID}/>
      case 'ask-question':
        return <AskQuestion newModel={this.state.newModel} user={this.state.user} fetchModel={this.fetchModel} setCurrentPage={this.setCurrentPage} userID={this.state.ID} /> 
      case 'answer':
        return <Answer username={this.state.username} newModel={this.state.newModel} user={this.state.user} fetchModel={this.fetchModel} questions={this.state.selectedQuestion} setCurrentPage={this.setCurrentPage}/>
      case 'tags':
        return <Header user={this.state.user} isLoggedIn={this.state.isLoggedIn}showAnswerComponent={this.state.showAnswerComponent} setShowAnswerComponent={this.setShowAnswerComponent} 
        setIsLoggedIn={this.setIsLoggedIn} selectedQuestion= {this.state.selectedQuestion} 
        setSelectedQuestion= {this.setSelectedQuestion} newModel= {this.state.newModel} setQuestions={this.setQuestions}currentPage={this.state.currentPage}
        fetchModel={this.fetchModel}  setCurrentPage={this.setCurrentPage} questions={this.state.questions} setID={this.setID} setUsername={this.setUsername}
         username={this.username} userID= {this.ID}/> 
         case 'profile':
          return <Header user={this.state.user} isLoggedIn={this.state.isLoggedIn}showAnswerComponent={this.state.showAnswerComponent} setShowAnswerComponent={this.setShowAnswerComponent} 
          setIsLoggedIn={this.setIsLoggedIn} selectedQuestion= {this.state.selectedQuestion} 
          setSelectedQuestion= {this.setSelectedQuestion} newModel= {this.state.newModel} setQuestions={this.setQuestions}currentPage={this.state.currentPage}
          fetchModel={this.fetchModel}  setCurrentPage={this.setCurrentPage} questions={this.state.questions} setID={this.setID} setUsername={this.setUsername}
           username={this.username} userID= {this.ID}/> 
         

        default:
        return <div>Invalid page</div>;
    }
  }

  render() {
    if (!this.state.newModel) {
      return <div>Loading...</div>; // Model not fetched from db yet
    }
    return (
      //returns the proper section but now we make it based of what button they clicked
      
      <>
        {this.renderContent()}
        {/* ... (other components or sections) */}
      </>
          //Keep here for reference of how we first launched the site.
          //<section className="fakeso">
          //<Header newModel= {this.state.newModel} setQuestions={this.setQuestions} currentPage={this.state.currentPage} fetchModel={this.fetchModel} setCurrentPage={this.setCurrentPage} questions={this.state.questions}/>
          //</section>
      
    )

  }
}
/**
 * whats left:
 * when asking a question, the username field isnt required bc it can be access thru /auth oute
 *  A new tag name can only be created by a user with at least 50 reputation points.
 * when answered a question, user is taken back to answers page
 * newest, active, and unaswered buttons dont work if there are more than 5 questions
 */
