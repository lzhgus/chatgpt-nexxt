import { ChatRequest, Message, createMessage, requestOpenAi } from "@/lib/chatgpt";
import { NextResponse } from "next/server";
import { CreateChatCompletionResponse } from "openai";

export const makeRequest = async (prompt: string, model: string) => {
  const messages: Message[] = [createMessage({
    role: "user",
    content: prompt,
  })];
  const request: ChatRequest = {
    messages: messages,
    stream: false,
    model: model,
    temperature: 0.7,
    top_p: 1,
    max_tokens: 1000,
    frequency_penalty: 0,
    presence_penalty: 0,
  };

  try {
    const api = await requestOpenAi(request);
    const res = new NextResponse(api.body);

    res.headers.set("Content-Type", "application/json");
    res.headers.set("Cache-Control", "no-cache");
    const result = (await res.json()) as CreateChatCompletionResponse;
    return result?.choices?.at(0)?.message?.content ?? "";
  } catch (e) {
    console.error("[OpenAI] ", request, e);
    return `ChatGPT was unable to find an answer for that! (Error: ${JSON.stringify(e)})`
  }
};

export async function POST(prompt: string, model: string) {
  return makeRequest(prompt, model);
}
