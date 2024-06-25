'use client';

import { Textarea } from '@/components/ui/Textarea';

export function AIInstructions({ instructions, handleInstructionsChange }) {
  return (
    <div>
      <h1 className="text-xl font-bold tracking-tight mb-2">Input Instructions:</h1>
      <Textarea
        placeholder="Provide instructions for the AI"
        className="min-h-[8rem]"
        value={instructions}
        onChange={handleInstructionsChange}
      />
    </div>
  );
}
