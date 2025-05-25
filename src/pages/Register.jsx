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

const Register = () => {
  const history = useHistory();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Nama wajib diisi';
    if (!form.email) errs.email = 'Email wajib diisi';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Format email tidak valid';
    if (!form.password || form.password.length < 8) errs.password = 'Password minimal 8 karakter';
    if (form.password !== form.password_confirmation) errs.password_confirmation = 'Konfirmasi password tidak cocok';
    return errs;
  };

  const handleRegister = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsLoading(true);
    setErrors({});
    setNotification({ show: false, message: '', type: '' });

    try {
      const response = await fetch('https://sazura.xyz/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) setErrors(data.errors);
        throw new Error(data.message || 'Registrasi gagal');
      }

      setNotification({
        show: true,
        message: 'Registrasi berhasil! Silakan login.',
        type: 'success',
      });

      setForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
      });

      setTimeout(() => {
        history.push('/'); // redirect ke halaman login
      }, 2000);
    } catch (error) {
      setNotification({
        show: true,
        message: error.message || 'Terjadi kesalahan saat registrasi.',
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
            <h1 className="login-title">DAFTAR AKUN</h1>

            <label>Nama:</label>
            <input
              type="text"
              name="name"
              placeholder="Masukan Nama…"
              value={form.name}
              onChange={handleChange}
            />
            {errors.name && <span className="error">{errors.name}</span>}

            <label>Email:</label>
            <input
              type="email"
              name="email"
              placeholder="Masukan Email…"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <span className="error">{errors.email}</span>}

            <label>Password:</label>
            <input
              type="password"
              name="password"
              placeholder="Masukan Password…"
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && <span className="error">{errors.password}</span>}

            <label>Konfirmasi Password:</label>
            <input
              type="password"
              name="password_confirmation"
              placeholder="Ulangi Password…"
              value={form.password_confirmation}
              onChange={handleChange}
            />
            {errors.password_confirmation && (
              <span className="error">{errors.password_confirmation}</span>
            )}

            <button className="login-button" onClick={handleRegister} disabled={isLoading}>
              {isLoading ? 'Memproses...' : 'Daftar'}
            </button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Register;
