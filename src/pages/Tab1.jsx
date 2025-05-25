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
  IonLabel,
  IonLoading,
  useIonToast
} from '@ionic/react';
import './Tab1.css';
import simaproLogo from '../assets/simapro2.png';
import poto from '../assets/pp.png';
import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useHistory } from 'react-router-dom';

const Tab1 = () => {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [showPopover, setShowPopover] = useState(false);
  const [popoverEvent, setPopoverEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [present] = useIonToast();
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          history.push('/login');
          return;
        }

        // Fetch products
        const productsResponse = await fetch('https://sazura.xyz/api/v1/products', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          }
        });

        if (!productsResponse.ok) {
          throw new Error('Failed to fetch products');
        }
        const productsData = await productsResponse.json();
        setProducts(productsData.data || []);

        // Fetch customers
        const customersResponse = await fetch('https://sazura.xyz/api/v1/customers', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          }
        });

        if (!customersResponse.ok) {
          throw new Error('Failed to fetch customers');
        }
        const customersData = await customersResponse.json();
        setCustomers(customersData.data || []);

      } catch (error) {
        console.error('Error fetching data:', error);
        present({
          message: 'Gagal memuat data. Silakan coba lagi.',
          duration: 2000,
          color: 'danger',
          position: 'top'
        });
        
        // If unauthorized, redirect to login
        if (error.message.includes('401')) {
          localStorage.removeItem('token');
          localStorage.removeItem('isLoggedIn');
          history.push('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [history, present]);

  const sortedProducts = [...products].sort((a, b) => b.stock - a.stock);
  const topProducts = sortedProducts.slice(0, 5);

  const visitCount = {};
  customers.forEach(c => {
    const name = c.name;
    visitCount[name] = (visitCount[name] || 0) + 1;
  });

  const customerData = Object.entries(visitCount).map(([name, count]) => ({
    name,
    jumlah: count,
  }));

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    
    present({
      message: 'Logout berhasil',
      duration: 1500,
      color: 'success',
      position: 'top'
    });
    
    // Redirect to login page after a short delay
    setTimeout(() => {
      history.push('/login');
    }, 1000);
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
        <IonLoading isOpen={isLoading} message="Memuat data..." />
        
        <div className="product-section">
          <h2>DASHBOARD</h2>

          <div className="chart-cards">
            <div className="chart-card">
              <h3>Produk Terlaris</h3>
              <div className="chart-container">
                {topProducts.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topProducts}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" stroke="#fff" tick={{ fill: "#fff" }} />
                      <YAxis stroke="#fff" tick={{ fill: "#fff" }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="amount" fill="#b9a5ff" name="Stok" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="no-data">Tidak ada data produk</p>
                )}
              </div>
            </div>

            <div className="chart-card">
              <h3>Pelanggan Paling Sering Datang</h3>
              <div className="chart-container">
                {customerData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={customerData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" stroke="#fff" tick={{ fill: "#fff" }} />
                      <YAxis stroke="#fff" tick={{ fill: "#fff" }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="jumlah" fill="#80ffd3" name="Jumlah" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="no-data">Tidak ada data pelanggan</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;