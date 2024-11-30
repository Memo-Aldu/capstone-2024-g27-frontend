import React from 'react';
import { render, screen } from '@testing-library/react';
import Loading from './Loading';

describe('Loading', () => {
  it('renders the CircularProgress component', () => {
    render(<Loading />);
    const loader = screen.getByRole('progressbar');
    expect(loader).toBeInTheDocument();
  });

  it('displays the correct heading', () => {
    render(<Loading />);
    const heading = screen.getByText(/authenticating/i);
    expect(heading).toBeInTheDocument();
  });

  it('displays the correct description text', () => {
    render(<Loading />);
    const description = screen.getByText(/please wait while we verify your credentials\./i);
    expect(description).toBeInTheDocument();
  });

  it('applies the correct styles to the container', () => {
    const { container } = render(<Loading />);
    const box = container.querySelector('.MuiBox-root');
    expect(box).toHaveStyle('display: flex');
    expect(box).toHaveStyle('flex-direction: column');
    expect(box).toHaveStyle('align-items: center');
    expect(box).toHaveStyle('justify-content: center');
  });
});
