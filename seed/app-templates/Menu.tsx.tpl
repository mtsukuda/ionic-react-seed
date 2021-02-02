import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonBadge
} from '@ionic/react';

import {
  bookmarkOutline,
  mailOutline, mailSharp,
  paperPlaneOutline, paperPlaneSharp,
  heartOutline, heartSharp,
  archiveOutline, archiveSharp,
  trashOutline, trashSharp,
  warningOutline, warningSharp,
  planetOutline, planetSharp,
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

const labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

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
          <IonListHeader>Inbox</IonListHeader>
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
          <IonItem button onClick={() => signOut()} lines="none" detail={false}>
            <IonIcon slot="start" ios={logOutOutline} md={logOutSharp} />
            <IonLabel>Sign Out</IonLabel>
          </IonItem>
        </IonList>

        <IonList id="labels-list">
          <IonListHeader>Labels</IonListHeader>
          {labels.map((label, index) => (
            <IonItem lines="none" key={index}>
              <IonIcon slot="start" icon={bookmarkOutline} />
              <IonLabel>{label}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
