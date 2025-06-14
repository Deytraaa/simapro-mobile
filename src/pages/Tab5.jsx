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
  IonButton,
  useIonViewWillEnter
} from '@ionic/react';
import './Tab1.css';
import simaproLogo from '../assets/simapro2.png';
import poto from '../assets/pp.png';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { utils as xlsxUtils, write as xlsxWrite } from 'xlsx';
import { saveAs } from 'file-saver';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';


const Tab5 = () => {
  const [data, setData] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState("success");
  const history = useHistory();
  const [showPopover, setShowPopover] = useState(false);
  const [popoverEvent, setPopoverEvent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [perPage] = useState(15);

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    history.push("/login");
  };

  useIonViewWillEnter(() => {
    fetchData();
    fetchCustomers();
    fetchProducts();
  });

  const fetchData = async (page = 1) => {
    try {
      const res = await fetch(`https://sazura.xyz/api/v1/invoices?page=${page}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const response = await res.json();
      
      if (response.data) {
        setData(response.data);
        setLastPage(response.meta?.last_page || 1);
      }
    } catch (error) {
      showErrorToast("Gagal mengambil data invoice");
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
      showErrorToast("Gagal mengambil data pelanggan");
    }
  };

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
      showErrorToast("Gagal mengambil data produk");
    }
  };

  const showErrorToast = (message) => {
    setToastMessage(message);
    setToastColor("danger");
    setShowToast(true);
  };

  const getCustomerName = (customerId) => {
    const customer = customers.find(c => Number(c.id) === Number(customerId));
    return customer ? customer.name : 'Unknown';
  };

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
      productId: item.productId,
      amount: item.amount,
      status: 'P',
      billedDate: item.billedDate,
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

      if (!response.ok) throw new Error();

      setData(prev =>
        prev.map(d => d.id === item.id ? {
          ...d,
          status: 'P',
          paidDate: formattedDate
        } : d)
      );

      setToastMessage("Status invoice berhasil diubah ke Paid");
      setToastColor("success");
      setShowToast(true);
    } catch (error) {
      showErrorToast("Gagal mengubah status invoice");
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
      showErrorToast("Gagal menghapus invoice");
    }
  };

  const exportToExcel = async () => {
    try {
      let allInvoices = [];
      let page = 1;
      let hasMore = true;
  
      while (hasMore) {
        const res = await fetch(`https://sazura.xyz/api/v1/invoices?page=${page}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
  
        const response = await res.json();
  
        if (response.data && response.data.length > 0) {
          allInvoices = [...allInvoices, ...response.data];
          page++;
          hasMore = page <= (response.meta?.last_page || 1);
        } else {
          hasMore = false;
        }
      }
  
      const excelData = allInvoices.map((item, index) => ({
        'No.': index + 1,
        'Nama Pelanggan': getCustomerName(item.customerId),
        'Produk': getProductName(item.productId),
        'Jumlah': item.amount,
        'Status': item.status.toLowerCase() === 'p' ? 'Lunas' : 'Belum Lunas',
        'Tanggal Tagihan': item.billedDate,
        'Tanggal Pembayaran': item.paidDate || '-'
      }));
  
      const worksheet = xlsxUtils.json_to_sheet(excelData);
      const workbook = xlsxUtils.book_new();
      xlsxUtils.book_append_sheet(workbook, worksheet, 'Invoices');
  
      const excelBuffer = xlsxWrite(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
  
      // Konversi ke base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64data = reader.result.split(',')[1];
  
        const fileName = `invoices_${new Date().toISOString().split('T')[0]}.xlsx`;
  
        await Filesystem.writeFile({
          path: fileName,
          data: base64data,
          directory: Directory.Documents, // Bisa juga Directory.Downloads
          encoding: Encoding.BASE64
        });
  
        setToastMessage("File Excel berhasil disimpan di folder Documents!");
        setToastColor("success");
        setShowToast(true);
      };
  
      reader.onerror = () => {
        showErrorToast("Gagal membaca file untuk konversi");
      };
  
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Export error:", error);
      showErrorToast("Gagal menyimpan file Excel");
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
            <div className="button-group">
              <button className="add-button" onClick={() => history.push('/app/tambah-penjualan')}>
                +
              </button>
              <button
                className="add-button"
                onClick={exportToExcel}
              >
                Export Excel
              </button>
            </div>
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
                    <td>{((currentPage - 1) * perPage) + index + 1}</td>
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

          <div className="pagination-controls">
            <button 
              className="pagination-btn"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            
            <span className="pagination-info">
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

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          color={toastColor}
          position="top"
        />
      </IonContent>
    </IonPage>
  );
};

export default Tab5;