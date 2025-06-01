import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonInput,
  IonTextarea,
  IonLabel,
  IonItem,
  IonImg,
  IonLoading,
  IonContent,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import simaproLogo from '../assets/simapro2.png';
import poto from '../assets/pp.png';
import './TambahProduk.css';

import NotificationBar from '../components/NotificationBar';

const TambahKategori = () => {
  const token = localStorage.getItem('token') || '';

  const [nama, setNama] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // State notifikasi
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: '', // 'success' | 'error'
  });

  const history = useHistory();

  const handleSimpan = async () => {
    if (!nama.trim()) {
      setError('Nama kategori tidak boleh kosong');
      return;
    }

    setIsLoading(true);
    setError('');
    setNotification({ show: false, message: '', type: '' });

    // Modified form data creation
    const formData = {
      name: nama.trim(),
      description: deskripsi ? deskripsi.trim() : deskripsi // Don't default to '-', send actual value
    };

    // Debug logs
    console.log('Form Values:', { nama, deskripsi }); // Log raw form values
    console.log('Sending data:', formData); // Log processed data

    try {
      const response = await fetch('https://sazura.xyz/api/v1/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      // Log the raw response
      const rawResponse = await response.text();
      console.log('Raw response:', rawResponse);

      // Parse the response only if it's valid JSON
      const responseData = rawResponse ? JSON.parse(rawResponse) : {};

      if (response.ok) {
        setNotification({
          show: true,
          message: 'Kategori berhasil ditambahkan!',
          type: 'success',
        });
        setTimeout(() => {
          history.push('/app/tab3');
        }, 1500);
      } else {
        throw new Error(responseData.message || 'Gagal menambahkan kategori');
      }
    } catch (error) {
      console.error('Error:', error);
      setNotification({
        show: true,
        message: error.message,
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBatal = () => {
    history.push('/app/tab3');
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

      <IonContent className="ion-padding">
        <h2>TAMBAH KATEGORI</h2>

        {error && (
          <div className="error-message" style={{ color: 'red', marginBottom: '15px' }}>
            {error}
          </div>
        )}

        <div className="form-container">
          <IonItem>
            <IonLabel position="stacked">Nama Kategori :</IonLabel>
            <IonInput
              placeholder="Masukkan nama kategori..."
              value={nama}
              onIonChange={(e) => setNama(e.detail.value)}
              clearInput
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Deskripsi :</IonLabel>
            <IonTextarea
              placeholder="Masukkan deskripsi kategori..."
              value={deskripsi}
              onIonChange={(e) => setDeskripsi(e.detail.value)}
              rows={3}
            />
          </IonItem>

          <div
            style={{
              marginTop: '20px',
              display: 'flex',
              gap: '10px',
              justifyContent: 'flex-end',
            }}
          >
            <IonButton className="custom-btn-simpan" onClick={handleSimpan} disabled={isLoading}>
              {isLoading ? 'Menyimpan...' : 'Simpan'}
            </IonButton>
            <IonButton className="custom-btn-batal" onClick={handleBatal} disabled={isLoading}>
              Batal
            </IonButton>
          </div>
        </div>
      </IonContent>

      <NotificationBar
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ show: false, message: '', type: '' })}
      />

      <IonLoading isOpen={isLoading} message={'Menyimpan data...'} />
    </IonPage>
  );
};

export default TambahKategori;
