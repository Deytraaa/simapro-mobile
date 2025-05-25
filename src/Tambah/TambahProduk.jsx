// src/pages/TambahProduk.jsx
import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonInput,
  IonLabel,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonImg,
  IonContent,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import simaproLogo from '../assets/simapro2.png';
import poto from '../assets/pp.png';
import './TambahProduk.css';
import NotificationBar from '../components/NotificationBar';

const TambahProduk = () => {
  const [nama, setNama] = useState('');
  const [stok, setStok] = useState('');
  const [harga, setHarga] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [status, setStatus] = useState('a'); // default aktif
  const [categories, setCategories] = useState([]);

  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: '', // 'success' atau 'error'
  });

  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setNotification({
        show: true,
        message: 'Anda harus login terlebih dahulu.',
        type: 'error',
      });
      history.push('/login');
      return;
    }

    fetch('https://sazura.xyz/api/v1/categories', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.data)) {
          setCategories(data.data);
        } else {
          console.error("Kategori tidak valid:", data);
        }
      })
      .catch(err => {
        console.error("Gagal mengambil kategori:", err);
      });
  }, [history]);

  const handleSimpan = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setNotification({
        show: true,
        message: 'Anda harus login terlebih dahulu.',
        type: 'error',
      });
      history.push('/login');
      return;
    }

    const form = {
      categoryId,
      name: nama,
      amount: parseInt(stok),
      price: parseFloat(harga),
      status,
    };

    try {
      const response = await fetch('https://sazura.xyz/api/v1/products/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify([form]),
      });

      const data = await response.json();

      if (response.ok) {
        setNotification({
          show: true,
          message: 'Produk berhasil ditambahkan!',
          type: 'success',
        });
        setTimeout(() => history.push('/app/tab2'), 1500); // Redirect setelah 1.5 detik
      } else {
        setNotification({
          show: true,
          message: `Gagal menambahkan produk: ${data.message || 'Terjadi kesalahan'}`,
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setNotification({
        show: true,
        message: 'Terjadi kesalahan saat menghubungi server.',
        type: 'error',
      });
    }
  };

  return (
    <>
      <NotificationBar
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ ...notification, show: false })}
      />

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
          <h2>TAMBAH PRODUK</h2>
          <div className="form-container">
            <IonItem>
              <IonLabel position="stacked">Nama Produk:</IonLabel>
              <IonInput
                placeholder="Masukkan nama produk..."
                value={nama}
                onIonChange={(e) => setNama(e.detail.value)}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Stok:</IonLabel>
              <IonInput
                type="number"
                placeholder="Masukkan jumlah stok..."
                value={stok}
                onIonChange={(e) => setStok(e.detail.value)}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Harga:</IonLabel>
              <IonInput
                type="number"
                placeholder="Masukkan harga..."
                value={harga}
                onIonChange={(e) => setHarga(e.detail.value)}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Kategori:</IonLabel>
              <IonSelect
                value={categoryId}
                placeholder="Pilih kategori"
                onIonChange={(e) => setCategoryId(e.detail.value)}
              >
                {categories.map((cat) => (
                  <IonSelectOption key={cat.category_id} value={cat.category_id}>
                    {cat.category_id} - {cat.name}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Status:</IonLabel>
              <IonSelect
                value={status}
                placeholder="Pilih status"
                onIonChange={(e) => setStatus(e.detail.value)}
              >
                <IonSelectOption value="a">a - Aktif</IonSelectOption>
                <IonSelectOption value="n">n - Nonaktif</IonSelectOption>
              </IonSelect>
            </IonItem>

            <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <IonButton className="custom-btn-simpan" onClick={handleSimpan}>Simpan</IonButton>
              <IonButton className="custom-btn-batal" onClick={() => history.push('/app/tab2')}>Batal</IonButton>
            </div>
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default TambahProduk;
