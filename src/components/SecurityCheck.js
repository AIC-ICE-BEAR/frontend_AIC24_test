import React, { useState } from 'react';

const PasswordCheck = ({ onAccessGranted }) => {
    const [Username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);


    const correctUser = process.env.REACT_APP_USERNAME;
    const correctPassword = process.env.REACT_APP_PASSWORD;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === correctPassword && Username === correctUser) {
            onAccessGranted();
        } else {
            setError(true);
        }
    };

    return (
        <div>
            <header className="bg-gray-800 p-5 text-white text-center text-3xl w-full">
                <h1>Event Retrieval App</h1>
            </header>

            <div className="flex flex-col h-screen justify-center items-center text-center">
                <header className=" p-5 text-center text-3xl w-full">
                    <h1>Authentication</h1>
                </header>

                <div className="flex flex-col justify-center items-center w-96 h-96 border-2 border-black rounded-md">
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Enter Username"
                            value={Username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-60 mb-4 p-2 border border-black rounded"
                        />
                    </form>

                    <form onSubmit={handleSubmit}>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-60 mb-4 p-2 border border-black rounded"
                        />
                    </form>

                    <button className="w-1/2 p-2 rounded-md bg-gray-300 hover:bg-sky-300" type="submit">
                        Enter
                    </button>
                    {error && <p style={{ color: 'red' }}>Incorrect Password</p>}
                </div>


            </div>
        </div>

    );
};

export default PasswordCheck;
