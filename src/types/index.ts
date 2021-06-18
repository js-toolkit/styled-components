/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-duplicates */

// todo: remove after fixed in original source
declare module '@material-ui/styles/makeStyles' {
  import type { ClassNameMap, Styles, WithStylesOptions } from '@material-ui/styles/withStyles';
  import type { Omit } from '@material-ui/types';
  import type { DefaultTheme } from '@material-ui/styles/defaultTheme';

  export type MakeStylesHook<Props extends {} = {}, ClassKey extends string = string> =
    keyof Props extends never
      ? (props?: { classes?: Partial<ClassNameMap<ClassKey>> }) => ClassNameMap<ClassKey>
      : (props: Props & { classes?: Partial<ClassNameMap<ClassKey>> }) => ClassNameMap<ClassKey>;

  /**
   * `makeStyles` where the passed `styles` do depend on props
   */
  export default function makeStyles<
    Theme = DefaultTheme,
    Props extends {} = {},
    ClassKey extends string = string
  >(
    styles: Styles<Theme, Props, ClassKey>,
    options?: Omit<WithStylesOptions<Theme>, 'withTheme'>
  ): MakeStylesHook<Props, ClassKey>;

  /**
   * `makeStyles` where the passed `styles` do not depend on props
   */
  export default function makeStyles<Theme = DefaultTheme, ClassKey extends string = string>(
    styles: Styles<Theme, {}, ClassKey>,
    options?: Omit<WithStylesOptions<Theme>, 'withTheme'>
  ): MakeStylesHook<{}, ClassKey>;
}

// todo: remove after fixed in original source
declare module '@material-ui/styles/styled' {
  import { Omit, Overwrite } from '@material-ui/types';
  import {
    CreateCSSProperties,
    StyledComponentProps,
    WithStylesOptions,
  } from '@material-ui/styles/withStyles';
  import * as React from 'react';
  import { DefaultTheme } from '@material-ui/styles/defaultTheme';

  export type StyledComponent<P extends {}> = (props: P) => React.ReactElement<P, any> | null;

  /**
   * @internal
   */
  export type ComponentCreator<Component extends React.ElementType> = <
    Theme = DefaultTheme,
    Props extends {} = React.ComponentPropsWithoutRef<Component>
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
    Component: Component
  ): ComponentCreator<Component>;
}
