import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { PATHS, SESSION_PATHS } from '../../routes/paths';
import logo from '../../assets/icons/Logo.svg';
import LoaderButton from '../../components/LoaderButton';

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });

  const toggleVisibility = (field: 'password' | 'confirmPassword') => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    console.log('Register attempt:', { name, email, password });
    navigate(PATHS.DASHBOARD);
  };

  return (
    <div className='auth-container d-flex align-items-center justify-content-center'>
      <div className='auth-card'>
        <div className='text-center'>
          <div className='w-100 d-flex justify-content-center mb-4 auth-logo' onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <img src={logo} alt='Website Logo' className='auth-logo' />
          </div>
          <h2 className='mb-2'>Create an account</h2>
          <p className='text-muted mb-4'>Please enter your details to sign up</p>
        </div>

        <div className='social-buttons d-flex gap-3 mb-3'>
          <button className='social-btn'>
            <img src='https://www.google.com/favicon.ico' alt='Google' />
            Google
          </button>
          <button className='social-btn'>
            <img src='https://www.apple.com/favicon.ico' alt='Apple' />
            Apple
          </button>
        </div>

        <div className='divider'>
          <span>or</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor='name' className='form-label'>
              Name
            </label>
            <div className='input-group'>
              <span className='input-group-text'>
                <User size={18} />
              </span>
              <input type='text' className='form-control' id='name' placeholder='Enter your name' value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          </div>

          <div className='mb-3'>
            <label htmlFor='email' className='form-label'>
              Email
            </label>
            <div className='input-group'>
              <span className='input-group-text'>
                <Mail size={18} />
              </span>
              <input type='email' className='form-control' id='email' placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          <div className='mb-3'>
            <label htmlFor='password' className='form-label'>
              Password
            </label>
            <div className='input-group'>
              <span className='input-group-text'>
                <Lock size={18} />
              </span>
              <input
                type={passwordVisibility.password ? 'text' : 'password'}
                className='form-control'
                id='password'
                placeholder='Enter new password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className='input-group-text' style={{ cursor: 'pointer' }} onClick={() => toggleVisibility('password')}>
                {passwordVisibility.password ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>

          <div className='mb-3'>
            <label htmlFor='confirmPassword' className='form-label'>
              Confirm Password
            </label>
            <div className='input-group'>
              <span className='input-group-text'>
                <Lock size={18} />
              </span>
              <input
                type={passwordVisibility.confirmPassword ? 'text' : 'password'}
                className='form-control'
                id='confirmPassword'
                placeholder='Confirm your password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span className='input-group-text' style={{ cursor: 'pointer' }} onClick={() => toggleVisibility('confirmPassword')}>
                {passwordVisibility.confirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>

          <LoaderButton type='submit' loadingText='Loading...' className='w-100 btn-loader-lg'>
            Sign up
          </LoaderButton>
        </form>

        <div className='signup-link'>
          Already have an account? <Link to={SESSION_PATHS.SIGNIN}>Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
