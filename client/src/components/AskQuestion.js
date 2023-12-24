import { useState } from 'react';
import axios from 'axios'

export default function AskQuestion(props){

    const { newModel, fetchModel, setCurrentPage } = props;

    const [formData, setFormData] = useState({
        title: '',
        text: '',
        tags: '',
        summary: '',
    });

    const [formErrors, setFormErrors] = useState({
        title: '',
        text: '',
        tags: '',
        summary: '',
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
    function findtID(id){
        for(let i=0;i<newModel.tags.length;i++){
            let tag=newModel.tags[i];
            console.log("Tag in new Model: "+ tag);
            console.log(tag.name.toLowerCase() + " see the diff "+ id.toLowerCase());
          if(tag.name.toLowerCase()===id.toLowerCase()){
            return tag._id;
          }
        }
        return null
        }

    const handleSubmit = async (e) => {
        e.preventDefault(); 

        console.log("Handling Submit of Question");


        console.log("Handling Submit of Question");

        const response = await axios.get('http://localhost:8000/auth', {withCredentials: true});
        const user= response.data.user
        console.log(user)

        let { title, text, tags, summary } = formData;
        const newFormErrors = { ...formErrors };

        if (title.length > 50 || title.length === 0) {
            newFormErrors.title = 'Please make sure the title is not empty and is 100 characters or less.';
        }

        if (text.length === 0) {
            newFormErrors.text = 'Text must not be empty.';
        } else{
            for (let i = 0; i < text.length - 2; i++) {
                if ((text[i] === ']' && text[i + 1] === '(' && text[i + 2] === ')') ||
                    (text[i] === '[' && text[i + 1] === ']' && text[i + 2] === '(')) {
                         newFormErrors.text = 'Invalid hyperlink format';
                }
                else if((text[i] === ']' && text[i + 1] === '(' && text[i + 2] !== 'h')){
                    newFormErrors.text = 'Invalid hyperlink format';
            }
            }
        
           
            const endIndex = text.length - 1;
            if ((text[endIndex - 1] === ']' && text[endIndex] === '(') ||
                (text[endIndex - 1] === '[' && text[endIndex] === ')')) {
                    newFormErrors.text = 'Invalid hyperlink format';
            }
        }

        console.log("error checking done");


        console.log("error checking done");


        const allTags = tags.split(' ').filter(tag => tag.trim() !== '');

        if (allTags.length > 5 ) {
            newFormErrors.tags = 'Invalid number of tags.';
        }

        console.log("entering loop");


        for (let i = 0; i < allTags.length; i++) {
            console.log("iterating");

            if (allTags[i].length > 10) {
                newFormErrors.tags = 'Each tag must not exceed 10 characters.';
                break;
            }
        }

        if (summary.length === 0) {
            newFormErrors.summary = 'Summary must not be empty.';
        }
        console.log('here')
        if(summary.length>140){
            newFormErrors.summary = 'Summary must be 140 characters or less.';
        }
        console.log('here')
        for(let i = 0; i < allTags.length; i++){
            //iterate through tags for the question

            try{
            console.log("iterating tags for Q");

            try{
            console.log("iterating tags for Q");
            const value= findtID(allTags[i])
            if(value==null&& user.reputation<50){
                newFormErrors.tags='Must have at least 50 reputations to post a new tag.'
                break;
            }

            if(value==null){
            //tag does not exist, so create a new one
                let newTag = {
                name: allTags[i],
            }
            const response = await axios.post('http://localhost:8000/newtag', {tag: newTag, user: user})
            await axios.put('http://localhost:8000/addtagtouser', {userID: user._id, tag  : response.data._id})
        }
    } catch(error){
        console.error('Error in loop:', error);
    }
    //tag DOES exist, so just add it to the questions tagIds array
            // else{
                
            //     let oldID = findtID(allTags[i]); //will return the tid
            //     questionObject.tagIds.push(oldID);
            // }
    } catch(error){
        
        console.error('Error in loop:', error);
    }
    //tag DOES exist, so just add it to the questions tagIds array
            // else{
                
            //     let oldID = findtID(allTags[i]); //will return the tid
            //     questionObject.tagIds.push(oldID);
            // }
        }
        // Check if there are any errors

        console.log("here");
        if (Object.values(newFormErrors).some((error) => error !== '')) {
            setFormErrors(newFormErrors);
            console.log('There are errors')
        } 
        
        else {

            console.log("hereee");
            
            // const id = `q${sizeQ}`;
            const realTags = [];
            for(let i=0;i<allTags.length;i++){
                console.log('second loop')
                const tempTag= findtID(allTags[i])  //returns ._id
                console.log(tempTag)
                console.log(allTags);
                realTags.push(tempTag)
                await axios.put('http://localhost:8000/updatetaguser', {tag: tempTag, usedBy: user})
            }

            const date = new Date();
            console.log(realTags);
            const questionObject = {
                // qid: id,
                title: title,
                text: text,
                summary: summary,
                tagIds: realTags,
                askedBy: user.username,
                askDate: date,
                ansIds: [],
                views: 0,
                comments: [],
                voteCount: 0,
                votes: [],
            };
            console.log("New Question: "+ questionObject.tagIds);

        //    newModel.addQuestion(questionObject, question);
            console.log('into posting')
           const response = await axios.post('http://localhost:8000/newquestion', questionObject)
           await axios.put('http://localhost:8000/addquestiontouser', {userID: user._id, questionID: response.data._id}) 
           console.log('reached')

                

            setFormData({
                title: '',
                text: '',
                tags: '',
                summary:'',
            });

            setFormErrors({
                title: '',
                text: '',
                tags: '',
                summary: '',
            });
            fetchModel()
            console.log('before switching page')
            setCurrentPage('questions');
        }
    
       
    };

    return (
        <form>
            <div className="question-form">
            <label htmlFor="title">Question Title*</label>

                <div className="form-group">
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Title (up to 50 characters)"
                        
                    />
                    <p className="error-message">{formErrors.title}</p>
                </div>
                
                <label htmlFor="text">Question Text*</label>

                <div className="form-group">
                    <textarea
                        id="text"
                        name="text"
                        value={formData.text}
                        onChange={handleInputChange}
                        placeholder="Question Text"
                    />
                    <p className="error-message">{formErrors.text}</p>
                </div>
                <label htmlFor="tags">Tags</label>

                <div className="form-group">
                    <input
                        type="text"
                        id="tags"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        placeholder="web-scripting html urls)"
                    />
                    <p className="error-message">{formErrors.tags}</p>
                </div>

                <label htmlFor="username">Summary*</label>
                <div className="form-group">
                    
                    <input
                        type="text"
                        id="summary"
                        name="summary"
                        value={formData.summary}
                        onChange={handleInputChange}
                        placeholder="Summary"

                    />
                    <p className="error-message">{formErrors.summary}</p>
                </div>
                <button type="submit" onClick={handleSubmit} className="btn" id="postq">Post Question</button>
            </div>

            
        </form>
    );
}

//when posting a question with a tag that exists, add the tag to the question