import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LoadingState, ErrorState, EmptyState } from './states';

describe('LoadingState', () => {
  it('should render default message', () => {
    render(<LoadingState />);
    expect(screen.getByText('Chargement...')).toBeInTheDocument();
  });

  it('should render custom message', () => {
    render(<LoadingState message="Veuillez patienter..." />);
    expect(screen.getByText('Veuillez patienter...')).toBeInTheDocument();
  });

  it('should render loading spinner', () => {
    const { container } = render(<LoadingState />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });
});

describe('ErrorState', () => {
  it('should render default title and message', () => {
    render(<ErrorState />);
    expect(screen.getByText('Une erreur est survenue')).toBeInTheDocument();
    expect(screen.getByText(/Impossible de charger/)).toBeInTheDocument();
  });

  it('should render custom title and message', () => {
    render(
      <ErrorState 
        title="Erreur personnalisée" 
        message="Message personnalisé" 
      />
    );
    expect(screen.getByText('Erreur personnalisée')).toBeInTheDocument();
    expect(screen.getByText('Message personnalisé')).toBeInTheDocument();
  });

  it('should show retry button when onRetry provided', () => {
    const mockOnRetry = vi.fn();
    render(<ErrorState onRetry={mockOnRetry} />);
    
    const retryButton = screen.getByRole('button', { name: /réessayer/i });
    expect(retryButton).toBeInTheDocument();
  });

  it('should not show retry button when onRetry not provided', () => {
    render(<ErrorState />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should call onRetry when retry button clicked', () => {
    const mockOnRetry = vi.fn();
    render(<ErrorState onRetry={mockOnRetry} />);
    
    fireEvent.click(screen.getByRole('button', { name: /réessayer/i }));
    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });
});

describe('EmptyState', () => {
  it('should render default title and message', () => {
    render(<EmptyState />);
    expect(screen.getByText('Aucun résultat')).toBeInTheDocument();
    expect(screen.getByText(/Aucun élément/)).toBeInTheDocument();
  });

  it('should render custom title and message', () => {
    render(
      <EmptyState 
        title="Pas de challenges" 
        message="Aucun challenge disponible" 
      />
    );
    expect(screen.getByText('Pas de challenges')).toBeInTheDocument();
    expect(screen.getByText('Aucun challenge disponible')).toBeInTheDocument();
  });

  it('should show action button when action provided', () => {
    const mockAction = { label: 'Créer', onClick: vi.fn() };
    render(<EmptyState action={mockAction} />);
    
    expect(screen.getByRole('button', { name: 'Créer' })).toBeInTheDocument();
  });

  it('should call action onClick when button clicked', () => {
    const mockAction = { label: 'Créer', onClick: vi.fn() };
    render(<EmptyState action={mockAction} />);
    
    fireEvent.click(screen.getByRole('button', { name: 'Créer' }));
    expect(mockAction.onClick).toHaveBeenCalledTimes(1);
  });
});
