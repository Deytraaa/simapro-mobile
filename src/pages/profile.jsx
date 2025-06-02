import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonButtons,
  IonImg,
} from '@ionic/react';
import React, { useState, useEffect } from 'react';
import './profile.css';
import simaproLogo from '../assets/simapro2.png';

const Profile = () => {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Ambil data user dari localStorage saat komponen mount
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userObj = JSON.parse(user);
        setNama(userObj.name || ''); // sesuaikan key dengan respons API
        setEmail(userObj.email || '');
      } catch (e) {
        console.error('Gagal parsing user dari localStorage', e);
      }
    }
  }, []);

  const handleLogout = () => {
    // Hapus data login di localStorage dan redirect ke halaman login
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    alert('Logout berhasil');
    window.location.href = '/'; // atau gunakan history.push kalau pakai react-router
  };

  const handleSave = () => {
    alert(`Data disimpan:\nNama: ${nama}\nEmail: ${email}`);
    // Disini kamu bisa tambahkan request API untuk update profile user
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonImg src={simaproLogo} className="logo" />
            <div className="header-text">
              <div className="app-title">SIMAPRO</div>
              <div className="app-subtitle">Sistem Manajemen Penjualan Produk</div>
            </div>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <h2 className="profile-header">PROFILE</h2>
        <div className="profile-card">
          <div className="form-group">
            <label>Nama :</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Masukkan nama"
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email"
            />
          </div>

          <div className="button-group">
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
            <button className="save-btn" onClick={handleSave}>
              Simpan
            </button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
