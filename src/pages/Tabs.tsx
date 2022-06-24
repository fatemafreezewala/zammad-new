import React from 'react';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge,IonApp, IonRouterOutlet, } from '@ionic/react';
import { calendar, personCircle, map, informationCircle } from 'ionicons/icons';
import {IonReactRouter} from '@ionic/react-router';
import {Redirect, Route} from 'react-router-dom';
import Dashboard from './Dashboard';
import Horairis from './Horairis';

const MainTabs: React.FC = () => {
    return (
      <IonTabs>
        <IonRouterOutlet>
          <Redirect exact path="/" to="/history" />
          <Route path="/profile" render={() => <Dashboard />} exact={true} />
          <Route path="/history" render={() => <Horairis />} exact={true} />
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="profile" href="/profile">
            {/* <IonIcon icon={calendar} /> */}
            <IonLabel>Profile</IonLabel>
          </IonTabButton>
          <IonTabButton tab="history" href="/history">
            <IonIcon icon={calendar} />
            <IonLabel>History</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    );
  };
  
  export default MainTabs;