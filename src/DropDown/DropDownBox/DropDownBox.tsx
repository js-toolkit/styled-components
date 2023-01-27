import React, { useCallback, useContext, useRef, useEffect } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Flex, FlexComponentProps } from 'reflexy/styled';
import type { Theme } from '../../theme';
import DropDownContext, { DropDownContextValue } from '../DropDownContext';

/** Map of html tags and their selector */
export type HtmlTagSelectorMap = { [P in keyof JSX.IntrinsicElements]?: string | undefined };

export interface DropDownBoxProps extends FlexComponentProps<'div'> {
  /** Function, boolean or map.
   * { a: undefined } - close on any link click.
   * { a: <selector> } - close on link click if link matches the selector.
   */
  closeOnClick?:
    | ((event: React.MouseEvent<Element>) => boolean)
    | boolean
    | HtmlTagSelectorMap
    | undefined;
  /**
   * Whether render hidden content.
   * Useful if needed always rendered links (but hidden) for SEO.
   */
  prerender?: boolean | undefined;
}

function isShouldClose(el: Element, topNode: Element, map: HtmlTagSelectorMap): boolean {
  const tag = el.nodeName.toLowerCase();
  if (tag in map && (map[tag] == null || el.matches(map[tag]))) {
    return true;
  }
  if (el === topNode || !el.parentElement) {
    return false;
  }
  return isShouldClose(el.parentElement, topNode, map);
}

const useStyles = makeStyles((theme: Theme) => ({
  root: ({ floating, prerender }: DropDownContextValue & DropDownBoxProps) => ({
    '&[hidden]': prerender ? { display: 'none' } : undefined,

    ...(floating
      ? {
          cursor: 'default',
          zIndex: 1,
          position: 'absolute',
          top: '100%',
          minWidth: '100%',
        }
      : undefined),

    ...theme.rc?.DropDownBox?.root,
  }),
}));

export default function DropDownBox({
  closeOnClick,
  prerender,
  className,
  ...rest
}: React.PropsWithChildren<DropDownBoxProps>): JSX.Element | null {
  const selfNodeRef = useRef<HTMLDivElement>(null);
  const closeOnClickRef = useRef(closeOnClick);

  const { expanded, floating, toggle } = useContext(DropDownContext);
  const css = useStyles({ classes: { root: className }, floating, prerender } as any);

  useEffect(() => {
    closeOnClickRef.current = closeOnClick;
  }, [closeOnClick]);

  const clickHandler = useCallback<React.MouseEventHandler>(
    (event) => {
      let shouldClose = false;
      const mapOrFnOrVal = closeOnClickRef.current;

      if (typeof mapOrFnOrVal === 'object') {
        shouldClose =
          !!selfNodeRef.current &&
          isShouldClose(event.target as Element, selfNodeRef.current, mapOrFnOrVal);
      } else if (typeof mapOrFnOrVal === 'function') {
        shouldClose = mapOrFnOrVal(event);
      } else {
        shouldClose = !!mapOrFnOrVal;
      }

      if (shouldClose) {
        toggle(false);
      }
    },
    [toggle]
  );

  if (!expanded && !prerender) return null;

  return (
    <Flex
      column
      component="div"
      componentRef={selfNodeRef}
      className={css.root}
      onClick={clickHandler}
      hidden={!expanded}
      aria-expanded={expanded}
      data-dropdown-box=""
      {...rest}
    />
  );
}
