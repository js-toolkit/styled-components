import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import ReactModal from 'react-modal';
import { Flex, FlexComponentProps, StylesTransformersProps } from 'reflexy/styled';
import type { Theme } from '../theme';
import Header from './Header';
import Body from './Body';
import Footer from './Footer';

ReactModal.defaultStyles.content = {};
ReactModal.defaultStyles.overlay = {};

export interface ModalProps
  extends Omit<ReactModal.Props, 'className' | 'overlayClassName' | 'style'>,
    FlexComponentProps {
  overlayClassName?: string;
  overlayStyle?: FlexComponentProps['style'];
  transitionDuration?: number;
  blurBackdrop?: boolean;
  lockBodyScroll?: boolean;
  size?: 'auto' | 'xs' | 's' | 'm' | 'l';
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    outline: 'none',
    borderRadius: 'var(--rc--modal-border-radius, 5px)',
    boxShadow:
      'var(--rc--modal-shadow, 0 15px 12px 0 rgba(0, 0, 0, 0.2), 0 20px 40px 0 rgba(0, 0, 0, 0.3))',
    maxWidth: '100vw',

    width: ({ size = 'auto' }: Partial<ModalProps>) =>
      size === 'auto'
        ? 'auto'
        : (theme.rc?.Modal?.[`width${size.toUpperCase()}`] as string | number) ||
          `var(--rc--modal-width-${size})` ||
          undefined,

    ...theme.rc?.Modal?.root,
  },

  overlay: ({ transitionDuration, blurBackdrop }: Partial<ModalProps>) => ({
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

    ...(transitionDuration
      ? {
          opacity: 0,
          transition: `all ${transitionDuration}ms`,
          backdropFilter: blurBackdrop ? 'blur(3px)' : undefined,

          '& $root': {
            transition: `all ${transitionDuration}ms`,
            transform: 'scale(0.7)',
            opacity: 0,
          },

          '&.open': {
            opacity: 1,

            '&:not(.close) $root': {
              transform: 'scale(1)',
              opacity: 1,
            },
          },

          '&.close': {
            opacity: 0,
          },
        }
      : undefined),

    ...theme.rc?.Modal?.overlay,
  }),

  body: {
    /* hide scrollbar of body */
    overflow: ({ lockBodyScroll }: Partial<ModalProps>) => (lockBodyScroll ? 'hidden' : undefined),
  },
}));

const classNameTransformer: StylesTransformersProps<ReactModal.Props>['classNameTransformer'] = (
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

const styleTransformer: StylesTransformersProps<ReactModal.Props>['styleTransformer'] = (
  calcStyle,
  userStyle
) => {
  return userStyle
    ? { content: { ...calcStyle, ...userStyle.content }, overlay: userStyle.overlay }
    : { content: { ...calcStyle } };
};

function Modal({
  size = 'auto',
  lockBodyScroll,
  transitionDuration = 200,
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
    size,
    transitionDuration: transitionDuration ?? 200,
    blurBackdrop,
    lockBodyScroll,
  });

  const calcOverlayClassName = {
    base: css.overlay,
    afterOpen: 'open',
    beforeClose: 'close',
  };

  return (
    <Flex
      column
      component={ReactModal}
      className={css.root}
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
  size,
  className,
  ...rest
}: Pick<ModalProps, 'size'> & FlexComponentProps<'div'>): JSX.Element {
  const css = useStyles({ classes: { root: className }, size });
  return <Flex column className={css.root} {...rest} />;
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
