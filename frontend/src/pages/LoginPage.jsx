import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setErrorMessage('');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (
      storedUser &&
      storedUser.email === email &&
      storedUser.password === password
    ) {
      navigate('/home');
    } else {
      setErrorMessage('Invalid login credentials');
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();

    const existingUser = JSON.parse(localStorage.getItem('user'));

    if (existingUser && existingUser.email === email) {
      setErrorMessage('This email is already registered');
    } else {
      const user = {
        firstName,
        lastName,
        email,
        password,
      };
      localStorage.setItem('user', JSON.stringify(user));
      alert('Signup successful! You can now log in.');
      resetForm();
      setIsSignup(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isSignup ? 'Sign Up' : 'Login'}
        </h1>

        <form
          onSubmit={isSignup ? handleSignup : handleLogin}
          className="space-y-4"
        >
          {errorMessage && (
            <div className="text-red-500 text-center">{errorMessage}</div>
          )}

          {isSignup && (
            <>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </>
          )}

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {isSignup ? 'Sign Up' : 'Login'}
          </button>

          <p className="text-center mt-4 text-sm">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup);
                resetForm();
              }}
              className="text-blue-600 hover:underline"
            >
              {isSignup ? 'Login here' : 'Sign up here'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
