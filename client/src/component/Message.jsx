import React, { useEffect } from "react";
import moment from "moment";
import Markdown from "react-markdown";
import Prism from "prismjs";
import { User, Bot } from 'lucide-react';

const Message = ({ message }) => {

  
  useEffect(() => {
    Prism.highlightAll();
  }, [message.content]);



  return (
    <div>
  {message.role === "user" ? (
    <div className="flex items-center justify-end my-4 gap-3">
      <div className="flex flex-col items-end gap-2">
        <div className="flex flex-col gap-2 p-4 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 dark:from-cyan-900/20 dark:to-teal-900/20 border border-cyan-300/50 dark:border-cyan-700/50 rounded-2xl rounded-tr-none max-w-2xl shadow-sm">
          <p className="text-sm text-gray-800 dark:text-cyan-100 font-medium">
            {message.content}
          </p>
          <span className="text-xs text-cyan-600/70 dark:text-cyan-400/60 font-mono">
            {moment(message.timestamp).fromNow()}
          </span>
        </div>
      </div>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-teal-500 rounded-full blur-sm opacity-30"></div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-teal-500 flex items-center justify-center border-2 border-cyan-300/50 dark:border-cyan-600/50 relative shadow-md">
          <User className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-start my-4 gap-3">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-full blur-sm opacity-40"></div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-teal-600 flex items-center justify-center relative shadow-md">
          <Bot className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="flex-1">
        <div className="flex flex-col gap-2 p-4 bg-gradient-to-r from-cyan-50 to-teal-50/50 dark:from-cyan-900/30 dark:to-teal-900/20 border border-cyan-200 dark:border-cyan-800/50 rounded-2xl rounded-tl-none max-w-2xl shadow-sm">
          {message.isImage ? (
            <img
              src={message.content}
              alt="Generated image"
              className="w-full max-w-md mt-2 rounded-lg border border-cyan-300/30 dark:border-cyan-700/30"
            />
          ) : (
            <div className="text-sm text-gray-800 dark:text-cyan-100 reset-tw">
              <Markdown>{message.content}</Markdown>
            </div>
          )}
          <span className="text-xs text-cyan-600/70 dark:text-cyan-400/60 font-mono">
            {moment(message.timestamp).fromNow()}
          </span>
        </div>
      </div>
    </div>
  )}
</div>
  );
};

export default Message;
