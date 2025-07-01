import { Link, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import '../components/LoginBox.css'
import { useAuth } from "./AuthContext.jsx";

function LoginBox() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const { setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
  console.log('Fetching from backend...');

  fetch('http://localhost:5000/')
    .then(res => {
      console.log('Raw response:', res);
      return res.json();
    })
    .then(data => {
      console.log('Parsed JSON:', data);
      setMessage(data.message);
    })
    .catch(err => {
      console.error('Error fetching:', err);
    });
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      credentials:'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password
      })
    });

    const data = await response.json();
    if (data.success) {
      setIsAuthenticated(true);
      navigate("/dashboard");  // let React Router handle it
    } else {
      alert("Login failed");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="form">
        <div className="title-2"><span>{message}</span></div>

        <div className="input-container">
          <input
            placeholder="Username"
            type="text"
            className="input-mail"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>

        <section className="bg-stars">
          <span className="star"></span>
          <span className="star"></span>
          <span className="star"></span>
          <span className="star"></span>
        </section>

        <div className="input-container">
          <input
            placeholder="Password"
            type="password"
            className="input-pwd"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button className="submit" type="submit">
          <span className="sign-text">Sign in</span>
        </button>

        <p className="signup-link">
          New Agent? | <Link to="/signup">Sign up!</Link>
        </p>
      </form>

      {/* {message && <p>{message}</p>} */}
    </>
  );
}

export default LoginBox;