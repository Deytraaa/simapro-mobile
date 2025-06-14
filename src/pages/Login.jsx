import React, { useState, useEffect } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './login.css';
import logo from '../assets/simapro3.png';

const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 10,
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: type === 'success' ? '#4BB543' : '#FF5252',
        color: 'white',
        padding: '10px 20px',
        borderRadius: 5,
        zIndex: 9999,
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        fontWeight: 'bold',
        minWidth: '250px',
        textAlign: 'center',
      }}
    >
      {message}
    </div>
  );
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const history = useHistory();

  const handleLogin = async () => {
    if (!email || !password) {
      setNotification({
        show: true,
        message: 'Email dan password harus diisi!',
        type: 'error',
      });
      return;
    }

    setIsLoading(true);

    try {
      const loginResponse = await fetch('https://sazura.xyz/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(loginData.message || 'Login gagal');
      }

      const token = loginData.access_token;
      localStorage.setItem('token', token);
      localStorage.setItem('isLoggedIn', 'true');

      const userResponse = await fetch('https://sazura.xyz/api/user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      const userData = await userResponse.json();

      if (!userResponse.ok) {
        throw new Error(userData.message || 'Gagal mengambil data user');
      }

      localStorage.setItem('user', JSON.stringify(userData));

      setNotification({
        show: true,
        message: 'Login berhasil!',
        type: 'success',
      });

      setTimeout(() => {
        history.push('/app/tab1');
      }, 1500);
    } catch (error) {
      console.error('Login error:', error);
      setNotification({
        show: true,
        message: error.message || 'Email atau password salah!',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding" fullscreen>
        {notification.show && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification({ ...notification, show: false })}
          />
        )}
        <div className="login-container">
          <div className="login-logo">
            <img src={logo} alt="Simapro Logo" />
          </div>
          <div className="login-form">
            <h1 className="login-title">SIMAPRO</h1>
            <p className="login-subtitle">Sistem Manajemen Penjualan Produk</p>
            
            <label>Email:</label>
            <input
              type="email"
              placeholder="Masukan Email…"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <label>Password:</label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Masukan Password…"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="toggle-password"
                title={showPassword ? 'Sembunyikan Password' : 'Lihat Password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>

            <div className="forgot-password">
              <a href="/register">Belum punya akun? Daftar</a>
            </div>

            <button 
              className="login-button" 
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? 'Memproses...' : 'Login'}
            </button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
