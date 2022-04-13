import React, { useMemo } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Flex, FlexAllProps } from 'reflexy';
import type { Theme } from '../theme';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    ...theme.rc?.HighlightedText?.root,
  },
}));

// export interface HighlightedTextProps extends React.HTMLAttributes<HTMLSpanElement> {
//   ignoreCase?: boolean;
//   children?: string | string[];
//   highlight?: string;
// }

export type HighlightedTextProps<C extends React.ElementType = 'span'> = {
  ignoreCase?: boolean;
  children?: string | string[];
  highlight?: string;
} & FlexAllProps<C>;

function isHighlightPart(part: string, highlight: string, ignoreCase: boolean): boolean {
  return ignoreCase ? part.toLowerCase() === highlight.toLowerCase() : part === highlight;
}

function normalizeArray<T>(array: T | T[] | undefined): typeof array {
  return Array.isArray(array) && array.length === 0 ? undefined : array;
}

export default function HighlightedText<C extends React.ElementType = 'span'>({
  highlight,
  children: text,
  ignoreCase = true,
  className,
  ...rest
}: HighlightedTextProps<C>): JSX.Element {
  const css = useStyles({ classes: { root: className } });

  const content = useMemo(() => {
    if (!highlight || !text) return text;

    const parts = (Array.isArray(text) ? text.join('') : text)
      .split(new RegExp(`(${highlight})`, `g${ignoreCase ? 'i' : ''}`))
      .filter((p) => !!p);

    if (parts.length === 1) {
      return isHighlightPart(parts[0], highlight, ignoreCase) ? (
        <mark>{parts[0]}</mark>
      ) : (
        normalizeArray(parts)
      );
    }

    return normalizeArray(
      parts.map((part, i) => {
        const key = `${highlight}${part}${i}`;
        if (isHighlightPart(part, highlight, ignoreCase)) return <mark key={key}>{part}</mark>;
        // return <span key={key}>{part}</span>;
        return part;
      })
    );
  }, [highlight, ignoreCase, text]);

  return (
    <Flex component="span" flex={false} className={css.root} {...rest}>
      {content}
    </Flex>
  );
}
