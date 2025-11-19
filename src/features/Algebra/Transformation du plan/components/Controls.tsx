//import React from 'react';

interface ControlsProps {
  onSelect: (value: string) => void;
}

export default function Controls({ onSelect }: ControlsProps) {
  return (
    <select onChange={(e) => onSelect(e.target.value)}>
      <option value="translation">Translation</option>
      <option value="symmetryCenter">Symétrie centrale</option>
      <option value="symmetryOrigin">Symétrie origine</option>
      <option value="conjugate">Conjugué</option>
      <option value="rotationOrigin">Rotation origine</option>
      <option value="rotationCenter">Rotation autour de a</option>
      <option value="symmetryOblique">Symétrie oblique</option>
    </select>
  );
}
