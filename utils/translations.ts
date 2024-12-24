import { I18n } from 'i18n-js';
import { getLocales } from 'expo-localization'
import en from '../assets/translations/en';
import es from '../assets/translations/es';

const i18n = new I18n({
    en: en,
    es: es,

    lng: 'es',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
});

console.log('english', en)
console.log('español', es)

i18n.enableFallback = true;
i18n.locale = /*getLocales()[0].languageCode ||*/ 'es';

export default i18n;
