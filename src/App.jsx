import React, { useState, useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonAlert,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCubes } from '@fortawesome/free-solid-svg-icons';

import Profile from './pages/profile';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';
import Tab4 from './pages/Tab4';
import Tab5 from './pages/Tab5';
import TambahProduk from './Tambah/TambahProduk';
import TambahKategori from './Tambah/TambahKategori';
import TambahPelanggan from './Tambah/TambahPelanggan';
import TambahPenjualan from './Tambah/TambahPenjualan';
import EditProduk from './edit/EditProduk';
import EditPelanggan from './edit/EditPelanggan';
import Login from './pages/Login';
import Register from './pages/Register';
import EditKategori from './edit/EditKategori';

import './App.css';
import './theme/variables.css';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import { home, cube, person, cart, exit } from 'ionicons/icons';

import { App as CapacitorApp } from '@capacitor/app';

setupIonicReact();

const App = () => {
  const [showExitAlert, setShowExitAlert] = useState(false);

  // === Back Button Handler ===
  useEffect(() => {
    const handler = (event) => {
      event.detail.register(10, () => {
        if (window.confirm('Yakin mau keluar?')) {
          CapacitorApp.exitApp();
        }
      });
    };

    document.addEventListener('ionBackButton', handler);
    return () => {
      document.removeEventListener('ionBackButton', handler);
    };
  }, []);

  const handleExitConfirm = () => {
    CapacitorApp.exitApp(); // gunakan untuk app native
    // window.location.href = '/login'; // alternatif untuk web
  };

  return (
    <IonApp>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/app/tab1" component={Tab1} />
          <Route exact path="/app/tab2" component={Tab2} />
          <Route exact path="/app/tab3" component={Tab3} />
          <Route exact path="/app/tab4" component={Tab4} />
          <Route exact path="/app/tab5" component={Tab5} />
          <Route exact path="/app/profile" component={Profile} />
          <Route exact path="/app/tambah-produk" component={TambahProduk} />
          <Route exact path="/app/tambah-kategori" component={TambahKategori} />
          <Route exact path="/app/tambah-pelanggan" component={TambahPelanggan} />
          <Route exact path="/app/tambah-penjualan" component={TambahPenjualan} />
          <Route exact path="/app/edit-produk/:id" component={EditProduk} />
          <Route exact path="/app/edit-pelanggan/:id" component={EditPelanggan} />
          <Route path="/app/edit-kategori/:id" exact={true}>
            <EditKategori />
          </Route>
          <Route exact path="/app" render={() => <Redirect to="/app/tab1" />} />
        </IonRouterOutlet>

        <IonTabBar slot="bottom" className="custom-tab-bar">
          <IonTabButton tab="tab1" href="/app/tab1" className="custom-tab-button">
            <IonIcon icon={home} className="tab-icon" />
          </IonTabButton>
          <IonTabButton tab="tab2" href="/app/tab2" className="custom-tab-button">
            <FontAwesomeIcon icon={faCubes} size="2x" />
          </IonTabButton>
          <IonTabButton tab="tab3" href="/app/tab3" className="custom-tab-button">
            <IonIcon icon={cube} className="tab-icon" />
          </IonTabButton>
          <IonTabButton tab="tab4" href="/app/tab4" className="custom-tab-button">
            <IonIcon icon={person} className="tab-icon" />
          </IonTabButton>
          <IonTabButton tab="tab5" href="/app/tab5" className="custom-tab-button">
            <IonIcon icon={cart} className="tab-icon" />
          </IonTabButton>

          {/* Tombol Exit */}
          <IonTabButton
            tab="exit"
            onClick={(e) => {
              e.preventDefault();
              setShowExitAlert(true);
            }}
            className="custom-tab-button"
          >
            <IonIcon icon={exit} className="tab-icon" />
          </IonTabButton>
        </IonTabBar>
      </IonTabs>

      <IonAlert
        isOpen={showExitAlert}
        onDidDismiss={() => setShowExitAlert(false)}
        header={'Konfirmasi'}
        message={'Apakah Anda yakin ingin keluar?'}
        buttons={[
          {
            text: 'Batal',
            role: 'cancel',
            handler: () => setShowExitAlert(false),
          },
          {
            text: 'Keluar',
            handler: handleExitConfirm,
          },
        ]}
      />
    </IonApp>
  );
};

const Tabs = () => (
  <IonReactRouter>
    <IonRouterOutlet>
      <Route exact path="/login" component={Login} />
      <Route exact path="/register" component={Register} />
      <Route path="/app" component={App} />
      <Redirect exact from="/" to="/login" />
    </IonRouterOutlet>
  </IonReactRouter>
);

export default Tabs;
