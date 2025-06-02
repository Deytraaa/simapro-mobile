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
  IonDatetime,
  IonModal,
  IonToast // Add this import
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import simaproLogo from '../assets/simapro2.png';
import poto from '../assets/pp.png';
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
  const [showToast, setShowToast] = useState(false); // Replace notification state with toast states
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState('success');
  const [showBilledDatePicker, setShowBilledDatePicker] = useState(false);
  const [showPaidDatePicker, setShowPaidDatePicker] = useState(false);
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
        setToastMessage(err.message);
        setToastColor('danger');
        setShowToast(true);
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
      setToastMessage('Mohon lengkapi semua inputan.');
      setToastColor('danger');
      setShowToast(true);
      return;
    }

    if (!isValidDateTime(billedDate)) {
      setToastMessage('Format Tanggal Tagihan salah. Gunakan format: YYYY-MM-DD HH:mm:ss');
      setToastColor('danger');
      setShowToast(true);
      return;
    }

    if (status === 'P' && (!paidDate || !isValidDateTime(paidDate))) {
      setToastMessage('Tanggal Pembayaran wajib diisi dan format harus benar jika status Lunas.');
      setToastColor('danger');
      setShowToast(true);
      return;
    }

    setSubmitLoading(true);

    try {
      const res = await fetch('https://sazura.xyz/api/v1/invoices/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify([{
          customerId: Number(customerId),
          productId: productId, // Keep as string, already converted in the select
          amount: Number(amount),
          status,
          billedDate,
          paidDate: status === 'P' ? paidDate : null,
        }])
      });

      if (!res.ok) {
        throw new Error('Gagal mengirim data');
      }

      setToastMessage('Invoice berhasil ditambahkan!');
      setToastColor('success');
      setShowToast(true);
      
      // Remove setTimeout and directly navigate
      history.push('/app/tab5'); // Changed from '/app/Tab5' to '/app/tab5'

    } catch (err) {
      console.error('Error:', err);
      setToastMessage('Terjadi kesalahan saat mengirim data');
      setToastColor('danger');
      setShowToast(true);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleBatal = () => {
    history.push('/app/tab5'); // Changed from '/app/Tab5' to '/app/tab5'
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
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          color={toastColor}
          position="top"
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
              readonly
              placeholder="YYYY-MM-DD HH:mm:ss"
              value={billedDate}
              onClick={() => setShowBilledDatePicker(true)}
            />
            <IonModal isOpen={showBilledDatePicker}>
              <IonContent>
                <IonDatetime
                  presentation="date-time"
                  preferWheel={true}
                  showDefaultButtons={true}
                  onIonChange={e => {
                    const date = new Date(e.detail.value);
                    setBilledDate(date.toISOString().slice(0, 19).replace('T', ' '));
                  }}
                  onIonCancel={() => setShowBilledDatePicker(false)}
                  onIonDismiss={() => setShowBilledDatePicker(false)}
                />
              </IonContent>
            </IonModal>
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Tanggal Pembayaran</IonLabel>
            <IonInput
              readonly
              placeholder="YYYY-MM-DD HH:mm:ss"
              value={paidDate}
              onClick={() => setShowPaidDatePicker(true)}
              disabled={status !== 'P'}
            />
            <IonModal isOpen={showPaidDatePicker}>
              <IonContent>
                <IonDatetime
                  presentation="date-time"
                  preferWheel={true}
                  showDefaultButtons={true}
                  onIonChange={e => {
                    const date = new Date(e.detail.value);
                    setPaidDate(date.toISOString().slice(0, 19).replace('T', ' '));
                  }}
                  onIonCancel={() => setShowPaidDatePicker(false)}
                  onIonDismiss={() => setShowPaidDatePicker(false)}
                />
              </IonContent>
            </IonModal>
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
