import React from 'react';
import TweakableElementWrapper from 'reflexy/TweakableElementWrapper';
import useRefCallback from '@js-toolkit/react-hooks/useRefCallback';
import Button, { type ButtonProps } from '../Button';
import Tooltipable, { type TooltipableTooltipProps } from '../Tooltipable';

export { type TooltipableTooltipProps as TooltipButtonTooltipProps };

export type TooltipButtonProps<C extends React.ElementType = 'button', D = undefined> = Omit<
  ButtonProps<C>,
  'onClick'
> &
  TooltipableTooltipProps<D, HTMLElement> & {
    onClick?: ((event: React.MouseEvent<HTMLButtonElement>, data: D) => void) | undefined;
  };

export default function TooltipButton<C extends React.ElementType = 'button', D = undefined>({
  data,
  tooltip,
  tooltipDelay,
  onShowTooltip,
  onHideTooltip,
  ...restProps
}: TooltipButtonProps<C, D>): JSX.Element {
  const { onClick, ...rest } = restProps as OmitStrict<
    TooltipButtonProps<'button'>,
    keyof TooltipableTooltipProps<undefined, HTMLButtonElement>
  >;

  const clickHandler = useRefCallback<React.MouseEventHandler<HTMLButtonElement>>((event) => {
    onClick && onClick(event, data as never);
  });

  return (
    <Tooltipable
      data={data as never}
      tooltip={tooltip}
      tooltipDelay={tooltipDelay}
      onShowTooltip={onShowTooltip}
      onHideTooltip={onHideTooltip}
      component={TweakableElementWrapper}
      element={<Button onClick={clickHandler} {...rest} />}
    />
  );
}
