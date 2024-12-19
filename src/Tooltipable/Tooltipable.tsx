import React, { useEffect, useRef } from 'react';
import { Flex, type DefaultComponentType, type FlexAllProps } from 'reflexy/styled';
import { noop } from '@js-toolkit/utils/noop';
import { debounce } from '@js-toolkit/utils/debounce';
import useRefs from '@js-toolkit/react-hooks/useRefs';
import useRefCallback from '@js-toolkit/react-hooks/useRefCallback';
import useHoverCallbacks from '@js-toolkit/react-hooks/useHoverCallbacks';
import useMemoDestructor from '@js-toolkit/react-hooks/useMemoDestructor';

type WithData<D = undefined> =
  Exclude<D, undefined> extends never
    ? { readonly data?: D | undefined }
    : unknown extends D // In case tooltip's data has unknown type
      ? { readonly data?: D | undefined }
      : IfExtends<D, undefined, { readonly data?: D | undefined }, { readonly data: D }>;

type GetHtmlType<C extends React.ElementType, T = React.ComponentRef<C>> = T extends never
  ? Element
  : unknown extends T
    ? Element
    : T;

export interface TooltipData<D = undefined, T extends Element = Element> {
  readonly target: T;
  readonly title: string;
  readonly data?: D | undefined;
}

export type TooltipableTooltipProps<D = undefined, T extends Element = Element> = {
  readonly tooltip?: string | undefined;
  readonly tooltipDelay?: number | undefined;
  readonly onShowTooltip?: ((tooltip: TooltipData<D, T>) => void) | undefined;
  readonly onHideTooltip?: ((target: TooltipData<D, T>['target']) => void) | undefined;
} & WithData<D>;

export type TooltipableProps<
  C extends React.ElementType = DefaultComponentType,
  D = undefined,
> = FlexAllProps<C> & TooltipableTooltipProps<D, GetHtmlType<C>>;

export default function Tooltipable<
  C extends React.ElementType = DefaultComponentType,
  D = undefined,
>({
  tooltip,
  tooltipDelay = 0,
  data,
  onShowTooltip,
  onHideTooltip,
  ...restProps
}: TooltipableProps<C, D>): React.JSX.Element {
  type T = GetHtmlType<C>;

  const { onMouseEnter, onMouseLeave, onTouchStart, onClick, onContextMenu, ref, ...rest } =
    restProps as TooltipableProps<DefaultComponentType>;

  // const [getHover, getHoverData, setHover] = useToggleDebounce<HTMLButtonElement | undefined>({
  //   wait: tooltipDelay,
  // });
  // const isHover = getHover();
  // const element = getHoverData();

  const rootRef = useRef<T>(null);
  const rootRefs = useRefs(rootRef as React.Ref<HTMLDivElement>, ref);
  const isShowingTooltipRef = useRef(false);

  const showTooltip = useRefCallback(() => {
    if (rootRef.current && tooltip && onShowTooltip) {
      isShowingTooltipRef.current = true;
      onShowTooltip({ target: rootRef.current, title: tooltip, data });
    }
  });

  const hideTooltip = useRefCallback(() => {
    if (rootRef.current && onHideTooltip) {
      isShowingTooltipRef.current = false;
      onHideTooltip(rootRef.current);
    }
  });

  const hideTooltipDelayed = useMemoDestructor(() => {
    if (onHideTooltip && tooltipDelay > 0) {
      const fn = debounce(hideTooltip, tooltipDelay);
      return [fn, () => fn.flush()];
    }
    return [hideTooltip, noop];
  }, [hideTooltip, onHideTooltip, tooltipDelay]);

  useEffect(() => {
    if (!isShowingTooltipRef.current) return;
    if (tooltip) showTooltip();
    else hideTooltip();
  }, [hideTooltip, showTooltip, tooltip, data]);

  // useEffect(() => {
  //   if (isHover && onShowTooltip && tooltip && element) {
  //     onShowTooltip({ target: element, title: tooltip, data });
  //   } else if ((!isHover || !tooltip) && onHideTooltip && element) {
  //     onHideTooltip(element);
  //   }
  // }, [data, element, isHover, onHideTooltip, onShowTooltip, tooltip]);

  const hoverCallbacks = useHoverCallbacks({
    onMouseEnter: (event) => {
      showTooltip();
      if (onMouseEnter) onMouseEnter(event);
    },
    onMouseLeave: (event) => {
      hideTooltipDelayed();
      if (onMouseLeave) onMouseLeave(event);
    },
    onTouchStart,
    onClick,
    onContextMenu,
  });

  return <Flex ref={rootRefs} aria-label={tooltip} {...hoverCallbacks} {...rest} />;
}
