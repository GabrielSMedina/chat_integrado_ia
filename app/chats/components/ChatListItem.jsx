'use client';

import { Button } from '@/components/ui/Button';
import { TrashIcon } from '@/components/ui/icons/TrashIcon';
import { useRouter } from 'next/navigation';

export const ChatListItem = ({ chat, onDelete }) => {
  const router = useRouter();

  return (
    <li className="flex items-center justify-between border p-4 rounded shadow-sm hover:bg-gray-50 transition">
      <div
        className="flex-1 cursor-pointer hover:underline"
        onClick={() => router.push(`/chats/${chat.id}`)}
      >
        {chat.title || 'Untitled Chat'}
      </div>
      <Button
        variant="danger"
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="px-3 py-1.5" // Ajuste adicional
        aria-label="Delete chat"
      >
        <TrashIcon className="h-4 w-4" />
      </Button>
    </li>
  );
};
