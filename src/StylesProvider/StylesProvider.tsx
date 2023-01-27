import React, { useMemo } from 'react';
import { create, JssOptions } from 'jss';
import MuiStylesProvider, {
  StylesProviderProps as MuiStylesProviderProps,
} from '@mui/styles/StylesProvider';
import createPlugins from './createPlugins';

export interface StylesProviderProps
  extends MuiStylesProviderProps,
    OptionalToUndefined<Partial<Pick<JssOptions, 'Renderer' | 'insertionPoint' | 'id'>>> {
  plugins?: (() => JssOptions['plugins']) | undefined;
}

export default function StylesProvider({
  plugins = createPlugins,
  Renderer,
  insertionPoint,
  id,
  injectFirst,
  ...rest
}: StylesProviderProps): JSX.Element {
  const jss = useMemo(() => {
    let insertionPointRef = insertionPoint;

    if (!insertionPointRef && injectFirst && typeof window !== 'undefined') {
      const { head } = document;
      if (
        head.firstChild?.nodeType === Node.COMMENT_NODE &&
        head.firstChild.nodeValue === 'mui-inject-first'
      ) {
        insertionPointRef = head.firstChild as Comment;
      } else {
        insertionPointRef = document.createComment('mui-inject-first');
        head.insertBefore(insertionPointRef, head.firstChild);
      }
    }

    return create({
      plugins: plugins(),
      ...(Renderer ? { Renderer } : undefined),
      ...(insertionPointRef ? { insertionPoint: insertionPointRef } : undefined),
      ...(id ? { id } : undefined),
    });
  }, [Renderer, plugins, id, injectFirst, insertionPoint]);

  return <MuiStylesProvider jss={jss} {...rest} />;
}
