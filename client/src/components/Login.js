import { useEffect, useState } from "react";
import axios from "axios";


export default function Login(props){

    const { setCurrentPage, setUsername, setID, setIsLoggedIn } = props;
    //Need to get the list of users for comparision of emails and such
    const [allUsers, setAllUsers] = useState([])
    useEffect(()=>{
            axios.get('http://localhost:8000/users')
            .then(res=>{
                setAllUsers(res.data) //this is for a list of users and their data
            })
    },[])

    const handleSubmit = async (e) =>{

        e.preventDefault();
        const emailInput = e.target.email.value;
        const passwordInput = e.target.password.value;

        try {
            if (emailInput === '' || passwordInput === '') {
                document.getElementById('loginError').innerHTML = 'Invalid Input';
            }
            const user = allUsers.find((user) => user.email === emailInput);

            if(!user){
                document.getElementById('loginError').innerHTML = 'Invalid Input: Incorrect Email/Password!';
            }
            
            //At this point user is found
            const userPassword = user.password;
            const userId = user._id;
            console.log("this is the id in login"+ userId); //ID IS HERE MOVE IT TO PROPS
            //post the login
            console.log(passwordInput);
            axios.defaults.withCredentials=true
            const response = await axios.post(
                'http://localhost:8000/login',
                { emailInput, passwordInput, userPassword }
              );
                console.log(response)
            // const { token, user: { id, username, admin } } = response.data;
            if(response){
            // const {id} = response.data;
            
            console.log("this is the id in login after"+ userId);
            setID(userId);
            

            // localStorage.setItem('id', id);
            // setID(id);
            setUsername(emailInput);
            setIsLoggedIn(true)
            // setUser(response.data.user)
            setCurrentPage('questions');
            }
            else{
                document.getElementById('loginError').innerHTML = 'Invalid Input: Incorrect Email/Password!';
            }

        } catch (error) {
              document.getElementById('loginError').innerHTML = "Error, please try again!";
              console.log(error);
        }
    }

    return (
        <>
            <div className="login-form">
                <h1>Please Login Below</h1>
                    <form onSubmit={handleSubmit}>
                        <p>Email</p>
                        <br></br>
                        <input type="text" id="email" name="email" />
                        <p>Password</p>
                        <br></br>
                        <input id="password" type="password" name="password" /><br />
                        <p id="loginError"></p>
                        <button type="submit" className="login-button">Login!</button>
                    </form>
            </div>

        </>

    );
    
    }