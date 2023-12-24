
export default function Welcome(props){

    const { setCurrentPage } = props;

    const guestLogin = () => {
        setCurrentPage('questions'); //?  have to make custom props for this to work correctly
    }
    const login = () => {
        setCurrentPage('login'); //make component for this
    }
    const signUp = () => {
        setCurrentPage('signup'); // make component for this too
    }



    return(
        <>
            
            <div className="welcome-page">
                <h1>Welcome to Fake Stack Overflow</h1>
                <button onClick={signUp} className="welcome-button">Sign Up</button>
                <button onClick= {login} className="welcome-button">Login</button>
                <button onClick= {guestLogin} className="welcome-button">Proceed as Guest</button>
            </div>

        </>
        
    )

}