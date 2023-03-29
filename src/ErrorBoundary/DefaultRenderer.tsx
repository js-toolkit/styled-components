import React from 'react';
import { Flex, type FlexComponentProps } from 'reflexy/styled';

export interface DefaultRendererProps extends FlexComponentProps {
  readonly error: unknown;
}

export default function DefaultRenderer({ error, ...rest }: DefaultRendererProps): JSX.Element {
  return (
    <Flex column center fill {...rest}>
      <h1>Произошла ошибка.</h1>
      <h2>Так сошлишь звезды...</h2>
      <h2>Повторите попытку, ну, или как хотите.</h2>
      <h3>Если ошибка повторяется, пожалуйста, свяжитесь с кем-нибудь.</h3>
      <h3>Если интересно, то вот ошибка:</h3>
      <div>
        <i>
          {(error && typeof error === 'object' && 'message' in error
            ? (error as Error).message
            : String(error)) || 'Unknown error'}
        </i>
      </div>
    </Flex>
  );
}
