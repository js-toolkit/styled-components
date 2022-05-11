import getRandom from '@jstoolkit/utils/getRandom';
import getTimer from '@jstoolkit/utils/getTimer';
import toInt from '@jstoolkit/utils/toInt';
import { getShowController, ShowController, ShowControllerOptions } from './getShowController';

export interface RandomShowControllerOptions {
  readonly updateTimeout?: number;
  readonly getBounds: () => Point;
  readonly onUpdate: (coord: Point) => void;
  readonly showOptions?: ShowControllerOptions;
}

export interface RandomShowController extends ShowController {
  readonly update: VoidFunction;
}

export function getRandomShowController({
  showOptions,
  updateTimeout,
  getBounds,
  onUpdate,
}: RandomShowControllerOptions): RandomShowController {
  const update = (): void => {
    const { x: maxX, y: maxY } = getBounds();
    onUpdate({
      x: getRandom(0, maxX),
      y: getRandom(0, maxY),
    });
  };

  if (showOptions) {
    const { visibleTimeout, hiddenTimeout, isVisible, onShow, onHide } = showOptions;

    const { start, stop } = getShowController({
      visibleTimeout,
      hiddenTimeout,
      isVisible,
      onShow: () => {
        update();
        onShow();
      },
      onHide,
    });

    return { start, stop, update };
  }

  const updateTimer = getTimer({
    callback: update,
    interval: () => updateTimeout ?? toInt(getRandom(5, 20) * 1000),
    autostart: false,
  });

  return {
    start: updateTimer.start,
    stop: updateTimer.stop,
    update,
  };
}
