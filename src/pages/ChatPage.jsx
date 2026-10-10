import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useOutletContext } from 'react-router-dom';
import { chatService } from '../services/chatService';
import { ChatMessage } from '../components/chat/ChatMessage';
import { ChatComposer } from '../components/chat/ChatComposer';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { LanguageSelector } from '../components/common/LanguageSelector';
import { useLanguage } from '../context/LanguageContext';
import {
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Check,
  Search,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  X,
  Clock,
  Info
} from 'lucide-react';

export const ChatPage = () => {
  const { onOpenVoiceModal } = useOutletContext();
  const { t, language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q');

  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [searchHistory, setSearchHistory] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [editingTitleId, setEditingTitleId] = useState(null);
  const [newTitle, setNewTitle] = useState('');

  const chatEndRef = useRef(null);

  // Suggested welcome questions
  const suggestedQuestions = [
    t("chat.sugBenefits", "What government benefits might be relevant to my situation?"),
    t("chat.sugIncome", "How do I apply for an income certificate?"),
    t("chat.sugRation", "What documents are commonly required for a ration card?"),
    t("chat.sugSeniorTN", "What schemes are available for senior citizens in Tamil Nadu?"),
    t("chat.sugLand", "How can I find information about land records?")
  ];

  // Initialize conversations
  useEffect(() => {
    const loaded = chatService.getConversations();
    setConversations(loaded);
    if (loaded.length > 0) {
      setActiveConvId(loaded[0].id);
    }
  }, []);

  // Handle auto query parameter
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      handleSendMessage(initialQuery.trim());
      setSearchParams({});
    }
  }, [initialQuery]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, activeConvId, loading]);

  const activeConversation = conversations.find(c => c.id === activeConvId) || conversations[0];

  const handleNewChat = () => {
    const newId = `conv-${Date.now()}`;
    const newConv = {
      id: newId,
      title: t('chat.newInquiry', "New Inquiry"),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: []
    };
    const updated = [newConv, ...conversations];
    setConversations(updated);
    setActiveConvId(newId);
    chatService.saveConversations(updated);
  };

  const handleSendMessage = async (text, editedMessageId = null) => {
    if (!text.trim()) return;

    let targetConv = activeConversation;
    let updatedConversations = [...conversations];

    // If no active conversation, create one
    if (!targetConv) {
      const newId = `conv-${Date.now()}`;
      targetConv = {
        id: newId,
        title: text.slice(0, 32) + (text.length > 32 ? '...' : ''),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: []
      };
      updatedConversations = [targetConv, ...updatedConversations];
      setActiveConvId(newId);
    }

    const userMsg = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toISOString(),
      text
    };

    let newMessages = [];
    if (editedMessageId) {
      // Find where edited message was and truncate following or replace
      const msgIndex = targetConv.messages.findIndex(m => m.id === editedMessageId);
      if (msgIndex !== -1) {
        newMessages = [...targetConv.messages.slice(0, msgIndex), userMsg];
      } else {
        newMessages = [...targetConv.messages, userMsg];
      }
    } else {
      newMessages = [...targetConv.messages, userMsg];
    }

    // Update title if first message
    const updatedTitle = targetConv.messages.length === 0 ? text.slice(0, 32) + (text.length > 32 ? '...' : '') : targetConv.title;

    targetConv = {
      ...targetConv,
      title: updatedTitle,
      updatedAt: new Date().toISOString(),
      messages: newMessages
    };

    updatedConversations = updatedConversations.map(c => c.id === targetConv.id ? targetConv : c);
    setConversations(updatedConversations);
    chatService.saveConversations(updatedConversations);
    setEditingMessage(null);
    setLoading(true);

    try {
      const responseData = await chatService.generateResponse(text, language);

      const assistantMsg = {
        id: `msg-assistant-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        data: responseData
      };

      const finalMessages = [...targetConv.messages, assistantMsg];
      const finalConv = {
        ...targetConv,
        updatedAt: new Date().toISOString(),
        messages: finalMessages
      };

      const finalConversations = updatedConversations.map(c => c.id === finalConv.id ? finalConv : c);
      setConversations(finalConversations);
      chatService.saveConversations(finalConversations);
    } catch (err) {
      console.error('Error generating assistant response', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConversation = (id) => {
    const updated = conversations.filter(c => c.id !== id);
    setConversations(updated);
    chatService.saveConversations(updated);
    if (activeConvId === id) {
      setActiveConvId(updated[0]?.id || null);
    }
  };

  const handleSaveTitle = (id) => {
    if (!newTitle.trim()) {
      setEditingTitleId(null);
      return;
    }
    const updated = conversations.map(c => c.id === id ? { ...c, title: newTitle.trim() } : c);
    setConversations(updated);
    chatService.saveConversations(updated);
    setEditingTitleId(null);
    setNewTitle('');
  };

  const filteredConversations = conversations.filter(c =>
    c.title.toLowerCase().includes(searchHistory.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-8.5rem)] -m-4 sm:-m-6 lg:-m-8">
      {/* Outer Shell */}
      <div className="flex-1 flex overflow-hidden bg-slate-50 dark:bg-slate-950">
        {/* ================= LEFT CONVERSATION HISTORY PANEL ================= */}
        <aside className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hidden md:flex flex-col">
          {/* Top Panel Actions */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 space-y-3">
            <button
              type="button"
              onClick={handleNewChat}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#075BA8] hover:bg-[#064780] text-white text-xs font-bold transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>{t('newChat')}</span>
            </button>

            {/* History Search input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchHistory}
                onChange={(e) => setSearchHistory(e.target.value)}
                placeholder={t('chat.searchHistory', 'Search history...')}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-[#075BA8] text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conv) => {
                const isActive = conv.id === activeConvId;
                const isEditingThis = editingTitleId === conv.id;

                return (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    className={`group relative p-2.5 rounded-xl cursor-pointer text-xs transition-colors flex items-center justify-between ${
                      isActive
                        ? 'bg-[#EAF4FF] text-[#075BA8] dark:bg-slate-800 dark:text-blue-400 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden flex-1 mr-2">
                      <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                      {isEditingThis ? (
                        <input
                          type="text"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle(conv.id)}
                          onBlur={() => handleSaveTitle(conv.id)}
                          autoFocus
                          className="w-full px-1 py-0.5 bg-white text-slate-900 rounded border border-[#075BA8] text-xs"
                        />
                      ) : (
                        <span className="truncate">{conv.title}</span>
                      )}
                    </div>

                    {/* Quick Rename & Delete Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingTitleId(conv.id);
                          setNewTitle(conv.title);
                        }}
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        title={t('common.edit', 'Rename conversation')}
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirmId(conv.id);
                        }}
                        className="p-1 text-slate-400 hover:text-red-600"
                        title={t('common.delete', 'Delete conversation')}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-slate-400">
                {t('chat.noHistory', 'No conversations found.')}
              </div>
            )}
          </div>

          {/* Sidebar Footer info */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>{t('help.privacyTitle', 'Local demo storage')}</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          </div>
        </aside>

        {/* ================= MAIN CHAT AREA ================= */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-slate-900">
          {/* Chat Header Bar */}
          <div className="px-4 sm:px-6 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#075BA8] to-[#064780] text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>{activeConversation?.title || t('chat.assistantTitle', 'JanaBridge Assistant')}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
                    {t('chat.ragReady', 'RAG Ready')}
                  </span>
                </h2>
                <p className="text-[11px] text-slate-400">{t('chat.assistantSubtitle', 'Evidence-backed welfare & document navigation assistant')}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleNewChat}
                className="md:hidden p-2 rounded-xl text-[#075BA8] hover:bg-slate-100"
                title={t('chat.newChat', 'New Chat')}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-4">
            {(!activeConversation || activeConversation.messages.length === 0) ? (
              /* Welcome Screen */
              <div className="max-w-2xl mx-auto py-8 text-center space-y-6">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#075BA8] to-[#064780] text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/10">
                  <Sparkles className="w-8 h-8 text-amber-300" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {t('chat.greeting', 'Hello! I am JanaBridge Assistant.')}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
                    {t('chat.subgreeting', 'I can help you explore government services, understand schemes and find the documents you may need.')}
                  </p>
                </div>

                {/* Suggested Questions Grid */}
                <div className="pt-2 text-left space-y-2 max-w-lg mx-auto">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    {t('chat.suggestedHeading', 'Suggested Questions:')}
                  </span>
                  <div className="space-y-2">
                    {suggestedQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendMessage(q)}
                        className="w-full text-left p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-[#EAF4FF] hover:border-[#075BA8] dark:hover:bg-blue-900/30 border border-slate-200/80 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 transition-all flex items-center justify-between group shadow-2xs"
                      >
                        <span className="group-hover:text-[#075BA8] dark:group-hover:text-blue-300">{q}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#075BA8] group-hover:translate-x-1 transition-transform shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Render conversation message list */
              <div className="max-w-3xl mx-auto">
                {activeConversation.messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    message={msg}
                    onEditPrompt={(m) => setEditingMessage(m)}
                  />
                ))}

                {/* Typing / Loading Indicator */}
                {loading && (
                  <div className="flex gap-3 mb-6 animate-in fade-in">
                    <div className="w-9 h-9 rounded-xl bg-[#075BA8] text-white flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 animate-spin" />
                    </div>
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#075BA8] animate-bounce" />
                      <span className="w-2 h-2 rounded-full bg-[#075BA8] animate-bounce [animation-delay:0.2s]" />
                      <span className="w-2 h-2 rounded-full bg-[#075BA8] animate-bounce [animation-delay:0.4s]" />
                      <span className="text-xs text-slate-500 font-medium ml-2">{t('chat.crossReferencing', 'Cross-referencing government evidence...')}</span>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          {/* Bottom Chat Composer Container */}
          <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs">
            <div className="max-w-3xl mx-auto">
              <ChatComposer
                onSend={handleSendMessage}
                onVoiceClick={onOpenVoiceModal}
                disabled={loading}
                editingMessage={editingMessage}
                onCancelEdit={() => setEditingMessage(null)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Delete */}
      <ConfirmationModal
        isOpen={!!deleteConfirmId}
        title={t('modal.confirmDeleteConvo', 'Delete Conversation')}
        message={t('modal.confirmDeleteConvoDesc', 'Are you sure you want to delete this chat session? All messages and evidence citations in this conversation will be removed.')}
        confirmText={t('modal.deleteBtn', 'Delete Conversation')}
        onConfirm={() => {
          if (deleteConfirmId) handleDeleteConversation(deleteConfirmId);
          setDeleteConfirmId(null);
        }}
        onClose={() => setDeleteConfirmId(null)}
      />
    </div>
  );
};
