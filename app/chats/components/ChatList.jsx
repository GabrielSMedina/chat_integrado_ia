'use client';

import { useChatList } from '../hooks/useChatList';
import { CreateChatButton } from './CreateChatButton';
import { ChatListItem } from './ChatListItem';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { UserProfile } from './UserProfile';
import { LoadingIndicator } from '@/components/ui/LoadingIndicator';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export const ChatList = () => {
  const {
    chats,
    loading,
    error,
    session,
    chatToDelete,
    handleCreateChat,
    handleDeleteChat,
    setChatToDelete,
    signOut,
  } = useChatList();

  if (loading) return <LoadingIndicator fullPage />;

  return (
    <div className="p-6 max-w-4xl mx-auto relative min-h-screen">
      <UserProfile session={session} signOut={signOut} />

      <h1 className="text-3xl font-bold mb-4">Your Chats</h1>

      {error && <ErrorMessage message={error} className="mb-4" />}

      <div className="mb-6">
        <CreateChatButton onCreate={handleCreateChat} />
      </div>

      {chats.length === 0 ? (
        <p className="text-gray-500">No chats found</p>
      ) : (
        <ul className="space-y-3">
          {chats.map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              onDelete={() => setChatToDelete(chat.id)}
            />
          ))}
        </ul>
      )}

      <DeleteConfirmationModal
        isOpen={!!chatToDelete}
        onClose={() => setChatToDelete(null)}
        onConfirm={() => handleDeleteChat(chatToDelete)}
      />
    </div>
  );
};
