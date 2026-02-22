import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Controls from './Controls';

const meta = {
  title: 'Components/Controls',
  component: Controls,
  parameters: {
    layout: 'centered',
  },
  args: {
    isPlaying: false,
    speed: 1,
    currentStep: 3,
    totalSteps: 15,
    onTogglePlay: () => {},
    onStepForward: () => {},
    onStepBackward: () => {},
    onReset: () => {},
    onSeek: () => {},
    onSpeedChange: () => {},
  },
} satisfies Meta<typeof Controls>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Playing: Story = {
  args: {
    isPlaying: true,
  },
};

export const FirstStep: Story = {
  args: {
    currentStep: 0,
  },
};

export const LastStep: Story = {
  args: {
    currentStep: 14,
  },
};

export const HighSpeed: Story = {
  args: {
    speed: 2,
    currentStep: 7,
  },
};
