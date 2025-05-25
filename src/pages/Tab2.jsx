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
  IonLabel,
} from '@ionic/react';
import './Tab2.css';
import simaproLogo from '../assets/simapro2.png';
import poto from '../assets/pp.png';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Tab2 = () => {
  const history = useHistory();
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showPopover, setShowPopover] = useState(false);
  const [popoverEvent, setPopoverEvent] = useState(null);

  // Dapatkan token dari localStorage
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, []);

  const fetchData = () => {
    fetch('https://sazura.xyz/api/v1/products', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    })
      .then(res => res.json())
      .then(response => {
        if (Array.isArray(response.data)) {
          setData(response.data);
        } else {
          console.error('Data produk tidak dalam bentuk array:', response);
        }
      })
      .catch(error => console.error('Gagal fetch produk:', error));
  };

  const fetchCategories = () => {
    fetch('https://sazura.xyz/api/v1/categories', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    })
      .then(res => res.json())
      .then(response => {
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          console.error('Kategori tidak dalam bentuk array:', response);
        }
      })
      .catch(error => console.error('Gagal fetch kategori:', error));
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => Number(cat.category_id) === Number(categoryId));
    return category ? category.name : 'Tidak diketahui';
  };

  const handleDeleteClick = (id) => {
    setSelectedProductId(id);
    setShowAlert(true);
  };

  const deleteProduct = () => {
    fetch(`https://sazura.xyz/api/v1/products/${selectedProductId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    })
      .then(res => {
        if (res.ok) {
          setToastMessage('Produk berhasil dihapus');
          setShowToast(true);
          fetchData();
        } else {
          setToastMessage('Gagal menghapus produk');
          setShowToast(true);
        }
      })
      .catch(err => {
        console.error('Gagal hapus:', err);
        setToastMessage('Terjadi kesalahan saat menghapus');
        setShowToast(true);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    history.push('/login');
  };

  const filteredData = data
    .filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

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
          <h2>DATA PRODUK</h2>
          <div className="search-add">
            <input
              type="text"
              placeholder="Ketikkan Produk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="add-button"
              onClick={() => history.push('/app/tambah-produk')}
            >
              +
            </button>
          </div>

          <div className="table-scroll-container">
            <table className="product-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Produk</th>
                  <th>Stok</th>
                  <th>Harga</th>
                  <th>Status</th>
                  <th>Kategori</th>
                  <th>Edit</th>
                  <th>Hapus</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.amount}</td>
                    <td>{item.price ? `Rp ${parseInt(item.price).toLocaleString('id-ID')}` : 'Rp 0'}</td>
                    <td>
                      <span className={`status-badge ${item.status === 'a' ? 'active' : 'inactive'}`}>
                        {item.status === 'a' ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td>{getCategoryName(item.categoryId)}</td>
                    <td>
                      <button className="edit-btn" onClick={() => history.push(`/app/edit-produk/${item.id}`)}>
                        Edit
                      </button>
                    </td>
                    <td>
                      <button className="delete-btn" onClick={() => handleDeleteClick(item.id)}>
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
          message={'Apakah Anda yakin ingin menghapus produk ini?'}
          buttons={[
            {
              text: 'Batal',
              role: 'cancel',
              handler: () => setShowAlert(false),
            },
            {
              text: 'Hapus',
              handler: () => deleteProduct(),
            },
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

export default Tab2;
