import React, { useState, useEffect } from 'react';
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
import { useHistory, useParams } from 'react-router-dom';
import simaproLogo from '../assets/simapro2.png';
import poto from '../assets/pp.png';
import './EditProduk.css';
import NotificationBar from '../components/NotificationBar';

const EditKategori = () => {
  const { id } = useParams();
  const token = localStorage.getItem('token') || '';
  const history = useHistory();

  const [nama, setNama] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: '',
  });

  // Fetch category data
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`https://sazura.xyz/api/v1/categories/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch category');
        }

        const result = await response.json();
        console.log('Raw API Response:', result); // Debug log

        if (result && result.data) {
          // Get both name and description from the response
          const categoryData = result.data;
          console.log('Category Data:', categoryData); // Debug log

          // Set both name and description
          setNama(categoryData.name || '');
          setDeskripsi(categoryData.description || '');
        }
      } catch (error) {
        console.error('Failed to fetch category:', error);
        setNotification({
          show: true,
          message: 'Gagal memuat data kategori',
          type: 'error'
        });
      }
    };

    if (id) {
      fetchCategory();
    }
  }, [id, token]);

  const handleSimpan = async () => {
    if (!nama.trim()) {
      setNotification({
        show: true,
        message: 'Nama kategori tidak boleh kosong',
        type: 'error',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`https://sazura.xyz/api/v1/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: nama.trim(),
          description: deskripsi.trim() || '-',
        }),
      });

      if (response.ok) {
        setNotification({
          show: true,
          message: 'Kategori berhasil diperbarui!',
          type: 'success',
        });
        setTimeout(() => {
          history.push('/app/tab3');
        }, 1500);
      } else {
        throw new Error('Gagal memperbarui kategori');
      }
    } catch (error) {
      setNotification({
        show: true,
        message: error.message,
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
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
        <h2>EDIT KATEGORI</h2>
        <div className="form-container">
          <IonItem>
            <IonLabel position="stacked">Nama Kategori:</IonLabel>
            <IonInput
              value={nama}
              onIonChange={e => setNama(e.detail.value)}
              placeholder="Masukkan nama kategori"
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Deskripsi:</IonLabel>
            <IonTextarea
              value={deskripsi}
              onIonChange={e => setDeskripsi(e.detail.value)}
              placeholder="Masukkan deskripsi"
              rows={3}
            />
          </IonItem>

          <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <IonButton 
              className="custom-btn-simpan" 
              onClick={handleSimpan}
              disabled={isLoading}
            >
              {isLoading ? 'Menyimpan...' : 'Simpan'}
            </IonButton>
            <IonButton 
              className="custom-btn-batal" 
              onClick={() => history.push('/app/tab3')}
              disabled={isLoading}
            >
              Batal
            </IonButton>
          </div>
        </div>

        <NotificationBar
          show={notification.show}
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ ...notification, show: false })}
        />
      </IonContent>

      <IonLoading isOpen={isLoading} message={'Menyimpan perubahan...'} />
    </IonPage>
  );
};

export default EditKategori;