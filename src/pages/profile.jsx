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
import poto from '../assets/pp.png';

const Profile = () => {
  const [image, setImage] = useState(null);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(URL.createObjectURL(file));
  };

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
          <IonImg src={poto} className="profile-pic" slot="end" />
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <h2 className="profile-header">PROFILE</h2>
        <div className="profile-card">
          <div className="profile-image-section">
            <img
              src={image || 'https://via.placeholder.com/100'}
              alt="Profile"
              className="profile-image"
            />
            <label className="choose-file-btn">
              Pilih Foto
              <input type="file" onChange={handleImageChange} hidden />
            </label>
          </div>

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
