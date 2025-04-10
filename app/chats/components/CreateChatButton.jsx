'use client';

import { Button } from '@/components/ui/Button';
import { PlusIcon } from '@/components/ui/icons/PlusIcon';

export const CreateChatButton = ({ onCreate }) => {
  return (
    <Button onClick={onCreate} className="px-5 py-2.5 flex items-center gap-2">
      <PlusIcon className="h-5 w-5" />
      Create New Chat
    </Button>
  );
};
