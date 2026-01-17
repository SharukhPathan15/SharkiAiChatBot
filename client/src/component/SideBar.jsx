import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import moment from "moment";
import toast from "react-hot-toast";
import {
  MessageSquare,
  Search,
  Trash2,
  Images,
  Gem,
  Moon,
  Sun,
  User,
  LogOut,
  X,
  Plus,
  Sparkles,
} from "lucide-react";

const SideBar = ({ isMenuOpen, setIsMenuOpen }) => {
  const {
    chats,
    selectedChat,
    setSelectedChat,
    theme,
    setTheme,
    user,
    navigate,
    createNewChat,
    axios,
    setChats,
    fetchUserChats,
    setToken,
    token,
  } = useAppContext();
  const [search, setSearch] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    toast.success("Logged out successfully");
  };

  const deleteChat = async (e, chatId) => {
    try {
      e.stopPropagation();
      const confirm = window.confirm(
        "Are you sure you want to delete this chat?"
      );
      if (!confirm) return;
      const { data } = await axios.post(
        "/api/chat/delete",
        { chatId },
        { headers: { Authorization: token } }
      );
      if (data.success) {
        setChats((prev) => prev.filter((chat) => chat._id !== chatId));
        await fetchUserChats();
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div
      className={`flex flex-col h-screen w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 max-md:absolute left-0 z-50 shadow-lg ${
        !isMenuOpen && "max-md:-translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="p-6 pb-4 border-b border-gray-100 dark:border-gray-900">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              SharkiAI
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              AI Assistant
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* New Chat Button */}
        <button
          onClick={createNewChat}
          className="w-full py-3 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm"
        >
          <Plus className="w-5 h-5" />
          New Chat
        </button>

        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 placeholder-gray-600 dark:placeholder-gray-300 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Search conversations"
          />
        </div>

        {/* Recent Chats */}
        {chats.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2">
              Recent Chats
            </p>
            <div className="space-y-2">
              {chats
                .filter((chat) =>
                  chat.messages[0]
                    ? chat.messages[0]?.content
                        .toLowerCase()
                        .includes(search.toLowerCase())
                    : chat.name.toLowerCase().includes(search.toLowerCase())
                )
                .map((chat) => {
                  const isSelected = selectedChat?._id === chat._id;

                  return (
                    <div
                      key={chat._id}
                      onClick={() => {
                        navigate("/");
                        setSelectedChat(chat);
                        setIsMenuOpen(false);
                      }}
                      className={`
                        p-3 rounded-lg cursor-pointer group relative transition-all duration-200
                        ${
                          isSelected
                            ? "bg-blue-50 dark:bg-cyan-950/40 border-l-4 border-teal-600 dark:border-cyan-400"
                            : "bg-gray-100 dark:bg-gray-800 "
                        }
                      `}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <MessageSquare
                              className={`w-4 h-4 flex-shrink-0 ${
                                isSelected
                                  ? "text-teal-600 dark:text-cyan-400"
                                  : "text-gray-400"
                              }`}
                            />
                            <p
                              className={`text-sm font-medium truncate ${
                                isSelected
                                  ? "text-teal-700 dark:text-cyan-300"
                                  : "text-gray-800 dark:text-gray-200"
                              }`}
                            >
                              {chat.messages.length > 0
                                ? chat.messages[0].content.slice(0, 32) +
                                  (chat.messages[0].content.length > 32
                                    ? "..."
                                    : "")
                                : chat.name}
                            </p>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-6">
                            {moment(chat.updatedAt).fromNow()}
                          </p>
                        </div>

                        <button
                          onClick={(e) =>
                            toast.promise(deleteChat(e, chat._id), {
                              loading: "Deleting...",
                            })
                          }
                          className={`p-1 rounded transition-opacity ${
                            isSelected
                              ? "opacity-100 hover:bg-blue-100 dark:hover:bg-cyan-950/40"
                              : "opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-700"
                          }`}
                        >
                          <Trash2 className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Section */}
      <div className="p-4 space-y-4 border-t border-gray-100 dark:border-gray-800">
        {/* Navigation Items */}
        <div className="space-y-2">
          <button
            onClick={() => {
              navigate("/community");
              setIsMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-sm"
          >
            <Images className="w-5 h-5" />
            <span>Community Images</span>
          </button>

          <button
            onClick={() => {
              navigate("/credits");
              setIsMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-sm"
          >
            <Gem className="w-5 h-5" />
            <div className="flex-1 text-left">
              <span>Credits: {user?.credits || 0}</span>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Purchase credits
              </p>
            </div>
          </button>
        </div>

        {/* Theme Toggle */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center gap-3">
            {theme === "dark" ? (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Dark Mode
            </span>
          </div>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              theme === "dark" ? "bg-teal-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                theme === "dark" ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-teal-500 rounded-full flex items-center justify-center text-white font-medium">
            {user?.name?.charAt(0)?.toUpperCase() || (
              <User className="w-5 h-5" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
              {user?.name || "Guest"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email || "Login to your account"}
            </p>
          </div>
          {user && (
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Close button for mobile */}
      <button
        onClick={() => setIsMenuOpen(false)}
        className="absolute top-4 right-4 md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
      >
        <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </button>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-[90%] max-w-sm shadow-xl">
            {/* Icon */}
            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <LogOut className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>

            {/* Text */}
            <h2 className="text-lg font-semibold text-center text-gray-800 dark:text-gray-100">
              Log out?
            </h2>
            <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-2">
              Are you sure you want to log out of your account?
            </p>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2 rounded-lg text-sm font-medium
                     bg-gray-100 dark:bg-gray-800
                     hover:bg-gray-200 dark:hover:bg-gray-700
                     transition"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  logout();
                  setShowLogoutConfirm(false);
                }}
                className="flex-1 py-2 rounded-lg text-sm font-medium
                     bg-red-500 hover:bg-red-600 text-white
                     transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SideBar;
