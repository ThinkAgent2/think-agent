'use client';

import { Check } from 'lucide-react';
import type { Thematique } from '@/types/database';

interface MultiSelectThematiquesProps {
  value: Thematique[];
  onChange: (value: Thematique[]) => void;
  disabled?: boolean;
}

const THEMATIQUES: { value: Thematique; emoji: string; label: string }[] = [
  { value: 'knowledge', emoji: '📚', label: 'Knowledge & Formation' },
  { value: 'content', emoji: '✍️', label: 'Création de contenu' },
  { value: 'data', emoji: '📊', label: 'Data & Analyse' },
  { value: 'automation', emoji: '🤖', label: 'Automatisation & Workflows' },
  { value: 'agents', emoji: '💬', label: 'Agents & Assistants' },
  { value: 'strategy', emoji: '💼', label: 'Stratégie & Conseil' },
  { value: 'code', emoji: '🧑‍💻', label: 'Code & Développement' },
  { value: 'design', emoji: '🎨', label: 'Design & UX' },
  { value: 'research', emoji: '🔍', label: 'Recherche & Veille' },
  { value: 'prompting', emoji: '🧠', label: 'Prompt Engineering' },
];

export { THEMATIQUES };

export function MultiSelectThematiques({ value, onChange, disabled }: MultiSelectThematiquesProps) {
  const toggleThematique = (thematique: Thematique) => {
    if (value.includes(thematique)) {
      onChange(value.filter((t) => t !== thematique));
    } else {
      onChange([...value, thematique]);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {THEMATIQUES.map((theme) => {
        const isSelected = value.includes(theme.value);
        return (
          <label
            key={theme.value}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
              isSelected
                ? 'bg-accent-jaune/20 border border-accent-jaune'
                : 'bg-card border border-border hover:border-accent-cyan'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => toggleThematique(theme.value)}
              disabled={disabled}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 rounded flex items-center justify-center ${
                isSelected ? 'bg-accent-jaune text-black' : 'bg-muted'
              }`}
            >
              {isSelected && <Check className="w-3 h-3" />}
            </div>
            <span className="text-lg">{theme.emoji}</span>
            <span className="text-sm">{theme.label}</span>
          </label>
        );
      })}
    </div>
  );
}
