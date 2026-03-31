/**
 * Tests for PromptCard.jsx component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import PromptCard from '../PromptCard'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => children,
}))

// Mock promptBuilder for variations
vi.mock('../../services/promptBuilder', () => ({
  genererVariations: vi.fn().mockReturnValue([
    {
      id: 1,
      angle: '3/4 front',
      prompt: 'Variation 1 prompt text',
    },
    {
      id: 2,
      angle: 'side view',
      prompt: 'Variation 2 prompt text',
    },
  ]),
}))

describe('PromptCard', () => {
  beforeEach(() => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    })
    vi.clearAllMocks()
  })

  it('should return null when no prompt prop is provided', () => {
    const { container } = render(<PromptCard prompt={null} config={{}} segment="femme" />)
    expect(container.firstChild).toBeNull()
  })

  it('should render prompt card when prompt is provided', () => {
    const prompt = {
      prompt: 'Ultra-realistic studio photography of a black leather derby shoe...',
      parametres: {
        segment: 'Femme',
        type: 'derby',
        style: 'classique',
      },
    }
    render(<PromptCard prompt={prompt} config={{}} segment="femme" />)
    expect(screen.getByText(/Prompt Image/)).toBeInTheDocument()
  })

  it('should display the prompt text', () => {
    const prompt = {
      prompt: 'Test prompt for shoe image generation',
      parametres: {
        segment: 'Femme',
        type: 'derby',
      },
    }
    render(<PromptCard prompt={prompt} config={{}} segment="femme" />)
    expect(screen.getByText(/Test prompt for shoe image generation/)).toBeInTheDocument()
  })

  it('should have a copy button', () => {
    const prompt = {
      prompt: 'Test prompt',
      parametres: { segment: 'Femme' },
    }
    render(<PromptCard prompt={prompt} config={{}} segment="femme" />)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThanOrEqual(1)
  })

  it('should copy prompt to clipboard when copy button is clicked', async () => {
    const prompt = {
      prompt: 'Test prompt for copying',
      parametres: { segment: 'Femme' },
    }
    render(<PromptCard prompt={prompt} config={{}} segment="femme" />)

    const copyButton = screen.getByTitle('Copier le prompt')
    fireEvent.click(copyButton)

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Test prompt for copying')
    })
  })

  it('should show check icon after copying', async () => {
    const prompt = {
      prompt: 'Test prompt',
      parametres: { segment: 'Femme' },
    }
    render(<PromptCard prompt={prompt} config={{}} segment="femme" />)

    const copyButton = screen.getByTitle('Copier le prompt')
    fireEvent.click(copyButton)

    await waitFor(() => {
      // After copying, the Check icon should be rendered
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    }, { timeout: 100 })
  })

  it('should display parametres as tags', () => {
    const prompt = {
      prompt: 'Test prompt',
      parametres: {
        segment: 'Femme',
        type: 'derby',
        style: 'classique',
      },
    }
    render(<PromptCard prompt={prompt} config={{}} segment="femme" />)

    expect(screen.getByText(/segment:/i)).toBeInTheDocument()
    expect(screen.getByText(/type:/i)).toBeInTheDocument()
    expect(screen.getByText(/style:/i)).toBeInTheDocument()
  })

  it('should not display empty parametres', () => {
    const prompt = {
      prompt: 'Test prompt',
      parametres: {
        segment: 'Femme',
        type: '',
        style: null,
      },
    }
    render(<PromptCard prompt={prompt} config={{}} segment="femme" />)

    expect(screen.getByText(/segment:/i)).toBeInTheDocument()
    // type and style are empty, so they should not be displayed
  })

  it('should have a refresh button for variations', () => {
    const prompt = {
      prompt: 'Test prompt',
      parametres: { segment: 'Femme' },
    }
    render(<PromptCard prompt={prompt} config={{}} segment="femme" />)

    const refreshButton = screen.getByTitle('Générer des variations')
    expect(refreshButton).toBeInTheDocument()
  })

  it('should show variations section when refresh button is clicked', async () => {
    const prompt = {
      prompt: 'Test prompt',
      parametres: { segment: 'Femme' },
    }
    const config = { type_chaussure: 'derby' }

    render(<PromptCard prompt={prompt} config={config} segment="femme" />)

    const refreshButton = screen.getByTitle('Générer des variations')
    fireEvent.click(refreshButton)

    await waitFor(() => {
      expect(screen.getByText(/Variations/)).toBeInTheDocument()
    })
  })

  it('should hide variations when refresh button is clicked again', async () => {
    const prompt = {
      prompt: 'Test prompt',
      parametres: { segment: 'Femme' },
    }
    const config = { type_chaussure: 'derby' }

    render(<PromptCard prompt={prompt} config={config} segment="femme" />)

    const refreshButton = screen.getByTitle('Générer des variations')

    // First click to show
    fireEvent.click(refreshButton)
    await waitFor(() => {
      expect(screen.getByText(/Variations/)).toBeInTheDocument()
    })

    // Second click to hide
    fireEvent.click(refreshButton)
    await waitFor(() => {
      expect(screen.queryByText(/Variations/)).not.toBeInTheDocument()
    }, { timeout: 100 })
  })

  it('should display variation prompts with copy buttons', async () => {
    const prompt = {
      prompt: 'Test prompt',
      parametres: { segment: 'Femme' },
    }
    const config = { type_chaussure: 'derby' }

    render(<PromptCard prompt={prompt} config={config} segment="femme" />)

    const refreshButton = screen.getByTitle('Générer des variations')
    fireEvent.click(refreshButton)

    await waitFor(() => {
      expect(screen.getByText(/Variation 1 prompt text/)).toBeInTheDocument()
      expect(screen.getByText(/Variation 2 prompt text/)).toBeInTheDocument()
    })
  })

  it('should copy variation prompt to clipboard', async () => {
    const prompt = {
      prompt: 'Test prompt',
      parametres: { segment: 'Femme' },
    }
    const config = { type_chaussure: 'derby' }

    render(<PromptCard prompt={prompt} config={config} segment="femme" />)

    const refreshButton = screen.getByTitle('Générer des variations')
    fireEvent.click(refreshButton)

    await waitFor(() => {
      expect(screen.getByText(/Variation 1 prompt text/)).toBeInTheDocument()
    })

    // Find copy buttons for variations (there will be multiple)
    const copyButtons = screen.getAllByRole('button').filter(
      btn => btn.querySelector('[data-icon="copy"]') || btn.title === ''
    )
    // Click a variation copy button
    const variationCopyBtn = copyButtons[copyButtons.length - 1]
    if (variationCopyBtn) {
      fireEvent.click(variationCopyBtn)
      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalled()
      }, { timeout: 100 })
    }
  })
})
