import React, { useState, useCallback } from 'react';
import styled from '@mui/system/styled';
import { Flex, type FlexComponentProps } from 'reflexy/styled';
import UserIcon from './UserIcon';

export interface AvatarProps extends FlexComponentProps<'div'> {
  img?: string | undefined;
  size?: string | number | undefined;
}

type RootProps = React.PropsWithChildren<FlexComponentProps & Pick<AvatarProps, 'size'>>;

const Root = styled<React.ComponentType<RootProps>>(Flex, {
  shouldForwardProp(key) {
    const prop = key as keyof RootProps;
    return prop !== 'size';
  },
})(({ theme: { rc }, size }) => ({
  position: 'relative',
  borderRadius: '100%',
  ...rc?.Avatar?.root,

  // for strengthen
  '&&': size
    ? {
        width: size,
        height: size,
      }
    : undefined,

  "&[data-img='false']": {
    backgroundColor: 'var(--rc--area-bg-color, #f4f7f8)',
    color: '#a1adbf',
    padding: size && `calc(${Number.isNaN(+size) ? size : `${size}px`} / 10)`,
    ...rc?.Avatar?.noImg,
  },
}));

const Img = styled('img')(({ theme: { rc } }) => ({
  width: '100%',
  height: '100%',
  borderRadius: 'inherit',
  textAlign: 'center',
  objectFit: 'cover',
  ...rc?.Avatar?.img,
}));

const FallbackIcon = styled(UserIcon)(({ theme: { rc } }) => ({
  width: '100%',
  height: '100%',
  borderRadius: 'inherit',
  backgroundColor: 'inherit',
  fill: 'currentColor',
  ...rc?.Avatar?.fallbackImg,
}));

function Avatar({ img, children, ...rest }: AvatarProps): React.JSX.Element {
  const [showFallbackUserIcon, setShowUserIcon] = useState(true);

  const onLoadSuccess = useCallback(() => {
    setShowUserIcon(false);
  }, []);

  return (
    <Root shrink={0} data-img={!showFallbackUserIcon} {...rest}>
      {img && <Img src={img} alt="" onLoad={onLoadSuccess} hidden={showFallbackUserIcon} />}
      {showFallbackUserIcon && <FallbackIcon />}
      {children}
    </Root>
  );
}

export default styled(Avatar);
