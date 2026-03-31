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

// Mock sourcing data with realistic data
vi.mock('../../data/sourcing', () => ({
  getCategories: vi.fn().mockReturnValue(['cuir', 'synthetique', 'semelles', 'accessoires']),
  getFournisseurs: vi.fn((category, mode) => {
    if (category === 'cuir') {
      if (mode === 'maroc') {
        return [
          {
            id: 'tan-maroc-01',
            nom: 'Tannerie de Fès',
            specialite: 'Cuir vachette / veau',
            qualite: 'standard',
            ville: 'Fès',
            pays: 'Maroc',
            delai_jours: 15,
            moq: 500,
            moq_unite: 'm²',
            certification: ['LWG Silver'],
            prix_mad_m2: { min: 80, max: 180 },
          },
        ]
      }
      return [
        {
          id: 'tan-it-01',
          nom: 'Conceria Walpier',
          specialite: 'Cuir veau végétal',
          qualite: 'luxe',
          ville: 'Santa Croce',
          pays: 'Italie',
          delai_jours: 25,
          moq: 200,
          moq_unite: 'm²',
          certification: ['LWG Gold'],
          prix_mad_m2: { min: 350, max: 650 },
        },
      ]
    }
    return []
  }),
}))

describe('SourcingModule', () => {
  beforeEach(() => {
    useAtelierStore.getState().reset()
    vi.clearAllMocks()
  })

  it('should render without crashing', () => {
    render(<SourcingModule segment="femme" config={{}} />)
    expect(screen.getByText('Sourcing')).toBeInTheDocument()
  })

  it('should have Maroc Local and Export Premium toggle buttons', () => {
    render(<SourcingModule segment="femme" config={{}} />)
    expect(screen.getByText('Maroc Local')).toBeInTheDocument()
    expect(screen.getByText('Export Premium')).toBeInTheDocument()
  })

  it('should have Maroc mode selected by default', () => {
    render(<SourcingModule segment="femme" config={{}} />)
    const marocButton = screen.getByText('Maroc Local').closest('button')
    expect(marocButton).toHaveClass('bg-or')
  })

  it('should switch to Export mode when Export button is clicked', async () => {
    render(<SourcingModule segment="femme" config={{}} />)
    const exportButton = screen.getByText('Export Premium').closest('button')
    fireEvent.click(exportButton)

    await waitFor(() => {
      expect(exportButton).toHaveClass('bg-or')
    })
  })

  it('should switch back to Maroc mode when clicked', async () => {
    render(<SourcingModule segment="femme" config={{}} />)
    const exportButton = screen.getByText('Export Premium').closest('button')
    const marocButton = screen.getByText('Maroc Local').closest('button')

    fireEvent.click(exportButton)
    await waitFor(() => {
      expect(exportButton).toHaveClass('bg-or')
    })

    fireEvent.click(marocButton)
    await waitFor(() => {
      expect(marocButton).toHaveClass('bg-or')
    })
  })

  it('should display category headers', () => {
    render(<SourcingModule segment="femme" config={{}} />)
    expect(screen.getByText('cuir')).toBeInTheDocument()
  })

  it('should display supplier names directly', () => {
    render(<SourcingModule segment="femme" config={{}} />)
    expect(screen.getByText('Tannerie de Fès')).toBeInTheDocument()
  })

  it('should display supplier specialite', () => {
    render(<SourcingModule segment="femme" config={{}} />)
    expect(screen.getByText('Cuir vachette / veau')).toBeInTheDocument()
  })

  it('should display supplier qualite badge', () => {
    render(<SourcingModule segment="femme" config={{}} />)
    expect(screen.getByText('standard')).toBeInTheDocument()
  })

  it('should display supplier location', () => {
    render(<SourcingModule segment="femme" config={{}} />)
    expect(screen.getByText(/Fès, Maroc/)).toBeInTheDocument()
  })

  it('should display supplier delay', () => {
    render(<SourcingModule segment="femme" config={{}} />)
    expect(screen.getByText(/15j délai/)).toBeInTheDocument()
  })

  it('should display supplier price', () => {
    render(<SourcingModule segment="femme" config={{}} />)
    expect(screen.getByText(/80–180 MAD\/m²/)).toBeInTheDocument()
  })

  it('should display supplier MOQ', () => {
    render(<SourcingModule segment="femme" config={{}} />)
    expect(screen.getByText(/MOQ: 500 m²/)).toBeInTheDocument()
  })

  it('should display supplier certifications', () => {
    render(<SourcingModule segment="femme" config={{}} />)
    expect(screen.getByText('LWG Silver')).toBeInTheDocument()
  })

  it('should update suppliers when sourcing mode changes', async () => {
    render(<SourcingModule segment="femme" config={{}} />)

    // Default maroc mode
    expect(screen.getByText('Tannerie de Fès')).toBeInTheDocument()

    // Switch to export
    const exportButton = screen.getByText('Export Premium').closest('button')
    fireEvent.click(exportButton)

    await waitFor(() => {
      expect(screen.getByText('Conceria Walpier')).toBeInTheDocument()
    })
  })
})
