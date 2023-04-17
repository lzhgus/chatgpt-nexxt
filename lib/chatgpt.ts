import { NextRequest } from "next/server";
import { ChatCompletionRequestMessage, CreateChatCompletionRequest } from "openai";

export type Message = ChatCompletionRequestMessage & {
    streaming?: boolean;
}

export function createMessage(override: Partial<Message>): Message {
    return {
        role: "user",
        content: "",
        ...override,
    }
}

export type ChatRequest = CreateChatCompletionRequest;

export async function requestOpenAi(req: ChatRequest) {
    const apiKey = process.env.OPENAI_API_KEY;
    const path = "v1/chat/completions";
    console.log("req: ", `https://api.openai.com/${path}`);
    console.log("apiKey: ", apiKey);
    console.log(JSON.stringify(req));
    return fetch(`https://api.openai.com/${path}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
        method: "POST",
        body: JSON.stringify(req),
    });
}