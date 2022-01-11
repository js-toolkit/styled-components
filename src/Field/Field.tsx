import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import { Flex, FlexComponentProps } from 'reflexy';
import { GetOverridedKeys } from '../types/local';
import type { CSSProperties, Theme } from '../theme';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FieldStates {}

export type FieldState = GetOverridedKeys<'default' | 'error' | 'warn' | 'info', FieldStates>;

export interface FieldProps extends FlexComponentProps {
  label?: string | (FlexComponentProps<'label'> & { content?: React.ReactNode });
  container?: FlexComponentProps<'div'>;
  helperText?: React.ReactNode;
  state?: FieldState;
}

const useStyles = makeStyles((theme: Theme) => {
  const { root, label, helperText, ...restTheme } = theme.rc?.Field ?? {};

  type StatesTheme = Pick<NonNullable<NonNullable<Theme['rc']>['Field']>, FieldState>;

  // Build futured classes from theme
  const themeClasses = Object.getOwnPropertyNames(restTheme).reduce((acc, p) => {
    const stateTheme = restTheme[p] as NonNullable<StatesTheme[keyof StatesTheme]>;

    acc[`&[data-field-state='${p}']`] = {
      ...stateTheme?.root,
      '& $label': stateTheme?.label,
      '& $helperText': stateTheme?.helperText,
    };

    return acc;
  }, {} as Record<`&[data-field-state='${FieldState}']`, CSSProperties>);

  return {
    root: {
      ...root,
      ...themeClasses,
    },

    rowLabel: {
      composes: '$label',
      width: 'auto',
      marginRight: '1.5em',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },

    colLabel: {
      composes: '$label',
      paddingBottom: '0.5em',
    },

    label: {
      ...label,
    },

    helperText: {
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
  } = (typeof label === 'string' ? { content: label } : label) as Exclude<
    FieldProps['label'],
    undefined | string
  >;

  const css = useStyles({ classes: { root: className } });

  return (
    <Flex
      row={row}
      column={column}
      alignItems={column ? 'flex-start' : 'baseline'}
      className={css.root}
      data-field=""
      data-field-row={row || undefined}
      data-field-column={column || undefined}
      data-field-state={state || undefined}
      {...rest}
    >
      {labelContent && (
        <Flex
          grow={false}
          shrink={false}
          justifyContent={row ? 'flex-end' : undefined}
          component="label"
          data-field-label
          {...labelProps}
          className={clsx(row ? css.rowLabel : css.colLabel, labelClassName)}
        >
          {labelContent}
        </Flex>
      )}

      <Flex column shrink={false} hfill={column} {...container}>
        {children}
        {!!helperText && (
          <div className={css.helperText} data-field-helper-text>
            {helperText}
          </div>
        )}
      </Flex>
    </Flex>
  );
}
