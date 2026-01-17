import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import Message from "./Message";
import toast from "react-hot-toast";
import { SendHorizonal, Square } from "lucide-react";

const ChatBox = () => {
  const { selectedChat, theme, user, axios, token, setUser } = useAppContext();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("text");
  const [isPublished, setIsPublished] = useState(false);

  const containerRef = useRef(null);

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!user) return toast("Login to send message");
      setLoading(true);
      const promptCopy = prompt;
      setPrompt("");
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: prompt,
          timestamp: Date.now(),
          isImage: false,
        },
      ]);
      const { data } = await axios.post(
        `/api/message/${mode}`,
        { chatId: selectedChat._id, prompt, isPublished },
        { headers: { Authorization: token } }
      );
      if (data.success) {
        setMessages((prev) => [...prev, data.reply]);
        //decrease credits
        if (mode === "image") {
          setUser((prev) => ({ ...prev, credits: prev.credits - 2 }));
        } else {
          setUser((prev) => ({ ...prev, credits: prev.credits - 1 }));
        }
      } else {
        toast.error(data.message);
        setPrompt(promptCopy);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setPrompt("");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);
  return (
    <div className="flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40">
      {/* Chat Messages */}
      <div className="flex-1 mb-5 overflow-y-scroll" ref={containerRef}>
        {/* Replace this entire empty state block */}
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            {/* Brand - Updated with wave pattern logo */}
            <div className="flex items-center gap-4 select-none mb-8">
              {/* Wave pattern logo */}
              <div className="w-16 h-16 bg-gradient-to-br from-teal-600 via-cyan-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 relative overflow-hidden">
                <div className="absolute w-10 h-10 bg-white/20 rounded-full blur-md"></div>
                <div className="relative z-10 flex space-x-1">
                  <div
                    className="w-2 h-4 bg-white rounded-full animate-pulse"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-6 bg-white rounded-full animate-pulse"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-8 bg-white rounded-full animate-pulse"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                  <div
                    className="w-2 h-6 bg-white rounded-full animate-pulse"
                    style={{ animationDelay: "450ms" }}
                  ></div>
                  <div
                    className="w-2 h-4 bg-white rounded-full animate-pulse"
                    style={{ animationDelay: "600ms" }}
                  ></div>
                </div>
              </div>

              {/* Text */}
              <div className="flex flex-col leading-tight text-left">
                <span className="text-3xl font-bold bg-gradient-to-r from-teal-600 via-cyan-500 to-cyan-400 bg-clip-text text-transparent">
                  SharkiAi
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-300 font-medium tracking-wider mt-0.5">
                  Intelligent AI Assistant
                </span>
              </div>
            </div>

            {/* Headline */}
            <p className="text-3xl sm:text-5xl font-medium text-gray-400 dark:text-white mb-4">
              How can I assist you today?
            </p>

            {/* Sub text */}
            <p className="mt-3 max-w-md text-sm sm:text-base text-gray-500 dark:text-gray-400">
              Start a conversation or generate creative images with AI-powered
              intelligence.
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}

        {/* Three Dots Loading */}
        {loading && (
          <div className="loader flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
          </div>
        )}
      </div>

      {mode === "image" && (
        <label className="inline-flex items-center gap-2 mb-3 text-sm mx-auto">
          <p className="text-xs">Publish Generated Image to Cummunity</p>
          <input
            type="checkbox"
            className="cursor-pointer"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
        </label>
      )}

      {/* Prompt Input Box */}
      <form
        onSubmit={onSubmit}
        className="bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20 border border-cyan-300/50 dark:border-cyan-700/50 rounded-full w-full max-w-2xl p-3 pl-4 mx-auto flex gap-4 items-center"
      >
        <select
          onChange={(e) => setMode(e.target.value)}
          value={mode}
          className="text-sm pl-3 pr-2 outline-none"
        >
          <option className="dark:bg-cyan-400" value="text">
            Text
          </option>
          <option className="dark:bg-cyan-400" value="image">
            Image
          </option>
        </select>
        <input
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
          type="text"
          placeholder="Type your prompt here..."
          className="flex-1 w-full text-sm outline-none"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={`
    w-10 h-10 rounded-full
    flex items-center justify-center
    transition-all duration-200
    ${
      loading
        ? "bg-teal-500 hover:bg-teal-600"
        : "bg-gradient-to-br from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
    }
    disabled:opacity-60
  `}
        >
          {loading ? (
            <Square size={18} className="text-white" />
          ) : (
            <SendHorizonal size={18} className="text-white ml-[1px]" />
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
