import React, { useCallback } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import '@js-toolkit/utils/types';
import ReactModal from 'react-modal';
import { Flex, type FlexComponentProps, type GetStylesTransformers } from 'reflexy/styled/jss';
import useUpdatedRefState from '@js-toolkit/react-hooks/useUpdatedRefState';
import HideableFlex, { type HideableProps } from '../HideableFlex';
import type { CSSProperties, Theme } from '../theme';
import Header from './Header';
import Body from './Body';
import Footer from './Footer';

ReactModal.defaultStyles.content = {};
ReactModal.defaultStyles.overlay = {};

type ModalSize = 'auto' | 'xs' | 's' | 'm' | 'l';

export interface ModalProps
  extends ExcludeTypes<
      RequiredSome<OmitStrict<HideableProps, 'disposable'>, 'hidden'>,
      string,
      { pick: 'transitionDuration' }
    >,
    OmitStrict<
      FlexComponentProps<typeof ReactModal>,
      | 'isOpen'
      | 'overlayElement'
      | 'overlayRef'
      | 'shouldCloseOnOverlayClick'
      | 'overlayClassName'
      | 'contentElement'
      | 'closeTimeoutMS'
    > {
  readonly backdropElement?: ReactModal.Props['overlayElement'] | undefined;
  readonly backdropRef?: ReactModal.Props['overlayRef'] | undefined;
  readonly shouldCloseOnBackdropClick?: ReactModal.Props['shouldCloseOnOverlayClick'] | undefined;
  readonly backdropClassName?: this['className'] | undefined;
  readonly backdropStyle?: this['style'] | undefined;
  readonly disableBackdrop?: boolean | undefined;
  readonly lockBodyScroll?: boolean | undefined;
  readonly size?: ModalSize | undefined;
}

// type MakeStylesProps = Pick<ModalProps, 'blurBackdrop'>;

const useStyles = makeStyles((theme: Theme) => {
  const modal = theme.rc?.Modal ?? {};

  // Build futured classes from theme
  const sizeClasses = Object.getOwnPropertyNames(modal).reduce(
    (acc, p) => {
      if (p.indexOf('size-') === 0) {
        const size = p as `size-${ModalSize}`;
        acc[size] = { ...modal[size] };
      }
      return acc;
    },
    {} as Record<`size-${ModalSize}`, CSSProperties>
  );

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

    backdrop: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'var(--rc--backdrop-color, rgba(0, 0, 0, 0.5))',
      zIndex: 1,

      // backdropFilter: ({ blurBackdrop }: MakeStylesProps) => (blurBackdrop ? 'blur(3px)' : 'none'),

      ...modal.backdrop,
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
  bodyOpenClassName,
  className,
  style,

  backdropRef,
  backdropClassName,
  backdropStyle,
  disableBackdrop,
  shouldCloseOnBackdropClick,

  hidden,
  collapsable,
  keepChildren,
  appear,
  transitionDuration = 250,
  transitionFunction,
  transitionProperty,
  hiddenClassName,
  onShown,
  onHidden,

  ...rest
}: React.PropsWithChildren<ModalProps>): JSX.Element {
  const css = useStyles({
    classes: {
      root: className,
      backdrop: backdropClassName,
    },
  });

  const [isVisible, setVisible] = useUpdatedRefState<boolean>(
    // Hide only by call update state method.
    (prev) => !hidden || !!prev,
    [hidden]
  );

  const hideHandler = useCallback(() => {
    setVisible(false);
    onHidden && onHidden();
  }, [onHidden, setVisible]);

  const contentElement: NonNullable<ReactModal.Props['contentElement']> = (
    { ref, ...contentProps },
    children
  ) => {
    return (
      <HideableFlex
        componentRef={ref}
        column
        hidden={hidden}
        collapsable={collapsable}
        keepChildren={keepChildren}
        appear={appear}
        transitionDuration={transitionDuration}
        transitionFunction={transitionFunction}
        transitionProperty={transitionProperty}
        hiddenClassName={hiddenClassName}
        onShown={onShown}
        onHidden={hideHandler}
        {...contentProps}
      >
        {children}
      </HideableFlex>
    );
  };

  const backdropElement: NonNullable<ModalProps['backdropElement']> =
    rest.backdropElement && !disableBackdrop
      ? rest.backdropElement
      : ({ ref, ...backdropProps }, contentEl) => {
          if (disableBackdrop) {
            return contentEl;
          }
          return (
            <Flex componentRef={ref} center overflowX="hidden" overflowY="auto" {...backdropProps}>
              {contentEl}
            </Flex>
          );
        };

  const backdropClasses: ReactModal.Classes = {
    base: css.backdrop,
    afterOpen: 'open',
    beforeClose: 'close',
  };

  const contentStyles: ReactModal.Styles = {
    content: style,
    overlay: backdropStyle,
  };

  const sizeClassName = css[`size-${size}`] ?? '';

  return (
    <Flex
      component={ReactModal}
      className={`${css.root} ${sizeClassName}`}
      style={contentStyles}
      classNameTransformer={classNameTransformer}
      styleTransformer={styleTransformer}
      parentSelector={Modal.defaultParentSelector}
      portalClassName="sc-modal-portal"
      {...(rest as any)}
      isOpen={isVisible()}
      closeTimeoutMS={0}
      overlayClassName={backdropClasses}
      bodyOpenClassName={
        lockBodyScroll && bodyOpenClassName
          ? `${css.lockScroll} ${bodyOpenClassName}`
          : (lockBodyScroll && css.lockScroll) || bodyOpenClassName || null
      }
      contentElement={contentElement}
      overlayElement={backdropElement}
      overlayRef={backdropRef}
      shouldCloseOnOverlayClick={shouldCloseOnBackdropClick}
    />
  );
}

function AsChild({
  size = 'auto',
  className,
  ...rest
}: Pick<ModalProps, 'size'> & FlexComponentProps<'div'>): JSX.Element {
  const css = useStyles({ classes: { root: className } });
  const sizeClassName = css[`size-${size}`] ?? '';
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
