import useTheme from '@mui/system/useTheme';
import type { Theme } from '../theme';
// eslint-disable-next-line import/no-cycle
import SvgSpriteIcon from './SvgSpriteIcon';

export default function useSvgSpriteIconHref(name: string): string | undefined {
  const { rc } = useTheme<Theme>();

  const spriteId = rc?.SvgSpriteIcon?.spriteId ?? SvgSpriteIcon.spriteId;
  if (!name || !spriteId) return undefined;

  return `#${spriteId}_${name}`;
}
