import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import '@js-toolkit/ts-utils/types';
import ReactModal from 'react-modal';
import { Flex, FlexComponentProps, GetStylesTransformers } from 'reflexy/styled';
import type { CSSProperties, Theme } from '../theme';
import HideableFlex, { HideableProps } from '../HideableFlex';
import Header from './Header';
import Body from './Body';
import Footer from './Footer';

ReactModal.defaultStyles.content = {};
ReactModal.defaultStyles.overlay = {};

type ModalSize = 'auto' | 'xs' | 's' | 'm' | 'l';

export interface ModalProps
  extends ExcludeTypes<
      RequiredSome<HideableProps, 'hidden'>,
      string,
      { pick: 'transitionDuration' }
    >,
    Omit<
      FlexComponentProps<typeof ReactModal, { defaultStyles: true }>,
      'isOpen' | 'overlayClassName'
    > {
  readonly overlayClassName?: this['className'];
  readonly overlayStyle?: this['style'];
  readonly blurBackdrop?: boolean;
  readonly lockBodyScroll?: boolean;
  readonly size?: ModalSize;
}

type UseStylesProps = Pick<ModalProps, 'blurBackdrop' | 'lockBodyScroll'>;

const useStyles = makeStyles((theme: Theme) => {
  const modal = theme.rc?.Modal ?? {};

  // Build futured classes from theme
  const sizeClasses = Object.getOwnPropertyNames(modal).reduce((acc, p) => {
    if (p.indexOf('size-') === 0) acc[p] = { ...(modal[p] as CSSProperties) };
    return acc;
  }, {} as Record<ModalSize, CSSProperties>);

  return {
    root: {
      outline: 'none',
      borderRadius: 'var(--rc--modal-border-radius, 5px)',
      boxShadow:
        'var(--rc--modal-shadow, 0 15px 12px 0 rgba(0, 0, 0, 0.2), 0 20px 40px 0 rgba(0, 0, 0, 0.3))',
      maxWidth: '100vw',

      // width: ({ size = 'auto' }: Partial<ModalProps>) =>
      //   (size === 'auto'
      //     ? modal[`width-${size}`] || 'auto'
      //     : modal[`width-${size}`] || `var(--rc--modal-width-${size})`) as string | number,

      ...modal.root,
    },

    ...sizeClasses,

    overlay: ({ /* transitionDuration, */ blurBackdrop }: UseStylesProps) => ({
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'var(--rc--backdrop-color, rgba(0, 0, 0, 0.5))',
      zIndex: 1,
      overflowX: 'hidden',
      overflowY: 'auto',

      backdropFilter: blurBackdrop ? 'blur(3px)' : undefined,

      // ...(transitionDuration
      //   ? {
      //       opacity: 0,
      //       transition: `all ${transitionDuration}`,
      //       backdropFilter: blurBackdrop ? 'blur(3px)' : undefined,

      //       '& $root': {
      //         transition: `all ${transitionDuration}`,
      //         transform: 'scale(0.7)',
      //         opacity: 0,
      //       },

      //       '&.open': {
      //         opacity: 1,

      //         '&:not(.close) $root': {
      //           transform: 'scale(1)',
      //           opacity: 1,
      //         },
      //       },

      //       '&.close': {
      //         opacity: 0,
      //       },
      //     }
      //   : undefined),

      ...modal.overlay,
    }),

    body: {
      /* hide scrollbar of body */
      overflow: ({ lockBodyScroll }: UseStylesProps) => (lockBodyScroll ? 'hidden' : undefined),
    },
  };
});

const classNameTransformer: GetStylesTransformers<ReactModal.Props>['classNameTransformer'] = (
  calcClassName,
  userClassName
) => {
  if (!userClassName) {
    return calcClassName;
  }
  if (typeof userClassName !== 'string') {
    throw new Error('Expected string.');
  }
  return `${calcClassName} ${userClassName}`;
};

const styleTransformer: GetStylesTransformers<ReactModal.Props>['styleTransformer'] = (
  calcStyle,
  userStyle
) => {
  return userStyle
    ? { content: { ...calcStyle, ...userStyle.content }, overlay: userStyle.overlay }
    : { content: calcStyle };
};

function Modal({
  size = 'auto',
  lockBodyScroll,
  transitionDuration = 0.2,
  blurBackdrop,
  className,
  overlayClassName,
  bodyOpenClassName,
  style,
  overlayStyle,
  ...rest
}: React.PropsWithChildren<ModalProps>): JSX.Element {
  const css = useStyles({
    classes: {
      root: className,
      overlay: overlayClassName,
      body: bodyOpenClassName || undefined,
    },
    // size,
    // transitionDuration,
    blurBackdrop,
    lockBodyScroll,
  });

  const calcOverlayClassName = {
    base: css.overlay,
    afterOpen: 'open',
    beforeClose: 'close',
  };

  const sizeClassName = (css[`size-${size}`] as string) ?? '';

  return (
    <HideableFlex
      component={ReactModal}
      column
      transitionDuration={transitionDuration}
      isOpen={!rest.hidden}
      className={`${css.root} ${sizeClassName}`}
      overlayClassName={calcOverlayClassName}
      style={{ content: style, overlay: overlayStyle }}
      classNameTransformer={classNameTransformer}
      styleTransformer={styleTransformer}
      closeTimeoutMS={transitionDuration}
      parentSelector={Modal.defaultParentSelector}
      bodyOpenClassName={css.body}
      {...rest}
    />
  );
}

function AsChild({
  size = 'auto',
  className,
  ...rest
}: Pick<ModalProps, 'size'> & FlexComponentProps<'div'>): JSX.Element {
  const css = useStyles({ classes: { root: className } });
  const sizeClassName = (css[`size-${size}`] as string) ?? '';
  return <Flex column className={`${css.root} ${sizeClassName}`} {...rest} />;
}

Modal.Header = Header;
Modal.Body = Body;
Modal.Footer = Footer;
Modal.AsChild = AsChild;

Modal.setAppElement = ReactModal.setAppElement.bind(ReactModal);
Modal.defaultStyles = ReactModal.defaultStyles;
Modal.defaultParentSelector = undefined as (() => HTMLElement) | undefined;

Object.defineProperty(Modal, 'defaultStyles', {
  configurable: true,
  enumerable: true,
  get() {
    return ReactModal.defaultStyles;
  },
  set(value: ReactModal.Styles) {
    ReactModal.defaultStyles = value;
  },
});

export default Modal;
