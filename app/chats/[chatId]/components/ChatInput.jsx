'use client';

import { Input } from '@/components/ui/Input';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Loader } from '@/components/ui/Loader';
import { SendIcon } from '@/components/ui/icons/SendIcon';
import { Button } from '@/components/ui/Button';

export const ChatInput = ({ input, setInput, loading, error, handleSend }) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4 px-4 shadow-lg">
      <div className="max-w-4xl mx-auto">
        {error && <ErrorMessage message={error} />}

        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-4 py-3" // Ajuste adicional se necessário
            aria-label="Send message"
          >
            {loading ? (
              <Loader size="small" variant="white" />
            ) : (
              <SendIcon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </footer>
  );
};
