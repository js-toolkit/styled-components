/* eslint-disable no-nested-ternary */
import type React from 'react';
import type { TooltipData } from './Tooltip';

export function calcX(
  x: number,
  alignX: TooltipData['alignX'],
  width: number,
  minX?: number,
  maxX?: number
): number {
  if (width <= 0) return -9999;
  const x1 = x - (alignX === 'middle' ? width / 2 : alignX === 'right' ? width : 0);
  if (minX != null) {
    if (x1 < minX) return minX;
  }
  if (maxX != null) {
    const x2 = x1 + width;
    if (x2 > maxX) return x1 - (x2 - maxX);
  }
  return x1;
}

export function calcY(
  y: number,
  alignY: TooltipData['alignY'],
  height: number,
  minY?: number,
  maxY?: number
): number {
  if (height <= 0) return -9999;
  const y1 = y - (alignY === 'middle' ? height / 2 : alignY === 'bottom' ? height : 0);
  if (minY != null) {
    if (y1 < minY) return minY;
  }
  if (maxY != null) {
    const y2 = y1 + height;
    if (y2 > maxY) return y1 - (y2 - maxY);
  }
  return y1;
}

export function calcXInside(
  width: number,
  parentWidth: number,
  parentLeft: number,
  minX?: number,
  maxX?: number
): number {
  if (width <= 0 || parentWidth <= 0) return -9999;
  const left = (parentWidth - width) / 2;
  const x1 = parentLeft + left;
  if (minX != null) {
    if (x1 < minX) return left - (x1 - minX);
  }
  if (maxX != null) {
    const x2 = x1 + width;
    if (x2 > maxX) return left - (x2 - maxX);
  }
  return left;
}

export function calcArrowCss(
  alignX: TooltipData['alignX'],
  alignY: TooltipData['alignY'],
  color: NonNullable<React.CSSProperties['color']>,
  size: string
): React.CSSProperties | undefined {
  const reset: React.CSSProperties = {
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
    top: 'auto',
    bottom: 'auto',
    right: 'auto',
    left: 'auto',
    borderStyle: 'solid',
    borderWidth: size,
  };

  if (alignY === 'middle') {
    // right
    if (alignX === 'right') {
      return {
        ...reset,
        borderLeftColor: color,
        left: '100%',
        top: '50%',
        transform: 'translateY(-50%)',
      };
    }
    // left
    return {
      ...reset,
      borderRightColor: color,
      right: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
    };
  }

  if (alignX === 'middle') {
    // top
    if (alignY === 'top') {
      return {
        ...reset,
        borderBottomColor: color,
        bottom: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
      };
    }
    // bottom
    return {
      ...reset,
      borderTopColor: color,
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
    };
  }

  return undefined;
}
