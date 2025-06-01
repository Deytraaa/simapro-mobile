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
  const [productId, setProductId] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');
  const [billedDate, setBilledDate] = useState('');
  const [paidDate, setPaidDate] = useState('');
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' }); // State untuk notifikasi
  const history = useHistory();

  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersRes, productsRes] = await Promise.all([
          fetch('https://sazura.xyz/api/v1/customers', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('https://sazura.xyz/api/v1/products', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        const customersData = await customersRes.json();
        const productsData = await productsRes.json();

        setCustomers(customersData.data || []);
        setProducts(productsData.data || []);
      } catch (err) {
        setNotification({ message: err.message, type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const isValidDateTime = (str) => {
    return /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(str);
  };

  // Update the handleSubmit function to match database columns
  const handleSubmit = async () => {
    if (!customerId || !productId || !amount || !status || !billedDate) {
      setNotification({
        message: 'Mohon lengkapi semua inputan.',
        type: 'error',
        show: true
      });
      return;
    }

    if (!isValidDateTime(billedDate)) {
      setNotification({
        message: 'Format Tanggal Tagihan salah. Gunakan format: YYYY-MM-DD HH:mm:ss',
        type: 'error',
        show: true
      });
      return;
    }

    if (status === 'P' && (!paidDate || !isValidDateTime(paidDate))) {
      setNotification({
        message: 'Tanggal Pembayaran wajib diisi dan format harus benar jika status Lunas.',
        type: 'error',
        show: true
      });
      return;
    }

    const newInvoice = [{
      customerId: Number(customerId),
      productId: productId, // Keep as string, already converted in the select
      amount: Number(amount),
      status,
      billedDate,
      paidDate: status === 'P' ? paidDate : null,
    }];

    setSubmitLoading(true);

    try {
      console.log('Sending data:', newInvoice); // Debug log

      const res = await fetch('https://sazura.xyz/api/v1/invoices/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(newInvoice)
      });

      const responseData = await res.json();
      console.log('Response:', responseData);

      if (!res.ok) {
        throw new Error(responseData.message || 'Gagal mengirim data');
      }

      setNotification({
        message: 'Invoice berhasil ditambahkan!',
        type: 'success',
        show: true
      });

      setTimeout(() => {
        history.push('/app/tab5');
      }, 1500);

    } catch (err) {
      console.error('Error:', err);
      setNotification({
        message: err.message || 'Terjadi kesalahan saat mengirim data',
        type: 'error',
        show: true
      });
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

        {/* Replace the existing NotificationBar */}
        <NotificationBar
          show={notification.show}
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ message: '', type: '', show: false })}
        />

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
            <IonLabel position="stacked">Pilih Produk</IonLabel>
            <IonSelect
              value={productId}
              placeholder="-- Pilih Produk --"
              onIonChange={(e) => setProductId(e.detail.value)}
            >
              {products.map((prod) => (
                <IonSelectOption key={prod.id} value={String(prod.id)}> {/* Convert ID to string */}
                  {prod.name}
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
