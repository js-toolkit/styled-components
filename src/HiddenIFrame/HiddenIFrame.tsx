import React from 'react';

export interface HiddenIFrameProps extends React.IframeHTMLAttributes<HTMLIFrameElement> {}

const style: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'transparent',
  border: 'none',
  // Must be visible for FireFox.
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1295245
  visibility: 'visible',
  opacity: 0,
  zIndex: -1,
};

export default React.memo(
  React.forwardRef((props: HiddenIFrameProps, ref: React.Ref<HTMLIFrameElement>) => {
    return (
      // eslint-disable-next-line jsx-a11y/iframe-has-title
      <iframe
        ref={ref}
        tabIndex={-1}
        {...props}
        style={props.style ? { ...style, ...props.style } : style}
      />
    );
  })
);
