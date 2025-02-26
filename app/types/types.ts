export interface CostInfo {
    totalRequestCost: number;
    totalTokens: number;
    promptTokens: number;
    completionTokens: number;
    cachedPromptTokens: number;
    reasoningTokens: number;
    promptCost: number;
    completionCost: number;
    cachedPromptCost: number;
}