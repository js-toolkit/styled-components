import type { CSSObject } from '@mui/styled-engine';
import type { FlexAllProps, FlexOnlyProps, SpaceProps } from 'reflexy/styled';
import type { MenuListItemProps } from './Menu/MenuListItem';
import type { ButtonColor, ButtonSize, ButtonVariant } from './Button';
import type { ModalProps } from './Modal';
import type { NotificationPosition, NotificationVariant } from './Notifications';
import type { FieldState } from './Field';

export type CSSProperties = CSSObject;

export type ButtonThemeSizes = {
  [P in ButtonSize as `size-${P}`]?: CSSProperties | undefined;
};

export type ButtonThemeVariants = {
  [P in ButtonVariant as `variant-${P}`]?: CSSProperties | undefined;
};

type ButtonStyles = {
  root?: CSSProperties | undefined;
  hover?: CSSProperties | undefined;
  active?: CSSProperties | undefined;
};

export type ButtonTheme = ButtonThemeSizes &
  ButtonThemeVariants &
  ButtonStyles & {
    [P in ButtonColor]?: { [K in ButtonVariant]?: ButtonStyles | undefined } | undefined;
  };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IconComponentProps<C extends React.ElementType = any> = FlexAllProps<C> & {
  readonly size?: string | number | undefined;
  readonly width?: string | number | undefined;
  readonly height?: string | number | undefined;
};

