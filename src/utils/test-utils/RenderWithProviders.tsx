import React from 'react'
import { render, type RenderOptions, type RenderResult } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from 'src/app/store'

const renderWithProviders = (
  ui: React.ReactElement,
  { ...renderOptions }: RenderOptions = {}
): RenderResult => {
  return render(<Provider store={store}>{ui}</Provider>, renderOptions)
}

export * from '@testing-library/react'
export { renderWithProviders }
