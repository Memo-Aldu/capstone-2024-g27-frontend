import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ContactManagementLayout from './ContactManagementLayout';

// Mock the useNavigate hook from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

const mockNavigate = jest.requireMock('react-router-dom').useNavigate;

// Mock menu items
const mockMenuItems = [
  { name: 'Groupes', path: '/ContactManagement/Groupes' },
  { name: 'Contacts', path: '/ContactManagement/Contacts' },
];

describe('ContactManagementLayout Component', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  it('should render the drawer with menu items', () => {
    render(
      <MemoryRouter>
        <ContactManagementLayout />
      </MemoryRouter>
    );

    mockMenuItems.forEach((item) => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
    });
  });

  it('should navigate to the correct path on menu item click', () => {
    render(
      <MemoryRouter>
        <ContactManagementLayout />
      </MemoryRouter>
    );

    mockMenuItems.forEach((item) => {
      const menuItem = screen.getByText(item.name);
      fireEvent.click(menuItem);
      expect(mockNavigate).toHaveBeenCalledWith(item.path);
    });
  });

  it('should render children passed to it', () => {
    render(
      <MemoryRouter>
        <ContactManagementLayout>
          <div>Test Child Component</div>
        </ContactManagementLayout>
      </MemoryRouter>
    );

    expect(screen.getByText('Test Child Component')).toBeInTheDocument();
  });
});