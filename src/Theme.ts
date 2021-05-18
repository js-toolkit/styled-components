import type { BaseCSSProperties } from '@material-ui/styles/withStyles';
import type { FlexComponentProps } from 'reflexy';
import type { SvgSpriteIconProps } from './SvgSpriteIcon';
import type { MenuListItemProps } from './Menu/MenuListItem';
import type { ButtonColor, ButtonSize, ButtonVariant } from './Button';

export interface CSSPropertiesDeep extends BaseCSSProperties {
  [k: string]: any | CSSPropertiesDeep;
}

export type BaseCreateCSSProperties = {
  [P in keyof BaseCSSProperties]: BaseCSSProperties[P];
};

export interface CreateCSSProperties extends BaseCreateCSSProperties {
  // Allow pseudo selectors and media queries
  [k: string]: BaseCreateCSSProperties[keyof BaseCreateCSSProperties] | CreateCSSProperties;
}

export type CSSProperties = CSSPropertiesDeep | CreateCSSProperties;

export type ButtonThemeSizes = {
  [P in ButtonSize as P extends 'contain'
    ? `size${Capitalize<P>}`
    : `size${Uppercase<P>}`]?: CSSProperties;
};

export default interface Theme {
  rc?: {
    colors?: {
      error?: string;
    };

    Badge?: {
      BadgeIcon?: CSSProperties;
    };

    Divider?: CSSProperties & { light?: CSSProperties };

    DropDown?: {
      root?: CSSProperties;
    };

    DropDownLabel?: {
      root?: CSSProperties;
    };

    DropDownBox?: {
      root?: CSSProperties;
    };

    Modal?: {
      root?: CSSProperties;
      overlay?: CSSProperties;

      Header?: CSSProperties & { closeIcon?: CSSProperties };
      Content?: CSSProperties;
      Footer?: CSSProperties;

      widthXS?: string | number;
      widthS?: string | number;
      widthM?: string | number;
      widthL?: string | number;
    };

    LoadableFlex?: {
      root?: CSSProperties;
      backdrop?: CSSProperties;

      spinner?: CSSProperties;
      spinnerSizeAuto?: CSSProperties;
      spinnerSizeXS?: CSSProperties;
      spinnerSizeS?: CSSProperties;
      spinnerSizeM?: CSSProperties;
      spinnerSizeL?: CSSProperties;
      spinnerSizeXL?: CSSProperties;
      spinnerPositionCenter?: CSSProperties;
      spinnerPositionTop?: CSSProperties;
      spinnerPositionBottom?: CSSProperties;
      spinnerPositionLeft?: CSSProperties;
      spinnerPositionRight?: CSSProperties;

      ring?: CSSProperties;
    };

    Button?: ButtonThemeSizes & {
      root?: CSSProperties;
    } & { [P in ButtonColor]?: { [K in ButtonVariant]?: CSSProperties /* & ButtonThemeSizes */ } };

    LoadableButton?: {
      root?: CSSProperties;
      spinner?: CSSProperties;
    };

    Checkbox?: {
      root?: CSSProperties;
      shape?: CSSProperties;
      disabled?: CSSProperties;

      colors?: {
        hover?: string;
        checked?: string;
        unchecked?: string;
        empty?: string;
      };

      checkbox?: {
        root?: CSSProperties;
        shape?: CSSProperties;
        checked?: {
          root?: CSSProperties;
          shape?: CSSProperties;
        };
      };

      radio?: {
        root?: CSSProperties;
        shape?: CSSProperties;
        checked?: {
          root?: CSSProperties;
          shape?: CSSProperties;
        };
      };

      switch?: {
        root?: CSSProperties;
        shape?: CSSProperties;
        checked?: {
          root?: CSSProperties;
          shape?: CSSProperties;
        };
        duration?: string;
        indent?: string;
      };
    };

    Avatar?: {
      defaultSize?: number | string;
      root?: CSSProperties;
      noImg?: CSSProperties;
      img?: CSSProperties;
      fallbackImg?: CSSProperties;
    };

    HighlightedText?: {
      root?: CSSProperties;
    };

    Field?: {
      root?: CSSProperties;
      label?: CSSProperties;
      info?: CSSProperties;

      error?: {
        root?: CSSProperties;
        label?: CSSProperties;
        info?: CSSProperties;
      };
    };

    InputGroup?: {
      root?: CSSProperties;
      input?: CSSProperties;

      errorIcon?: CSSProperties & {
        size: 'string';
        indent: 'string';
      };

      error?: {
        root?: CSSProperties;
        input?: CSSProperties;
      };

      DropDownLabel?: CSSProperties;
      DropDownBox?: CSSProperties;
    };

    VideoWatermark?: {
      default?: CSSProperties;
      random?: CSSProperties;
    };

    SvgSpriteIcon?: {
      spriteId?: string;
      defaultSize?: number | string;
    };

    MenuList?: {
      header?: {
        flex?: FlexComponentProps;
        backIcon?: Pick<SvgSpriteIconProps<string>, 'name' | 'size'>;
        closeIcon?: Pick<SvgSpriteIconProps<string>, 'name' | 'size'>;
        title?: {
          root?: CSSProperties;
          flex?: FlexComponentProps | ((options: { hasIcon: boolean }) => FlexComponentProps);
        };
        action?: {
          root?: CSSProperties;
          flex?: FlexComponentProps;
        };
      };
      list?: {
        flex?: FlexComponentProps | ((options: { hasHeader: boolean }) => FlexComponentProps);
      };
    };

    MenuListItem?: {
      root?: CSSProperties;
      hover?: CSSProperties;
      flex?: FlexComponentProps | ((options: { hasIcon: boolean }) => FlexComponentProps);
      title?: {
        root?: CSSProperties;
        flex?:
          | FlexComponentProps
          | ((
              options: { hasIcon: boolean } & Pick<MenuListItemProps<string, string>, 'shrinkTitle'>
            ) => FlexComponentProps);
      };
      subtitle?: {
        root?: CSSProperties;
        flex?:
          | FlexComponentProps
          | ((
              options: Pick<MenuListItemProps<string, string>, 'shrinkTitle'>
            ) => FlexComponentProps);
      };
      checkIcon?: Pick<SvgSpriteIconProps<string>, 'name' | 'size'>;
      submenuIcon?: Pick<SvgSpriteIconProps<string>, 'name' | 'size'>;
    };
  };
}
