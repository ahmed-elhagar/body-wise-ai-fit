
import { LanguageConfig, SupportedLanguage } from './types';

// Language configurations
export const getLanguageConfig = (language: SupportedLanguage): LanguageConfig => {
  const configs: Record<SupportedLanguage, LanguageConfig> = {
    'ar': {
      language: 'Arabic',
      isRTL: true,
      responseInstructions: 'Respond with all text content, names, instructions, and descriptions in Arabic. Use Arabic names for exercises, foods, and measurements.'
    },
    'en': {
      language: 'English',
      isRTL: false,
      responseInstructions: 'Respond with all text content in English.'
    }
  };
  
  return configs[language] || configs['en'];
};
