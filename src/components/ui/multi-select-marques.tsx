'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import type { Marque } from '@/types/database';

interface MultiSelectMarquesProps {
  value: Marque[];
  onChange: (value: Marque[]) => void;
  disabled?: boolean;
}

const MARQUES: Marque[] = ['FLOW', 'IT', 'VALUE', 'FORGE', 'FI', 'SHIELD', 'NILO', 'DSM'];

export function MultiSelectMarques({ value, onChange, disabled }: MultiSelectMarquesProps) {
  const isAllSelected = value.length === 0;

  const toggleAll = () => {
    onChange([]);
  };

  const toggleMarque = (marque: Marque) => {
    if (isAllSelected) {
      // Si "Toutes" est sélectionné, on passe à cette marque seule
      onChange([marque]);
    } else if (value.includes(marque)) {
      // Désélectionner
      const newValue = value.filter((m) => m !== marque);
      // Si on désélectionne tout, revenir à "Toutes"
      onChange(newValue.length === 0 ? [] : newValue);
    } else {
      // Sélectionner
      onChange([...value, marque]);
    }
  };

  return (
    <div className="space-y-2">
      {/* Option "Toutes les marques" */}
      <label
        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
          isAllSelected
            ? 'bg-accent-cyan/20 border border-accent-cyan'
            : 'bg-card border border-border hover:border-accent-cyan'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input
          type="checkbox"
          checked={isAllSelected}
          onChange={toggleAll}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`w-5 h-5 rounded flex items-center justify-center ${
            isAllSelected ? 'bg-accent-cyan text-black' : 'bg-muted'
          }`}
        >
          {isAllSelected && <Check className="w-3 h-3" />}
        </div>
        <span className="font-medium">Toutes les marques</span>
      </label>

      {/* Séparateur */}
      <div className="border-t border-border my-2" />

      {/* Marques individuelles */}
      <div className="grid grid-cols-2 gap-2">
        {MARQUES.map((marque) => {
          const isSelected = !isAllSelected && value.includes(marque);
          return (
            <label
              key={marque}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                isSelected
                  ? 'bg-exalt-blue/20 border border-exalt-blue'
                  : 'bg-card border border-border hover:border-accent-cyan'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleMarque(marque)}
                disabled={disabled}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded flex items-center justify-center ${
                  isSelected ? 'bg-exalt-blue text-white' : 'bg-muted'
                }`}
              >
                {isSelected && <Check className="w-3 h-3" />}
              </div>
              <span>{marque}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
