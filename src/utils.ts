import type { StyledOptions } from '@mui/styled-engine';

export function excludeProp<T extends string | AnyObject, L = T extends string ? T : keyof T>(
  list: readonly L[]
): NonNullable<StyledOptions['shouldForwardProp']> {
  return (prop) => !(list as readonly string[]).includes(prop);
}
