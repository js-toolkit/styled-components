import type { StyledOptions } from '@mui/styled-engine';

export function excludeProp<T extends string>(
  list: UnionToTuple<T>
): NonNullable<StyledOptions['shouldForwardProp']> {
  return (prop) => !(list as string[]).includes(prop);
}
