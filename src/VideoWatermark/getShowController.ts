/* eslint-disable no-use-before-define */
import getTimer from '@js-toolkit/utils/getTimer';

export interface ShowControllerOptions {
  readonly visibleTimeout: number;
  readonly hiddenTimeout: number;
  readonly isVisible: () => boolean;
  readonly onShow: VoidFunction;
  readonly onHide: VoidFunction;
}

export interface ShowController {
  readonly start: VoidFunction;
  readonly stop: VoidFunction;
}

export function getShowController({
  visibleTimeout,
  hiddenTimeout,
  isVisible,
  onShow,
  onHide,
}: ShowControllerOptions): ShowController {
  const show = (): void => {
    showTimer.stop();
    hideTimer.start();
    if (!isVisible()) onShow();
  };

  const hide = (): void => {
    hideTimer.stop();
    showTimer.start();
    if (isVisible()) onHide();
  };

  const showTimer = getTimer({
    callback: show,
    interval: () => hiddenTimeout,
    autostart: false,
  });

  const hideTimer = getTimer({
    callback: hide,
    interval: () => visibleTimeout,
    autostart: false,
  });

  const start = (): void => {
    if (isVisible()) show();
    else hide();
  };

  const stop = (): void => {
    showTimer.stop();
    hideTimer.stop();
  };

  return { start, stop };
}
