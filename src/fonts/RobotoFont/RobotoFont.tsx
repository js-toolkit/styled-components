import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles({
  '@global': {
    '@font-face': [
      /* cyrillic-ext */
      {
        fontFamily: 'Roboto',
        fontStyle: 'italic',
        fontWeight: 300,
        fontDisplay: 'swap',
        src: "local('Roboto Light Italic'), local('Roboto-LightItalic'), url(https://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TjASc3CsTKlA.woff2) format('woff2')",
        unicodeRange: 'U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F',
      },
      /* cyrillic */
      {
        fontFamily: 'Roboto',
        fontStyle: 'italic',
        fontWeight: 300,
        fontDisplay: 'swap',
        src: "local('Roboto Light Italic'), local('Roboto-LightItalic'), url(https://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TjASc-CsTKlA.woff2) format('woff2')",
        unicodeRange: 'U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116',
      },
      /* latin-ext */
      {
        fontFamily: 'Roboto',
        fontStyle: 'italic',
        fontWeight: 300,
        fontDisplay: 'swap',
        src: "local('Roboto Light Italic'), local('Roboto-LightItalic'), url(https://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TjASc0CsTKlA.woff2) format('woff2')",
        unicodeRange:
          'U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF',
      },
      /* latin */
      {
        fontFamily: 'Roboto',
        fontStyle: 'italic',
        fontWeight: 300,
        fontDisplay: 'swap',
        src: "local('Roboto Light Italic'), local('Roboto-LightItalic'), url(https://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TjASc6CsQ.woff2) format('woff2')",
        unicodeRange:
          'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
      },
      /* cyrillic-ext */
      {
        fontFamily: 'Roboto',
        fontStyle: 'italic',
        fontWeight: 400,
        fontDisplay: 'swap',
        src: "local('Roboto Italic'), local('Roboto-Italic'), url(https://fonts.gstatic.com/s/roboto/v20/KFOkCnqEu92Fr1Mu51xFIzIFKw.woff2) format('woff2')",
        unicodeRange: 'U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F',
      },
      /* cyrillic */
      {
        fontFamily: 'Roboto',
        fontStyle: 'italic',
        fontWeight: 400,
        fontDisplay: 'swap',
        src: "local('Roboto Italic'), local('Roboto-Italic'), url(https://fonts.gstatic.com/s/roboto/v20/KFOkCnqEu92Fr1Mu51xMIzIFKw.woff2) format('woff2')",
        unicodeRange: 'U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116',
      },
      /* latin-ext */
      {
        fontFamily: 'Roboto',
        fontStyle: 'italic',
        fontWeight: 400,
        fontDisplay: 'swap',
        src: "local('Roboto Italic'), local('Roboto-Italic'), url(https://fonts.gstatic.com/s/roboto/v20/KFOkCnqEu92Fr1Mu51xGIzIFKw.woff2) format('woff2')",
        unicodeRange:
          'U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF',
      },
      /* latin */
      {
        fontFamily: 'Roboto',
        fontStyle: 'italic',
        fontWeight: 400,
        fontDisplay: 'swap',
        src: "local('Roboto Italic'), local('Roboto-Italic'), url(https://fonts.gstatic.com/s/roboto/v20/KFOkCnqEu92Fr1Mu51xIIzI.woff2) format('woff2')",
        unicodeRange:
          'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
      },
      /* cyrillic-ext */
      {
        fontFamily: 'Roboto',
        fontStyle: 'italic',
        fontWeight: 500,
        fontDisplay: 'swap',
        src: "local('Roboto Medium Italic'), local('Roboto-MediumItalic'), url(https://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51S7ACc3CsTKlA.woff2) format('woff2')",
        unicodeRange: 'U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F',
      },
      /* cyrillic */
      {
        fontFamily: 'Roboto',
        fontStyle: 'italic',
        fontWeight: 500,
        fontDisplay: 'swap',
        src: "local('Roboto Medium Italic'), local('Roboto-MediumItalic'), url(https://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51S7ACc-CsTKlA.woff2) format('woff2')",
        unicodeRange: 'U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116',
      },
      /* latin-ext */
      {
        fontFamily: 'Roboto',
        fontStyle: 'italic',
        fontWeight: 500,
        fontDisplay: 'swap',
        src: "local('Roboto Medium Italic'), local('Roboto-MediumItalic'), url(https://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51S7ACc0CsTKlA.woff2) format('woff2')",
        unicodeRange:
          'U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF',
      },
      /* latin */
      {
        fontFamily: 'Roboto',
        fontStyle: 'italic',
        fontWeight: 500,
        fontDisplay: 'swap',
        src: "local('Roboto Medium Italic'), local('Roboto-MediumItalic'), url(https://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51S7ACc6CsQ.woff2) format('woff2')",
        unicodeRange:
          'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
      },
      /* cyrillic-ext */
      {
        fontFamily: 'Roboto',
        fontStyle: 'italic',
        fontWeight: 700,
        fontDisplay: 'swap',
        src: "local('Roboto Bold Italic'), local('Roboto-BoldItalic'), url(https://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TzBic3CsTKlA.woff2) format('woff2')",
        unicodeRange: 'U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F',
      },
      /* cyrillic */
      {
        fontFamily: 'Roboto',
        fontStyle: 'italic',
        fontWeight: 700,
        fontDisplay: 'swap',
        src: "local('Roboto Bold Italic'), local('Roboto-BoldItalic'), url(https://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TzBic-CsTKlA.woff2) format('woff2')",
        unicodeRange: 'U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116',
      },
      /* latin-ext */
      {
        fontFamily: 'Roboto',
        fontStyle: 'italic',
        fontWeight: 700,
        fontDisplay: 'swap',
        src: "local('Roboto Bold Italic'), local('Roboto-BoldItalic'), url(https://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TzBic0CsTKlA.woff2) format('woff2')",
        unicodeRange:
          'U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF',
      },
      /* latin */
      {
        fontFamily: 'Roboto',
        fontStyle: 'italic',
        fontWeight: 700,
        fontDisplay: 'swap',
        src: "local('Roboto Bold Italic'), local('Roboto-BoldItalic'), url(https://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TzBic6CsQ.woff2) format('woff2')",
        unicodeRange:
          'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
      },
      /* cyrillic-ext */
      {
        fontFamily: 'Roboto',
        fontStyle: 'italic',
        fontWeight: 900,
        fontDisplay: 'swap',
        src: "local('Roboto Black Italic'), local('Roboto-BlackItalic'), url(https://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TLBCc3CsTKlA.woff2) format('woff2')",
        unicodeRange: 'U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F',
      },
      /* cyrillic */
      {
        fontFamily: 'Roboto',
        fontStyle: 'italic',
        fontWeight: 900,
        fontDisplay: 'swap',
        src: "local('Roboto Black Italic'), local('Roboto-BlackItalic'), url(https://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TLBCc-CsTKlA.woff2) format('woff2')",
        unicodeRange: 'U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116',
      },
      /* latin-ext */
      {
        fontFamily: 'Roboto',
        fontStyle: 'italic',
        fontWeight: 900,
        fontDisplay: 'swap',
        src: "local('Roboto Black Italic'), local('Roboto-BlackItalic'), url(https://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TLBCc0CsTKlA.woff2) format('woff2')",
        unicodeRange:
          'U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF',
      },
      /* latin */
      {
        fontFamily: 'Roboto',
        fontStyle: 'italic',
        fontWeight: 900,
        fontDisplay: 'swap',
        src: "local('Roboto Black Italic'), local('Roboto-BlackItalic'), url(https://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TLBCc6CsQ.woff2) format('woff2')",
        unicodeRange:
          'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
      },
      /* cyrillic-ext */
      {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 300,
        fontDisplay: 'swap',
        src: "local('Roboto Light'), local('Roboto-Light'), url(https://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmSU5fCRc4EsA.woff2) format('woff2')",
        unicodeRange: 'U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F',
      },
      /* cyrillic */
      {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 300,
        fontDisplay: 'swap',
        src: "local('Roboto Light'), local('Roboto-Light'), url(https://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmSU5fABc4EsA.woff2) format('woff2')",
        unicodeRange: 'U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116',
      },
      /* latin-ext */
      {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 300,
        fontDisplay: 'swap',
        src: "local('Roboto Light'), local('Roboto-Light'), url(https://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmSU5fChc4EsA.woff2) format('woff2')",
        unicodeRange:
          'U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF',
      },
      /* latin */
      {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 300,
        fontDisplay: 'swap',
        src: "local('Roboto Light'), local('Roboto-Light'), url(https://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmSU5fBBc4.woff2) format('woff2')",
        unicodeRange:
          'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
      },
      /* cyrillic-ext */
      {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 400,
        fontDisplay: 'swap',
        src: "local('Roboto'), local('Roboto-Regular'), url(https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu72xKOzY.woff2) format('woff2')",
        unicodeRange: 'U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F',
      },
      /* cyrillic */
      {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 400,
        fontDisplay: 'swap',
        src: "local('Roboto'), local('Roboto-Regular'), url(https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu5mxKOzY.woff2) format('woff2')",
        unicodeRange: 'U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116',
      },
      /* latin-ext */
      {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 400,
        fontDisplay: 'swap',
        src: "local('Roboto'), local('Roboto-Regular'), url(https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu7GxKOzY.woff2) format('woff2')",
        unicodeRange:
          'U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF',
      },
      /* latin */
      {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 400,
        fontDisplay: 'swap',
        src: "local('Roboto'), local('Roboto-Regular'), url(https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxK.woff2) format('woff2')",
        unicodeRange:
          'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
      },
      /* cyrillic-ext */
      {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 500,
        fontDisplay: 'swap',
        src: "local('Roboto Medium'), local('Roboto-Medium'), url(https://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmEU9fCRc4EsA.woff2) format('woff2')",
        unicodeRange: 'U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F',
      },
      /* cyrillic */
      {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 500,
        fontDisplay: 'swap',
        src: "local('Roboto Medium'), local('Roboto-Medium'), url(https://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmEU9fABc4EsA.woff2) format('woff2')",
        unicodeRange: 'U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116',
      },
      /* latin-ext */
      {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 500,
        fontDisplay: 'swap',
        src: "local('Roboto Medium'), local('Roboto-Medium'), url(https://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmEU9fChc4EsA.woff2) format('woff2')",
        unicodeRange:
          'U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF',
      },
      /* latin */
      {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 500,
        fontDisplay: 'swap',
        src: "local('Roboto Medium'), local('Roboto-Medium'), url(https://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmEU9fBBc4.woff2) format('woff2')",
        unicodeRange:
          'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
      },
      /* cyrillic-ext */
      {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 700,
        fontDisplay: 'swap',
        src: "local('Roboto Bold'), local('Roboto-Bold'), url(https://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmWUlfCRc4EsA.woff2) format('woff2')",
        unicodeRange: 'U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F',
      },
      /* cyrillic */
      {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 700,
        fontDisplay: 'swap',
        src: "local('Roboto Bold'), local('Roboto-Bold'), url(https://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmWUlfABc4EsA.woff2) format('woff2')",
        unicodeRange: 'U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116',
      },
      /* latin-ext */
      {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 700,
        fontDisplay: 'swap',
        src: "local('Roboto Bold'), local('Roboto-Bold'), url(https://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmWUlfChc4EsA.woff2) format('woff2')",
        unicodeRange:
          'U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF',
      },
      /* latin */
      {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 700,
        fontDisplay: 'swap',
        src: "local('Roboto Bold'), local('Roboto-Bold'), url(https://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmWUlfBBc4.woff2) format('woff2')",
        unicodeRange:
          'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
      },
      /* cyrillic-ext */
      {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 900,
        fontDisplay: 'swap',
        src: "local('Roboto Black'), local('Roboto-Black'), url(https://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmYUtfCRc4EsA.woff2) format('woff2')",
        unicodeRange: 'U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F',
      },
      /* cyrillic */
      {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 900,
        fontDisplay: 'swap',
        src: "local('Roboto Black'), local('Roboto-Black'), url(https://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmYUtfABc4EsA.woff2) format('woff2')",
        unicodeRange: 'U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116',
      },
      /* latin-ext */
      {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 900,
        fontDisplay: 'swap',
        src: "local('Roboto Black'), local('Roboto-Black'), url(https://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmYUtfChc4EsA.woff2) format('woff2')",
        unicodeRange:
          'U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF',
      },
      /* latin */
      {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 900,
        fontDisplay: 'swap',
        src: "local('Roboto Black'), local('Roboto-Black'), url(https://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmYUtfBBc4.woff2) format('woff2')",
        unicodeRange:
          'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
      },
    ],
  },
});

export default function RobotoFont(): null {
  useStyles();
  return null;
}
