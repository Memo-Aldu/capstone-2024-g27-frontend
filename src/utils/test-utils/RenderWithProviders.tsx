import React from 'react'
import { render, type RenderOptions, type RenderResult } from '@testing-library/react'
import { Provider } from 'react-redux'
import { setupStore } from 'src/app/store'

const store = setupStore()

const renderWithProviders = (
  ui: React.ReactElement,
  { ...renderOptions }: RenderOptions = {}
): RenderResult => {
  return render(<Provider store={store}>{ui}</Provider>, renderOptions)
}

export * from '@testing-library/react'
export { renderWithProviders }
