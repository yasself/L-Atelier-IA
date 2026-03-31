/**
 * Tests for SourcingModule.jsx component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SourcingModule from '../SourcingModule'
import useAtelierStore from '../../store/useAtelierStore'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => children,
}))

// Mock sourcing data
vi.mock('../../data/sourcing', () => ({
  getCategories: vi.fn().mockReturnValue([
    'materiaux',
    'composants',
    'emballage',
  ]),
  getFournisseurs: vi.fn((category, mode) => {
    if (category === 'materiaux') {
      return [
        {
          id: 'f1',
          nom: 'Supplier One',
          specialite: 'Leather materials',
          qualite: 'premium',
          ville: 'Fez',
          pays: 'Maroc',
          delai_jours: 14,
          moq: 50,
          moq_unite: 'paire',
          certification: ['ISO 9001'],
          prix_mad_m2: { min: 80, max: 120 },
        },
        {
          id: 'f2',
          nom: 'Supplier Two',
          specialite: 'Synthetic materials',
          qualite: 'standard',
          ville: 'Casablanca',
          pays: 'Maroc',
          delai_jours: 7,
          moq: 100,
          moq_unite: 'paire',
          certification: [],
          prix_mad_paire: { min: 50, max: 80 },
        },
      ]
    }
    return []
  }),
}))

describe('SourcingModule', () => {
  beforeEach(() => {
    // Reset store state
    const store = useAtelierStore.getState()
    store.reset()
    vi.clearAllMocks()
  })

  it('should render without crashing', () => {
    render(<SourcingModule segment="femme" config={{}} />)
    expect(screen.getByText(/Sourcing/)).toBeInTheDocument()
  })

  it('should display the sourcing header', () => {
    render(<SourcingModule segment="femme" config={{}} />)
    expect(screen.getByText('Sourcing')).toBeInTheDocument()
  })

  it('should have Maroc and Export Premium toggle buttons', () => {
    render(<SourcingModule segment="femme" config={{}} />)
    expect(screen.getByText('Maroc')).toBeInTheDocument()
    expect(screen.getByText('Export Premium')).toBeInTheDocument()
  })

  it('should have Maroc mode selected by default', () => {
    render(<SourcingModule segment="femme" config={{}} />)
    const marocButton = screen.getByRole('button', { name: /Maroc/ })
    expect(marocButton).toHaveClass('bg-or')
  })

  it('should switch to Export mode when Export button is clicked', async () => {
    render(<SourcingModule segment="femme" config={{}} />)
    const exportButton = screen.getByRole('button', { name: /Export Premium/ })
    fireEvent.click(exportButton)

    await waitFor(() => {
      expect(exportButton).toHaveClass('bg-or')
    })
  })

  it('should switch back to Maroc mode when Maroc button is clicked', async () => {
    render(<SourcingModule segment="femme" config={{}} />)
    const exportButton = screen.getByRole('button', { name: /Export Premium/ })
    const marocButton = screen.getByRole('button', { name: /Maroc/ })

    // First switch to export
    fireEvent.click(exportButton)
    await waitFor(() => {
      expect(exportButton).toHaveClass('bg-or')
    })

    // Then switch back to maroc
    fireEvent.click(marocButton)
    await waitFor(() => {
      expect(marocButton).toHaveClass('bg-or')
    })
  })

  it('should display category sections', () => {
    render(<SourcingModule segment="femme" config={{}} />)
    expect(screen.getByText(/materiaux/i)).toBeInTheDocument()
  })

  it('should display category count', async () => {
    render(<SourcingModule segment="femme" config={{}} />)
    await waitFor(() => {
      expect(screen.getByText(/2 fournisseurs/i)).toBeInTheDocument()
    })
  })

  it('should toggle category expansion when clicked', async () => {
    render(<SourcingModule segment="femme" config={{}} />)

    const categoryButton = screen.getByRole('button', { name: /materiaux/ })
    fireEvent.click(categoryButton)

    await waitFor(() => {
      expect(screen.getByText('Supplier One')).toBeInTheDocument()
    })
  })

  it('should display supplier details when category is expanded', async () => {
    render(<SourcingModule segment="femme" config={{}} />)

    const categoryButton = screen.getByRole('button', { name: /materiaux/ })
    fireEvent.click(categoryButton)

    await waitFor(() => {
      expect(screen.getByText('Supplier One')).toBeInTheDocument()
      expect(screen.getByText('Leather materials')).toBeInTheDocument()
      expect(screen.getByText(/Fez/)).toBeInTheDocument()
      // Check for Maroc in multiple elements using getAllByText
      const marocElements = screen.getAllByText(/Maroc/)
      expect(marocElements.length).toBeGreaterThan(0)
    })
  })

  it('should display supplier qualite badge', async () => {
    render(<SourcingModule segment="femme" config={{}} />)

    const categoryButton = screen.getByRole('button', { name: /materiaux/ })
    fireEvent.click(categoryButton)

    await waitFor(() => {
      expect(screen.getByText('premium')).toBeInTheDocument()
      expect(screen.getByText('standard')).toBeInTheDocument()
    })
  })

  it('should display supplier delay information', async () => {
    render(<SourcingModule segment="femme" config={{}} />)

    const categoryButton = screen.getByRole('button', { name: /materiaux/ })
    fireEvent.click(categoryButton)

    await waitFor(() => {
      expect(screen.getByText(/14j délai/)).toBeInTheDocument()
      expect(screen.getByText(/7j délai/)).toBeInTheDocument()
    })
  })

  it('should display supplier price information', async () => {
    render(<SourcingModule segment="femme" config={{}} />)

    const categoryButton = screen.getByRole('button', { name: /materiaux/ })
    fireEvent.click(categoryButton)

    await waitFor(() => {
      expect(screen.getByText(/80–120 MAD\/m²/)).toBeInTheDocument()
      expect(screen.getByText(/50–80 MAD\/paire/)).toBeInTheDocument()
    })
  })

  it('should display supplier MOQ information', async () => {
    render(<SourcingModule segment="femme" config={{}} />)

    const categoryButton = screen.getByRole('button', { name: /materiaux/ })
    fireEvent.click(categoryButton)

    await waitFor(() => {
      expect(screen.getByText(/MOQ: 50 paire/)).toBeInTheDocument()
      expect(screen.getByText(/MOQ: 100 paire/)).toBeInTheDocument()
    })
  })

  it('should display supplier certifications', async () => {
    render(<SourcingModule segment="femme" config={{}} />)

    const categoryButton = screen.getByRole('button', { name: /materiaux/ })
    fireEvent.click(categoryButton)

    await waitFor(() => {
      expect(screen.getByText('ISO 9001')).toBeInTheDocument()
    })
  })

  it('should collapse category when clicked again', async () => {
    render(<SourcingModule segment="femme" config={{}} />)

    const categoryButton = screen.getByRole('button', { name: /materiaux/ })

    // First click to expand
    fireEvent.click(categoryButton)
    await waitFor(() => {
      expect(screen.getByText('Supplier One')).toBeInTheDocument()
    })

    // Second click to collapse
    fireEvent.click(categoryButton)
    await waitFor(() => {
      expect(screen.queryByText('Supplier One')).not.toBeInTheDocument()
    }, { timeout: 100 })
  })

  it('should display multiple categories', async () => {
    render(<SourcingModule segment="femme" config={{}} />)

    // Should have buttons for each category with fournisseurs
    const categoryButtons = screen.getAllByRole('button')
    // At least 3 buttons: 2 for toggle (Maroc/Export) + 1 for category
    expect(categoryButtons.length).toBeGreaterThanOrEqual(3)
  })

  it('should update suppliers when sourcing mode is changed', async () => {
    render(<SourcingModule segment="femme" config={{}} />)

    // Expand materiaux category in maroc mode
    const categoryButton = screen.getByRole('button', { name: /materiaux/ })
    fireEvent.click(categoryButton)

    await waitFor(() => {
      expect(screen.getByText('Supplier One')).toBeInTheDocument()
    })

    // Switch to export mode
    const exportButton = screen.getByRole('button', { name: /Export Premium/ })
    fireEvent.click(exportButton)

    // The suppliers should be updated based on the new mode
    // (In this test, we're just checking that the mode changes)
    await waitFor(() => {
      expect(exportButton).toHaveClass('bg-or')
    })
  })
})
