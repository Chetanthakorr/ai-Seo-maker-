import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ModuleType, AnalysisResult, GroundingSource } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to map module types to system prompts
const getSystemInstruction = (module: ModuleType): string => {
  const baseInstruction = `You are SEOMaster AI, an advanced SEO intelligence system. 
  Your output must be structured, professional, and actionable.
  Always respond in this exact Markdown format:
  
  ## 🔍 Overview of Analysis
  [Short professional summary]
  
  ## 📊 Key Findings
  * [Insight 1]
  * [Insight 2]
  
  ## 📈 Detailed Analysis
  [Deep dive based on the module]
  
  ## 🛠 Action Plan
  1. [Step 1]
  2. [Step 2]
  
  ## ✨ AI-Generated Assets
  [Code snippets, titles, meta descriptions, or outlines]
  
  ## 🎯 Final Recommendation
  [Conclusion]
  
  Use emojis appropriately as headers. Keep tone professional, data-driven, yet beginner-friendly.`;

  switch (module) {
    case ModuleType.CONTENT_GAP:
      return `${baseInstruction}\nFocus on: Content gaps, keyword comparison, missed ranking opportunities, and SEO-optimized titles/outlines.`;
    case ModuleType.TECHNICAL_AUDIT:
      return `${baseInstruction}\nFocus on: Metadata, headings, internal links, page speed estimates, schema, and readability. Provide a Health Score (0-100) at the start of Detailed Analysis.`;
    case ModuleType.SERP_PLANNER:
      return `${baseInstruction}\nFocus on: 3-6 month strategy, monthly goals, weekly tasks, pillar/cluster pages, and social amplification.`;
    case ModuleType.KEYWORD_CLUSTER:
      return `${baseInstruction}\nFocus on: Expanding keyword lists, grouping by intent, ranking difficulty, and internal linking structure.`;
    case ModuleType.LOCAL_SEO:
      return `${baseInstruction}\nFocus on: Local keywords, GMB optimization, NAP consistency, and city-specific competitor analysis.`;
    case ModuleType.COMPETITOR_ANALYSIS:
      return `${baseInstruction}\nFocus on: Competitor content strategy, meta structure, semantic keywords, backlinks, and weaknesses to exploit.`;
    default:
      return baseInstruction;
  }
};

const getModelForModule = (module: ModuleType): string => {
  // Use gemini-3-pro-preview for deep reasoning and search capabilities
  return 'gemini-3-pro-preview';
};

export const runAnalysis = async (
  module: ModuleType,
  inputs: Record<string, string>,
  onStream: (text: string) => void
): Promise<AnalysisResult> => {
  const modelId = getModelForModule(module);
  const systemInstruction = getSystemInstruction(module);
  
  // Construct the user prompt based on inputs
  let prompt = "";
  switch (module) {
    case ModuleType.CONTENT_GAP:
      prompt = `Analyze content gap. My URL: ${inputs.myUrl}. Competitor URL: ${inputs.competitorUrl}.`;
      break;
    case ModuleType.TECHNICAL_AUDIT:
      prompt = `Perform a technical SEO audit for: ${inputs.url || inputs.content}. If it is a URL, use Google Search to find public technical details.`;
      break;
    case ModuleType.SERP_PLANNER:
      prompt = `Create a SERP domination plan for niche/goal: ${inputs.goal}.`;
      break;
    case ModuleType.KEYWORD_CLUSTER:
      prompt = `Generate keyword clusters for topic: ${inputs.topic}.`;
      break;
    case ModuleType.LOCAL_SEO:
      prompt = `Boost Local SEO for Business: ${inputs.businessType} in City: ${inputs.city}.`;
      break;
    case ModuleType.COMPETITOR_ANALYSIS:
      prompt = `Reverse engineer competitor: ${inputs.competitorUrl}.`;
      break;
  }

  try {
    // Configure tools: Google Search is essential for URL analysis
    const tools = [
      { googleSearch: {} }
    ];

    const responseStream = await ai.models.generateContentStream({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction,
        tools,
        thinkingConfig: { thinkingBudget: 1024 } // Enable some thinking for complex SEO logic
      }
    });

    let fullText = "";
    let groundingSources: GroundingSource[] = [];

    for await (const chunk of responseStream) {
      const c = chunk as GenerateContentResponse;
      
      // Accumulate text
      if (c.text) {
        fullText += c.text;
        onStream(fullText);
      }
      
      // Extract grounding metadata if present (Search URLs)
      if (c.candidates?.[0]?.groundingMetadata?.groundingChunks) {
        const chunks = c.candidates[0].groundingMetadata.groundingChunks;
        chunks.forEach((gc: any) => {
          if (gc.web?.uri && gc.web?.title) {
            groundingSources.push({
              title: gc.web.title,
              uri: gc.web.uri
            });
          }
        });
      }
    }

    // Deduplicate sources
    const uniqueSources = Array.from(new Map(groundingSources.map(s => [s.uri, s])).values());

    return {
      markdown: fullText,
      groundingSources: uniqueSources
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate analysis. Please try again.");
  }
};
