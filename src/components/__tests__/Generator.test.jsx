/**
 * Tests for Generator.jsx component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Generator from '../Generator'
import useAtelierStore from '../../store/useAtelierStore'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }) => children,
}))

// Mock enrichmentService
vi.mock('../../services/enrichmentService', () => ({
  enrichirProduit: vi.fn().mockResolvedValue({
    data: {
      materiaux: ['vachette'],
      montages: ['colle'],
    },
    confiance: 85,
    source: 'statique',
  }),
}))

// Mock promptBuilder
vi.mock('../../services/promptBuilder', () => ({
  genererPromptImage: vi.fn().mockReturnValue({
    prompt: 'test prompt for shoe image',
    parametres: {
      segment: 'Femme',
      type: 'derby',
      style: 'classique',
    },
  }),
  genererVariations: vi.fn().mockReturnValue([]),
}))

// Mock historyService
vi.mock('../../services/historyService', () => ({
  create: vi.fn(),
  getAll: vi.fn().mockReturnValue([]),
  getById: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
  clearAll: vi.fn(),
  search: vi.fn(),
  getRecent: vi.fn(),
  exportJSON: vi.fn(),
  importJSON: vi.fn(),
}))

// Mock child components
vi.mock('../TechnicalCard', () => ({
  default: ({ segment, config, enrichment }) => (
    <div data-testid="technical-card">
      TechnicalCard - {segment}
    </div>
  ),
}))

vi.mock('../PromptCard', () => ({
  default: ({ prompt, config, segment }) => (
    <div data-testid="prompt-card">
      PromptCard
    </div>
  ),
}))

vi.mock('../SourcingModule', () => ({
  default: ({ segment, config }) => (
    <div data-testid="sourcing-module">
      SourcingModule
    </div>
  ),
}))

describe('Generator', () => {
  beforeEach(() => {
    // Reset store state before each test
    const store = useAtelierStore.getState()
    store.reset()
    vi.clearAllMocks()
  })

  it('should render without crashing', () => {
    render(<Generator />)
    expect(screen.getByText(/Femme/)).toBeInTheDocument()
  })

  it('should display segment label and pointures', () => {
    render(<Generator />)
    expect(screen.getByText('Femme')).toBeInTheDocument()
    expect(screen.getByText(/Pointures/)).toBeInTheDocument()
  })

  it('should have a reset button', () => {
    render(<Generator />)
    const resetButton = screen.getByRole('button', { name: /Réinitialiser/ })
    expect(resetButton).toBeInTheDocument()
  })

  it('should have a generate button with correct initial text', () => {
    render(<Generator />)
    const generateButton = screen.getByRole('button', { name: /Générer la fiche/ })
    expect(generateButton).toBeInTheDocument()
  })

  it('should disable generate button when no type_chaussure is selected', () => {
    render(<Generator />)
    const generateButton = screen.getByRole('button', { name: /Générer la fiche/ })
    expect(generateButton).toBeDisabled()
  })

  it('should render type select with options', () => {
    render(<Generator />)
    const selects = screen.getAllByRole('combobox')
    expect(selects.length).toBeGreaterThan(0)
    expect(screen.getAllByText('Sélectionner...').length).toBeGreaterThan(0)
  })

  it('should render all form fields', () => {
    render(<Generator />)
    expect(screen.getByText(/Type de chaussure/)).toBeInTheDocument()
    expect(screen.getByText(/Matériau tige/)).toBeInTheDocument()
    expect(screen.getByText(/Couleur principale/)).toBeInTheDocument()
    expect(screen.getByText(/Montage/)).toBeInTheDocument()
    expect(screen.getByText(/Type de semelle/)).toBeInTheDocument()
    expect(screen.getByText(/Style/)).toBeInTheDocument()
    expect(screen.getByText(/Inspiration/)).toBeInTheDocument()
  })

  it('should update type_chaussure in config when selected', () => {
    render(<Generator />)
    const selects = screen.getAllByRole('combobox')
    const typeSelect = selects[0]
    fireEvent.change(typeSelect, { target: { value: 'escarpin' } })
    expect(typeSelect.value).toBe('escarpin')
  })

  it('should enable generate button when type_chaussure is selected', () => {
    render(<Generator />)
    const selects = screen.getAllByRole('combobox')
    const typeSelect = selects[0]
    const generateButton = screen.getByRole('button', { name: /Générer la fiche/ })

    fireEvent.change(typeSelect, { target: { value: 'escarpin' } })
    expect(generateButton).not.toBeDisabled()
  })

  it('should show loading state when generating', async () => {
    render(<Generator />)
    const selects = screen.getAllByRole('combobox')
    const typeSelect = selects[0]
    fireEvent.change(typeSelect, { target: { value: 'escarpin' } })

    const generateButton = screen.getByRole('button', { name: /Générer la fiche/ })
    fireEvent.click(generateButton)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Génération\.\.\./ })).toBeInTheDocument()
    })
  })

  it('should display results after generation', async () => {
    render(<Generator />)
    const selects = screen.getAllByRole('combobox')
    const typeSelect = selects[0]
    fireEvent.change(typeSelect, { target: { value: 'escarpin' } })

    const generateButton = screen.getByRole('button', { name: /Générer la fiche/ })
    fireEvent.click(generateButton)

    await waitFor(() => {
      expect(screen.getByTestId('technical-card')).toBeInTheDocument()
      expect(screen.getByTestId('prompt-card')).toBeInTheDocument()
      expect(screen.getByTestId('sourcing-module')).toBeInTheDocument()
    })
  })

  it('should show save button after generation', async () => {
    render(<Generator />)
    const selects = screen.getAllByRole('combobox')
    const typeSelect = selects[0]
    fireEvent.change(typeSelect, { target: { value: 'escarpin' } })

    const generateButton = screen.getByRole('button', { name: /Générer la fiche/ })
    fireEvent.click(generateButton)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Sauvegarder/ })).toBeInTheDocument()
    })
  })

  it('should reset config when reset button is clicked', async () => {
    render(<Generator />)
    const selects = screen.getAllByRole('combobox')
    const typeSelect = selects[0]

    // Set a value
    fireEvent.change(typeSelect, { target: { value: 'escarpin' } })
    expect(typeSelect.value).toBe('escarpin')

    // Click reset
    const resetButton = screen.getByRole('button', { name: /Réinitialiser/ })
    fireEvent.click(resetButton)

    // Value should be cleared
    expect(typeSelect.value).toBe('')
  })

  it('should update color field when color is selected', () => {
    render(<Generator />)
    const selects = screen.getAllByRole('combobox')
    // Type is 0, Material is 1, Color is 2
    const colorSelect = selects[2]
    fireEvent.change(colorSelect, { target: { value: 'noir' } })
    expect(colorSelect.value).toBe('noir')
  })

  it('should update style field when style is selected', () => {
    render(<Generator />)
    const selects = screen.getAllByRole('combobox')
    // Style is the 6th select (index 5)
    const styleSelect = selects[5]
    fireEvent.change(styleSelect, { target: { value: 'classique' } })
    expect(styleSelect.value).toBe('classique')
  })

  it('should update inspiration field when text is entered', () => {
    render(<Generator />)
    const inputs = screen.getAllByRole('textbox')
    const inspirationInput = inputs[inputs.length - 1] // inspiration is the last textbox
    fireEvent.change(inspirationInput, { target: { value: 'test inspiration' } })
    expect(inspirationInput.value).toBe('test inspiration')
  })

  describe('dropdown segment filtering', () => {
    it('should not show vernis finition for bebe segment', () => {
      // Set store segment to bebe
      useAtelierStore.getState().setSegment('bebe')
      const { unmount } = render(<Generator />)
      // Find all select options text
      const allOptions = screen.getAllByRole('option').map(o => o.textContent.toLowerCase())
      expect(allOptions).not.toContain('vernis')
      unmount()
    })

    it('should not show lacets fermeture for bebe segment', () => {
      useAtelierStore.getState().setSegment('bebe')
      render(<Generator />)
      const allOptions = screen.getAllByRole('option').map(o => o.textContent.toLowerCase())
      expect(allOptions).not.toContain('lacets')
    })

    it('should not show hauteur talon for bebe segment', () => {
      useAtelierStore.getState().setSegment('bebe')
      render(<Generator />)
      expect(screen.queryByText(/Hauteur de talon/)).not.toBeInTheDocument()
    })

    it('should show hauteur talon for femme segment', () => {
      useAtelierStore.getState().setSegment('femme')
      render(<Generator />)
      expect(screen.getByText(/Hauteur de talon/)).toBeInTheDocument()
    })
  })
})
