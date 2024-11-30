import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Home from './Home'

// Mocking the useNavigate hook from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}))

const mockNavigate = jest.fn()

// Wrap Home component with BrowserRouter to handle routing
const renderWithRouter = () => {
  render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  )
}

describe('Home component', () => {
  it('renders the homepage correctly', () => {
    renderWithRouter()

    // Check if the title is displayed
    expect(screen.getByText(/Homepage/i)).toBeInTheDocument()

    // Check if the cards are present
    expect(screen.getByText(/Account Info/i)).toBeInTheDocument()
    expect(screen.getByText(/Payment/i)).toBeInTheDocument()
    expect(screen.getByText(/Incoming Text Messages/i)).toBeInTheDocument()
    expect(screen.getByText(/Message delivery tracking/i)).toBeInTheDocument()

    // Check content inside the cards
    expect(screen.getByText(/AuthID: 12345/i)).toBeInTheDocument()
    expect(screen.getByText(/Credits: 100.00 CAD/i)).toBeInTheDocument()
    expect(screen.getByText(/Chris Humphries Thank you for your time/i)).toBeInTheDocument()
    expect(screen.getByText(/There are no deliveries to track/i)).toBeInTheDocument()

    // Ensure grid and card structure is present
    expect(screen.getByRole('grid')).toBeInTheDocument()
    expect(screen.getAllByRole('gridcell')).toHaveLength(6) // 6 cards should be present

    // Ensure Card components are being rendered
    const cardElements = screen.getAllByRole('presentation') // Cards are divs with no role or presentation
    expect(cardElements).toHaveLength(4) // 4 cards present in total
  })

  it('navigates to the correct page when an icon is clicked', () => {
    // Mock useNavigate to use the mocked function
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate
    }))

    renderWithRouter()

    // Find and click on the Account Info icon
    const accountIcon = screen.getByRole('button', { name: /accountcircle/i })
    fireEvent.click(accountIcon)
    expect(mockNavigate).toHaveBeenCalledWith('/my-account')

    // Find and click on the Payment icon
    const paymentIcon = screen.getByRole('button', { name: /creditcard/i })
    fireEvent.click(paymentIcon)
    expect(mockNavigate).toHaveBeenCalledWith('/payment')

    // Find and click on the Message icon
    const messageIcon = screen.getByRole('button', { name: /message/i })
    fireEvent.click(messageIcon)
    expect(mockNavigate).toHaveBeenCalledWith('/messaging')
  })

  it('renders all sections of the grid layout properly', () => {
    renderWithRouter()

    // Check if all 4 main sections in the grid are rendered
    const gridItems = screen.getAllByRole('gridcell')
    expect(gridItems).toHaveLength(6) // Verify there are 6 items (4 cards, 1 activity section, and 1 additional card)
  })
})
