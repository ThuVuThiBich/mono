module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'tr', 'zh', 'zh-CN', 'zh-TW', 'ko'],
    localeDetection: false,
    react: {
      transEmptyNodeValue: '', // what to return for empty Trans
      transSupportBasicHtmlNodes: true, // allow <br/> and simple html elements in translations
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p', 'u', 'b'], // don't convert to <1></1> if simple react elements
      transWrapTextNodes: '', // Wrap text nodes in a user-specified element.
    },
  },
};
