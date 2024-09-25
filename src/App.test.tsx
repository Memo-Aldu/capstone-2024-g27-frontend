import { render, waitFor, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('tests', async () => {
    render(<App />)
    const elem = await waitFor(() => screen.getByText('Home'))
    expect(elem).toBeInTheDocument()
  })
})
