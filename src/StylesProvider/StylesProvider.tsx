import React, { useMemo } from 'react';
import { create, JssOptions } from 'jss';
import MuiStylesProvider, {
  StylesProviderProps as MuiStylesProviderProps,
} from '@material-ui/styles/StylesProvider';
import presetPlugins from '../presetPlugins';

export interface StylesProviderProps
  extends MuiStylesProviderProps,
    Partial<Pick<JssOptions, 'Renderer' | 'insertionPoint' | 'id'>> {
  createPlugins?: () => JssOptions['plugins'];
}

export default function StylesProvider({
  createPlugins,
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
      plugins: createPlugins ? createPlugins() : presetPlugins(),
      ...(Renderer ? { Renderer } : undefined),
      ...(insertionPointRef ? { insertionPoint: insertionPointRef } : undefined),
      ...(id ? { id } : undefined),
    });
  }, [Renderer, createPlugins, id, injectFirst, insertionPoint]);

  return <MuiStylesProvider jss={jss} {...rest} />;
}
