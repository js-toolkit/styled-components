import React, { useEffect, useRef } from 'react';
import { Flex, type DefaultComponentType, type FlexAllProps } from 'reflexy/styled';
import { noop } from '@js-toolkit/utils/noop';
import { debounce } from '@js-toolkit/utils/debounce';
import useRefs from '@js-toolkit/react-hooks/useRefs';
import useMemoDestructor from '@js-toolkit/react-hooks/useMemoDestructor';
import useRefCallback from '@js-toolkit/react-hooks/useRefCallback';

type WithData<D = undefined> =
  Exclude<D, undefined> extends never
    ? { readonly data?: D | undefined }
    : unknown extends D // In case tooltip's data has unknown type
      ? { readonly data?: D | undefined }
      : IfExtends<D, undefined, { readonly data?: D | undefined }, { readonly data: D }>;

type GetHtmlType<C extends React.ElementType, T = React.ElementRef<C>> = T extends never
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
}: TooltipableProps<C, D>): JSX.Element {
  type T = GetHtmlType<C>;

  const {
    onClick,
    onMouseEnter,
    onMouseLeave,
    onTouchStart,
    onContextMenu,
    componentRef,
    ...rest
  } = restProps as TooltipableProps<DefaultComponentType>;

  // const [getHover, getHoverData, setHover] = useToggleDebounce<HTMLButtonElement | undefined>({
  //   wait: tooltipDelay,
  // });
  // const isHover = getHover();
  // const element = getHoverData();

  const rootRef = useRef<T>(null);
  const rootRefs = useRefs(rootRef, componentRef as React.Ref<T>);
  const isShowingTooltipRef = useRef(false);
  /** To prevent mouseenter (showing tooltip) on touch */
  const isTouchingRef = useRef(false);

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

  const touchStartHandler = useRefCallback<React.TouchEventHandler<HTMLDivElement>>((event) => {
    // console.log('touchStart', event.nativeEvent.type);
    isTouchingRef.current = true;
    onTouchStart && onTouchStart(event);
  });

  const contextMenuHandler = useRefCallback<React.MouseEventHandler<HTMLDivElement>>((event) => {
    // console.log('contextMenu', event.nativeEvent.type);
    isTouchingRef.current = false;
    onContextMenu && onContextMenu(event);
  });

  const clickHandler = useRefCallback<React.MouseEventHandler<HTMLDivElement>>((event) => {
    // console.log('click', event.nativeEvent.type);
    isTouchingRef.current = false;
    onClick && onClick(event);
  });

  const mouseEnterHandler = useRefCallback<React.MouseEventHandler<HTMLDivElement>>((event) => {
    // console.log('mouseEnter', event.nativeEvent.type, event.nativeEvent);
    if (isTouchingRef.current) return;
    // tooltip && onShowTooltip && setHover(true, event.currentTarget);
    showTooltip();
    onMouseEnter && onMouseEnter(event);
  });

  const mouseLeaveHandler = useRefCallback<React.MouseEventHandler<HTMLDivElement>>((event) => {
    // console.log('mouseLeave', event.nativeEvent.type, event.nativeEvent);
    if (isTouchingRef.current) return;
    // (getHover() || tooltip) && onHideTooltip && setHover(false, event.currentTarget);
    hideTooltipDelayed();
    onMouseLeave && onMouseLeave(event);
  });

  return (
    <Flex
      componentRef={rootRefs}
      onMouseEnter={mouseEnterHandler}
      onMouseLeave={mouseLeaveHandler}
      onTouchStart={touchStartHandler}
      onContextMenu={contextMenuHandler}
      onClick={clickHandler}
      aria-label={tooltip}
      {...(rest as any)}
    />
  );
}
