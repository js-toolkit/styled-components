import React from 'react';
import styled from '@mui/system/styled';
import { Flex, type FlexComponentProps } from 'reflexy/styled';
import DropDownContext from './DropDownContext';

/** Map of html tags and their selector */
export type HtmlTagSelectorMap = { [P in keyof React.JSX.IntrinsicElements]?: string | undefined };

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
  if (tag in map) {
    const v = map[tag as keyof typeof map];
    if (v == null || el.matches(v)) return true;
  }
  if (el === topNode || !el.parentElement) {
    return false;
  }
  return isShouldClose(el.parentElement, topNode, map);
}

type RootProps = RequiredSome<DropDownBoxProps, 'prerender'> & { floating: boolean };

const Root = styled(Flex, {
  shouldForwardProp: (key) => {
    const prop = key as keyof RootProps;
    return prop !== 'prerender' && prop !== 'floating';
  },
})<RootProps>(({ theme: { rc }, prerender, floating }) => ({
  '&[hidden]': {
    display: prerender ? 'none' : undefined,
  },

  ...(floating
    ? {
        cursor: 'default',
        zIndex: 1,
        position: 'absolute',
        top: '100%',
        minWidth: '100%',
      }
    : undefined),

  ...rc?.DropDownBox?.root,
}));

export default styled(function DropDownBox({
  closeOnClick,
  prerender = false,
  ...rest
}: React.PropsWithChildren<DropDownBoxProps>): React.JSX.Element | null {
  const selfNodeRef = React.useRef<HTMLDivElement>(null);
  const closeOnClickRef = React.useRef(closeOnClick);

  const { expanded, floating, toggle } = React.use(DropDownContext);

  React.useEffect(() => {
    closeOnClickRef.current = closeOnClick;
  }, [closeOnClick]);

  const clickHandler = React.useCallback<React.MouseEventHandler>(
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
    <Root
      column
      ref={selfNodeRef}
      onClick={clickHandler}
      hidden={!expanded}
      floating={floating}
      prerender={prerender}
      aria-expanded={expanded}
      data-dropdown-box=""
      {...rest}
    />
  );
});
