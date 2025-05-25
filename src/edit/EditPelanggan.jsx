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
  IonRadioGroup,
  IonRadio,
} from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import simaproLogo from '../assets/simapro2.png';
import poto from '../assets/pp.png';
import './EditProduk.css';

const EditPelanggan = () => {
  const { id } = useParams();
  const history = useHistory();
  const token = localStorage.getItem('token'); // Ambil token dari localStorage

  const [form, setForm] = useState({
    name: '',
    type: '',
    email: '',
    address: '',
    city: '',
    postalCode: ''
  });

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await axios.get(`https://sazura.xyz/api/v1/customers/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          }
        });
        const pelanggan = res.data.data;
        setForm({
          name: pelanggan.name || '',
          type: pelanggan.type || '',
          email: pelanggan.email || '',
          address: pelanggan.address || '',
          city: pelanggan.city || '',
          postalCode: pelanggan.postalCode || ''
        });
      } catch (error) {
        console.error('Gagal memuat pelanggan:', error);
        alert('Gagal memuat data pelanggan.');
        history.push('/app/tab4');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id, history, token]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const { name, type, email } = form;

    if (!name.trim() || !email.trim()) {
      setError('Nama dan email tidak boleh kosong.');
      return;
    }

    if (!['B', 'I'].includes(type)) {
      setError('Tipe pelanggan harus dipilih (B atau I).');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      await axios.put(`https://sazura.xyz/api/v1/customers/${id}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });
      alert('Pelanggan berhasil diperbarui!');
      history.push('/app/tab4');
    } catch (error) {
      console.error('Gagal memperbarui pelanggan:', error);
      setError('Gagal memperbarui pelanggan.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    history.push('/app/tab4');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
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
        <h2>EDIT PELANGGAN</h2>

        {error && (
          <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>
        )}

        <div className="form-container">
          <IonItem>
            <IonLabel position="stacked">Nama</IonLabel>
            <IonInput
              value={form.name}
              onIonChange={(e) => handleChange('name', e.detail.value)}
              placeholder="Masukkan nama pelanggan..."
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Tipe</IonLabel>
            <IonRadioGroup
              value={form.type}
              onIonChange={(e) => handleChange('type', e.detail.value)}
            >
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
              value={form.email}
              onIonChange={(e) => handleChange('email', e.detail.value)}
              placeholder="Masukkan email pelanggan..."
              type="email"
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Alamat</IonLabel>
            <IonInput
              value={form.address}
              onIonChange={(e) => handleChange('address', e.detail.value)}
              placeholder="Masukkan alamat pelanggan..."
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Kota</IonLabel>
            <IonInput
              value={form.city}
              onIonChange={(e) => handleChange('city', e.detail.value)}
              placeholder="Masukkan kota pelanggan..."
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Kode Pos</IonLabel>
            <IonInput
              value={form.postalCode}
              onIonChange={(e) => handleChange('postalCode', e.detail.value)}
              placeholder="Masukkan kode pos pelanggan..."
              type="text"
            />
          </IonItem>

          <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <IonButton onClick={handleSubmit} disabled={isSaving}>
              {isSaving ? 'Menyimpan...' : 'Simpan'}
            </IonButton>
            <IonButton color="medium" onClick={handleCancel} disabled={isSaving}>
              Batal
            </IonButton>
          </div>
        </div>
      </IonContent>

      <IonLoading isOpen={loading || isSaving} message={loading ? 'Memuat data...' : 'Menyimpan data...'} />
    </IonPage>
  );
};

export default EditPelanggan;
