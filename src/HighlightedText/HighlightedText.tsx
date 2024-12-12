import React, { useMemo } from 'react';
import styled from '@mui/system/styled';
import { Flex, type FlexAllProps } from 'reflexy/styled';
import { escapeRegExp } from '@js-toolkit/utils/escapeRegExp';

export type HighlightedTextProps<C extends React.ElementType = 'span'> = {
  ignoreCase?: boolean | undefined;
  children?: string | string[] | undefined;
  highlight?: string | undefined;
  // onHighlight?: (parts: string[]) => void;
} & FlexAllProps<C>;

function isHighlightPart(part: string, highlight: string, ignoreCase: boolean): boolean {
  return ignoreCase ? part.toLowerCase() === highlight.toLowerCase() : part === highlight;
}

function normalizeArray<T>(array: T | T[] | undefined): T[] | undefined {
  return (Array.isArray(array) ? array.length > 0 && array : array != null && [array]) || undefined;
}

function HighlightedText<C extends React.ElementType = 'span'>({
  highlight,
  // onHighlight,
  children: text,
  ignoreCase = true,
  ...rest
}: HighlightedTextProps<C>): React.JSX.Element {
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
      [[] as (React.JSX.Element | string)[], [] as string[]] as const
    );

    return [normalizeArray(nextParts), normalizeArray(hParts)] as const;
  }, [highlight, ignoreCase, text]);

  // useEffect(() => {
  //   highlighted && highlighted.length > 0 && onHighlight && onHighlight(highlighted);
  // }, [highlighted, onHighlight]);

  return (
    <Flex component="span" flex={false} {...(rest as FlexAllProps<'span'>)}>
      {content}
    </Flex>
  );
}

export default styled(HighlightedText)(({ theme: { rc } }) => ({
  ...rc?.HighlightedText?.root,
})) as typeof HighlightedText;
