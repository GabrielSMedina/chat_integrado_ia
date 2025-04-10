'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';

export const ChatHeader = () => {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <header className="p-4 bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/chats')}
          className="flex items-center gap-2"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Meus Chats
        </Button>
        
        {session?.user && (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="font-medium text-gray-700">{session.user.name}</p>
              <p className="text-xs text-gray-500">{session.user.email}</p>
            </div>
            <Avatar src={session.user.image} alt={session.user.name} />
          </div>
        )}
      </div>
    </header>
  );
};

const ArrowLeftIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
  </svg>
);