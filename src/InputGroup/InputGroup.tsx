import React, { useMemo } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import { Flex, FlexComponentProps, FlexAllProps } from 'reflexy';
import type { Theme } from '../theme';
import InvalidIcon from './InvalidIcon';

export interface InputGroupProps<C extends React.ElementType = 'input'> extends FlexComponentProps {
  input: JSX.Element | FlexAllProps<C>;
  error?: string | boolean | JSX.Element;
}

const useStyles = makeStyles((theme: Theme) => {
  const errorIconSize = theme.rc?.InputGroup?.errorIcon?.size || '1em';
  const errorIconIndent = theme.rc?.InputGroup?.errorIcon?.indent || '0.75em';
  const errorColor = theme.rc?.colors?.error || 'var(--rc--color-invalid, #a94442)';

  return {
    root: ({ showErrorIcon }: { showErrorIcon: boolean }) => ({
      ...theme.rc?.InputGroup?.root,

      "&[data-invalid='true']": {
        color: errorColor,
        ...theme.rc?.InputGroup?.error?.root,

        '& [data-input]:not([data-dropdown]), & [data-dropdown-label]': {
          paddingRight: showErrorIcon
            ? `calc(${errorIconSize} + ${errorIconIndent} + 0.35em)`
            : undefined,

          // color: errorColor,
          borderColor: errorColor,

          ...theme.rc?.InputGroup?.error?.input,
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
        ...theme.rc?.InputGroup?.input,
      },

      // DropDownLabel
      '& [data-dropdown-label]': {
        border: '1px solid transparent',
        ...theme.rc?.InputGroup?.DropDownLabel,
      },
      // DropDownBox
      '& [data-dropdown-box]': {
        border: `1px solid transparent`,
        ...theme.rc?.InputGroup?.DropDownBox,
      },

      '& [data-icon-error]': {
        color: errorColor,
        fill: 'currentColor',
        width: errorIconSize,
        height: errorIconSize,
        marginLeft: `calc((${errorIconSize} + ${errorIconIndent}) * -1)`,
        marginRight: errorIconIndent,
        zIndex: 0,
        ...theme.rc?.InputGroup?.errorIcon,
      },
    }),
  };
});

export default function InputGroup<C extends React.ElementType = 'input'>({
  input,
  error,
  className,
  children,
  ...rest
}: React.PropsWithChildren<InputGroupProps<C>>): JSX.Element {
  const hasError = error != null && error !== false;
  const showErrorIcon = error != null && typeof error === 'string' && !!error;
  const css = useStyles({ classes: { root: className }, showErrorIcon } as any);
  const stateAttrs = useMemo(() => ({ 'data-invalid': hasError || undefined }), [hasError]);

  const inputComponent = React.isValidElement(input) ? (
    React.cloneElement(input, { ...stateAttrs, 'data-input': '' } as any)
  ) : (
    <Flex {...(input as FlexAllProps<'input'>)} data-input="" />
  );

  return (
    <Flex alignItems="center" className={css.root} {...stateAttrs} {...rest} data-input-group="">
      {inputComponent}

      {showErrorIcon && (
        <InvalidIcon data-icon-error>
          <title>{error}</title>
        </InvalidIcon>
      )}

      {!!error && React.isValidElement(error) && error}

      {children && React.Children.only(children)}
    </Flex>
  );
}
