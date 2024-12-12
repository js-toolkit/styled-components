/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-use-before-define */
import React from 'react';
import styled from '@mui/system/styled';
import type { MUIStyledCommonProps } from '@mui/system';
import { Flex, type FlexComponentProps } from 'reflexy/styled';
import type { GetOverridedKeys } from '../types/local';
import { isValidReactNode } from '../isValidReactNode';

export interface FieldStates {}

export type FieldState = GetOverridedKeys<'default' | 'error' | 'warn' | 'info', FieldStates>;

type FlexContent<T extends React.ElementType> = Omit<FlexComponentProps<T>, 'content'> &
  OmitStrict<MUIStyledCommonProps, 'as'> & { content?: React.ReactNode | undefined };

export interface FieldProps extends FlexComponentProps<'div', { omitProps: true }> {
  label?: React.ReactNode | FlexContent<'label'> | undefined;
  controls?: (FlexComponentProps<'div'> & OmitStrict<MUIStyledCommonProps, 'as'>) | undefined;
  helperText?: React.ReactNode | FlexContent<'div'> | undefined;
  state?: FieldState | undefined;
}

type RootProps = React.PropsWithChildren<
  RequiredSome<FieldProps, 'state'> & { direction: 'column' | 'row' }
>;

const Root = styled(
  ({ state, direction, ...rest }: RootProps) => {
    return (
      <Flex
        row={direction === 'row' || undefined}
        column={direction === 'column' || undefined}
        alignItems={direction === 'column' ? 'flex-start' : 'baseline'}
        data-field=""
        data-field-dir={direction}
        data-field-state={state || undefined}
        {...rest}
      />
    );
  },
  { name: Field.name }
)(({ theme: { rc }, direction, state }) => ({
  ...rc?.Field?.root,
  ...(direction === 'column' ? rc?.Field?.column?.root : rc?.Field?.row?.root),
  ...rc?.Field?.[state]?.root,
}));

type FieldElementProps = React.PropsWithChildren<
  FlexComponentProps & Pick<RootProps, 'state' | 'direction'>
>;

const Label = styled(
  ({ state, direction, ...rest }: FieldElementProps) => {
    return (
      <Flex
        grow={false}
        shrink={false}
        justifyContent={direction === 'row' ? 'flex-end' : undefined}
        component="label"
        data-field-label=""
        {...rest}
      />
    );
  },
  { name: Field.name, slot: 'label' }
)(({ theme: { rc }, direction, state }) => ({
  ...rc?.Field?.label,

  ...(direction === 'column'
    ? { paddingBottom: '0.5em' }
    : {
        width: 'auto',
        marginRight: '1.5em',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }),

  ...rc?.Field?.[direction]?.label,
  ...rc?.Field?.[state]?.label,
}));

const Controls = styled(
  ({ state, direction, ...rest }: FieldElementProps) => {
    return (
      <Flex
        column
        shrink={false}
        hfill={direction === 'column' || undefined}
        data-field-controls=""
        {...rest}
      />
    );
  },
  { name: Field.name, slot: 'controls' }
)(({ theme: { rc }, direction, state }) => ({
  ...rc?.Field?.controls,
  ...rc?.Field?.[direction]?.controls,
  ...rc?.Field?.[state]?.controls,
}));

const HelperTextContainer = styled(
  ({ state, direction, ...rest }: FieldElementProps) => {
    return <Flex shrink={false} data-field-helper-text="" {...rest} />;
  },
  { name: Field.name, slot: 'helperText' }
)(({ theme: { rc }, direction, state }) => ({
  cursor: 'default',
  marginTop: '0.5em',
  fontSize: '0.85em',
  color: 'inherit',
  opacity: 'var(--rc--placeholder-opacity, 0.7)',
  textAlign: 'left',

  ...rc?.Field?.helperText,
  ...rc?.Field?.[direction]?.helperText,
  ...rc?.Field?.[state]?.helperText,
}));

export default function Field({
  column,
  label,
  controls,
  helperText,
  state = 'default',
  children,
  ...rest
}: React.PropsWithChildren<FieldProps>): React.JSX.Element {
  const {
    children: labelChildren,
    content: labelContent = labelChildren,
    ...labelProps
  } = isValidReactNode(label) ? ({ content: label } as FlexContent<'label'>) : label;

  const {
    children: helperTextChildren,
    content: helperTextContent = helperTextChildren,
    ...helperTextProps
  } = isValidReactNode(helperText) ? ({ content: helperText } as FlexContent<'div'>) : helperText;

  const direction = column ? 'column' : 'row';

  return (
    <Root direction={direction} state={state} {...rest}>
      {labelContent && (
        <Label direction={direction} state={state} {...labelProps}>
          {labelContent}
        </Label>
      )}

      <Controls direction={direction} state={state} {...controls}>
        {children}

        {helperTextContent != null && (
          <HelperTextContainer direction={direction} state={state} {...helperTextProps}>
            {helperTextContent}
          </HelperTextContainer>
        )}
      </Controls>
    </Root>
  );
}
