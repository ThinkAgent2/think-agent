import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChallengeFilters } from './ChallengeFilters';
import type { ChallengeFilters as Filters } from '@/types/database';

describe('ChallengeFilters', () => {
  const defaultFilters: Filters = {};
  const mockOnFiltersChange = vi.fn();

  beforeEach(() => {
    mockOnFiltersChange.mockClear();
  });

  describe('Search', () => {
    it('should render search input', () => {
      render(
        <ChallengeFilters 
          filters={defaultFilters} 
          onFiltersChange={mockOnFiltersChange} 
        />
      );
      
      expect(screen.getByPlaceholderText(/rechercher/i)).toBeInTheDocument();
    });

    it('should call onFiltersChange on form submit', async () => {
      render(
        <ChallengeFilters 
          filters={defaultFilters} 
          onFiltersChange={mockOnFiltersChange} 
        />
      );
      
      const input = screen.getByPlaceholderText(/rechercher/i);
      fireEvent.change(input, { target: { value: 'test query' } });
      fireEvent.submit(input.closest('form')!);
      
      expect(mockOnFiltersChange).toHaveBeenCalledWith({ search: 'test query' });
    });
  });

  describe('Niveau filters', () => {
    it('should render all niveau options', () => {
      render(
        <ChallengeFilters 
          filters={defaultFilters} 
          onFiltersChange={mockOnFiltersChange} 
        />
      );
      
      expect(screen.getByText('Explorer')).toBeInTheDocument();
      expect(screen.getByText('Crafter')).toBeInTheDocument();
      expect(screen.getByText('Architecte')).toBeInTheDocument();
    });

    it('should call onFiltersChange when clicking a niveau', async () => {
      render(
        <ChallengeFilters 
          filters={defaultFilters} 
          onFiltersChange={mockOnFiltersChange} 
        />
      );
      
      fireEvent.click(screen.getByText('Explorer'));
      
      expect(mockOnFiltersChange).toHaveBeenCalledWith({ niveau: 'Explorer' });
    });

    it('should deselect niveau when clicking the same one', async () => {
      render(
        <ChallengeFilters 
          filters={{ niveau: 'Explorer' }} 
          onFiltersChange={mockOnFiltersChange} 
        />
      );
      
      fireEvent.click(screen.getByText('Explorer'));
      
      expect(mockOnFiltersChange).toHaveBeenCalledWith({ niveau: undefined });
    });
  });

  describe('Marque filters', () => {
    it('should render marque options', () => {
      render(
        <ChallengeFilters 
          filters={defaultFilters} 
          onFiltersChange={mockOnFiltersChange} 
        />
      );
      
      expect(screen.getByText('FLOW')).toBeInTheDocument();
      expect(screen.getByText('IT')).toBeInTheDocument();
      expect(screen.getByText('VALUE')).toBeInTheDocument();
    });

    it('should call onFiltersChange when clicking a marque', async () => {
      render(
        <ChallengeFilters 
          filters={defaultFilters} 
          onFiltersChange={mockOnFiltersChange} 
        />
      );
      
      fireEvent.click(screen.getByText('FLOW'));
      
      expect(mockOnFiltersChange).toHaveBeenCalledWith({ marque: 'FLOW' });
    });
  });

  describe('Difficulté filters', () => {
    it('should render difficulty buttons', () => {
      render(
        <ChallengeFilters 
          filters={defaultFilters} 
          onFiltersChange={mockOnFiltersChange} 
        />
      );
      
      expect(screen.getByText('1 ⭐')).toBeInTheDocument();
      expect(screen.getByText('5 ⭐')).toBeInTheDocument();
    });

    it('should call onFiltersChange when clicking a difficulty', async () => {
      render(
        <ChallengeFilters 
          filters={defaultFilters} 
          onFiltersChange={mockOnFiltersChange} 
        />
      );
      
      fireEvent.click(screen.getByText('3 ⭐'));
      
      expect(mockOnFiltersChange).toHaveBeenCalledWith({ difficulte: 3 });
    });
  });

  describe('Clear filters', () => {
    it('should not show clear button when no filters', () => {
      render(
        <ChallengeFilters 
          filters={defaultFilters} 
          onFiltersChange={mockOnFiltersChange} 
        />
      );
      
      expect(screen.queryByText(/effacer/i)).not.toBeInTheDocument();
    });

    it('should show clear button when filters are active', () => {
      render(
        <ChallengeFilters 
          filters={{ niveau: 'Explorer' }} 
          onFiltersChange={mockOnFiltersChange} 
        />
      );
      
      expect(screen.getByText(/effacer/i)).toBeInTheDocument();
    });

    it('should clear all filters when clicking clear button', async () => {
      render(
        <ChallengeFilters 
          filters={{ niveau: 'Explorer', difficulte: 3 }} 
          onFiltersChange={mockOnFiltersChange} 
        />
      );
      
      fireEvent.click(screen.getByText(/effacer/i));
      
      expect(mockOnFiltersChange).toHaveBeenCalledWith({});
    });
  });

  describe('Combined filters', () => {
    it('should preserve other filters when adding a new one', async () => {
      render(
        <ChallengeFilters 
          filters={{ niveau: 'Explorer' }} 
          onFiltersChange={mockOnFiltersChange} 
        />
      );
      
      fireEvent.click(screen.getByText('FLOW'));
      
      expect(mockOnFiltersChange).toHaveBeenCalledWith({ 
        niveau: 'Explorer', 
        marque: 'FLOW' 
      });
    });
  });
});
