import { generateListingDescription } from "../services/ai";

export async function generateListingDescriptionResolver(
  _: unknown,
  args: { category: string; conditionGrade: string; manifestSummary?: string }
) {
  return generateListingDescription({
    category: args.category,
    conditionGrade: args.conditionGrade,
    manifestSummary: args.manifestSummary,
  });
}
