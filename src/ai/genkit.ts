import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * @fileOverview ForgeOS Genkit Configuration
 * 
 * Standardized for @genkit-ai/google-genai provider using the stable v1 API.
 * This configuration ensures maximum compatibility within Firebase Studio
 * by avoiding unstable v1beta endpoints which frequently cause 404 errors.
 */

export const ai = genkit({
  plugins: [
    googleAI({
      apiVersion: 'v1',
    }),
  ],
});
