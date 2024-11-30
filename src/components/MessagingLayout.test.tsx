import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useNavigate } from 'react-router-dom';
import MessagingLayout from './MessagingLayout';

// Mock de useNavigate pour tester la navigation
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('MessagingLayout', () => {
  it('renders the menu items correctly', () => {
    render(
      <MemoryRouter>
        <MessagingLayout />
      </MemoryRouter>
    );

    const menuItems = [
      'Quick Message',
      'Conversation',
      'Campaign',
      'Templates',
      'Email to SMS',
      'History',
    ];

    menuItems.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('navigates to the correct path on menu item click', () => {
    const navigate = useNavigate() as jest.Mock; // Utilise le mock de useNavigate

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<MessagingLayout />} />
          <Route path="/messaging/quickmessage" element={<div>Quick Message Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Clique sur le bouton "Quick Message"
    const quickMessageButton = screen.getByText('Quick Message');
    fireEvent.click(quickMessageButton);

    // Vérifie que la fonction navigate a été appelée avec le bon chemin
    expect(navigate).toHaveBeenCalledWith('/messaging/quickmessage');

    // Vérifie si la nouvelle page s'affiche
    expect(screen.getByText('Quick Message Page')).toBeInTheDocument();
  });

  it('renders children content in the main area', () => {
    render(
      <MemoryRouter>
        <MessagingLayout>
          <div data-testid="child-content">Test Content</div>
        </MessagingLayout>
      </MemoryRouter>
    );

    const childContent = screen.getByTestId('child-content');
    expect(childContent).toBeInTheDocument();
    expect(childContent).toHaveTextContent('Test Content');
  });

  it('checks the drawer navigation functionality', () => {
    const navigate = useNavigate() as jest.Mock;

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<MessagingLayout />} />
          <Route path="/messaging/quickmessage" element={<div>Quick Message Page</div>} />
          <Route path="/messaging/conversation" element={<div>Conversation Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Clique sur le premier item du menu
    fireEvent.click(screen.getByText('Quick Message'));
    expect(navigate).toHaveBeenCalledWith('/messaging/quickmessage');
    
    // Clique sur un autre item du menu
    fireEvent.click(screen.getByText('Conversation'));
    expect(navigate).toHaveBeenCalledWith('/messaging/conversation');
  });
});
