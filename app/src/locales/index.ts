import en from "@/locales/translations/en.json";
import it from "@/locales/translations/it.json";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";

export const LocalesInit = () => {
  i18next.use(initReactI18next).init({
    compatibilityJSON: "v3",
    // lng: 'it',

    resources: {
      en: {
        translation: en,
      },
      it: {
        translation: it,
      },
    },

    detection: {
      order: ["navigator", "querystring", "localStorage"], // change the order when will have a language switcher
      lookupQuerystring: "lng",
    },

    returnNull: false,

    fallbackLng: "en",
    missingKeyNoValueFallbackToKey: true,
    returnEmptyString: false,

    keySeparator: "\\s\\",
    nsSeparator: "\\ns\\",

    interpolation: {
      escapeValue: false,
    },
  });
};

export default LocalesInit;
