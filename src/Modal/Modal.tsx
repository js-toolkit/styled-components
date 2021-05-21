import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import createStyles from '@material-ui/styles/createStyles';
import ReactModal from 'react-modal';
import {
  Flex,
  FlexComponentProps,
  FlexAllProps,
  DefaultComponentType,
  StylesTransformersProps,
} from 'reflexy/styled';
import CloseIcon from './CloseIcon';
import type { Theme } from '../Theme';

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

type FlexComponentType<ExtraProps extends Record<string, unknown> = Record<string, unknown>> = <
  C extends React.ElementType = DefaultComponentType
>(
  props: React.PropsWithChildren<FlexAllProps<C, true> & ExtraProps>
) => JSX.Element;

const useHeaderStyles = makeStyles((theme: Theme) => {
  const { closeIcon: closeIconTheme, ...headerTheme } = theme.rc?.Modal?.Header ?? {};

  return {
    root: {
      position: 'relative',
      boxSizing: 'border-box',
      fontSize: '1.125em',
      borderTopLeftRadius: 'inherit',
      borderTopRightRadius: 'inherit',
      borderBottom: '1px solid var(--rc--modal-footer-color, #2c7caf)',
      backgroundColor: 'var(--rc--modal-header-bg-color, #3488c3)',
      color: '#fff',

      ...headerTheme,
    },

    closeIcon: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: '1.35em',
      height: '1.35em',
      boxSizing: 'content-box',
      cursor: 'pointer',
      userSelect: 'none',
      transition: 'scale 0.1s',

      '&:hover:not(:active)': {
        scale: 1.2,
      },

      ...closeIconTheme,
    },
  };
});

const Header: FlexComponentType<{
  closeIcon?: boolean | React.ReactNode;
  onCloseClick?: React.MouseEventHandler<SVGSVGElement>;
}> = ({ closeIcon, onCloseClick, className, children, ...rest }) => {
  const css = useHeaderStyles({ classes: { root: className } });
  return (
    <Flex className={css.root} {...rest}>
      {children}
      {closeIcon === true && (
        <Flex p="s" component={CloseIcon} className={css.closeIcon} onClick={onCloseClick} />
      )}
      {closeIcon && closeIcon !== true && closeIcon}
    </Flex>
  );
};

const contentStyles = createStyles({
  root: {
    boxSizing: 'border-box',
    backgroundColor: '#fff',

    '&:first-child': {
      borderTopLeftRadius: 'inherit',
      borderTopRightRadius: 'inherit',
    },

    '&:last-child': {
      borderBottomLeftRadius: 'inherit',
      borderBottomRightRadius: 'inherit',
    },
  },
});

const useContentStyles = makeStyles((theme: Theme) => ({
  root: {
    ...contentStyles.root,
    ...theme.rc?.Modal?.Content,
  },
}));

const Content: FlexComponentType = ({ className, ...rest }) => {
  const css = useContentStyles({ classes: { root: className } });
  return <Flex column className={css.root} {...rest} />;
};

const useFooterStyles = makeStyles((theme: Theme) => ({
  root: {
    ...contentStyles.root,
    borderTop: '1px solid var(--rc--divider-color, rgba(0, 0, 0, 0.1))',
    color: 'var(--rc--modal-footer-color, #2c7caf)',
    ...theme.rc?.Modal?.Footer,
  },
}));

const Footer: FlexComponentType = ({ className, ...rest }) => {
  const css = useFooterStyles({ classes: { root: className } });
  return <Flex column className={css.root} {...rest} />;
};

(Header as React.FC<FlexComponentProps>).defaultProps = { p: 'l' };
(Content as React.FC<FlexComponentProps>).defaultProps = { p: 'l' };
(Footer as React.FC<FlexComponentProps>).defaultProps = { p: 'l' };

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

const AsChild: FlexComponentType<Pick<ModalProps, 'size'>> = ({ size, className, ...rest }) => {
  const css = useStyles({ classes: { root: className }, size });
  return <Flex column className={css.root} {...rest} />;
};

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

Modal.Header = Header;
Modal.Content = Content;
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
