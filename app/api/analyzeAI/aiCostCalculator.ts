import { OpenAI } from "openai";
import { CostInfo } from "@/app/types/types";

export const calculateCost = (completion: OpenAI.Chat.Completions.ChatCompletion & {
    _request_id?: string | null;
}): CostInfo => {

    const model = completion.model;

    const modelCosts = {
        "gpt-4o-2024-08-06": {
            input: 2.5,
            output: 10,
            cachedInput: 1.25
        },
        "gpt-4o-mini-2024-07-18": {
            input: 0.15,
            output: 0.60,
            cachedInput: 0.075
        },
        "gpt-3.5-turbo-0125": {
            input: 0.50,
            output: 1.50,
            cachedInput: 0
        }
    }
    const costPerMillionTokensInputInDollars = modelCosts[model]?.input || 0;
    const costPerMillionTokensOutputInDollars = modelCosts[model]?.output || 0;
    const costPerMillionTokensCachedInputInDollars = modelCosts[model]?.cachedInput || 0;


    const promptTokens = completion.usage?.prompt_tokens || 0;
    const completionTokens = completion.usage?.completion_tokens || 0;
    const cachedPromptTokens = completion.usage?.prompt_tokens_details?.cached_tokens || 0;
    const reasoningTokens = completion.usage?.completion_tokens_details?.reasoning_tokens || 0;
    const totalTokens = promptTokens + completionTokens;

    const promptCost = +((totalTokens / 1000000) * costPerMillionTokensInputInDollars).toFixed(5);
    const completionCost = +((completionTokens / 1000000) * costPerMillionTokensOutputInDollars).toFixed(5);
    const cachedPromptCost = +((cachedPromptTokens / 1000000) * costPerMillionTokensCachedInputInDollars).toFixed(5);

    const totalCost = +(promptCost + completionCost + cachedPromptCost).toFixed(5);

    // console.log('Completion:', completion)


    const costInfo: CostInfo = {
        totalRequestCost: totalCost || 0,
        totalTokens: totalTokens || 0,
        promptTokens: promptTokens || 0,
        completionTokens: completionTokens || 0,
        cachedPromptTokens: cachedPromptTokens || 0,
        reasoningTokens: reasoningTokens || 0,
        promptCost: promptCost || 0,
        completionCost: completionCost || 0,
        cachedPromptCost: cachedPromptCost || 0
    };
    return costInfo;
};

