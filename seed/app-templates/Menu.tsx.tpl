import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote
} from '@ionic/react';

import {
  bookmarkOutline,
  <!--@@APP_MENU_ICONS-->
  logOutOutline, logOutSharp
} from 'ionicons/icons';

import React from 'react';
import { useLocation } from 'react-router-dom';
import './Menu.css';
import { Auth } from 'aws-amplify';

interface AppPage {
  strUrl: string;
  iosIcon: string;
  mdIcon: string;
  strTitle: string;
}

const appPages: AppPage[] =
  <!--@@APP_MENU-->
;

<!--@@APP_MENU_BOTTOM_PARAMETER-->

const signOut = async () => {
  try {
    await Auth.signOut();
  } catch (error) {
    console.log('error signing out: ', error);
  }
}

const Menu: React.FC = () => {
  const location = useLocation();

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader><!--@@APP_HEADER--></IonListHeader>
          <IonNote>hi@ionicframework.com</IonNote>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appPage.strUrl ? 'selected' : ''} routerLink={appPage.strUrl} routerDirection="none" lines="none" detail={false}>
                  <IonIcon slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                  <IonLabel>{appPage.strTitle}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>

        <!--@@APP_MENU_BOTTOM-->

        <IonList id="sign-out">
          <IonItem button onClick={() => signOut()} lines="none" detail={false}>
            <IonIcon slot="start" ios={logOutOutline} md={logOutSharp} />
            <IonLabel><!--@@APP_MENU_SIGNOUT--></IonLabel>
          </IonItem>
        </IonList>

      </IonContent>
    </IonMenu>
  );
};

export default Menu;
