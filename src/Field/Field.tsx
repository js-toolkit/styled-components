import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Flex, FlexComponentProps } from 'reflexy';
import type { Theme } from '../theme';

export interface FieldProps extends FlexComponentProps {
  label?: string | (FlexComponentProps<'label'> & { content?: React.ReactNode });
  container?: FlexComponentProps<'div'>;
  info?: React.ReactNode;
  error?: boolean;
}

const useStyles = makeStyles((theme: Theme) => {
  const rowLabelMargin = '1.5em';
  const colLabelMargin = '0.5em';

  return {
    root: {
      ...theme.rc?.Field?.root,

      "&[data-field-invalid='true']": {
        color: theme.rc?.colors?.error || 'var(--rc--color-invalid, #a94442)',
        ...theme.rc?.Field?.error?.root,

        '& $label': theme.rc?.Field?.error?.label,

        '& $info': theme.rc?.Field?.error?.info,
      },
    },

    label: ({ row }: FlexComponentProps) =>
      row
        ? {
            width: 'auto',
            marginRight: rowLabelMargin,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            ...theme.rc?.Field?.label,
          }
        : {
            paddingBottom: colLabelMargin,
            ...theme.rc?.Field?.label,
          },

    info: {
      marginTop: colLabelMargin,
      fontSize: '0.85em',
      color: 'inherit',
      opacity: 'var(--rc--placeholder-opacity, 0.7)',
      textAlign: 'left',
      ...theme.rc?.Field?.info,
    },
  };
});

export default function Field({
  column,
  row = !column,
  label,
  container,
  info,
  error,
  children,
  className,
  ...rest
}: React.PropsWithChildren<FieldProps>): JSX.Element {
  const labelClassName = (typeof label === 'object' && label?.className) || undefined;
  const labelContent = typeof label === 'string' ? label : label?.content ?? label?.children;

  const css = useStyles({ classes: { root: className, label: labelClassName }, row });

  return (
    <Flex
      row={row}
      column={column}
      alignItems={column ? 'flex-start' : 'baseline'}
      className={css.root}
      data-field=""
      data-field-row={row || undefined}
      data-field-column={column || undefined}
      data-field-invalid={!!error || undefined}
      {...rest}
    >
      {labelContent && (
        <Flex
          grow={false}
          shrink={false}
          justifyContent={row ? 'flex-end' : undefined}
          component="label"
          data-field-label
          {...(typeof label === 'object' ? label : undefined)}
          className={css.label}
        >
          {labelContent}
        </Flex>
      )}

      <Flex column shrink={false} hfill={column} {...container}>
        {children}
        {!!info && (
          <div className={css.info} data-field-info>
            {info}
          </div>
        )}
      </Flex>
    </Flex>
  );
}
