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
          // Filter out invalid categories
          const validCategories = data.data.filter(cat => cat && cat.id);
          setCategories(validCategories);
        } else {
          console.error("Kategori tidak valid:", data);
          setNotification({
            show: true,
            message: 'Gagal memuat data kategori',
            type: 'error',
          });
        }
      })
      .catch(err => {
        console.error("Gagal mengambil kategori:", err);
        setNotification({
          show: true,
          message: 'Gagal mengambil data kategori',
          type: 'error',
        });
      });
  }, [history]);

  const handleSimpan = async () => {
    // Enhanced validation
    if (!categoryId) {
      setNotification({
        show: true,
        message: 'Pilih kategori terlebih dahulu!',
        type: 'error',
      });
      return;
    }

    if (!nama || !stok || !harga) {
      setNotification({
        show: true,
        message: 'Semua field harus diisi!',
        type: 'error',
      });
      return;
    }

    // Validate numeric values
    const numericStok = parseInt(stok);
    const numericHarga = parseFloat(harga);
    const numericCategoryId = parseInt(categoryId);

    if (isNaN(numericStok) || numericStok <= 0) {
      setNotification({
        show: true,
        message: 'Stok harus berupa angka positif!',
        type: 'error',
      });
      return;
    }

    if (isNaN(numericHarga) || numericHarga <= 0) {
      setNotification({
        show: true,
        message: 'Harga harus berupa angka positif!',
        type: 'error',
      });
      return;
    }

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
      categoryId: parseInt(categoryId), // this is correct - backend expects 'categoryId'
      name: nama.trim(),
      amount: parseInt(stok),
      price: parseInt(harga), // change to parseInt since DB expects integer
      status: status.toLowerCase() // ensure lowercase to match backend validation
    };

    try {
      console.log('Sending data:', form);

      const response = await fetch('https://sazura.xyz/api/v1/products/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify([form]),
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
          message: 'Produk berhasil ditambahkan!',
          type: 'success',
        });
        setTimeout(() => history.push('/app/tab2'), 1500);
      } else {
        throw new Error(data.message || 'Terjadi kesalahan saat menambah produk');
      }
    } catch (error) {
      console.error('Error:', error);
      setNotification({
        show: true,
        message: error.message || 'Terjadi kesalahan saat menghubungi server',
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
                onIonChange={(e) => {
                  console.log('Selected category:', e.detail.value); // Debug log
                  setCategoryId(e.detail.value);
                }}
              >
                {categories.map((cat) => {
                  // Skip invalid categories
                  if (!cat || !cat.id) return null;
                  
                  return (
                    <IonSelectOption 
                      key={cat.id} 
                      value={cat.id.toString()}
                    >
                      {cat.name || 'Unnamed Category'}
                    </IonSelectOption>
                  );
                })}
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Status:</IonLabel>
              <IonSelect
                value={status}
                placeholder="Pilih status"
                onIonChange={(e) => setStatus(e.detail.value)}
              >
                <IonSelectOption value="a">Aktif</IonSelectOption>
                <IonSelectOption value="n">Nonaktif</IonSelectOption>
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
