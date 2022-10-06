import React, { useEffect, useRef } from 'react';
import noop from '@jstoolkit/utils/noop';
import debounce from '@jstoolkit/utils/debounce';
import useRefs from '@jstoolkit/react-hooks/useRefs';
import useMemoDestructor from '@jstoolkit/react-hooks/useMemoDestructor';
import useRefCallback from '@jstoolkit/react-hooks/useRefCallback';
import Button, { ButtonProps } from '../Button';

export interface TooltipData<D = never> {
  readonly target: HTMLButtonElement;
  readonly title: string;
  readonly data?: D;
}

export interface TooltipButtonTooltipProps<D = never> {
  tooltip?: TooltipData<D>['title'];
  tooltipDelay?: number;
  onShowTooltip?: (tooltip: TooltipData<D>) => void;
  onHideTooltip?: (target: TooltipData<D>['target']) => void;
}

export type TooltipButtonProps<C extends React.ElementType = 'button', D = never> = ButtonProps<C> &
  TooltipButtonTooltipProps<D> & {
    readonly data?: D;
  };

export default function TooltipButton<C extends React.ElementType = 'button', D = never>({
  tooltip,
  tooltipDelay = 0,
  data,
  onShowTooltip,
  onHideTooltip,
  ...restProps
}: TooltipButtonProps<C, D>): JSX.Element {
  const {
    onClick,
    onMouseEnter,
    onMouseLeave,
    onTouchStart,
    onContextMenu,
    componentRef,
    ...rest
  } = restProps as TooltipButtonProps<'button'>;

  // const [getHover, getHoverData, setHover] = useToggleDebounce<HTMLButtonElement | undefined>({
  //   wait: tooltipDelay,
  // });
  // const isHover = getHover();
  // const element = getHoverData();

  const rootRef = useRef<HTMLButtonElement>(null);
  const rootRefs = useRefs(rootRef, componentRef);
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
  }, [hideTooltip, showTooltip, tooltip]);

  // useEffect(() => {
  //   if (isHover && onShowTooltip && tooltip && element) {
  //     onShowTooltip({ target: element, title: tooltip, data });
  //   } else if ((!isHover || !tooltip) && onHideTooltip && element) {
  //     onHideTooltip(element);
  //   }
  // }, [data, element, isHover, onHideTooltip, onShowTooltip, tooltip]);

  const touchStartHandler = useRefCallback<React.TouchEventHandler<HTMLButtonElement>>((event) => {
    // console.log('touchStart', event.nativeEvent.type);
    isTouchingRef.current = true;
    onTouchStart && onTouchStart(event);
  });

  const contextMenuHandler = useRefCallback<React.MouseEventHandler<HTMLButtonElement>>((event) => {
    // console.log('contextMenu', event.nativeEvent.type);
    isTouchingRef.current = false;
    onContextMenu && onContextMenu(event);
  });

  const clickHandler = useRefCallback<React.MouseEventHandler<HTMLButtonElement>>((event) => {
    // console.log('click', event.nativeEvent.type);
    isTouchingRef.current = false;
    onClick && onClick(event);
  });

  const mouseEnterHandler = useRefCallback<React.MouseEventHandler<HTMLButtonElement>>((event) => {
    // console.log('mouseEnter', event.nativeEvent.type, event.nativeEvent);
    if (isTouchingRef.current) return;
    // tooltip && onShowTooltip && setHover(true, event.currentTarget);
    showTooltip();
    onMouseEnter && onMouseEnter(event);
  });

  const mouseLeaveHandler = useRefCallback<React.MouseEventHandler<HTMLButtonElement>>((event) => {
    // console.log('mouseLeave', event.nativeEvent.type, event.nativeEvent);
    if (isTouchingRef.current) return;
    // (getHover() || tooltip) && onHideTooltip && setHover(false, event.currentTarget);
    hideTooltipDelayed();
    onMouseLeave && onMouseLeave(event);
  });

  return (
    <Button
      componentRef={rootRefs}
      onMouseEnter={mouseEnterHandler}
      onMouseLeave={mouseLeaveHandler}
      onTouchStart={touchStartHandler}
      onContextMenu={contextMenuHandler}
      onClick={clickHandler}
      {...rest}
    />
  );
}
