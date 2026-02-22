import * as webllm from '@mlc-ai/web-llm';

const MODEL_ID = 'Llama-3.1-8B-Instruct-q4f32_1-MLC';

type ModelStatus = 'idle' | 'loading' | 'ready' | 'error';

let engine: webllm.MLCEngineInterface | null = null;
let modelStatus: ModelStatus = 'idle';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof navigator !== 'undefined';
}

export async function checkWebGPUSupport(): Promise<boolean> {
  if (!isBrowser()) return false;
  try {
    if (!navigator.gpu) return false;
    const adapter = await navigator.gpu.requestAdapter();
    return adapter !== null;
  } catch {
    return false;
  }
}

export async function checkCompatibility(): Promise<{
  isCompatible: boolean;
  hasWebGPU: boolean;
  isBrowser: boolean;
  errorMessage?: string;
}> {
  const browser = isBrowser();
  if (!browser) {
    return {
      isCompatible: false,
      hasWebGPU: false,
      isBrowser: false,
      errorMessage: 'WebLLM requires a browser environment.',
    };
  }
  const hasWebGPU = await checkWebGPUSupport();
  if (!hasWebGPU) {
    return {
      isCompatible: false,
      hasWebGPU: false,
      isBrowser: true,
      errorMessage: 'WebGPU is not supported. Please use Chrome 113+ or Edge 113+.',
    };
  }
  return { isCompatible: true, hasWebGPU: true, isBrowser: true };
}

export function isModelLoaded(): boolean {
  return modelStatus === 'ready' && engine !== null;
}

export function getModelStatus(): ModelStatus {
  return modelStatus;
}

export async function initializeModel(
  onProgress?: (progress: number) => void,
): Promise<void> {
  if (!isBrowser()) {
    throw new Error('WebLLM requires a browser environment.');
  }

  const hasWebGPU = await checkWebGPUSupport();
  if (!hasWebGPU) {
    throw new Error('WebGPU not supported. Use Chrome 113+ or Edge 113+.');
  }

  if (modelStatus === 'ready' && engine) {
    if (onProgress) onProgress(100);
    return;
  }

  modelStatus = 'loading';

  const initProgressCallback = (report: webllm.InitProgressReport) => {
    const progressMatch = report.text.match(/(\d+(?:\.\d+)?)\s*%/);
    let progressValue = 0;
    if (progressMatch) {
      progressValue = parseFloat(progressMatch[1]);
    } else if (report.progress !== undefined) {
      progressValue = report.progress * 100;
    }
    progressValue = Math.max(0, Math.min(100, progressValue));
    if (onProgress) onProgress(progressValue);
  };

  try {
    engine = await webllm.CreateMLCEngine(MODEL_ID, {
      initProgressCallback,
    });
    modelStatus = 'ready';
    if (onProgress) onProgress(100);
  } catch (error) {
    modelStatus = 'error';
    const msg =
      error instanceof Error ? error.message : 'Failed to initialize model.';
    throw new Error(msg);
  }
}

export interface StreamCallbacks {
  onToken?: (token: string) => void;
  onComplete?: (response: string) => void;
  onError?: (error: Error) => void;
}

export async function streamChat(
  systemPrompt: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  callbacks: StreamCallbacks = {},
): Promise<string> {
  if (!engine) {
    throw new Error('Model not initialized. Call initializeModel() first.');
  }
  if (modelStatus !== 'ready') {
    throw new Error(`Model is not ready. Current status: ${modelStatus}`);
  }

  const { onToken, onComplete, onError } = callbacks;

  try {
    const chatMessages: webllm.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...messages.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
    ];

    const stream = await engine.chat.completions.create({
      messages: chatMessages,
      temperature: 0.7,
      max_tokens: 2048,
      stream: true,
    });

    let fullResponse = '';

    for await (const chunk of stream) {
      const delta = chunk.choices.at(0)?.delta?.content;
      if (delta) {
        fullResponse += delta;
        onToken?.(delta);
      }
    }

    onComplete?.(fullResponse);
    return fullResponse;
  } catch (error) {
    const wrapped =
      error instanceof Error ? error : new Error(String(error));
    onError?.(wrapped);
    throw new Error(`Stream chat failed: ${wrapped.message}`);
  }
}

export async function resetModel(): Promise<void> {
  engine = null;
  modelStatus = 'idle';
}
