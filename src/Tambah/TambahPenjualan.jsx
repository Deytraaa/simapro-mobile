import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonContent,
  IonInput,
  IonLabel,
  IonItem,
  IonRadio,
  IonRadioGroup,
  IonSelect,
  IonSelectOption,
  IonImg,
  IonLoading,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import simaproLogo from '../assets/simapro2.png';
import poto from '../assets/pp.png';
import NotificationBar from '../components/NotificationBar'; // Import notifikasi
import './TambahProduk.css';

const TambahPenjualan = () => {
  const [customerId, setCustomerId] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');
  const [billedDate, setBilledDate] = useState('');
  const [paidDate, setPaidDate] = useState('');
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' }); // State untuk notifikasi
  const history = useHistory();

  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch('https://sazura.xyz/api/v1/customers', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Gagal mengambil data pelanggan');
        const json = await res.json();
        setCustomers(json.data || []);
      } catch (err) {
        setNotification({ message: err.message, type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomers();
  }, [token]);

  const isValidDateTime = (str) => {
    return /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(str);
  };

  const handleSubmit = async () => {
    if (!customerId || !amount || !status || !billedDate) {
      setNotification({ message: 'Mohon lengkapi semua inputan.', type: 'error' });
      return;
    }

    if (!isValidDateTime(billedDate)) {
      setNotification({ message: 'Format Tanggal Tagihan salah. Gunakan format: YYYY-MM-DD HH:mm:ss', type: 'error' });
      return;
    }

    if (status === 'P' && (!paidDate || !isValidDateTime(paidDate))) {
      setNotification({ message: 'Tanggal Pembayaran wajib diisi dan format harus benar jika status Lunas.', type: 'error' });
      return;
    }

    const newInvoice = [
      {
        customerId,
        amount: Number(amount),
        status,
        billedDate,
        paidDate: status === 'P' ? paidDate : null,
      },
    ];

    setSubmitLoading(true);
    setNotification({ message: '', type: '' });

    try {
      const res = await fetch('https://sazura.xyz/api/v1/invoices/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newInvoice),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error('Gagal mengirim data: ' + errorText);
      }

      setNotification({ message: 'Invoice berhasil ditambahkan!', type: 'success' });
      history.push('/app/Tab5');
    } catch (err) {
      setNotification({ message: 'Terjadi kesalahan: ' + err.message, type: 'error' });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleBatal = () => {
    history.push('/app/Tab5');
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
        <h2>TAMBAH PENJUALAN</h2>

        {notification.message && (
          <NotificationBar
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification({ message: '', type: '' })}
          />
        )}

        <div className="form-container">
          <IonItem>
            <IonLabel position="stacked">Pilih Pelanggan</IonLabel>
            <IonSelect
              value={customerId}
              placeholder="-- Pilih Pelanggan --"
              onIonChange={(e) => setCustomerId(e.detail.value)}
            >
              {customers.map((cust) => (
                <IonSelectOption key={cust.id} value={cust.id}>
                  {cust.id.toString().padStart(3, '0')} - {cust.name}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Jumlah</IonLabel>
            <IonInput
              type="number"
              value={amount}
              placeholder="Masukkan jumlah..."
              onIonChange={(e) => setAmount(e.detail.value)}
              min="1"
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Status</IonLabel>
            <IonRadioGroup value={status} onIonChange={(e) => setStatus(e.detail.value)}>
              <IonItem>
                <IonLabel>Lunas</IonLabel>
                <IonRadio slot="start" value="P" />
              </IonItem>
              <IonItem>
                <IonLabel>Belum Lunas</IonLabel>
                <IonRadio slot="start" value="B" />
              </IonItem>
            </IonRadioGroup>
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Tanggal Tagihan</IonLabel>
            <IonInput
              placeholder="YYYY-MM-DD HH:mm:ss"
              value={billedDate}
              onIonChange={(e) => setBilledDate(e.detail.value)}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Tanggal Pembayaran</IonLabel>
            <IonInput
              placeholder="YYYY-MM-DD HH:mm:ss"
              value={paidDate}
              onIonChange={(e) => setPaidDate(e.detail.value)}
              disabled={status !== 'P'}
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
            <IonButton onClick={handleSubmit} disabled={submitLoading}>
              {submitLoading ? 'Menyimpan...' : 'Simpan'}
            </IonButton>
            <IonButton onClick={handleBatal} disabled={submitLoading} color="medium">
              Batal
            </IonButton>
          </div>
        </div>

        <IonLoading isOpen={isLoading} message={'Memuat data pelanggan...'} />
        <IonLoading isOpen={submitLoading} message={'Menyimpan data...'} />
      </IonContent>
    </IonPage>
  );
};

export default TambahPenjualan;
