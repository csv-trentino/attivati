module.exports = {
  // Change your rules accordingly to your coding style preferences.
  // https://prettier.io/docs/en/options.html
  semi: true,
  endOfLine: "lf",
  trailingComma: "all",
  singleQuote: false,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  importOrder: ["^react$", "<THIRD_PARTY_MODULES>", "^@(.*)$", "^[./]", "^[../]"],
  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
};
