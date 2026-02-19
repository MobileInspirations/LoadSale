/**
 * AI service - integrates Claude/GPT-4V for listing intelligence.
 * Set ANTHROPIC_API_KEY / OPENAI_API_KEY for production.
 */

export async function generateListingDescription(params: {
  category: string;
  conditionGrade: string;
  photoUrls?: string[];
  manifestSummary?: string;
}): Promise<{ title: string; description: string }> {
  if (process.env.ANTHROPIC_API_KEY) {
    // TODO: Call Claude API with vision for real generation
  }
  return {
    title: `Bulk load - ${params.category} (Grade ${params.conditionGrade})`,
    description: `Quality ${params.conditionGrade} bulk inventory in ${params.category}. ${params.manifestSummary ?? "Mixed assortment."} Listed on LoadDrop.`,
  };
}

export function computeQualityScore(params: {
  hasManifest: boolean;
  photoCount: number;
  descriptionLength: number;
}): number {
  let score = 50;
  if (params.hasManifest) score += 20;
  score += Math.min(params.photoCount * 3, 15);
  score += Math.min(Math.floor(params.descriptionLength / 50), 15);
  return Math.min(100, score);
}
