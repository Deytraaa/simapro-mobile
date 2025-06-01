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
import { useIonViewWillEnter } from '@ionic/react'; // Add this import

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

  // Add pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [perPage] = useState(15); // Items per page

  const handleLogout = () => {
    localStorage.removeItem("token");
    history.push("/login");
  };

  // Replace useEffect with useIonViewWillEnter
  useIonViewWillEnter(() => {
    fetchCustomers(currentPage);
  });

  // Update fetchCustomers to handle pagination
  const fetchCustomers = async (page) => {
    const token = localStorage.getItem('token');
    if (!token) {
      history.push('/login');
      return;
    }

    try {
      const response = await fetch(`https://sazura.xyz/api/v1/customers?page=${page}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        history.push('/login');
        return;
      }

      const data = await response.json();
      if (Array.isArray(data.data)) {
        setCustomers(data.data);
        setLastPage(data.meta.last_page || 1);
      } else {
        console.error("Data pelanggan tidak valid:", data);
      }
    } catch (error) {
      console.error("Gagal fetch pelanggan:", error);
    }
  };

  // Add effect for pagination
  useEffect(() => {
    fetchCustomers(currentPage);
  }, [currentPage]);

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
                    <td>{((currentPage - 1) * perPage) + index + 1}</td>
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

          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '10px', 
            margin: '20px 0',
            alignItems: 'center' 
          }}>
            <button 
              className="pagination-btn"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            
            <span>
              Page {currentPage} of {lastPage}
            </span>

            <button 
              className="pagination-btn"
              onClick={() => setCurrentPage(p => Math.min(lastPage, p + 1))}
              disabled={currentPage === lastPage}
            >
              Next
            </button>
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
