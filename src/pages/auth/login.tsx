import { useState } from 'react';
import { useRouter } from 'next/router';
import '@/app/styles/globals.scss';
import firebaseService from '@/app/services/firebaseService';
import Message from '@/app/components/Message';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError('');
  };

  const setError = (error: any) => {
    setErrorMessage(error);
    setTimeout(() => setErrorMessage(''), 3000);
  }

  const setMessage = (msg: any) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3000);
  }

  const handleEmailLogin = async () => {
    let error = '';
    if (!email) {
      error = 'Correo obligatorio';
    }
    if (!password) {
      error += (error != '' ? '\n' : '') + 'Contraseña obligatoria'
    }

    if (error != '') {
      setError(error)
      return
    }

    try {
      await firebaseService.loginUserWithEmail(email, password);
      setMessage('Login con email correcto');
      router.push('/');
    } catch (error: any) {
      setError(error.message)
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await firebaseService.loginUserWithGoogle();
      router.push('/');
    } catch (error: any) {
      setError(error.message)
    }
  };

  return (
    <div className="containerForm">
      <div className="form-container">
        {/* <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
          className={`form-input ${emailError ? 'error' : ''}`}
        />
        {emailError && <span className="error-text">{emailError}</span>}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          className={`form-input ${passwordError ? 'error' : ''}`}
        />
        {passwordError && <span className="error-text">{passwordError}</span>}
        <a href="#">Recordar contraseña</a>
        <button onClick={handleEmailLogin} className="form-button">
          Login with Email
        </button> */}
        <button onClick={handleGoogleLogin} className="form-button">
          <img src="/google-icon.png" alt="Google" />
          Login with Google
        </button>
        {/* <div className="button-container">
          <a href="#">Registrarse</a>
        </div> */}
        {/* Utiliza el componente FeedbackMessage para mostrar los mensajes */}
        {errorMessage && <Message message={errorMessage} type="error" />}
        {successMessage && <Message message={successMessage} type="success" />}
      </div>
    </div>
  );
};

export default Login;
