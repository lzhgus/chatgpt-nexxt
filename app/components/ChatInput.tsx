'use client'

import { db } from "@/firebase";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid"
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

type Props = {
    chatId: string
}

function ChatInput({ chatId }: Props) {
    const [prompt, setPrompt] = useState("");
    const { data: session } = useSession();

    // useSWR to get model
    const model = "gpt-3.5-turbo"

    const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!prompt) return;

        const input = prompt.trim();
        setPrompt("");

        const message: Message = {
            text: input,
            createdAt: serverTimestamp(),
            user: {
                _id: session?.user?.email!,
                name: session?.user?.name!,
                avatar: session?.user?.image! || `https://ui-avatars.com/api/?name=${session?.user?.name!}`
            }
        }

        await addDoc(collection(db, 'users', session?.user?.email!, 'chats', chatId, 'messages'), message);

        // Toast notification 
        const notification = toast.loading("ChatGPT is thinking...");

        await fetch("/api/askQuestion", {
            //API hits this endpoint that we created (//Explanation continued in askQuestions.ts)
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt: input,
                chatId,
                model,
                session,
            }),
        }).then(() => {
            //If the fetch was successful
            //Toast notification to say successful
            toast.success("ChatGPT has found an answer!", {
                id: notification,
            });
        });
    }

    return (
        <div className="bg-gray-700/50 text-gray-400 rounded-lg text-sm">
            <form onSubmit={sendMessage} className="p-5 space-x-5 flex">
                <input
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    type="text"
                    className="flex-1 focus:outline-none bg-transparent"
                    placeholder="Type your message here..."
                    disabled={!session}
                />

                <button
                    type="submit"
                    disabled={!prompt || !session}
                    className="bg-[#11A37F] px-4 py-2 text-white font-bold rounded hover:opacity-50 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    <PaperAirplaneIcon className="h-4 w-4 -rotate-45" />
                </button>
            </form>

            <div>
                { /* ModelSection */}
            </div>
        </div>
    )
}

export default ChatInput