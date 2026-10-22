import fs from 'node:fs/promises';
export const locales = JSON.parse(await fs.readFile(new URL('./locale-config.json', import.meta.url), 'utf8'));
export const languages = locales.map(locale => locale.code);
export const translatedLocales = locales.filter(locale => locale.code !== 'en');
export const localeBootstrap = 'window.ALUX_LOCALES = ' + JSON.stringify(locales.map(({code,name}) => ({code,name}))) + ';\n';
