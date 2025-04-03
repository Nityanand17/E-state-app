import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './register.css';
import { API_URL } from '../../utils/constants';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('login-page');
    return () => {
      document.body.classList.remove('login-page');
    };
  }, []);

  const createUser = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/register`, {
        EmailID: email.trim(),
        Password: password.trim()
      });

      console.log('✅ User created:', response.data);
      
      // Store token in localStorage
      localStorage.setItem('authToken', response.data.token);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.status === 409) {
        setError('User with this email already exists');
      } else {
        setError(err.response?.data?.message || 'Failed to create user');
      }
      console.error('❌ Error creating user:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrapper">
      <form onSubmit={createUser}>
        <h1>Register</h1>

        {error && <div className="error-message">{error}</div>}

        <div className="input-box">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <i className='bx bxs-user'></i>
        </div>

        <div className="input-box">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <i className='bx bxs-lock-alt'></i>
        </div>

        <div className="input-box">
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
          />
          <i className='bx bxs-lock-alt'></i>
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
        <div className="register-link">
          <p>
            Already have an account? <Link to="/">Login</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;