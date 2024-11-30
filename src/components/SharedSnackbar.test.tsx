import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from 'src/app/store';
import SharedSnackbar from './SharedSnackbar';
import { closeSnackbar } from 'src/features/snackbar/snackbarSlice';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

describe('Composant SharedSnackbar', () => {
  it('affiche le snackbar avec le message et la sévérité correcte', () => {
    const snackbarState = {
      open: true,
      message: 'Ceci est un message de test',
      severity: 'success' as 'success' | 'error' | 'info' | 'warning',
    };

    render(
      <Provider store={store}>
        <SharedSnackbar />
      </Provider>
    );

    expect(screen.getByText(snackbarState.message)).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('MuiAlert-standard-success');
  });

  it('change la classe CSS pour chaque sévérité', () => {
    const severities: ('success' | 'error' | 'info' | 'warning')[] = ['success', 'error', 'info', 'warning'];

    severities.forEach((severity) => {
      render(
        <Provider store={store}>
          <SharedSnackbar />
        </Provider>
      );
      
      expect(screen.getByRole('alert')).toHaveClass(`MuiAlert-standard-${severity}`);
    });
  });

  it('ferme le snackbar après la durée d\'auto-fermée', async () => {
    jest.useFakeTimers();

    render(
      <Provider store={store}>
        <SharedSnackbar />
      </Provider>
    );

    expect(screen.getByRole('alert')).toBeVisible();

    jest.advanceTimersByTime(6000);

    await waitFor(() => expect(screen.queryByRole('alert')).toBeNull());
  });

  it('envoie l\'action closeSnackbar lors de la fermeture manuelle', () => {
    const dispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(dispatch);

    render(
      <Provider store={store}>
        <SharedSnackbar />
      </Provider>
    );

    fireEvent.click(screen.getByRole('alert').querySelector('button')!);

    expect(dispatch).toHaveBeenCalledWith(closeSnackbar());
  });
});
