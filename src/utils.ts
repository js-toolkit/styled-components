import type { StyledOptions } from '@mui/styled-engine';

export function excludeProp<T extends string>(
  list: readonly T[]
): NonNullable<StyledOptions['shouldForwardProp']> {
  return (prop) => !(list as readonly string[]).includes(prop);
}
