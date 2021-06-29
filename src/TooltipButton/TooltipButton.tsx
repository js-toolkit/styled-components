import React, { useEffect, useRef } from 'react';
import useToggleDebounce from '@js-toolkit/react-hooks/useToggleDebounce';
import useRefCallback from '@js-toolkit/react-hooks/useRefCallback';
import Button, { ButtonProps } from '../Button';

export interface TooltipData {
  readonly target: HTMLButtonElement;
  readonly title: string;
}

export interface TooltipButtonTooltipProps {
  tooltip?: TooltipData['title'];
  tooltipDelay?: number;
  onShowTooltip?: (tooltip: TooltipData) => void;
  onHideTooltip?: (target: TooltipData['target']) => void;
}

export type TooltipButtonProps<
  C extends React.ElementType = 'button'
  // D = unknown
> = ButtonProps<C> & TooltipButtonTooltipProps /* & {
    readonly data?: D;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>, data?: D) => void;
  } */;

export default function TooltipButton<C extends React.ElementType = 'button'>({
  tooltip,
  tooltipDelay = 0,
  onShowTooltip,
  onHideTooltip,
  // data,
  ...restProps
}: TooltipButtonProps<C>): JSX.Element {
  const { onClick, onMouseEnter, onMouseLeave, onTouchStart, onContextMenu, ...rest } =
    restProps as TooltipButtonProps<'button'>;

  const [getHover, getHoverData, setHover] = useToggleDebounce<HTMLButtonElement | undefined>({
    wait: tooltipDelay,
  });
  const isHover = getHover();
  const element = getHoverData();

  /** To prevent mouseenter (showing tooltip) on touch */
  const isTouchingRef = useRef(false);

  useEffect(() => {
    if (isHover && onShowTooltip && tooltip && element) {
      onShowTooltip({ target: element, title: tooltip });
    } else if ((!isHover || !tooltip) && onHideTooltip && element) {
      onHideTooltip(element);
    }
  }, [element, isHover, onHideTooltip, onShowTooltip, tooltip]);

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
    tooltip && onShowTooltip && setHover(true, event.currentTarget);
    onMouseEnter && onMouseEnter(event);
  });

  const mouseLeaveHandler = useRefCallback<React.MouseEventHandler<HTMLButtonElement>>((event) => {
    // console.log('mouseLeave', event.nativeEvent.type, event.nativeEvent);
    if (isTouchingRef.current) return;
    (getHover() || tooltip) && onHideTooltip && setHover(false, event.currentTarget);
    onMouseLeave && onMouseLeave(event);
  });

  return (
    <Button
      // color="none"
      // size="contain"
      // shrink={0}
      onMouseEnter={mouseEnterHandler}
      onMouseLeave={mouseLeaveHandler}
      onTouchStart={touchStartHandler}
      onContextMenu={contextMenuHandler}
      onClick={clickHandler}
      {...rest}
    />
  );
}
