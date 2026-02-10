class AIChatbot {
    constructor() {
        this.chatHistory = [];
        this.conversationHistory = [];
        this.isOpen = false;
        this.currentModule = this.detectCurrentModule();
        this.activityLog = [];
        this.sessionId = this.getOrCreateSessionId();
        this.init();
        
        // Listen for page navigation to update module context
        this.setupNavigationListener();
    }

    getOrCreateSessionId() {
        let sessionId = localStorage.getItem('chatSessionId');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('chatSessionId', sessionId);
        }
        return sessionId;
    }

    setupNavigationListener() {
        // Update module when URL changes (for single-page navigation)
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;
        
        const updateModule = () => {
            const newModule = this.detectCurrentModule();
            if (newModule !== this.currentModule) {
                this.currentModule = newModule;
                this.updateModuleDisplay();
                // Add a system message about module change
                this.addSystemMessage(`Switched to ${this.getModuleName()}`);
            }
        };

        history.pushState = function() {
            originalPushState.apply(history, arguments);
            updateModule();
        };

        history.replaceState = function() {
            originalReplaceState.apply(history, arguments);
            updateModule();
        };

        // Also listen for popstate (back/forward buttons)
        window.addEventListener('popstate', updateModule);
        
        // Listen for link clicks
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' || e.target.closest('a')) {
                setTimeout(updateModule, 100);
            }
        });
    }

    updateModuleDisplay() {
        const moduleNameElement = document.getElementById('current-module-name');
        if (moduleNameElement) {
            moduleNameElement.textContent = this.getModuleName();
        }
        
        // Update input placeholder
        const input = document.getElementById('chat-input');
        if (input) {
            input.placeholder = `Ask about ${this.getModuleName()}...`;
        }
        
        // Update suggestions for new module
        if (this.isOpen) {
            this.loadSuggestions();
        }
    }

    addSystemMessage(message) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message system';
        messageDiv.innerHTML = `
            <div class="system-message">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                ${message}
            </div>`;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    detectCurrentModule() {
        const path = window.location.pathname;
        const moduleMatch = path.match(/\/([\w_]+)/);
        return moduleMatch ? moduleMatch[1] : 'home';
    }

    init() {
        this.createChatUI();
        this.attachEventListeners();
        this.loadChatHistory();
        this.trackUserActivity();
    }

    trackUserActivity() {
        // Track page interactions for better context
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') {
                this.activityLog.push({
                    action: 'interaction',
                    element: e.target.id || e.target.className,
                    timestamp: Date.now()
                });
                // Keep only last 10 activities
                if (this.activityLog.length > 10) {
                    this.activityLog.shift();
                }
            }
        });
    }

    createChatUI() {
        const chatHTML = `
<div id="ai-chatbot" class="chatbot-sidebar">
    <!-- Toggle Button -->
    <button id="chat-toggle" class="chat-toggle-btn" aria-label="Toggle AI Assistant">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <span class="chat-badge">AI</span>
    </button>

    <!-- Sidebar Panel -->
    <div id="chat-sidebar" class="chat-sidebar-panel">
        <div class="chat-sidebar-header">
            <div class="chat-header-content">
                <div class="chat-header-title">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                        <line x1="9" y1="9" x2="9.01" y2="9"></line>
                        <line x1="15" y1="9" x2="15.01" y2="9"></line>
                    </svg>
                    <h3>AI Math Tutor</h3>
                </div>
                <p class="chat-subtitle">Module: <span id="current-module-name">${this.getModuleName()}</span></p>
            </div>
            <div class="chat-header-actions">
                <button id="chat-new-session" class="chat-action-btn" title="New Chat Session">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>
                <button id="chat-close" class="chat-action-btn" title="Close">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        </div>

        <div id="chat-messages" class="chat-messages">
            ${this.getWelcomeMessage()}
        </div>

        <div class="chat-suggestions" id="chat-suggestions">
            <!-- Dynamic suggestions will appear here -->
        </div>

        <div class="chat-input-container">
            <textarea id="chat-input" class="chat-input" 
                      placeholder="Ask about ${this.getModuleName()}..." 
                      rows="1"></textarea>
            <button id="chat-send" class="chat-send-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
            </button>
        </div>
    </div>
</div>`;
        document.body.insertAdjacentHTML('beforeend', chatHTML);
    }

    getWelcomeMessage() {
        // Only show welcome if no chat history
        const hasHistory = localStorage.getItem('chatHistory');
        if (hasHistory) {
            return ''; // Will be populated by loadChatHistory()
        }
        
        return `
            <div class="chat-message assistant">
                <div class="message-avatar">AI</div>
                <div class="message-content">
                    <p>👋 Hi! I'm your AI math tutor.</p>
                    <p><strong>I can see you're on: ${this.getModuleName()}</strong></p>
                    <p>Ask me anything about this module!</p>
                </div>
            </div>`;
    }

    getModuleName() {
        const names = {
            'home': 'Dashboard',
            'vectors': 'Vector Spaces',
            'matrices': 'Matrix Operations',
            'transformations': 'Linear Transformations',
            'systems': 'Systems of Equations',
            'eigen': 'Eigenvalues & Eigenvectors',
            'gradient': 'Gradient Descent',
            'neural': 'Neural Networks',
            'pca': 'PCA',
            'feature_space': 'Feature Space',
            'convolution': 'Convolution Filters',
            'ml_model': 'ML Model Trainer'
        };
        return names[this.currentModule] || 'Dashboard';
    }

    attachEventListeners() {
        const toggleBtn = document.getElementById('chat-toggle');
        const closeBtn = document.getElementById('chat-close');
        const newSessionBtn = document.getElementById('chat-new-session');
        const sendBtn = document.getElementById('chat-send');
        const input = document.getElementById('chat-input');

        toggleBtn.addEventListener('click', () => this.toggleChat());
        closeBtn.addEventListener('click', () => this.toggleChat());
        newSessionBtn.addEventListener('click', () => this.newChatSession());
        sendBtn.addEventListener('click', () => this.sendMessage());
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        input.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        });
    }

    toggleChat() {
        const sidebar = document.getElementById('chat-sidebar');
        const toggleBtn = document.getElementById('chat-toggle');
        const appContainer = document.querySelector('.app-container');
        
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            sidebar.classList.add('open');
            toggleBtn.classList.add('active');
            appContainer.classList.add('chatbot-open');
            document.getElementById('chat-input').focus();
            this.loadSuggestions();
        } else {
            sidebar.classList.remove('open');
            toggleBtn.classList.remove('active');
            appContainer.classList.remove('chatbot-open');
        }
    }

    newChatSession() {
        if (confirm('Start a new chat session? Current conversation will be saved.')) {
            // Save current session with timestamp
            const timestamp = new Date().toISOString();
            const sessionBackup = {
                sessionId: this.sessionId,
                timestamp: timestamp,
                chatHistory: this.chatHistory,
                conversationHistory: this.conversationHistory
            };
            
            // Save to archived sessions
            let archivedSessions = JSON.parse(localStorage.getItem('archivedSessions') || '[]');
            archivedSessions.push(sessionBackup);
            localStorage.setItem('archivedSessions', JSON.stringify(archivedSessions));
            
            // Clear current session
            this.conversationHistory = [];
            this.chatHistory = [];
            this.sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('chatSessionId', this.sessionId);
            localStorage.removeItem('chatHistory');
            localStorage.removeItem('conversationHistory');
            
            // Clear UI and show welcome message
            const messagesContainer = document.getElementById('chat-messages');
            messagesContainer.innerHTML = `
                <div class="chat-message assistant">
                    <div class="message-avatar">AI</div>
                    <div class="message-content">
                        <p>🆕 New session started!</p>
                        <p><strong>Module: ${this.getModuleName()}</strong></p>
                        <p>What would you like to learn?</p>
                    </div>
                </div>`;
            
            // Reload suggestions
            this.loadSuggestions();
        }
    }

    async sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (!message) return;

        // Add user message to UI
        this.addMessage(message, 'user');
        input.value = '';
        input.style.height = 'auto';

        // Show typing indicator
        this.showTypingIndicator();

        // Get enhanced context
        const context = this.getEnhancedContext();

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: message,
                    module: this.currentModule,
                    context: context,
                    history: this.conversationHistory
                })
            });

            const data = await response.json();
            this.removeTypingIndicator();

            if (data.success) {
                this.addMessage(data.response, 'assistant');
                
                // Update conversation history
                this.conversationHistory.push(
                    { role: 'user', content: message },
                    { role: 'assistant', content: data.response }
                );
                
                // Update suggestions dynamically
                this.updateDynamicSuggestions(message, data.response);
            } else {
                this.addMessage('Sorry, I encountered an error. Please try again.', 'assistant');
            }
        } catch (error) {
            this.removeTypingIndicator();
            this.addMessage('Connection error. Please check your internet.', 'assistant');
        }

        this.saveChatHistory();
    }

    getEnhancedContext() {
        const context = {
            module: this.currentModule,
            page_title: this.getModuleName(),
            timestamp: new Date().toISOString(),
            recent_actions: this.activityLog.slice(-3).map(a => a.action).join(', ') || 'Just opened page'
        };

        // Extract module-specific parameters
        if (this.currentModule === 'gradient') {
            const learningRate = document.getElementById('learning_rate')?.value;
            const iterations = document.getElementById('iterations')?.value;
            if (learningRate) context.learning_rate = learningRate;
            if (iterations) context.iterations = iterations;
        }

        return context;
    }

    addMessage(content, role) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${role}`;

        const renderedContent = this.renderLatex(content);
        
        if (role === 'assistant') {
            messageDiv.innerHTML = `
                <div class="message-avatar">AI</div>
                <div class="message-content">${renderedContent}</div>`;
        } else {
            messageDiv.innerHTML = `
                <div class="message-content">${renderedContent}</div>`;
        }
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        this.chatHistory.push({ role, content, timestamp: Date.now() });
        this.saveChatHistory();
    }

    renderLatex(text) {
        let rendered = text
            .replace(/\$\$(.*?)\$\$/g, '<div class="math-display">$1</div>')
            .replace(/\$(.*?)\$/g, '<span class="math-inline">$1</span>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');
        return rendered;
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chat-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message assistant typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">AI</div>
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>`;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    }

    async loadSuggestions() {
        try {
            // Get last few messages for context
            const recentMessages = this.conversationHistory.slice(-4);
            const lastUserMessage = recentMessages.filter(m => m.role === 'user').slice(-1)[0];
            
            const response = await fetch('/api/chat/suggest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    module: this.currentModule,
                    recent_messages: recentMessages,
                    last_user_message: lastUserMessage?.content || '',
                    has_conversation: this.conversationHistory.length > 0
                })
            });

            const data = await response.json();
            this.displaySuggestions(data.suggestions);
        } catch (error) {
            console.error('Failed to load suggestions:', error);
        }
    }

    displaySuggestions(suggestions) {
        const suggestionsContainer = document.getElementById('chat-suggestions');
        
        // Filter out empty or irrelevant suggestions
        const validSuggestions = suggestions.filter(s => 
            s && 
            s.length > 0 && 
            !s.toLowerCase().includes('get started') &&
            !s.toLowerCase().includes('click') &&
            !s.toLowerCase().includes('button')
        );
        
        if (validSuggestions && validSuggestions.length > 0) {
            suggestionsContainer.innerHTML = validSuggestions
                .slice(0, 3) // Show max 3 suggestions
                .map(s => `<button class="suggestion-chip">${s}</button>`)
                .join('');

            suggestionsContainer.querySelectorAll('.suggestion-chip').forEach(chip => {
                chip.addEventListener('click', () => {
                    document.getElementById('chat-input').value = chip.textContent;
                    this.sendMessage();
                });
            });
        } else {
            // Show generic helpful suggestions if none available
            suggestionsContainer.innerHTML = '';
        }
    }

    updateDynamicSuggestions(userMessage, aiResponse) {
        // Update suggestions based on conversation context
        // Wait a bit for the conversation to settle
        setTimeout(() => this.loadSuggestions(), 800);
    }

    saveChatHistory() {
        localStorage.setItem('chatHistory', JSON.stringify(this.chatHistory));
        localStorage.setItem('conversationHistory', JSON.stringify(this.conversationHistory));
    }

    loadChatHistory() {
        const savedHistory = localStorage.getItem('chatHistory');
        const savedConversation = localStorage.getItem('conversationHistory');
        
        if (savedHistory) {
            this.chatHistory = JSON.parse(savedHistory);
            // Restore messages to UI
            const messagesContainer = document.getElementById('chat-messages');
            messagesContainer.innerHTML = ''; // Clear welcome message
            
            this.chatHistory.forEach(msg => {
                this.restoreMessage(msg.content, msg.role);
            });
        }
        
        if (savedConversation) {
            this.conversationHistory = JSON.parse(savedConversation);
        }
    }

    restoreMessage(content, role) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${role}`;

        const renderedContent = this.renderLatex(content);
        
        if (role === 'assistant') {
            messageDiv.innerHTML = `
                <div class="message-avatar">AI</div>
                <div class="message-content">${renderedContent}</div>`;
        } else if (role === 'user') {
            messageDiv.innerHTML = `
                <div class="message-content">${renderedContent}</div>`;
        } else if (role === 'system') {
            messageDiv.className = 'chat-message system';
            messageDiv.innerHTML = `
                <div class="system-message">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    ${renderedContent}
                </div>`;
        }
        
        messagesContainer.appendChild(messageDiv);
    }
}

// Initialize chatbot when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.chatbot = new AIChatbot();
});
