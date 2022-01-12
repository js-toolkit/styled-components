import React from 'react';

export function isValidReactNode(object: {} | null | undefined): object is React.ReactNode {
  if (React.isValidElement(object) || object == null) return true;
  const type = typeof object;
  return type === 'string' || type === 'number' || type === 'boolean';
}
