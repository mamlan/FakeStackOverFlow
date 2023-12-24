import axios from 'axios'
import { useEffect, useState } from "react";

export default function SignUp({setCurrentPage}){
    const [allUsers, setAllUsers] = useState([])

    useEffect(()=>{
             axios.get('http://localhost:8000/users').then(res=>{
                setAllUsers(res.data)
            })
        })

    async function checkEmail(email){
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const foundUser = allUsers.find((user) => user.email.toLowerCase() === email.toLowerCase());
         if(!emailRegex.test(email)){
            document.getElementById('errorHandlingEmail').innerText='Invalid email format. Please enter a valid email address.'
            return false;
         }
         else if(foundUser){
            document.getElementById('errorHandlingEmail').innerText='Email address already exists.'
            return false;
         }
         else{
            document.getElementById('errorHandlingEmail').innerText=''
            return true;

         }
    }
    async function checkPassword(first, second, email){
        const emailSplit = email.split(' ')
        if(first!==second){
            document.getElementById('errorHandlingRegPw').innerText='Passwords do not match.'
            return false;
        }
        else if(first.includes(emailSplit[0])){
            document.getElementById('errorHandlingRegPw').innerText='Password must not contain email.'
            return false;
        }
        else{
            document.getElementById('errorHandlingRegPw').innerText=''
            return true;
        }
    }

    const handleSubmit = async (e)=> {
        let valid = true;
        e.preventDefault()
        if(e.target.username.value==='' || e.target.email.value==='' || e.target.password.value===''|| e.target.passwordAgain.value !==e.target.password.value){
            document.getElementById('errorHandlingReg').innerHTML='Cannot have empty fields.'
            valid=false;
        }
        else if(!await checkEmail(e.target.email.value)){
            valid=false;
        }
        else if(!await checkPassword(e.target.password.value, e.target.passwordAgain.value, e.target.email.value)){
            valid=false;
        }

        if(valid){
            try {
                await axios.post('http://localhost:8000/newUsers', {
                    username: e.target.username.value,
                    password: e.target.password.value,
                    email: e.target.email.value,
                });
                setCurrentPage('login');
            } catch (error) {
                console.log(e, 'error posting user credentials')
                 
            }
        }
    }

    return(
        <>
        <div className='welcomeBody'>
            <div className='welcome'>
                <h2> Create a New Account</h2>
                <form onSubmit={handleSubmit}>
                    <p>Username*</p>
                    <input type='text' id='username' name='username'placeholder='username'></input>
                    <br></br>
                    <p>Email*</p>
                    <input type='text' id='email' name='email'placeholder='email'></input>
                    <p id='errorHandlingEmail' className='errorHandlingEmail'></p>
                    <br></br>
                    <p>Password*</p>
                        <input type="password" id="password" name="password" placeholder='password'/>
                        <p id='errorHandlingRegPw' className='errorHandlingPw'></p>
                    <br></br>
                    <p>Reenter Password*</p>
                        <input type="password" id="passwordAgain" name="passwordAgain" placeholder='password'/>
                    <br></br>
                    <p id='errorHandlingReg' className='errorHandling'></p>
                    <button className='postBtn'>Sign Up</button>
                </form>
            </div>
        </div>
        </>
    )
}