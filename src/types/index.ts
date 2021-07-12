/*
 * todo: remove after fixed in original source
 */

declare module '@material-ui/styles/makeStyles' {
  import type { ClassNameMap, Styles, WithStylesOptions } from '@material-ui/styles/withStyles';
  import type { Omit } from '@material-ui/types';
  import type { DefaultTheme } from '@material-ui/styles/defaultTheme';

  export type MakeStylesHook<
    Props extends AnyObject = EmptyObject,
    ClassKey extends string = string
  > = keyof Props extends never
    ? (props?: { classes?: Partial<ClassNameMap<ClassKey>> }) => ClassNameMap<ClassKey>
    : (props: Props & { classes?: Partial<ClassNameMap<ClassKey>> }) => ClassNameMap<ClassKey>;

  /**
   * `makeStyles` where the passed `styles` do depend on props
   */
  export default function makeStyles<
    Theme = DefaultTheme,
    Props extends AnyObject = EmptyObject,
    ClassKey extends string = string
  >(
    styles: Styles<Theme, Props, ClassKey>,
    options?: Omit<WithStylesOptions<Theme>, 'withTheme'>
  ): MakeStylesHook<Props, ClassKey>;

  /**
   * `makeStyles` where the passed `styles` do not depend on props
   */
  export default function makeStyles<Theme = DefaultTheme, ClassKey extends string = string>(
    styles: Styles<Theme, EmptyObject, ClassKey>,
    options?: Omit<WithStylesOptions<Theme>, 'withTheme'>
  ): MakeStylesHook<EmptyObject, ClassKey>;
}

declare module '@material-ui/styles/styled' {
  // eslint-disable-next-line import/no-extraneous-dependencies
  import { Omit, Overwrite } from '@material-ui/types';
  import {
    CreateCSSProperties,
    StyledComponentProps,
    WithStylesOptions,
  } from '@material-ui/styles/withStyles';
  import * as React from 'react';
  import { DefaultTheme } from '@material-ui/styles/defaultTheme';

  export type StyledComponent<P extends AnyObject> = (props: P) => React.ReactElement<P> | null;

  export type ComponentCreator<Component extends React.ElementType> = <
    Theme = DefaultTheme,
    Props extends AnyObject = React.ComponentPropsWithoutRef<Component>
  >(
    styles:
      | CreateCSSProperties<Props>
      | ((props: { theme: Theme } & Props) => CreateCSSProperties<Props>),
    options?: WithStylesOptions<Theme>
  ) => StyledComponent<
    Omit<
      JSX.LibraryManagedAttributes<Component, React.ComponentProps<Component>>,
      'classes' | 'className'
    > &
      StyledComponentProps<'root'> &
      Overwrite<Props, { className?: string; theme?: Theme }>
  >;

  export interface StyledProps {
    className: string;
  }

  export default function styled<Component extends React.ElementType>(
    component: Component
  ): ComponentCreator<Component>;
}
