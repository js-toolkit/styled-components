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

type MakeStylesProps = Pick<ModalProps, 'blurBackdrop' | 'lockBodyScroll'>;

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
      ...modal.root,
    },

    ...sizeClasses,

    overlay: {
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

      backdropFilter: ({ blurBackdrop }: MakeStylesProps) => (blurBackdrop ? 'blur(3px)' : 'none'),

      ...modal.overlay,
    },

    /* hide scrollbar of body */
    lockScroll: {
      overflow: 'hidden',
    },
  };
});

const classNameTransformer: GetStylesTransformers<ReactModal.Props>['classNameTransformer'] = (
  calcClassName,
  userClassName
) => {
  if (userClassName && typeof userClassName !== 'string') {
    throw new Error('Expected string.');
  }
  return {
    base: userClassName ? `${calcClassName} ${userClassName}` : calcClassName,
    afterOpen: 'open',
    beforeClose: 'close',
  };
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
  transitionDuration = 200,
  blurBackdrop,
  className,
  overlayClassName,
  bodyOpenClassName,
  style,
  overlayStyle,
  onShown,
  onHidden,
  ...rest
}: React.PropsWithChildren<ModalProps>): JSX.Element {
  const css = useStyles({
    classes: {
      root: className,
      overlay: overlayClassName,
    },
    blurBackdrop,
    lockBodyScroll,
  });

  const overlayClasses: ReactModal.Classes = {
    base: css.overlay,
    afterOpen: 'open',
    beforeClose: 'close',
  };

  const contentStyles: ReactModal.Styles = {
    content: style,
    overlay: overlayStyle,
  };

  const sizeClassName = (css[`size-${size}`] as string) ?? '';

  return (
    <HideableFlex
      component={ReactModal}
      column
      transitionDuration={transitionDuration}
      isOpen={!rest.hidden}
      className={`${css.root} ${sizeClassName}`}
      overlayClassName={overlayClasses}
      style={contentStyles}
      classNameTransformer={classNameTransformer}
      styleTransformer={styleTransformer}
      closeTimeoutMS={transitionDuration}
      parentSelector={Modal.defaultParentSelector}
      bodyOpenClassName={
        lockBodyScroll && bodyOpenClassName
          ? `${css.lockScroll} ${bodyOpenClassName}`
          : (lockBodyScroll && css.lockScroll) || bodyOpenClassName || null
      }
      onAfterOpen={onShown}
      onAfterClose={onHidden}
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
