import React, { useMemo } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import type { Theme } from '../theme';

const useStyles = makeStyles((theme: Theme) => ({
  root: theme.rc?.HighlightedText?.root ?? {},
}));

export interface HighlightedTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  ignoreCase?: boolean;
  children: string | string[];
  highlight: string;
}

function isHighlightPart(part: string, highlight: string, ignoreCase: boolean): boolean {
  return ignoreCase ? part.toLowerCase() === highlight.toLowerCase() : part === highlight;
}

export default function HighlightedText({
  highlight,
  children: text,
  ignoreCase = true,
  className,
  ...rest
}: HighlightedTextProps): JSX.Element {
  const css = useStyles({ classes: { root: className } });

  const parts = useMemo(() => {
    if (!highlight) return [];
    return (Array.isArray(text) ? text.join('') : text)
      .split(new RegExp(`(${highlight})`, `g${ignoreCase ? 'i' : ''}`))
      .filter((p) => !!p);
  }, [highlight, ignoreCase, text]);

  // eslint-disable-next-line no-nested-ternary
  const content = !highlight
    ? text
    : parts.length === 1
    ? (isHighlightPart(parts[0], highlight, ignoreCase) && <mark>{parts[0]}</mark>) || parts
    : parts.map((part) => {
        if (isHighlightPart(part, highlight, ignoreCase)) return <mark key={part}>{part}</mark>;
        return <span key={part}>{part}</span>;
      });

  return (
    <span className={css.root} {...rest}>
      {content}
    </span>
  );
}
