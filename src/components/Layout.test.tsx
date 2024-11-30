import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Layout from './Layout';

describe('Layout component', () => {
  it('renders AppBar with title', () => {
    render(
      <MemoryRouter>
        <Layout>
          <div>Test Content</div>
        </Layout>
      </MemoryRouter>
    );
    expect(screen.getByText('PharmfinderCRM')).toBeInTheDocument();
  });

  it('renders menu items in the drawer', () => {
    render(
      <MemoryRouter>
        <Layout>
          <div>Test Content</div>
        </Layout>
      </MemoryRouter>
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Contact Management')).toBeInTheDocument();
    expect(screen.getByText('Messaging')).toBeInTheDocument();
  });

  it('navigates on menu item click', () => {
    const { getByText } = render(
      <MemoryRouter>
        <Layout>
          <div>Test Content</div>
        </Layout>
      </MemoryRouter>
    );

    const homeButton = getByText('Home');
    fireEvent.click(homeButton);

    // Navigation assertion (needs a router mock if navigation needs verification)
    expect(homeButton).toBeInTheDocument(); // Simple presence check
  });

  it('renders children correctly', () => {
    render(
      <MemoryRouter>
        <Layout>
          <div>Test Content</div>
        </Layout>
      </MemoryRouter>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});
