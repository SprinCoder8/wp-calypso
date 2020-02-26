// languages.ts

// giving a name might help comprehension
// I'm pretty sure that the `languages.js` file
// is autogenerated otherwise we could include
// the actual slugs for extra type safety - here
// it's really not needed or helpful though
type LanguageSlug = string;
type WPLocale = string;

type BaseLanguage = {
	langSlug: LanguageSlug;
	name: string;
	popular?: number;
	rtl?: boolean;
	territories: string[];
	value: number;
	wpLocale: WPLocale | '';
};

type SubLanguage = BaseLanguage & { parentLangSlug: string };

export type Language = BaseLanguage | SubLanguage;
