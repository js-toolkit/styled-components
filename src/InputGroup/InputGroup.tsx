import React from 'react';
import styled from '@mui/system/styled';
import { Flex, type FlexComponentProps, type FlexAllProps } from 'reflexy/styled';
import InvalidIcon from './InvalidIcon';

export interface InputGroupProps<C extends React.ElementType = 'input'> extends FlexComponentProps {
  input: JSX.Element | FlexAllProps<C>;
  error?: string | boolean | JSX.Element | undefined;
}

type RootProps = FlexComponentProps & { showErrorIcon: boolean };

const Root = styled(Flex, {
  shouldForwardProp: (key) => {
    const prop = key as keyof RootProps;
    return prop !== 'showErrorIcon';
  },
})<RootProps>(({ theme: { rc }, showErrorIcon }) => {
  const theme = rc?.InputGroup ?? {};
  const errorIconSize = theme.errorIcon?.size || '1em';
  const errorIconIndent = theme.errorIcon?.indent || '0.75em';
  const errorColor = rc?.colors?.error || 'var(--rc--color-invalid, #a94442)';

  return {
    root: {
      ...theme.root,

      "&[data-invalid='true']": {
        color: errorColor,
        ...theme.error?.root,

        '& [data-input]:not([data-dropdown]), & [data-dropdown-label]': {
          paddingRight: showErrorIcon
            ? `calc(${errorIconSize} + ${errorIconIndent} + 0.35em)`
            : undefined,

          // color: errorColor,
          borderColor: errorColor,

          ...theme.error?.input,
        },

        // DropDownBox
        '& [data-dropdown-box]': {
          borderColor: errorColor,
        },

        // Checkbox
        "& [role='checkbox'], & [role='radio']": {
          '&::before': {
            borderColor: errorColor,
          },
        },
        "& [role='switch']": {
          background: errorColor,
        },
      },

      '& [data-input]': {
        width: '100%',
        maxWidth: '100%',
        ...theme.input,
      },

      // DropDownLabel
      '& [data-dropdown-label]': {
        border: '1px solid transparent',
        ...theme.DropDownLabel,
      },
      // DropDownBox
      '& [data-dropdown-box]': {
        border: `1px solid transparent`,
        ...theme.DropDownBox,
      },

      '& [data-icon-error]': {
        color: errorColor,
        fill: 'currentColor',
        width: errorIconSize,
        height: errorIconSize,
        marginLeft: `calc((${errorIconSize} + ${errorIconIndent}) * -1)`,
        marginRight: errorIconIndent,
        zIndex: 0,
        ...theme.errorIcon,
      },
    },
  };
});

export default function InputGroup<C extends React.ElementType = 'input'>({
  input,
  error,
  children,
  ...rest
}: React.PropsWithChildren<InputGroupProps<C>>): JSX.Element {
  const hasError = !!error;
  const showErrorIcon = hasError && typeof error === 'string';
  const stateAttrs = { 'data-invalid': hasError || undefined };

  const inputComponent = React.isValidElement<typeof stateAttrs & { 'data-input': '' }>(input) ? (
    React.cloneElement(input, { ...stateAttrs, 'data-input': '' })
  ) : (
    <Flex flex={false} {...(input as FlexAllProps<'input'>)} data-input="" />
  );

  return (
    <Root
      showErrorIcon={showErrorIcon}
      alignItems="center"
      {...stateAttrs}
      {...rest}
      data-input-group=""
    >
      {inputComponent}

      {showErrorIcon && (
        <InvalidIcon data-icon-error>
          <title>{error}</title>
        </InvalidIcon>
      )}

      {!!error && React.isValidElement(error) && error}

      {children && React.Children.only(children)}
    </Root>
  );
}
