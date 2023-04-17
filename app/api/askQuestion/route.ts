// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import admin from "firebase-admin";
import { POST } from "@/lib/queryApi";
import { adminDB } from "@/firebaseAdmin";
import { NextRequest } from "next/server";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase";

type Data = {
    answer: string;
};

async function handler(
    req: NextRequest,
) {
    const json = await req.json();
    const { prompt, session, chatId, model } = json;

    if (!prompt) {
        return new Response("Please provide a prompt");
    }

    if (!chatId) {
        return new Response("Please provide a valid chat ID");
    }

    //   ChatGPT query
    const response = await POST(prompt, model);

    const message: Message = {
        text: response || `ChatGPT is unable to find an answer for that!`,
        createdAt: serverTimestamp(),
        user: {
            _id: "ChatGPT",
            name: "ChatGPT",
            avatar: "https://links.papareact.com/89k",
        },
    };

    // await adminDB
    //     .collection("users")
    //     .doc(session?.user?.email)
    //     .collection("chats")
    //     .doc(chatId)
    //     .collection("messages")
    //     .add(message);

    await addDoc(collection(db, 'users', session?.user?.email!, 'chats', chatId, 'messages'), message);

    return new Response(JSON.stringify({ answer: message.text }));
}

export { handler as GET, handler as POST };

