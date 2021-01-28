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
  logOutOutline, logOutSharp
} from 'ionicons/icons';

import React from 'react';
import { useLocation } from 'react-router-dom';
import './Menu.css';
import { Auth } from 'aws-amplify';

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
  badge: number;
}

const appPages: AppPage[] = [
  {
    title: 'Inbox',
    url: '/page/Inbox',
    iosIcon: mailOutline,
    mdIcon: mailSharp,
    badge: 0
  },
  {
    title: 'Outbox',
    url: '/page/Outbox',
    iosIcon: paperPlaneOutline,
    mdIcon: paperPlaneSharp,
    badge: 5
  },
  {
    title: 'Favorites',
    url: '/page/Favorites',
    iosIcon: heartOutline,
    mdIcon: heartSharp,
    badge: 0
  },
  {
    title: 'Archived',
    url: '/page/Archived',
    iosIcon: archiveOutline,
    mdIcon: archiveSharp,
    badge: 8
  },
  {
    title: 'Trash',
    url: '/page/Trash',
    iosIcon: trashOutline,
    mdIcon: trashSharp,
    badge: 0
  },
  {
    title: 'Spam',
    url: '/page/Spam',
    iosIcon: warningOutline,
    mdIcon: warningSharp,
    badge: 0
  }
];

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
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                  {
                    appPage.badge === 0 ? "" : <IonBadge slot="end">{appPage.badge}</IonBadge>
                  }
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
