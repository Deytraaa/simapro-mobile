import React, { useState } from 'react';  
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonButtons,
  IonButton,
  IonInput,
  IonLabel,
  IonItem,
  IonImg,
  IonRadioGroup,
  IonRadio,
  IonLoading,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import simaproLogo from '../assets/simapro2.png';
import poto from '../assets/pp.png';
import NotificationBar from '../components/NotificationBar';
import './TambahProduk.css'; // Reuse styling if needed

const TambahPelanggan = () => {
  const token = localStorage.getItem('token') || '';

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: '', // 'success' atau 'error'
  });
  const history = useHistory();

  const handleSimpan = async () => {
    if (!name.trim() || !email.trim()) {
      setNotification({
        show: true,
        message: 'Nama dan email tidak boleh kosong.',
        type: 'error',
      });
      return;
    }

    if (!['B', 'I'].includes(type)) {
      setNotification({
        show: true,
        message: 'Tipe pelanggan harus dipilih (B atau I).',
        type: 'error',
      });
      return;
    }

    const form = {
      name: name.trim(),
      type,
      email: email.trim(),
      address: address.trim(),
      city: city.trim(),
      postalCode: postalCode.trim(),
    };

    setIsLoading(true);
    setError('');
    setNotification({ show: false, message: '', type: '' });

    try {
      const response = await fetch('https://sazura.xyz/api/v1/customers', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const contentType = response.headers.get('content-type');

      if (!response.ok) {
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Gagal menambahkan pelanggan');
        } else {
          const errorText = await response.text();
          throw new Error('Respon tidak valid: ' + errorText);
        }
      }

      setNotification({
        show: true,
        message: 'Pelanggan berhasil ditambahkan!',
        type: 'success',
      });

      // Redirect setelah delay agar notifikasi sempat muncul
      setTimeout(() => {
        history.push('/app/tab4');
      }, 1500);
      
    } catch (error) {
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
    history.push('/app/tab4');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start" style={{ alignItems: 'center' }}>
            <IonImg src={simaproLogo} className="logo" />
            <div className="header-text" style={{ marginLeft: '10px' }}>
              <div className="app-title">SIMAPRO</div>
              <div className="app-subtitle">Sistem Manajemen Penjualan Produk</div>
            </div>
          </IonButtons>
          <IonImg src={poto} className="profile-pic" slot="end" />
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h2>TAMBAH PELANGGAN</h2>

        {error && (
          <div className="error-message" style={{ color: 'red', marginBottom: '15px' }}>
            {error}
          </div>
        )}

        <div className="form-container">
          <IonItem>
            <IonLabel position="stacked">Nama</IonLabel>
            <IonInput
              placeholder="Masukkan nama pelanggan..."
              value={name}
              onIonChange={(e) => setName(e.detail.value)}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Tipe</IonLabel>
            <IonRadioGroup value={type} onIonChange={(e) => setType(e.detail.value)}>
              <IonItem>
                <IonRadio slot="start" value="B" />
                <IonLabel>B</IonLabel>
              </IonItem>
              <IonItem>
                <IonRadio slot="start" value="I" />
                <IonLabel>I</IonLabel>
              </IonItem>
            </IonRadioGroup>
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Email</IonLabel>
            <IonInput
              placeholder="Masukkan email pelanggan..."
              value={email}
              onIonChange={(e) => setEmail(e.detail.value)}
              type="email"
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Alamat</IonLabel>
            <IonInput
              placeholder="Masukkan alamat pelanggan..."
              value={address}
              onIonChange={(e) => setAddress(e.detail.value)}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Kota</IonLabel>
            <IonInput
              placeholder="Masukkan kota pelanggan..."
              value={city}
              onIonChange={(e) => setCity(e.detail.value)}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Kode Pos</IonLabel>
            <IonInput
              placeholder="Masukkan kode pos pelanggan..."
              value={postalCode}
              onIonChange={(e) => setPostalCode(e.detail.value)}
              type="text"
            />
          </IonItem>

          <div style={{
            marginTop: '20px',
            display: 'flex',
            gap: '10px',
            justifyContent: 'flex-end'
          }}>
            <IonButton onClick={handleSimpan} disabled={isLoading}>
              {isLoading ? 'Menyimpan...' : 'Simpan'}
            </IonButton>
            <IonButton onClick={handleBatal} disabled={isLoading} color="medium">
              Batal
            </IonButton>
          </div>
        </div>
      </IonContent>

      <IonLoading isOpen={isLoading} message={'Menyimpan data...'} />

      {/* NotificationBar untuk menampilkan notifikasi */}
      <NotificationBar
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ show: false, message: '', type: '' })}
      />
    </IonPage>
  );
};

export default TambahPelanggan;
