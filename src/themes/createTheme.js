const defaultColors = {
  // grey scale
  white: "#ffffff",
  grey: "#F2F2F2",
  black: "#1A1A1A",

  // brand
  primary: "#1A1FDF",
  secondary: "#F79900",
};

const defaultBreakpoints = [
  "414px",
  "576px",
  "768px",
  "1024px",
  "1440px",
  "1920px",
];

defaultBreakpoints.base = defaultBreakpoints[0];
defaultBreakpoints.mobile = defaultBreakpoints[1];
defaultBreakpoints.tablet = defaultBreakpoints[2];
defaultBreakpoints.web = defaultBreakpoints[3];
defaultBreakpoints.hd = defaultBreakpoints[4];
defaultBreakpoints.fullhd = defaultBreakpoints[5];

const defaultBorderRadius = [0, 8, 16, 24, 28, 99999999];
defaultBorderRadius.none = defaultBorderRadius[0];
defaultBorderRadius.sm = defaultBorderRadius[1];
defaultBorderRadius.md = defaultBorderRadius[2];
defaultBorderRadius.lg = defaultBorderRadius[3];
defaultBorderRadius.xl = defaultBorderRadius[4];
defaultBorderRadius.full = defaultBorderRadius[5];

const defaultFonts = {
  default: "'Roboto', sans-serif",
};

const defaultFontWeights = [300, 500, 700, 900];
defaultFontWeights.regular = defaultFontWeights[0];
defaultFontWeights.medium = defaultFontWeights[1];
defaultFontWeights.bold = defaultFontWeights[2];

const defaultSpace = [
  0,
  2,
  4,
  6,
  8,
  10,
  12,
  14,
  16,
  18,
  20,
  22,
  24,
  26,
  28,
  30,
  32,
  40,
  54,
  64,
  128,
  144,
  256,
];

const defaultShadows = [
  "none",
  "0px 2px 4px rgba(0, 0, 0, 0.1)",
  "0px 4px 8px rgba(0, 0, 0, 0.1)",
  "0px 8px 16px rgba(0, 0, 0, 0.1)",
  "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
  "0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)",
  "0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)",
  "0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)",
  "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)",
  "0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)",
  "0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)",
  "0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)",
  "0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)",
  "0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)",
  "0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)",
  "0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)",
  "0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)",
  "0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)",
  "0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)",
  "0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)",
  "0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)",
  "0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)",
  "0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)",
  "0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)",
  "0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)",
];

export const createTheme = ({
  name = "default",
  icons = {},
  assets = {},
  colors = defaultColors,
  breakpoints = defaultBreakpoints,
  borderRadius = defaultBorderRadius,
  fonts = defaultFonts,
  fontSizes = {},
  lineHeightScale = 4,
  fontWeights = defaultFontWeights,
  space = defaultSpace,
  shadows = defaultShadows,
  zIndices = {},
  ...rest
}) => {
  // merge colors with base colors
  colors = {
    ...defaultColors,
    ...colors,
  };

  const mediaQueries = Object.entries(breakpoints).reduce(
    (prev, [key, val]) => ({
      up: {
        ...prev.up,
        [key]: `@media screen and (min-width: ${val})`,
      },
      down: {
        ...prev.down,
        [key]: `@media screen and (max-width: ${val})`,
      },
    }),
    {
      up: {},
      down: {},
    }
  );

  return {
    // theme name,
    name,

    // icons
    icons,

    // theme assets
    assets,

    // colors
    colors,

    // font family
    fonts,

    // font size
    fontSizes,

    // line height scale
    lineHeightScale,

    // font weight
    fontWeights,

    // margin and padding
    space,

    // media querys
    breakpoints,

    // border radius
    borderRadius,

    // shadows
    shadows,

    // mediaQueries
    mediaQueries,

    // other theme props
    ...rest,
  };
};
