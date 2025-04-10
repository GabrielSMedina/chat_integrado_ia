'use client';

import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';

export const UserProfile = ({ session, signOut }) => {
  if (!session?.user) return null;

  return (
    <div className="absolute top-6 right-6 flex items-center gap-4">
      <div className="hidden sm:block text-right">
        <p className="font-medium text-sm">{session.user.name}</p>
        <p className="text-xs text-gray-500">{session.user.email}</p>
      </div>
      <Avatar src={session.user.image} alt={session.user.name} size="medium" />
      <Button
        onClick={signOut}
        size="small"
        variant="danger"
        className="text-xs"
      >
        Sign Out
      </Button>
    </div>
  );
};
