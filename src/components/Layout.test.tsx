import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import Layout from './Layout';
import { store } from 'src/app/store';
import { Provider } from 'react-redux';

// Mock de la fonction `useNavigate`
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Layout', () => {
  const navigate = jest.fn(); // Crée un mock de navigate

  beforeEach(() => {
    // Avant chaque test, on s'assure que le mock de navigate est bien réinitialisé
    (useNavigate as jest.Mock).mockReturnValue(navigate);
  });

  it('renders the layout correctly', () => {
    render(
      <Provider store={store}>
        <Router>
          <Layout>
            <div>Test content</div>
          </Layout>
        </Router>
      </Provider>
    );

    // Vérifier la présence du titre
    expect(screen.getByText('PharmfinderCRM')).toBeInTheDocument();

    // Vérifier la présence des icônes dans la barre de navigation
    expect(screen.getByRole('button', { name: /notifications/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /settings/i })).toBeInTheDocument();

    // Vérifier la présence des éléments du menu latéral
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Contact Management')).toBeInTheDocument();
    expect(screen.getByText('Messaging')).toBeInTheDocument();
    expect(screen.getByText('Help')).toBeInTheDocument();
    expect(screen.getByText('My Account')).toBeInTheDocument();

    // Vérifier le contenu principal
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('opens and closes the user menu on hover', async () => {
    render(
      <Provider store={store}>
        <Router>
          <Layout>
            <div>Test content</div>
          </Layout>
        </Router>
      </Provider>
    );

    // Vérifier que le menu utilisateur est fermé initialement
    expect(screen.queryByText('Account Settings')).not.toBeInTheDocument();

    // Hover sur l'icône de l'utilisateur pour ouvrir le menu
    fireEvent.mouseEnter(screen.getByRole('button', { name: /accountcircleicon/i }));

    // Attendre que le menu s'affiche
    await waitFor(() => {
      expect(screen.getByText('Account Settings')).toBeInTheDocument();
    });

    // Hover out pour fermer le menu
    fireEvent.mouseLeave(screen.getByRole('button', { name: /accountcircleicon/i }));

    // Vérifier que le menu se ferme
    await waitFor(() => {
      expect(screen.queryByText('Account Settings')).not.toBeInTheDocument();
    });
  });

  it('navigates when clicking on a menu item', () => {
    render(
      <Provider store={store}>
        <Router>
          <Layout>
            <div>Test content</div>
          </Layout>
        </Router>
      </Provider>
    );

    // Cliquer sur un élément de menu
    fireEvent.click(screen.getByText('Dashboard'));

    // Vérifier si navigate a été appelé avec le bon chemin
    expect(navigate).toHaveBeenCalledWith('/dashboard');
  });

  it('handles logout correctly', async () => {
    render(
      <Provider store={store}>
        <Router>
          <Layout>
            <div>Test content</div>
          </Layout>
        </Router>
      </Provider>
    );

    // Hover sur l'icône de l'utilisateur pour afficher le menu
    fireEvent.mouseEnter(screen.getByRole('button', { name: /accountcircleicon/i }));

    // Cliquer sur le bouton de déconnexion
    fireEvent.click(screen.getByText('Logout'));

    // Vérifier que la fonction de déconnexion a été appelée (si un mock de déconnexion est défini dans le Logout component)
  });
});
