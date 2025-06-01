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

    // Change this part to properly handle empty description
    const form = {
      name: nama.trim(),
      description: deskripsi.trim() || deskripsi || '-' // Try to use the actual description first
    };

    setIsLoading(true);
    setError('');
    setNotification({ show: false, message: '', type: '' });

    try {
      console.log('Sending category data:', form); // Debug log

      const response = await fetch('https://sazura.xyz/api/v1/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const responseText = await response.text();
      console.log('Response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response:', e);
        throw new Error('Invalid server response');
      }

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
        throw new Error(data.message || 'Gagal menambahkan kategori');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(`Terjadi kesalahan: ${error.message}`);
      setNotification({
        show: true,
        message: `Terjadi kesalahan: ${error.message}`,
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
              onIonChange={(e) => {
                console.log('Description changed:', e.detail.value); // Debug log
                setDeskripsi(e.detail.value || '');
              }}
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

        <NotificationBar
          show={notification.show}
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ show: false, message: '', type: '' })}
        />
      </IonContent>

      <IonLoading isOpen={isLoading} message={'Menyimpan data...'} />
    </IonPage>
  );
};

export default TambahKategori;
