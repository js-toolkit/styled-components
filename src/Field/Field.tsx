import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import { Flex, FlexComponentProps } from 'reflexy';
import type { CSSProperties, Theme } from '../theme';
import type { GetOverridedKeys } from '../types/local';
import { isValidReactNode } from '../isValidReactNode';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FieldStates {}

export type FieldState = GetOverridedKeys<'default' | 'error' | 'warn' | 'info', FieldStates>;

type FlexContent<T extends React.ElementType> = FlexComponentProps<T> & {
  content?: React.ReactNode;
};

export interface FieldProps extends FlexComponentProps {
  label?: React.ReactNode | FlexContent<'label'>;
  container?: FlexComponentProps<'div'>;
  helperText?: React.ReactNode | FlexContent<'div'>;
  state?: FieldState;
}

const useStyles = makeStyles((theme: Theme) => {
  const { root, label, helperText, ...restTheme } = theme.rc?.Field ?? {};

  type StatesTheme = Pick<NonNullable<NonNullable<Theme['rc']>['Field']>, FieldState>;

  // Build futured classes from theme
  const themeClasses = Object.getOwnPropertyNames(restTheme).reduce((acc, p) => {
    const stateTheme = restTheme[p] as NonNullable<StatesTheme[keyof StatesTheme]>;

    acc[`&[data-field-state=${p}]`] = {
      ...stateTheme?.root,
      '& $label': stateTheme?.label,
      '& $helperText': stateTheme?.helperText,
    };

    return acc;
  }, {} as Record<`&[data-field-state=${FieldState}]`, CSSProperties>);

  return {
    root: {
      '&[data-field-row] $label': {
        width: 'auto',
        marginRight: '1.5em',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },

      '&[data-field-column] $label': {
        paddingBottom: '0.5em',
      },

      ...root,
      ...themeClasses,
    },

    label: {
      ...label,
    },

    helperText: {
      cursor: 'default',
      marginTop: '0.5em',
      fontSize: '0.85em',
      color: 'inherit',
      opacity: 'var(--rc--placeholder-opacity, 0.7)',
      textAlign: 'left',
      ...helperText,
    },
  };
});

export default function Field({
  column,
  row = !column,
  label,
  container,
  helperText,
  state = 'default',
  children,
  className,
  ...rest
}: React.PropsWithChildren<FieldProps>): JSX.Element {
  const {
    children: labelChildren,
    content: labelContent = labelChildren,
    className: labelClassName,
    ...labelProps
  } = (isValidReactNode(label) ? { content: label } : label) as FlexContent<'label'>;

  const {
    children: helperTextChildren,
    content: helperTextContent = helperTextChildren,
    className: helperTextClassName,
    ...helperTextProps
  } = (isValidReactNode(helperText) ? { content: helperText } : helperText) as FlexContent<'div'>;

  const css = useStyles({ classes: { root: className } });

  return (
    <Flex
      row={row}
      column={column}
      alignItems={column ? 'flex-start' : 'baseline'}
      className={css.root}
      data-field=""
      data-field-row={row ? '' : undefined}
      data-field-column={column ? '' : undefined}
      data-field-state={state || undefined}
      {...rest}
    >
      {labelContent && (
        <Flex
          grow={false}
          shrink={false}
          justifyContent={row ? 'flex-end' : undefined}
          component="label"
          data-field-label=""
          {...labelProps}
          className={clsx(css.label, labelClassName)}
        >
          {labelContent}
        </Flex>
      )}

      <Flex column shrink={false} hfill={column} {...container}>
        {children}

        {helperTextContent != null && (
          <Flex
            shrink={false}
            data-field-helper-text=""
            {...helperTextProps}
            className={clsx(css.helperText, helperTextClassName)}
          >
            {helperTextContent}
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}
