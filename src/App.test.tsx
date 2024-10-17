import { render, waitFor, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('loads HomePage', async () => {
    render(<App />)
    const homeElem = await waitFor(() => screen.getByText('Homepage'))
    expect(homeElem).toBeInTheDocument()
  })
})
