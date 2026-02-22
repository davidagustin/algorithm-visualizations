'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AlgorithmDefinition, AlgorithmStep, Language } from '@/lib/types';
import { buildTutorSystemPrompt, getTutorGreeting } from '@/lib/tutor-prompt';

// ─── Types ──────────────────────────────────────────────────────

interface AIChatDrawerProps {
  algorithm: AlgorithmDefinition;
  currentStep: AlgorithmStep | null;
  currentStepIndex: number;
  totalSteps: number;
  language: Language;
}

type Phase = 'idle' | 'loading' | 'ready' | 'error';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

// ─── Icons ──────────────────────────────────────────────────────

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  );
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61z" />
    </svg>
  );
}

function BrainIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A5.5 5.5 0 0 0 4 7.5c0 1.13.34 2.18.92 3.05A5.5 5.5 0 0 0 7 16.5V22h4v-5.5" />
      <path d="M14.5 2A5.5 5.5 0 0 1 20 7.5c0 1.13-.34 2.18-.92 3.05A5.5 5.5 0 0 1 17 16.5V22h-4v-5.5" />
    </svg>
  );
}

// ─── Main Component ─────────────────────────────────────────────

export default function AIChatDrawer({
  algorithm,
  currentStep,
  currentStepIndex,
  totalSteps,
  language,
}: AIChatDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isNearby, setIsNearby] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadStatus, setLoadStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [isWebGPUSupported, setIsWebGPUSupported] = useState<boolean | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const tabRef = useRef<HTMLButtonElement>(null);
  const systemPromptRef = useRef<string>('');

  // Check WebGPU on mount
  useEffect(() => {
    import('@/lib/webllm').then(({ checkWebGPUSupport }) => {
      checkWebGPUSupport().then(setIsWebGPUSupported);
    });
  }, []);

  // Detect mouse proximity to the tab
  useEffect(() => {
    if (isOpen) return;

    function handleMouseMove(e: MouseEvent) {
      const threshold = 120;
      const distFromRight = window.innerWidth - e.clientX;
      const distFromBottom = window.innerHeight - e.clientY;

      if (distFromRight < threshold && distFromBottom < threshold) {
        setIsNearby(true);
      } else {
        setIsNearby(false);
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isOpen]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  // Focus input when ready
  useEffect(() => {
    if (phase === 'ready' && isOpen) {
      inputRef.current?.focus();
    }
  }, [phase, isOpen]);

  const handleActivate = useCallback(async () => {
    const { isModelLoaded, initializeModel } = await import('@/lib/webllm');

    if (isModelLoaded()) {
      setPhase('ready');
      if (messages.length === 0) {
        setMessages([{
          id: generateId(),
          role: 'assistant',
          content: getTutorGreeting(algorithm),
        }]);
      }
      return;
    }

    setPhase('loading');
    setLoadProgress(0);
    setLoadStatus('Connecting to model server...');

    try {
      await initializeModel((progress) => {
        setLoadProgress(progress);
        if (progress < 5) setLoadStatus('Connecting to model server...');
        else if (progress < 90) setLoadStatus('Downloading model weights...');
        else if (progress < 99) setLoadStatus('Loading into GPU memory...');
        else setLoadStatus('Finalizing...');
      });

      setPhase('ready');
      setMessages([{
        id: generateId(),
        role: 'assistant',
        content: getTutorGreeting(algorithm),
      }]);
    } catch (err) {
      setPhase('error');
      setErrorMessage(err instanceof Error ? err.message : 'Failed to load AI model');
    }
  }, [algorithm, messages.length]);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsStreaming(true);
    setStreamingContent('');

    // Rebuild system prompt with latest step context
    systemPromptRef.current = buildTutorSystemPrompt(
      algorithm,
      currentStep,
      currentStepIndex,
      totalSteps,
      language,
    );

    // Keep last 20 messages for context
    const history = [...messages, userMessage]
      .slice(-20)
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const { streamChat } = await import('@/lib/webllm');
      let fullResponse = '';

      await streamChat(systemPromptRef.current, history, {
        onToken: (token) => {
          fullResponse += token;
          setStreamingContent(fullResponse);
        },
        onComplete: (response) => {
          setMessages((prev) => [
            ...prev,
            { id: generateId(), role: 'assistant', content: response },
          ]);
          setStreamingContent('');
          setIsStreaming(false);
        },
        onError: () => {
          setMessages((prev) => [
            ...prev,
            {
              id: generateId(),
              role: 'assistant',
              content: 'Sorry, I ran into an error. Please try again.',
            },
          ]);
          setStreamingContent('');
          setIsStreaming(false);
        },
      });
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role: 'assistant',
          content: 'Sorry, I ran into an error. Please try again.',
        },
      ]);
      setStreamingContent('');
      setIsStreaming(false);
    }
  }, [input, isStreaming, messages, algorithm, currentStep, currentStepIndex, totalSteps, language]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const quickActions = useMemo(
    () => [
      { label: 'Explain Step', icon: SparkleIcon, prompt: 'Explain what is happening at the current step of the visualization.' },
      { label: 'Code Walkthrough', icon: BrainIcon, prompt: 'Walk me through this algorithm\'s code line by line.' },
    ],
    [],
  );

  const handleQuickAction = useCallback(
    (prompt: string) => {
      setInput(prompt);
      setTimeout(() => {
        handleSend();
      }, 50);
    },
    [handleSend],
  );

  // ─── Render ──────────────────────────────────────

  return (
    <>
      {/* ─── Collapsed Tab (bottom-right, semi-hidden) ───── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            ref={tabRef}
            initial={{ x: 60 }}
            animate={{ x: isNearby ? 0 : 50 }}
            exit={{ x: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={() => {
              setIsOpen(true);
              if (phase === 'idle') handleActivate();
            }}
            className="fixed bottom-6 right-0 z-50 flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-l-xl border border-r-0 border-[var(--border-default)] shadow-lg cursor-pointer transition-colors duration-200"
            style={{ background: 'var(--gradient-brand)' }}
            aria-label="Open AI Tutor"
          >
            <ChatIcon className="w-5 h-5 text-white shrink-0" />
            <span className="text-sm font-semibold text-white whitespace-nowrap">
              Ask AI
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ─── Drawer Panel ────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 sm:hidden"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ x: '100%', opacity: 0.8 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed z-50 bottom-0 right-0 sm:bottom-4 sm:right-4 w-full sm:w-[380px] h-[85vh] sm:h-[560px] sm:rounded-2xl flex flex-col overflow-hidden border border-[var(--border-default)] shadow-2xl"
              style={{ background: 'var(--bg-surface)' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)] shrink-0" style={{ background: 'var(--bg-elevated)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-brand)' }}>
                    <ChatIcon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--text-primary)] leading-tight">
                      Ask AI
                    </h3>
                    <p className="text-[10px] text-[var(--text-muted)] leading-tight">
                      {phase === 'ready' ? 'Powered by Llama 3.1' : 'Local AI Tutor'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-overlay)] transition-colors"
                  aria-label="Close"
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-hidden flex flex-col">
                {phase === 'idle' && (
                  <IdlePhase
                    isWebGPUSupported={isWebGPUSupported}
                    onActivate={handleActivate}
                  />
                )}

                {phase === 'loading' && (
                  <LoadingPhase progress={loadProgress} status={loadStatus} />
                )}

                {phase === 'error' && (
                  <ErrorPhase message={errorMessage} onRetry={handleActivate} />
                )}

                {phase === 'ready' && (
                  <>
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                      {messages.map((msg) => (
                        <MessageBubble key={msg.id} message={msg} />
                      ))}

                      {isStreaming && streamingContent && (
                        <MessageBubble
                          message={{
                            id: 'streaming',
                            role: 'assistant',
                            content: streamingContent,
                          }}
                          isStreaming
                        />
                      )}

                      {isStreaming && !streamingContent && (
                        <div className="flex items-center gap-2 px-3 py-2">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: '0.15s' }} />
                            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: '0.3s' }} />
                          </div>
                          <span className="text-xs text-[var(--text-muted)]">Thinking...</span>
                        </div>
                      )}

                      {/* Quick actions (only after greeting) */}
                      {messages.length === 1 && !isStreaming && (
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          {quickActions.map(({ label, icon: Icon, prompt }) => (
                            <button
                              key={label}
                              onClick={() => handleQuickAction(prompt)}
                              className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-[var(--border-default)] hover:border-blue-500/40 hover:bg-blue-500/5 transition-all duration-200 group"
                            >
                              <Icon className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                              <span className="text-xs font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
                                {label}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="px-3 py-2 border-t border-[var(--border-subtle)] shrink-0" style={{ background: 'var(--bg-elevated)' }}>
                      <div className="flex items-end gap-2">
                        <textarea
                          ref={inputRef}
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="Type your question here..."
                          rows={1}
                          className="flex-1 px-3 py-2 text-sm bg-[var(--bg-overlay)] border border-[var(--border-default)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-muted)] resize-none outline-none focus:border-blue-500/50 transition-colors"
                          style={{ maxHeight: '80px' }}
                          disabled={isStreaming}
                        />
                        <button
                          onClick={handleSend}
                          disabled={!input.trim() || isStreaming}
                          className="p-2.5 rounded-xl transition-all duration-200 shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
                          style={{
                            background: input.trim() && !isStreaming ? 'var(--gradient-brand)' : 'var(--bg-overlay)',
                          }}
                          aria-label="Send"
                        >
                          <SendIcon className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Sub-components ─────────────────────────────────────────────

function IdlePhase({
  isWebGPUSupported,
  onActivate,
}: {
  isWebGPUSupported: boolean | null;
  onActivate: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 gap-4 text-center">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ background: 'var(--gradient-brand)' }}
      >
        <BrainIcon className="w-7 h-7 text-white" />
      </div>
      <div>
        <h4 className="text-base font-semibold text-[var(--text-primary)] mb-1">
          AI Algorithm Tutor
        </h4>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          Get personalized explanations of the algorithm, code, and each
          visualization step. Runs locally in your browser.
        </p>
      </div>

      {isWebGPUSupported === false && (
        <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          WebGPU is required but not supported in this browser. Please use
          Chrome 113+ or Edge 113+.
        </div>
      )}

      <button
        onClick={onActivate}
        disabled={isWebGPUSupported === false}
        className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background: 'var(--gradient-brand)' }}
      >
        Activate AI Tutor
      </button>

      <p className="text-[10px] text-[var(--text-muted)]">
        First load downloads ~3 GB model. Cached for future use.
      </p>
    </div>
  );
}

function LoadingPhase({ progress, status }: { progress: number; status: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 gap-4">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center animate-pulse" style={{ background: 'var(--gradient-brand)' }}>
        <BrainIcon className="w-6 h-6 text-white" />
      </div>

      <div className="w-full max-w-[240px]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-[var(--text-secondary)]">Loading model</span>
          <span className="text-xs font-mono text-[var(--text-muted)]">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-2 w-full bg-[var(--bg-overlay)] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'var(--gradient-brand)' }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="text-[10px] text-[var(--text-muted)] mt-2 text-center">
          {status}
        </p>
      </div>
    </div>
  );
}

function ErrorPhase({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 gap-4 text-center">
      <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center">
        <span className="text-2xl">!</span>
      </div>
      <p className="text-sm text-[var(--text-secondary)]">{message}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:brightness-110"
        style={{ background: 'var(--gradient-brand)' }}
      >
        Try Again
      </button>
    </div>
  );
}

function MessageBubble({
  message,
  isStreaming,
}: {
  message: Message;
  isStreaming?: boolean;
}) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
          isUser
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
            : 'bg-[var(--bg-overlay)] text-[var(--text-primary)] border border-[var(--border-subtle)]'
        } ${isStreaming ? 'animate-pulse' : ''}`}
      >
        <div className="whitespace-pre-wrap break-words">{message.content}</div>
      </div>
    </div>
  );
}
