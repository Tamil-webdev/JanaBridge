/**
 * apiClient.js
 *
 * HTTP client for the JanaBridge FastAPI backend.
 * All requests go to /api/v1/* which Vite proxies to http://127.0.0.1:8000
 * during development (see vite.config.js).
 *
 * PRIVACY: All data stays local. No external services are contacted.
 * The backend uses local Ollama inference only.
 */

const BASE = '/api/v1';

/** Generic fetch wrapper with consistent error handling. */
async function apiFetch(path, options = {}) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      detail = body.detail || body.message || detail;
    } catch (_) {
      // ignore parse errors
    }
    throw new Error(detail);
  }

  return res.json();
}

// ---------------------------------------------------------------------------
// Health
// ---------------------------------------------------------------------------

export async function checkHealth() {
  return apiFetch('/health');
}

// ---------------------------------------------------------------------------
// Conversations
// ---------------------------------------------------------------------------

export async function createConversation(title = 'New Inquiry') {
  return apiFetch('/conversations/', {
    method: 'POST',
    body: JSON.stringify({ title }),
  });
}

export async function listConversations(skip = 0, limit = 20) {
  return apiFetch(`/conversations/?skip=${skip}&limit=${limit}`);
}

export async function getConversation(conversationId) {
  return apiFetch(`/conversations/${conversationId}`);
}

export async function updateConversationTitle(conversationId, title) {
  return apiFetch(`/conversations/${conversationId}`, {
    method: 'PATCH',
    body: JSON.stringify({ title }),
  });
}

// ---------------------------------------------------------------------------
// Messages — real RAG inference
// ---------------------------------------------------------------------------

/**
 * Send a user message to a conversation.
 * The backend runs: embed → hybrid retrieve → qwen3.5:0.8b → citation validate
 *
 * @param {string} conversationId
 * @param {string} message - User's question
 * @param {string} language - 'en' | 'ta' | 'hi'
 * @param {string|null} state - Selected state code (optional)
 * @returns {Promise<MessageResponse>} Assistant message with citations
 */
export async function sendMessage(conversationId, message, language = 'en', state = null) {
  return apiFetch(`/conversations/${conversationId}/messages`, {
    method: 'POST',
    body: JSON.stringify({
      message,
      language,
      state,
    }),
  });
}

// ---------------------------------------------------------------------------
// Documents
// ---------------------------------------------------------------------------

export async function indexDocuments() {
  return apiFetch('/documents/index', { method: 'POST' });
}

export async function listDocuments(skip = 0, limit = 20) {
  return apiFetch(`/documents/?skip=${skip}&limit=${limit}`);
}

export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${BASE}/documents/`, {
    method: 'POST',
    body: formData,
    // Do NOT set Content-Type header — browser sets boundary automatically
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `HTTP ${res.status}`);
  }
  return res.json();
}
