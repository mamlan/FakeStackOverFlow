
import { useState } from 'react';
import axios from 'axios'

export default function Answer(props){

    const {questions, setCurrentPage, newModel, fetchModel, user} = props;
    const [formData, setFormData] = useState({
        
        username: '',
        text: '',

    });
    const [formErrors, setFormErrors] = useState({

        username: '',
        text: '',

    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });

        setFormErrors({
            ...formErrors,
            [name]: '',
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        console.log(questions)
        // const response= await axios.get('http://localhost:8000/getuserdetail', {username})
        
        console.log("USERNAME:" +user.username)
        const { text } = formData;
        const newFormErrors = { ...formErrors };

        if (text.length === 0) {
            newFormErrors.text = 'Text must not be empty.';
        }  else{
            for (let i = 0; i < text.length - 2; i++) {
                if ((text[i] === ']' && text[i + 1] === '(' && text[i + 2] === ')') ||
                    (text[i] === '[' && text[i + 1] === ']' && text[i + 2] === '(')) {
                         newFormErrors.text = 'Invalid hyperlink format';
                }
            }
        
           
            const endIndex = text.length - 1;
            if ((text[endIndex - 1] === ']' && text[endIndex] === '(') ||
                (text[endIndex - 1] === '[' && text[endIndex] === ')')) {
                    newFormErrors.text = 'Invalid hyperlink format';
            }
        }

        // Check if there are any errors
        if (Object.values(newFormErrors).some((error) => error !== '')) {
            setFormErrors(newFormErrors);
        } else {
            
            // console.log(model);
            console.log(newModel)
            
            const date = new Date().toUTCString;
            const answerObject = {
                text: text,
                ansBy:user.username,
                ansDate: date,
                voteCount: 0,
                comments: [],
                votes: [],
            };

        //    model.addAnswer(answerObject, question);
        console.log('first call')
        //   const res= await axios.post('http://localhost:8000/newanswer', {answer: answerObject})
          console.log('second call')
        //   console.log("Questions:" + questions);
          await axios.put('http://localhost:8000/addanswertoquestion', {answer: answerObject, question: questions, userID: user._id})
            // console.log(res.data.newAnswer._id);
            // await axios.put('http://localhost:8000/addanswertouser', {answer: res.data.newAnswer, id: user._id})
          setFormData({
                title: '',
                text: '',
                tags: '',
                username: '',
            });

            setFormErrors({
                title: '',
                text: '',
                tags: '',
                username: '',
            });
            fetchModel()
            setCurrentPage('questions')
        }

        
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="question-form">
                <label htmlFor="text">Answer Text*</label>

                <div className="form-group">
                    <textarea
                        id="text"
                        name="text"
                        value={formData.text}
                        onChange={handleInputChange}
                        placeholder="Answer Text"
                    />
                    <p className="error-message">{formErrors.text}</p>
                </div>
                <button type="submit" className="btn" id="postq">Post Answer</button>
            </div>   
        </form>
    );
}