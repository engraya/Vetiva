import { useNavigate } from 'react-router';
import { Star, UserRound } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/features/auth/store';

function HeaderIconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-[42px] items-center justify-center rounded-input border border-line bg-white text-ink transition-colors hover:bg-olive-soft focus-visible:outline-2 focus-visible:outline-olive"
    >
      {children}
    </button>
  );
}

/** Approved app-shell header: "Welcome {NAME}" + two bordered icon buttons. */
export function AppHeader() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between border-b border-line px-4 pb-3 pt-4 md:px-[34px] md:pb-4 md:pt-5">
      <div>
        <h1 className="text-xl font-bold tracking-[-0.02em] text-ink md:text-2xl">
          Welcome {user ? user.firstName.toUpperCase() : ''}
        </h1>
        <p className="mt-0.5 text-sm text-muted">Let's grow your assets today</p>
      </div>
      <div className="flex gap-2.5">
        <HeaderIconButton label="Favourites" onClick={() => toast('Favourites — [DEMO]')}>
          <Star className="size-[18px]" aria-hidden />
        </HeaderIconButton>
        <HeaderIconButton label="Profile" onClick={() => navigate('/profile')}>
          <UserRound className="size-[18px]" aria-hidden />
        </HeaderIconButton>
      </div>
    </header>
  );
}
