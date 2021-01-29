import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import { useParams } from 'react-router';
import ExploreContainer from '../components/ExploreContainer';
import './Page.css';

const Page: React.FC = () => {

  const { name } = useParams<{ name: string; }>();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{name}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <nav className="pagination" role="navigation" aria-label="pagination">
          <a className="pagination-previous dm-text-a6a6a6">Previous</a>
          <a className="pagination-next dm-text-a6a6a6">Next page</a>
          <ul className="pagination-list">
            <li>
              <a className="pagination-link dm-text-a6a6a6" aria-label="Goto page 1">1</a>
            </li>
            <li>
              <span className="pagination-ellipsis">&hellip;</span>
            </li>
            <li>
              <a className="pagination-link dm-text-a6a6a6" aria-label="Goto page 6">6</a>
            </li>
            <li>
              <a className="pagination-link dm-text-a6a6a6" aria-label="Goto page 7">7</a>
            </li>
            <li>
              <a className="pagination-link dm-text-a6a6a6 is-current" aria-label="Goto page 8" aria-current="page">8</a>
            </li>
            <li>
              <a className="pagination-link dm-text-a6a6a6" aria-label="Goto page 86">&gt;</a>
            </li>
          </ul>
        </nav>
        <ExploreContainer name={name} />
      </IonContent>
    </IonPage>
  );
};

export default Page;
