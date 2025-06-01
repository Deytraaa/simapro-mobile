import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonButtons,
  IonImg,
  IonToast,
  IonPopover,
  IonList,
  IonItem,
  IonLabel,
  useIonViewWillEnter // Add this import
} from '@ionic/react';
import './Tab1.css';
import simaproLogo from '../assets/simapro2.png';
import poto from '../assets/pp.png';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaCheck } from 'react-icons/fa';

const Tab5 = () => {
  const [data, setData] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]); // Add products state
  const [search, setSearch] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState("success"); // hijau jika sukses
  const history = useHistory();
  const [showPopover, setShowPopover] = useState(false);
  const [popoverEvent, setPopoverEvent] = useState(null);

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    history.push("/login");
  };

  // Add this hook to refresh data when entering the page
  useIonViewWillEnter(() => {
    fetchData();
    fetchCustomers();
    fetchProducts();
  });

  const fetchData = async () => {
    try {
      const res = await fetch('https://sazura.xyz/api/v1/invoices', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const response = await res.json();
      if (Array.isArray(response.data)) {
        setData(response.data);
      }
    } catch (error) {
      setToastMessage("Gagal mengambil data invoice");
      setToastColor("danger");
      setShowToast(true);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await fetch('https://sazura.xyz/api/v1/customers', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const response = await res.json();
      if (Array.isArray(response.data)) {
        setCustomers(response.data);
      }
    } catch (error) {
      setToastMessage("Gagal mengambil data pelanggan");
      setToastColor("danger");
      setShowToast(true);
    }
  };

  // Add fetchProducts function
  const fetchProducts = async () => {
    try {
      const res = await fetch('https://sazura.xyz/api/v1/products', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const response = await res.json();
      if (Array.isArray(response.data)) {
        setProducts(response.data);
      }
    } catch (error) {
      setToastMessage("Gagal mengambil data produk");
      setToastColor("danger");
      setShowToast(true);
    }
  };

  const getCustomerName = (customerId) => {
    const customer = customers.find(c => Number(c.id) === Number(customerId));
    return customer ? customer.name : 'Unknown';
  };

  // Update the getProductName function to match getCustomerName's logic
  const getProductName = (productId) => {
    const product = products.find(p => Number(p.id) === Number(productId));
    return product ? product.name : 'Unknown';
  };

  const toggleStatusPaid = async (item) => {
    if (item.status.toLowerCase() === 'p') return;

    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');

    const payload = {
      customerId: item.customerId,
      productId: item.productId,    // Changed from product to productId
      amount: item.amount,        
      status: 'P',
      billedDate: item.billedDate,  // Use camelCase to match backend expectation
      paidDate: formattedDate
    };

    try {
      const response = await fetch(`https://sazura.xyz/api/v1/invoices/${item.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData); // Add debug logging
        throw new Error(errorData.message || 'Failed to update status');
      }

      setData(prev =>
        prev.map(d => d.id === item.id ? {
          ...d,
          status: 'P',
          paid_date: formattedDate
        } : d)
      );

      setToastMessage("Status invoice berhasil diubah ke Paid");
      setToastColor("success");
      setShowToast(true);
    } catch (error) {
      console.error('Error:', error); // Add error logging
      setToastMessage("Gagal mengubah status invoice");
      setToastColor("danger");
      setShowToast(true);
    }
  };

  const handleDelete = async (id) => {
    const konfirmasi = window.confirm("Yakin ingin menghapus invoice ini?");
    if (!konfirmasi) return;

    try {
      const response = await fetch(`https://sazura.xyz/api/v1/invoices/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        }
      });

      if (!response.ok) throw new Error();

      setData(prev => prev.filter(item => item.id !== id));
      setToastMessage("Invoice berhasil dihapus");
      setToastColor("success");
      setShowToast(true);
    } catch {
      setToastMessage("Gagal menghapus invoice");
      setToastColor("danger");
      setShowToast(true);
    }
  };

  const filteredData = data
    .filter(item => getCustomerName(item.customerId).toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => getCustomerName(a.customerId).localeCompare(getCustomerName(b.customerId)));

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

          <IonImg
            src={poto}
            className="profile-pic"
            slot="end"
            onClick={(e) => {
              setPopoverEvent(e.nativeEvent);
              setShowPopover(true);
            }}
          />

          <IonPopover
            isOpen={showPopover}
            event={popoverEvent}
            onDidDismiss={() => setShowPopover(false)}
          >
            <IonList>
              <IonItem button onClick={() => {
                setShowPopover(false);
                history.push('/app/profile');
              }}>
                <IonLabel>Profil</IonLabel>
              </IonItem>
              <IonItem button onClick={() => {
                setShowPopover(false);
                handleLogout();
              }}>
                <IonLabel>Logout</IonLabel>
              </IonItem>
            </IonList>
          </IonPopover>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="product-section">
          <h2>DATA INVOICE</h2>
          <div className="search-add">
            <input
              type="text"
              placeholder="Cari Nama Pelanggan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="add-button" onClick={() => history.push('/app/tambah-penjualan')}>
              +
            </button>
          </div>

          <div className="table-scroll-container">
            <table className="product-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Nama Pelanggan</th>
                  <th>Produk</th>
                  <th>Jumlah</th>
                  <th>Status</th>
                  <th>Tgl Tagihan</th>
                  <th>Tgl Bayar</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{getCustomerName(item.customerId)}</td>
                    <td>{getProductName(item.productId)}</td>
                    <td>{item.amount}</td>
                    <td>
                      {item.status.toLowerCase() === 'b' ? (
                        <label style={{ color: 'red', fontWeight: 'bold' }}>
                          <input
                            type="checkbox"
                            onChange={() => toggleStatusPaid(item)}
                            style={{ marginRight: '5px' }}
                          />
                          Belum Lunas
                        </label>
                      ) : (
                        <span style={{ color: 'green', fontWeight: 'bold' }}>
                          <FaCheck style={{ marginRight: '5px' }} />
                          Lunas
                        </span>
                      )}
                    </td>
                    <td>{item.billedDate}</td>
                    <td>{item.paidDate || '-'}</td>
                    <td>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(item.id)}
                        style={{
                          background: '#dc3545',
                          color: '#fff',
                          border: 'none',
                          padding: '5px 10px',
                          borderRadius: '5px',
                          cursor: 'pointer'
                        }}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          color={toastColor}
        />
      </IonContent>
    </IonPage>
  );
};

export default Tab5;
