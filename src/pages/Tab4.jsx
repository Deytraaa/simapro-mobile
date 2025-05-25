import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonImg,
  IonAlert,
  IonToast,
  IonPopover,
  IonList,
  IonItem,
  IonLabel
} from '@ionic/react';
import './Tab1.css';
import simaproLogo from '../assets/simapro2.png';
import poto from '../assets/pp.png';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Tab4 = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const history = useHistory();
  const [showPopover, setShowPopover] = useState(false);
  const [popoverEvent, setPopoverEvent] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    history.push("/login");
  };

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCustomers = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      history.push('/login');
      return;
    }

    fetch('https://sazura.xyz/api/v1/customers', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
      .then(res => {
        if (res.status === 401) {
          // Token invalid / expired
          localStorage.removeItem('token');
          history.push('/login');
          return null;
        }
        return res.json();
      })
      .then(response => {
        if (!response) return;
        if (Array.isArray(response.data)) {
          setCustomers(response.data);
        } else {
          console.error("Data pelanggan tidak valid:", response);
        }
      })
      .catch(error => console.error("Gagal fetch pelanggan:", error));
  };

  const handleDeleteClick = (id) => {
    setSelectedCustomerId(id);
    setShowAlert(true);
  };

  const deleteCustomer = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      history.push('/login');
      return;
    }

    fetch(`https://sazura.xyz/api/v1/customers/${selectedCustomerId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
      .then(res => {
        if (res.status === 401) {
          localStorage.removeItem('token');
          history.push('/login');
          return;
        }
        if (res.ok) {
          setToastMessage("Pelanggan berhasil dihapus");
          setShowToast(true);
          fetchCustomers();
        } else {
          setToastMessage("Gagal menghapus pelanggan");
          setShowToast(true);
        }
      })
      .catch(err => {
        console.error("Gagal hapus:", err);
        setToastMessage("Terjadi kesalahan saat menghapus");
        setShowToast(true);
      });
  };

  const filteredCustomers = customers
    .slice()
    .sort((a, b) => {
      const nameA = a.name?.toLowerCase() || '';
      const nameB = b.name?.toLowerCase() || '';
      return nameA.localeCompare(nameB);
    })
    .filter(customer =>
      customer.name?.toLowerCase().includes(search.toLowerCase())
    );

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
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">SIMAPRO</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="product-section">
          <h2>DATA PELANGGAN</h2>
          <div className="search-add">
            <input
              type="text"
              placeholder="Ketikkan Nama Pelanggan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="add-button" onClick={() => history.push('/app/tambah-pelanggan')}>
              +
            </button>
          </div>

          <div className="table-scroll-container">
            <table className="product-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Nama</th>
                  <th>Tipe</th>
                  <th>Email</th>
                  <th>Alamat</th>
                  <th>Kota</th>
                  <th>Kode Pos</th>
                  <th>Edit</th>
                  <th>Hapus</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer, index) => (
                  <tr key={customer.id}>
                    <td>{index + 1}</td>
                    <td>{customer.name || '-'}</td>
                    <td
                      className={
                        customer.type === 'B' ? 'type-business' :
                        customer.type === 'I' ? 'type-individu' :
                        ''
                      }
                    >
                      {customer.type === 'B' ? 'Business' : customer.type === 'I' ? 'Individu' : '-'}
                    </td>
                    <td>{customer.email || '-'}</td>
                    <td>{customer.address || '-'}</td>
                    <td>{customer.city || '-'}</td>
                    <td>{customer.postalCode || '-'}</td>
                    <td>
                      <button className="edit-btn" onClick={() => history.push(`/app/edit-pelanggan/${customer.id}`)}>
                        Edit
                      </button>
                    </td>
                    <td>
                      <button className="delete-btn" onClick={() => handleDeleteClick(customer.id)}>
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={'Konfirmasi Hapus'}
          message={'Apakah Anda yakin ingin menghapus pelanggan ini?'}
          buttons={[
            {
              text: 'Batal',
              role: 'cancel',
              handler: () => setShowAlert(false)
            },
            {
              text: 'Hapus',
              handler: () => deleteCustomer()
            }
          ]}
        />

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          color="primary"
        />
      </IonContent>
    </IonPage>
  );
};

export default Tab4;
