import useTheme from '@material-ui/styles/useTheme';
import { Theme } from '../theme';
import SvgSpriteIcon from './SvgSpriteIcon';

export default function useSvgSpriteIconHref(name: string): string | undefined {
  const { rc } = useTheme<Theme>();

  const spriteId = rc?.SvgSpriteIcon?.spriteId ?? SvgSpriteIcon.spriteId;
  if (!name || !spriteId) return undefined;

  return `#${spriteId}_${name}`;
}