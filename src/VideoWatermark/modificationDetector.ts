import getTimer from '@js-toolkit/utils/getTimer';
import type { VideoWatermarkProps } from './VideoWatermark';

export interface ModificationDetectorOptions {
  readonly mode: NonNullable<VideoWatermarkProps['mode']>;
  readonly checkInterval?: number;
  readonly onModified: (type: 'children' | 'root') => void;
}

export interface ModificationDetector {
  readonly setVisible: VoidFunction;
  readonly setHidden: VoidFunction;
  readonly setNode: (node: HTMLElement) => void;
  // readonly start: (node: HTMLElement, immediately?: boolean) => void; // (node: Element) => void;
  // readonly check: VoidFunction;
  // readonly startTimer: VoidFunction;
  // readonly stopTimer: VoidFunction;
  readonly destroy: VoidFunction;
}

export function getModificationDetector({
  mode: _,
  checkInterval = 5000,
  onModified,
}: ModificationDetectorOptions): ModificationDetector {
  let visible = false;
  let rootStyle: Pick<CSSStyleDeclaration, 'display' | 'position' | 'zIndex'> | undefined;
  let rootNode: HTMLElement | undefined;
  let parentNode: Element | null | undefined;

  const observer = new MutationObserver((mutations) => {
    if (mutations.some((m) => m.type === 'childList' || m.target !== rootNode)) {
      // console.log(mutations);
      onModified('children');
    }
  });

  const checkRoot = (): void => {
    if (!rootNode || !rootStyle) return;

    const { display, visibility, opacity, position, zIndex } = window.getComputedStyle(rootNode);
    if (
      parentNode !== rootNode.parentElement ||
      rootStyle.display !== display ||
      rootStyle.position !== position ||
      rootStyle.zIndex !== zIndex ||
      (visible && (visibility !== 'visible' || +opacity < 0.8))
    ) {
      // console.log('* Modified *');
      // console.log(
      //   normal.parent !== normal.node.parentElement,
      //   normal.display !== display,
      //   normal.visibility !== visibility,
      //   normal.opacity !== (+opacity).toFixed(2),
      //   normal.position !== position,
      //   normal.opacity,
      //   (+opacity).toFixed(2)
      // );
      onModified('root');
    }
  };

  const timer = getTimer({
    autostart: false,
    interval: () => checkInterval,
    callback: checkRoot,
  });

  const observe = (): void => {
    if (!rootNode || !visible) return;
    observer.observe(rootNode, {
      childList: true,
      subtree: true,
      characterData: true,
      // attributes: true,
      // attributeFilter: [], // There are many children attrs changes by theme, user theming, fullscreen, so modification detection appeares.
      // attributeFilter: [
      //   // 'class', // class names are unstable with JSS
      //   'style',
      //   'width',
      //   'height',
      //   'fill',
      //   'color',
      //   'x',
      //   'y',
      //   'viewBox',
      // ],
    });
    timer.start();
  };

  const setup = (node: HTMLElement): void => {
    if (!node || node === rootNode) return;

    rootNode = node;
    parentNode = node.parentElement;

    const { display, position, zIndex } = window.getComputedStyle(node);
    rootStyle = { display, position, zIndex };
    // console.log(rootStyle);

    observe();
  };

  return {
    setVisible: () => {
      visible = true;
      if (!timer.active) observe();
    },
    setHidden: () => {
      visible = false;
    },
    setNode: setup,
    // check: checkRoot,
    // start: (node, immediately) => {
    //   console.log('start');

    //   setup(node);
    //   timer.start({ immediately });
    //   // observer.observe(node, {
    //   //   childList: true,
    //   //   attributes: true,
    //   //   subtree: true,
    //   //   attributeFilter: [
    //   //     'class',
    //   //     'style',
    //   //     'hidden',
    //   //     'width',
    //   //     'height',
    //   //     'fill',
    //   //     'color',
    //   //     'x',
    //   //     'y',
    //   //     'viewBox',
    //   //   ],
    //   // });
    // },
    // startTimer: () => timer.start({ immediately: true }),
    // stopTimer: timer.pause,
    destroy: () => {
      // console.log('destroy');
      // stop();
      timer.stop();
      observer.disconnect();
      visible = false;
      rootStyle = undefined;
      rootNode = undefined;
      parentNode = undefined;
    },
  };
}
