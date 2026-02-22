// WebGPU type declarations for navigator.gpu
interface GPU {
  requestAdapter(options?: GPURequestAdapterOptions): Promise<GPUAdapter | null>;
}

interface GPURequestAdapterOptions {
  powerPreference?: 'low-power' | 'high-performance';
}

interface GPUAdapter {
  readonly name: string;
}

interface Navigator {
  readonly gpu: GPU;
}
