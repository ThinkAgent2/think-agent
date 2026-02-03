import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

// Simple component for testing
function TestButton({ label }: { label: string }) {
  return <button>{label}</button>;
}

describe('React Testing Library', () => {
  it('should render a component', () => {
    render(<TestButton label="Click me" />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should find text content', () => {
    render(<TestButton label="Click me" />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
