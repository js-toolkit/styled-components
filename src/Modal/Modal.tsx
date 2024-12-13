/* eslint-disable no-use-before-define */
import React, { useCallback } from 'react';
import styled from '@mui/system/styled';
import ReactModal from 'react-modal';
import { clsx } from 'clsx';
import { Flex, type FlexComponentProps, type GetStylesTransformers } from 'reflexy/styled';
import useUpdatedRefState from '@js-toolkit/react-hooks/useUpdatedRefState';
import TransitionFlex, { type HideableProps } from '../TransitionFlex';
import Header from './Header';
import Body from './Body';
import Footer from './Footer';

ReactModal.defaultStyles.content = {};
ReactModal.defaultStyles.overlay = {};

type ModalSize = 'auto' | 'xs' | 's' | 'm' | 'l';

export interface ModalProps
  extends RequiredSome<OmitStrict<HideableProps, 'disposable'>, 'hidden'>,
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

const Root = styled(
  ({
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
    appear,
    keepChildren,
    transition,
    transitionProps,
    transitionDuration,
    onHidden,
    onShown,

    parentSelector,
    ...rest
  }: React.PropsWithChildren<ModalProps>) => {
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
      contentProps,
      children
    ) => {
      return (
        <TransitionFlex
          column
          hidden={hidden}
          appear={appear}
          keepChildren={keepChildren}
          transition={transition}
          transitionProps={transitionProps}
          transitionDuration={transitionDuration}
          onHidden={hideHandler}
          onShown={onShown}
          {...contentProps}
        >
          {children}
        </TransitionFlex>
      );
    };

    const backdropElement: NonNullable<ModalProps['backdropElement']> =
      rest.backdropElement && !disableBackdrop
        ? rest.backdropElement
        : (backdropProps, contentEl) => {
            if (disableBackdrop) {
              return contentEl;
            }
            return (
              <Flex center overflowX="hidden" overflowY="auto" {...backdropProps}>
                {contentEl}
              </Flex>
            );
          };

    const backdropClasses: ReactModal.Classes = {
      base: clsx(`${className}__backdrop`, backdropClassName),
      afterOpen: 'open',
      beforeClose: 'close',
    };

    const contentStyles: ReactModal.Styles = {
      content: style,
      overlay: backdropStyle,
    };

    return (
      <Flex
        component={ReactModal}
        className={className}
        style={contentStyles}
        classNameTransformer={classNameTransformer}
        styleTransformer={styleTransformer}
        portalClassName="sc-modal-portal"
        {...rest}
        parentSelector={
          (parentSelector ?? Modal.defaultParentSelector) as NonNullable<
            ModalProps['parentSelector']
          >
        }
        isOpen={isVisible()}
        closeTimeoutMS={0}
        overlayClassName={backdropClasses}
        bodyOpenClassName={clsx(lockBodyScroll && `${className}__lockScroll`, bodyOpenClassName)}
        contentElement={contentElement}
        overlayElement={backdropElement}
        overlayRef={backdropRef}
        shouldCloseOnOverlayClick={shouldCloseOnBackdropClick}
      />
    );
  },
  {
    shouldForwardProp: (key) => {
      const prop = key as keyof ModalProps;
      return prop !== 'size';
    },
  }
)(({ theme: { rc }, size = 'auto', lockBodyScroll }) => ({
  outline: 'none',
  borderRadius: 'var(--rc--modal-border-radius, 5px)',
  boxShadow:
    'var(--rc--modal-shadow, 0 15px 12px 0 rgba(0, 0, 0, 0.2), 0 20px 40px 0 rgba(0, 0, 0, 0.3))',
  maxWidth: '100vw',
  ...rc?.Modal?.root,
  ...(size && rc?.Modal?.[`size-${size}`]),

  '&__lockScroll': {
    /* hide scrollbar of body */
    overflow: lockBodyScroll ? 'hidden' : undefined,
  },

  '&__backdrop': {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'var(--rc--backdrop-color, rgba(0, 0, 0, 0.5))',
    zIndex: 1,
    // backdropFilter: ({ blurBackdrop }: MakeStylesProps) => (blurBackdrop ? 'blur(3px)' : 'none'),
    ...rc?.Modal?.backdrop,
  },
}));

function Modal(props: ModalProps): React.JSX.Element {
  return <Root {...props} />;
}

type AsChildProps = Pick<ModalProps, 'size'> & FlexComponentProps<'div'>;

const AsChild = styled((props: AsChildProps) => <Flex column {...props} />, {
  shouldForwardProp: (key) => {
    const prop = key as keyof ModalProps;
    return prop !== 'size';
  },
})(({ theme: { rc }, size = 'auto' }) => ({
  outline: 'none',
  borderRadius: 'var(--rc--modal-border-radius, 5px)',
  boxShadow:
    'var(--rc--modal-shadow, 0 15px 12px 0 rgba(0, 0, 0, 0.2), 0 20px 40px 0 rgba(0, 0, 0, 0.3))',
  maxWidth: '100vw',
  ...rc?.Modal?.root,
  ...(size && rc?.Modal?.[`size-${size}`]),
}));

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
