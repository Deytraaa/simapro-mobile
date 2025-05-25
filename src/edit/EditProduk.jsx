import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonInput,
  IonLabel,
  IonItem,
  IonLoading,
  IonImg,
  IonContent,
} from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import NotificationBar from '../components/NotificationBar'; // Import NotificationBar
import simaproLogo from '../assets/simapro2.png';
import poto from '../assets/pp.png';
import './EditProduk.css';

const EditProduk = () => {
  const { id } = useParams();
  const history = useHistory();
  const token = localStorage.getItem('token');

  const [form, setForm] = useState({
    name: '',
    amount: '',
    price: '',
    status: '',
    categoryId: '',
  });

  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: '',
  });

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`https://sazura.xyz/api/v1/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
        const produk = res.data.data;
        setForm({
          name: produk.name || '',
          amount: produk.amount || '',
          price: produk.price || '',
          status: produk.status || '',
          categoryId: produk.categoryId || '',
        });
      } catch (error) {
        console.error('Gagal memuat produk:', error);
        setNotification({
          show: true,
          message: 'Gagal memuat data produk.',
          type: 'error',
        });
        history.push('/app/tab2');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, history, token]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const { name, amount, price, status, categoryId } = form;

    if (!name || !amount || !price || !status || !categoryId) {
      setNotification({
        show: true,
        message: 'Mohon lengkapi semua data produk.',
        type: 'error',
      });
      return;
    }

    const updatedData = {
      name,
      amount: parseInt(amount, 10),
      price: parseFloat(price),
      status,
      categoryId: parseInt(categoryId, 10),
    };

    setIsSaving(true);

    try {
      await axios.put(`https://sazura.xyz/api/v1/products/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      setNotification({
        show: true,
        message: 'Produk berhasil diperbarui!',
        type: 'success',
      });

      setTimeout(() => {
        history.push('/app/tab2');
      }, 2000); // Redirect setelah 2 detik
    } catch (error) {
      console.error('Gagal memperbarui produk:', error);
      setNotification({
        show: true,
        message: error.response?.data?.message || 'Gagal memperbarui produk.',
        type: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <IonLoading isOpen={true} message="Memuat data..." />;
  }

  return (
    <IonPage>
      <NotificationBar
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ ...notification, show: false })}
      />
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
        <h2>EDIT PRODUK</h2>
        <div className="form-container">
          <IonItem>
            <IonLabel position="stacked">Nama Produk</IonLabel>
            <IonInput
              placeholder="Masukkan nama produk..."
              value={form.name}
              onIonChange={(e) => handleChange('name', e.detail.value)}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Stok</IonLabel>
            <IonInput
              type="number"
              placeholder="Masukkan jumlah stok..."
              value={form.amount}
              onIonChange={(e) => handleChange('amount', e.detail.value)}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Harga</IonLabel>
            <IonInput
              type="number"
              placeholder="Masukkan harga..."
              value={form.price}
              onIonChange={(e) => handleChange('price', e.detail.value)}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Status</IonLabel>
            <IonInput
              placeholder="Masukkan status produk (contoh: a/n)..."
              value={form.status}
              onIonChange={(e) => handleChange('status', e.detail.value)}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">ID Kategori</IonLabel>
            <IonInput
              type="number"
              placeholder="Masukkan ID kategori (angka)..."
              value={form.categoryId}
              onIonChange={(e) => handleChange('categoryId', e.detail.value)}
            />
          </IonItem>

          <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <IonButton
              className="custom-btn-simpan"
              onClick={handleSubmit}
              disabled={isSaving}
            >
              {isSaving ? 'Menyimpan...' : 'Simpan'}
            </IonButton>
            <IonButton
              className="custom-btn-batal"
              color="medium"
              onClick={() => history.push('/app/tab2')}
              disabled={isSaving}
            >
              Batal
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default EditProduk;