export interface Theme {
  rc?: {
    colors?:
      | {
          error?: string | undefined;
        }
      | undefined;

    Badge?:
      | {
          BadgeIcon?: CSSProperties | undefined;
        }
      | undefined;

    Divider?:
      | { default?: CSSProperties | undefined; light?: CSSProperties | undefined }
      | undefined;

    DropDown?:
      | {
          root?: CSSProperties | undefined;
        }
      | undefined;

    DropDownLabel?:
      | {
          root?: CSSProperties | undefined;
        }
      | undefined;

    DropDownBox?:
      | {
          root?: CSSProperties | undefined;
        }
      | undefined;

    Modal?:
      | ({
          root?: CSSProperties | undefined;
          backdrop?: CSSProperties | undefined;

          Header?: (CSSProperties & { closeIcon?: CSSProperties | undefined }) | undefined;
          Body?: CSSProperties | undefined;
          Footer?: CSSProperties | undefined;
        } & {
          [P in NonNullable<ModalProps['size']> as `size-${P}`]?: CSSProperties | undefined;
        })
      | undefined;

    LoadableFlex?: {
      root?: CSSProperties | undefined;
      backdrop?: CSSProperties | undefined;

      spinner?: CSSProperties | undefined;
      spinnerSizeAuto?: CSSProperties | undefined;
      spinnerSizeXS?: CSSProperties | undefined;
      spinnerSizeS?: CSSProperties | undefined;
      spinnerSizeM?: CSSProperties | undefined;
      spinnerSizeL?: CSSProperties | undefined;
      spinnerSizeXL?: CSSProperties | undefined;
      spinnerPositionCenter?: CSSProperties | undefined;
      spinnerPositionTop?: CSSProperties | undefined;
      spinnerPositionBottom?: CSSProperties | undefined;
      spinnerPositionLeft?: CSSProperties | undefined;
      spinnerPositionRight?: CSSProperties | undefined;

      ring?: CSSProperties | undefined;
    };

    Button?: ButtonTheme | undefined;

    LoadableButton?:
      | {
          root?: CSSProperties | undefined;
          spinner?: CSSProperties | undefined;
        }
      | undefined;

    Checkbox?: {
      root?: CSSProperties | undefined;
      disabled?: CSSProperties | undefined;
      shape?: (CSSProperties & { hover?: CSSProperties | undefined }) | undefined;

      colors?:
        | {
            hover?: string | undefined;
            checked?: string | undefined;
            unchecked?: string | undefined;
            empty?: string | undefined;
          }
        | undefined;

      checkbox?:
        | {
            root?: CSSProperties | undefined;
            shape?: (CSSProperties & { hover?: CSSProperties | undefined }) | undefined;
            checked?:
              | {
                  root?: CSSProperties | undefined;
                  shape?: CSSProperties | undefined;
                }
              | undefined;
          }
        | undefined;

      radio?:
        | {
            root?: CSSProperties | undefined;
            shape?: (CSSProperties & { hover?: CSSProperties | undefined }) | undefined;
            checked?:
              | {
                  root?: CSSProperties | undefined;
                  shape?: CSSProperties | undefined;
                }
              | undefined;
          }
        | undefined;

      switch?: {
        root?: CSSProperties | undefined;
        shape?: (CSSProperties & { hover?: CSSProperties | undefined }) | undefined;
        checked?:
          | {
              root?: CSSProperties | undefined;
              shape?: CSSProperties | undefined;
            }
          | undefined;
        duration?: string | undefined;
        indent?: string | undefined;
      };
    };

    Avatar?:
      | {
          defaultSize?: number | string | undefined;
          root?: CSSProperties | undefined;
          noImg?: CSSProperties | undefined;
          img?: CSSProperties | undefined;
          fallbackImg?: CSSProperties | undefined;
        }
      | undefined;

    HighlightedText?: {
      root?: CSSProperties | undefined;
    };

    TruncatedText?:
      | {
          root?: CSSProperties | undefined;
          multiline?: CSSProperties | undefined;
        }
      | undefined;

    Field?:
      | ({
          root?: CSSProperties | undefined;
          label?: CSSProperties | undefined;
          controls?: CSSProperties | undefined;
          helperText?: CSSProperties | undefined;
        } & {
          [P in FieldState]?:
            | Pick<
                NonNullable<NonNullable<Theme['rc']>['Field']>,
                'root' | 'label' | 'controls' | 'helperText'
              >
            | undefined;
        } & {
          [P in 'row' | 'column']?:
            | Pick<
                NonNullable<NonNullable<Theme['rc']>['Field']>,
                'root' | 'label' | 'controls' | 'helperText'
              >
            | undefined;
        })
      | undefined;

    InputGroup?:
      | ({
          root?: CSSProperties | undefined;
          input?: CSSProperties | undefined;

          errorIcon?:
            | (CSSProperties & {
                size: 'string';
                indent: 'string';
              })
            | undefined;

          error?:
            | {
                root?: CSSProperties | undefined;
                input?: CSSProperties | undefined;
              }
            | undefined;

          DropDownLabel?: CSSProperties | undefined;
          DropDownBox?: CSSProperties | undefined;
        } & {
          [P in FieldState]?:
            | Pick<
                NonNullable<NonNullable<Theme['rc']>['InputGroup']>,
                'root' | 'input' | 'DropDownLabel' | 'DropDownBox'
              >
            | undefined;
        })
      | undefined;

    SvgSpriteIcon?:
      | {
          spriteId?: string | undefined;
          defaultSize?: number | string | undefined;
        }
      | undefined;

    MenuList?: {
      root?: CSSProperties | undefined;
      header?:
        | {
            root?: CSSProperties | undefined;
            flex?: FlexOnlyProps | undefined;
            group?:
              | {
                  root?: CSSProperties | undefined;
                  flex?:
                    | FlexOnlyProps
                    | ((options: { hasIcon: boolean }) => FlexOnlyProps)
                    | undefined;
                }
              | undefined;
            backIcon?: IconComponentProps | undefined;
            closeIcon?: IconComponentProps | undefined;
            title?:
              | {
                  root?: CSSProperties | undefined;
                  flex?:
                    | FlexOnlyProps
                    | ((options: { hasIcon: boolean }) => FlexOnlyProps)
                    | undefined;
                }
              | undefined;
            action?:
              | {
                  root?: CSSProperties | undefined;
                  flex?: FlexOnlyProps | undefined;
                }
              | undefined;
          }
        | undefined;
      list?:
        | {
            flex?: FlexOnlyProps | ((options: { hasHeader: boolean }) => FlexOnlyProps) | undefined;
          }
        | undefined;
    };

    MenuListItem?: {
      root?: CSSProperties | undefined;
      hover?: CSSProperties | undefined;
      flex?:
        | FlexOnlyProps
        | ((options: { hasIcon: boolean; submenu: boolean; checked: boolean }) => FlexOnlyProps)
        | undefined;
      icon?: CSSProperties | undefined;
      title?:
        | {
            root?: CSSProperties | undefined;
            flex?:
              | FlexOnlyProps
              | ((
                  options: { hasIcon: boolean; submenu: boolean; checked: boolean } & Pick<
                    MenuListItemProps<string, never>,
                    'shrinkTitle'
                  >
                ) => FlexOnlyProps)
              | undefined;
          }
        | undefined;
      subtitle?:
        | {
            root?: CSSProperties | undefined;
            flex?:
              | FlexOnlyProps
              | ((
                  options: { hasIcon: boolean; submenu: boolean; checked: boolean } & Pick<
                    MenuListItemProps<string, never>,
                    'shrinkTitle'
                  >
                ) => FlexOnlyProps)
              | undefined;
          }
        | undefined;

      checkIcon?: IconComponentProps | undefined;
      submenuIcon?: IconComponentProps | undefined;
    };

    Tooltip?:
      | {
          style?: CSSProperties | undefined;
          title?: CSSProperties | undefined;
          text?: CSSProperties | undefined;
          arrowColor?: string | undefined;
          space?: SpaceProps | undefined;
          innerSpace?: SpaceProps | undefined;
        }
      | undefined;

    Notifications?:
      | ({
          rootContainer?: CSSProperties | undefined;
          root?: CSSProperties | undefined;
          scrollingContainer?: CSSProperties | undefined;
          item?: CSSProperties | undefined;
          itemSpace?: CSSProperties | undefined;
        } & {
          [P in NotificationPosition]?: Pick<
            NonNullable<NonNullable<Theme['rc']>['Notifications']>,
            'rootContainer' | 'root' | 'scrollingContainer' | 'item' | 'itemSpace'
          >;
        })
      | undefined;

    NotificationBar?:
      | ({
          root?: CSSProperties | undefined;
          content?: CSSProperties | undefined;
          action?: CSSProperties | undefined;
        } & {
          [P in NotificationVariant]?: {
            root?: CSSProperties | undefined;
            content?: CSSProperties | undefined;
            action?: CSSProperties | undefined;
          };
        })
      | undefined;
  };
}

type AppTheme = Theme;

declare module '@mui/system/createTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-shadow
  export interface Theme extends AppTheme {}
}
