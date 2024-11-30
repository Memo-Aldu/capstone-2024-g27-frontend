// src/components/SharedSnackbar.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from 'src/app/store'; // Assurez-vous d'importer le store correctement
import SharedSnackbar from './SharedSnackbar';
import { closeSnackbar } from 'src/features/snackbar/snackbarSlice';

describe('Composant SharedSnackbar', () => {
  it('affiche le snackbar avec le message et la sévérité correcte', () => {
    // État initial pour le snackbar
    const snackbarState = {
      open: true,
      message: 'Ceci est un message de test',
      severity: 'success' as 'success' | 'error' | 'info' | 'warning',
    };

    // Rendu du composant avec l'état initial du store
    render(
      <Provider store={store}>
        <SharedSnackbar />
      </Provider>
    );

    // Vérifier que le snackbar est visible avec le bon message
    expect(screen.getByText(snackbarState.message)).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('MuiAlert-standard-success');
  });

  it('ferme le snackbar après la durée d\'auto-fermée', async () => {
    jest.useFakeTimers(); // Mock des timers pour tester le comportement de l\'auto-fermeture

    render(
      <Provider store={store}>
        <SharedSnackbar />
      </Provider>
    );

    // Le snackbar devrait être visible au début
    expect(screen.getByRole('alert')).toBeVisible();

    // Avancer les timers pour simuler la durée d\'auto-fermeture
    jest.advanceTimersByTime(6000);

    // Le snackbar devrait être fermé après la durée d\'auto-fermeture
    await waitFor(() => expect(screen.queryByRole('alert')).toBeNull());
  });

  it('envoie l\'action closeSnackbar lors de la fermeture manuelle', () => {
    const { getByRole } = render(
      <Provider store={store}>
        <SharedSnackbar />
      </Provider>
    );

    // Simuler la fermeture du snackbar manuellement (par exemple, en cliquant sur le bouton de fermeture)
    fireEvent.click(getByRole('alert').querySelector('button')!);

    // Vérifier si l\'action closeSnackbar a été envoyée
    expect(store.getState().snackbar.open).toBe(false);
  });
});
