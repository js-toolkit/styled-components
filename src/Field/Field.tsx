import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import { Flex, type FlexComponentProps } from 'reflexy/styled/jss';
import type { WithFlexComponent } from 'reflexy/types';
import type { CSSProperties, Theme } from '../theme';
import type { GetOverridedKeys } from '../types/local';
import { isValidReactNode } from '../isValidReactNode';

export interface FieldStates {}

export type FieldState = GetOverridedKeys<'default' | 'error' | 'warn' | 'info', FieldStates>;

type FlexContent<T extends React.ElementType> = Omit<FlexComponentProps<T>, 'content'> & {
  content?: React.ReactNode | undefined;
};

export interface FieldProps
  extends FlexComponentProps<'div', { omitProps: true }>,
    WithFlexComponent {
  label?: React.ReactNode | FlexContent<'label'> | undefined;
  /** @deprecated Use `controls` */
  container?: FlexComponentProps<'div'> | undefined;
  controls?: FlexComponentProps<'div'> | undefined;
  helperText?: React.ReactNode | FlexContent<'div'> | undefined;
  state?: FieldState | undefined;
}

const useStyles = makeStyles((theme: Theme) => {
  const { root, label, controls, helperText, row, column, ...restTheme } = theme.rc?.Field ?? {};

  // type StatesTheme = Pick<NonNullable<NonNullable<Theme['rc']>['Field']>, FieldState>;

  // Build futured classes from theme
  const themeStateClasses = Object.getOwnPropertyNames(restTheme).reduce(
    (acc, p) => {
      const state = p as FieldState;
      const stateTheme = restTheme[state]; // as NonNullable<StatesTheme[keyof StatesTheme]>;
      acc.root[`state-${state}`] = { ...stateTheme?.root };
      acc.label[`state-${state}-label`] = { ...stateTheme?.label };
      acc.controls[`state-${state}-controls`] = { ...stateTheme?.controls };
      acc.helperText[`state-${state}-helperText`] = { ...stateTheme?.helperText };
      return acc;
    },
    {
      root: {} as Record<`state-${FieldState}`, CSSProperties>,
      label: {} as Record<`state-${FieldState}-label`, CSSProperties>,
      controls: {} as Record<`state-${FieldState}-controls`, CSSProperties>,
      helperText: {} as Record<`state-${FieldState}-helperText`, CSSProperties>,
    }
  );

  const themeDirClasses = {
    row: (row?.root && { ...row.root }) as CSSProperties,
    'row-label': (row?.label && { ...row.label }) as CSSProperties,
    'row-controls': (row?.controls && { ...row.controls }) as CSSProperties,
    'row-helperText': (row?.helperText && { ...row.helperText }) as CSSProperties,
    column: (column?.root && { ...column.root }) as CSSProperties,
    'column-label': (column?.label && { ...column.label }) as CSSProperties,
    'column-controls': (column?.controls && { ...column.controls }) as CSSProperties,
    'column-helperText': (column?.helperText && { ...column.helperText }) as CSSProperties,
  };

  return {
    root: {
      ...root,
    },

    label: {
      ...label,
    },

    controls: {
      ...controls,
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

    ...themeDirClasses,

    'row-label': {
      width: 'auto',
      marginRight: '1.5em',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      ...themeDirClasses['row-label'],
    },

    'column-label': {
      paddingBottom: '0.5em',
      ...themeDirClasses['column-label'],
    },

    ...themeStateClasses.root,
    ...themeStateClasses.label,
    ...themeStateClasses.controls,
    ...themeStateClasses.helperText,
  };
});

export default function Field({
  FlexComponent = Flex,
  column,
  row = !column,
  label,
  container,
  controls = container,
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
  } = isValidReactNode(label) ? ({ content: label } as FlexContent<'label'>) : label;

  const {
    children: helperTextChildren,
    content: helperTextContent = helperTextChildren,
    className: helperTextClassName,
    ...helperTextProps
  } = isValidReactNode(helperText) ? ({ content: helperText } as FlexContent<'div'>) : helperText;

  const css = useStyles();

  const dir = column ? 'column' : 'row';

  return (
    <FlexComponent
      row={row}
      column={column}
      alignItems={column ? 'flex-start' : 'baseline'}
      className={clsx(css.root, css[dir], css[`state-${state}`], className)}
      data-field=""
      data-field-dir={dir}
      data-field-state={state || undefined}
      {...rest}
    >
      {labelContent && (
        <FlexComponent
          grow={false}
          shrink={false}
          justifyContent={row ? 'flex-end' : undefined}
          component="label"
          data-field-label=""
          {...labelProps}
          className={clsx(
            css.label,
            css[`${dir}-label`],
            css[`state-${state}-label`],
            labelClassName
          )}
        >
          {labelContent}
        </FlexComponent>
      )}

      <FlexComponent
        column
        shrink={false}
        hfill={column}
        {...controls}
        className={clsx(
          css.controls,
          css[`${dir}-controls`],
          css[`state-${state}-controls`],
          controls?.className
        )}
      >
        {children}

        {helperTextContent != null && (
          <FlexComponent
            shrink={false}
            data-field-helper-text=""
            {...helperTextProps}
            className={clsx(
              css.helperText,
              css[`${dir}-helperText`],
              css[`state-${state}-helperText`],
              helperTextClassName
            )}
          >
            {helperTextContent}
          </FlexComponent>
        )}
      </FlexComponent>
    </FlexComponent>
  );
}
