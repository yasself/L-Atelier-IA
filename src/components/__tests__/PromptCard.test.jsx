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

describe('PromptCard', () => {
  beforeEach(() => {
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
      parametres: { segment: 'Femme', type: 'derby', style: 'classique' },
    }
    render(<PromptCard prompt={prompt} config={{}} segment="femme" />)
    expect(screen.getByText(/Prompt Image/)).toBeInTheDocument()
  })

  it('should display the prompt text in monospace zone', () => {
    const prompt = {
      prompt: 'Test prompt for shoe image generation',
      parametres: { segment: 'Femme', type: 'derby' },
    }
    render(<PromptCard prompt={prompt} config={{}} segment="femme" />)
    expect(screen.getByText(/Test prompt for shoe image generation/)).toBeInTheDocument()
    expect(screen.getByText('Prompt positif')).toBeInTheDocument()
  })

  it('should have a copy button with Copier label', () => {
    const prompt = {
      prompt: 'Test prompt',
      parametres: { segment: 'Femme' },
    }
    render(<PromptCard prompt={prompt} config={{}} segment="femme" />)
    expect(screen.getByText('Copier')).toBeInTheDocument()
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

  it('should show Copié feedback after clicking copy', async () => {
    const prompt = {
      prompt: 'Test prompt',
      parametres: { segment: 'Femme' },
    }
    render(<PromptCard prompt={prompt} config={{}} segment="femme" />)

    const copyButton = screen.getByTitle('Copier le prompt')
    fireEvent.click(copyButton)

    await waitFor(() => {
      expect(screen.getByText('Copié !')).toBeInTheDocument()
    })
  })

  it('should display parametres as tags', () => {
    const prompt = {
      prompt: 'Test prompt',
      parametres: { segment: 'Femme', type: 'derby', style: 'classique' },
    }
    render(<PromptCard prompt={prompt} config={{}} segment="femme" />)
    expect(screen.getByText(/segment:/i)).toBeInTheDocument()
    expect(screen.getByText(/type:/i)).toBeInTheDocument()
    expect(screen.getByText(/style:/i)).toBeInTheDocument()
  })

  it('should not display empty parametres', () => {
    const prompt = {
      prompt: 'Test prompt',
      parametres: { segment: 'Femme', type: '', style: null },
    }
    render(<PromptCard prompt={prompt} config={{}} segment="femme" />)
    expect(screen.getByText(/segment:/i)).toBeInTheDocument()
  })

  it('should have a collapsible negative prompt section', () => {
    const prompt = {
      prompt: 'Test prompt',
      parametres: { segment: 'Femme' },
    }
    render(<PromptCard prompt={prompt} config={{}} segment="femme" />)
    expect(screen.getByText('Prompt négatif')).toBeInTheDocument()
  })

  it('should expand negative prompt when clicked', async () => {
    const prompt = {
      prompt: 'Test prompt',
      parametres: { segment: 'Femme' },
    }
    render(<PromptCard prompt={prompt} config={{}} segment="femme" />)

    const negativeButton = screen.getByText('Prompt négatif').closest('button')
    fireEvent.click(negativeButton)

    await waitFor(() => {
      expect(screen.getByText(/low quality, blurry/)).toBeInTheDocument()
    })
  })

  it('should display quality indicators', () => {
    const prompt = {
      prompt: 'Test prompt',
      parametres: { segment: 'Femme' },
    }
    render(<PromptCard prompt={prompt} config={{}} segment="femme" />)
    expect(screen.getByText('Indicateurs qualité')).toBeInTheDocument()
    expect(screen.getByText('Haute fidélité')).toBeInTheDocument()
    expect(screen.getByText('Studio professionnel')).toBeInTheDocument()
  })

  it('should display compatibility label', () => {
    const prompt = {
      prompt: 'Test prompt',
      parametres: { segment: 'Femme' },
    }
    render(<PromptCard prompt={prompt} config={{}} segment="femme" />)
    expect(screen.getByText(/Compatible : Midjourney · DALL-E · Flux/)).toBeInTheDocument()
  })
})
