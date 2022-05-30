import React, { useMemo } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Flex, FlexAllProps } from 'reflexy';
import { escapeRegExp } from '@jstoolkit/utils/escapeRegExp';
import type { Theme } from '../theme';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    ...theme.rc?.HighlightedText?.root,
  },
}));

export type HighlightedTextProps<C extends React.ElementType = 'span'> = {
  ignoreCase?: boolean;
  children?: string | string[];
  highlight?: string;
  // onHighlight?: (parts: string[]) => void;
} & FlexAllProps<C>;

function isHighlightPart(part: string, highlight: string, ignoreCase: boolean): boolean {
  return ignoreCase ? part.toLowerCase() === highlight.toLowerCase() : part === highlight;
}

function normalizeArray<T>(array: T | T[] | undefined): T[] | undefined {
  return (Array.isArray(array) ? array.length > 0 && array : array != null && [array]) || undefined;
}

export default function HighlightedText<C extends React.ElementType = 'span'>({
  highlight,
  // onHighlight,
  children: text,
  ignoreCase = true,
  className,
  ...rest
}: HighlightedTextProps<C>): JSX.Element {
  const css = useStyles({ classes: { root: className } });

  const [content, _highlighted] = useMemo(() => {
    if (!highlight || !text) return [text, undefined];

    const parts = (Array.isArray(text) ? text.join('') : text)
      .split(new RegExp(`(${escapeRegExp(highlight)})`, `g${ignoreCase ? 'i' : ''}`))
      .filter((p) => !!p);

    // if (parts.length === 1) {
    //   return isHighlightPart(parts[0], highlight, ignoreCase) ? (
    //     <mark>{parts[0]}</mark>
    //   ) : (
    //     normalizeArray(parts)
    //   );
    // }

    const [nextParts, hParts] = parts.reduce(
      (acc, part, i) => {
        if (isHighlightPart(part, highlight, ignoreCase)) {
          const key = `${highlight}${part}${i}`;
          acc[0].push(<mark key={key}>{part}</mark>);
          acc[1].push(part);
        } else {
          acc[0].push(part);
        }
        return acc;
      },
      [[] as (JSX.Element | string)[], [] as string[]] as const
    );

    return [normalizeArray(nextParts), normalizeArray(hParts)] as const;
  }, [highlight, ignoreCase, text]);

  // useEffect(() => {
  //   highlighted && highlighted.length > 0 && onHighlight && onHighlight(highlighted);
  // }, [highlighted, onHighlight]);

  return (
    <Flex component="span" flex={false} className={css.root} {...rest}>
      {content}
    </Flex>
  );
}
