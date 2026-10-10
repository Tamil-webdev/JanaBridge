import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/common/EmptyState';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { chatService } from '../services/chatService';
import { useLanguage } from '../context/LanguageContext';
import {
  MessageSquare,
  Search,
  Trash2,
  Edit2,
  Clock,
  ArrowRight,
  Plus,
  X
} from 'lucide-react';

export const ChatHistoryPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [conversations, setConversations] = useState([]);
  const [search, setSearch] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [editingTitleId, setEditingTitleId] = useState(null);
  const [titleInput, setTitleInput] = useState('');

  useEffect(() => {
    const list = chatService.getConversations();
    setConversations(list);
  }, []);

  const handleDelete = (id) => {
    const updated = conversations.filter(c => c.id !== id);
    setConversations(updated);
    chatService.saveConversations(updated);
  };

  const handleSaveTitle = (id) => {
    if (!titleInput.trim()) {
      setEditingTitleId(null);
      return;
    }
    const updated = conversations.map(c => c.id === id ? { ...c, title: titleInput.trim() } : c);
    setConversations(updated);
    chatService.saveConversations(updated);
    setEditingTitleId(null);
    setTitleInput('');
  };

  const filteredConversations = conversations.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.messages.some(m => (m.text || m.data?.directAnswer || '').toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={t('history.title', 'Chat History')}
        subtitle={t('history.subtitle', 'Review past sessions with JanaBridge Assistant, evidence citations, and advice logs.')}
        badge={`${conversations.length} ${t('history.sessions', 'Sessions')}`}
        actions={
          <button
            type="button"
            onClick={() => navigate('/chat')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#075BA8] hover:bg-[#064780] text-white text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{t('chat.newChat', 'Start New Chat')}</span>
          </button>
        }
      />

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('chat.searchHistory', 'Search conversation titles and messages...')}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#075BA8]"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Conversations Grid */}
      {filteredConversations.length > 0 ? (
        <div className="space-y-3">
          {filteredConversations.map((conv) => {
            const isEditing = editingTitleId === conv.id;
            const lastMsg = conv.messages[conv.messages.length - 1];
            const previewText = lastMsg
              ? (lastMsg.text || lastMsg.data?.directAnswer || t('chat.discussionThread', 'Discussion thread'))
              : t('chat.noMessagesYet', 'No messages yet');

            return (
              <div
                key={conv.id}
                className="group p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-xs hover:border-[#075BA8] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#075BA8] shrink-0" />
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={titleInput}
                          onChange={(e) => setTitleInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle(conv.id)}
                          autoFocus
                          className="px-2 py-1 text-xs border border-[#075BA8] rounded-md bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveTitle(conv.id)}
                          className="px-2 py-1 bg-[#075BA8] text-white rounded text-xs font-semibold"
                        >
                          {t('common.save', 'Save')}
                        </button>
                      </div>
                    ) : (
                      <h3
                        onClick={() => navigate('/chat')}
                        className="text-sm font-bold text-slate-900 dark:text-white hover:text-[#075BA8] cursor-pointer flex items-center gap-2"
                      >
                        <span>{conv.title}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingTitleId(conv.id);
                            setTitleInput(conv.title);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-slate-600 transition-opacity"
                          title={t('common.edit', 'Edit Title')}
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </h3>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 pl-6">
                    {previewText}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 pl-6 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(conv.updatedAt).toLocaleString()}
                    </span>
                    <span>•</span>
                    <span>{conv.messages.length} {t('chat.messagesCount', 'messages')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 sm:self-center">
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(conv.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    title={t('common.delete', 'Delete Conversation')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/chat')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#EAF4FF] text-[#075BA8] dark:bg-slate-700 dark:text-blue-300 hover:bg-[#075BA8] hover:text-white transition-all text-xs font-bold"
                  >
                    <span>{t('common.open', 'Open Conversation')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={MessageSquare}
          title={t('history.empty', 'No chat sessions found')}
          message={t('history.emptyDesc', 'Your conversation logs will appear here so you can review previous responses and verified citations.')}
          actionText={t('chat.newChat', 'Start First Conversation')}
          onAction={() => navigate('/chat')}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deleteConfirmId}
        title={t('modal.confirmDeleteConvo', 'Delete Conversation')}
        message={t('modal.confirmDeleteConvoDesc', 'Are you sure you want to permanently delete this chat session? This cannot be undone.')}
        confirmText={t('modal.deleteBtn', 'Delete')}
        onConfirm={() => {
          if (deleteConfirmId) handleDelete(deleteConfirmId);
          setDeleteConfirmId(null);
        }}
        onClose={() => setDeleteConfirmId(null)}
      />
    </div>
  );
};
