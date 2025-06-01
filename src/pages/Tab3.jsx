import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonImg,
  IonPopover,
  IonList,
  IonItem,
  IonLabel
} from '@ionic/react';
import './Tab2.css';
import simaproLogo from '../assets/simapro2.png';
import poto from '../assets/pp.png';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useIonViewWillEnter } from '@ionic/react';

const Tab3 = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [perPage] = useState(5); // Change this for different page size
  const history = useHistory();
  const [showPopover, setShowPopover] = useState(false);
  const [popoverEvent, setPopoverEvent] = useState(null);

  useIonViewWillEnter(() => {
    fetchCategories(1); // Fetch first page
    setCurrentPage(1); // Reset to first page
  });

  useEffect(() => {
    fetchCategories(currentPage);
    // eslint-disable-next-line
  }, [currentPage]);

  const fetchCategories = async (page) => {
    const token = localStorage.getItem('token');
    if (!token) {
      history.push('/login');
      return;
    }
    try {
      const res = await fetch(`https://sazura.xyz/api/v1/categories?page=${page}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        }
      });
      const response = await res.json();
      if (Array.isArray(response.data)) {
        // Filter out invalid categories
        const validCategories = response.data.filter(cat => cat && (cat.category_id || cat.id));
        setCategories(validCategories);
        setLastPage(response.meta?.last_page || 1);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    history.push('/login');
  };

  const filteredCategories = categories
    .slice()
    .sort((a, b) => {
      const nameA = a.name?.toLowerCase() || '';
      const nameB = b.name?.toLowerCase() || '';
      return nameA.localeCompare(nameB);
    })
    .filter(category =>
      category.name?.toLowerCase().includes(search.toLowerCase())
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
          <h2>DETAIL KATEGORI</h2>
          <div className="search-add">
            <input
              type="text"
              placeholder="Ketikkan Nama Kategori..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="add-button" onClick={() => history.push('/app/tambah-kategori')}>
              +
            </button>
          </div>

          <div className="table-scroll-container">
            <table className="product-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>Deskripsi</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category, index) => {
                  // Generate a fallback key if category_id is missing
                  const key = category.category_id || `category-${index}`;
                  
                  return (
                    <tr key={key}>
                      <td>{(currentPage - 1) * 15 + index + 1}</td>
                      <td>{category.name || '-'}</td>
                      <td>{category.description || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span style={{ margin: '0 12px' }}>
              Page {currentPage} of {lastPage}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(lastPage, p + 1))}
              disabled={currentPage === lastPage}
            >
              Next
            </button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
