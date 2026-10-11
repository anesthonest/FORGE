
'use server';

import { ai } from '@/ai/genkit';
import { forgeGenerate, withAutonomousFallback } from '../core/model-router';
import { safeParseJSON } from '../core/self-healing-engine';

export interface EnterpriseSalesInput {
  companyDescription: string;
  currentCloudSpend?: number;
}

export interface EnterpriseSalesOutput {
  opportunity_id: string;
  proposal_title: string;
  roi_summary: {
    cost_reduction: string;
    efficiency_boost: string;
    payback_period: string;
  };
  suggested_package: {
    tier: 'Standard' | 'Enterprise' | 'Sovereign';
    monthly_price: string;
    features: string[];
  };
  legal_manifest_summary: string;
}

export async function generateEnterpriseProposal(input: EnterpriseSalesInput): Promise<EnterpriseSalesOutput> {
  return withAutonomousFallback('reasoning', async (model) => {
    const response = await forgeGenerate(model, `Analyze the company and generate a proposal: ${input.companyDescription}.
      Return ONLY valid JSON.`);

    const parsed = safeParseJSON<any>(response.text, {
      proposal_title: "Error Proposal",
      roi_summary: { cost_reduction: "0", efficiency_boost: "0", payback_period: "N/A" },
      suggested_package: { tier: "Standard", monthly_price: "0", features: [] },
      legal_manifest_summary: "Parsing failure"
    });

    return {
      ...parsed,
      opportunity_id: `opp-${Math.random().toString(36).substr(2, 9)}`,
    };
  });
}
