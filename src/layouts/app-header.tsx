import { useNavigate } from 'react-router';
import { LogOut, Menu, UserRound } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/features/auth/store';
import { useOffer } from '@/features/offer/api';

export function AppHeader({ onOpenNav }: { onOpenNav: () => void }) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const { data: offer } = useOffer();

  return (
    <header className="glass sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-line px-4 md:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenNav}
          aria-label="Open navigation"
          className="rounded-md p-2 text-ink hover:bg-olive-soft lg:hidden"
        >
          <Menu className="size-5" aria-hidden />
        </button>
        {offer && (
          <div className="flex items-center gap-2.5 text-sm">
            <span className="hidden font-bold text-ink md:inline">{offer.ticker}</span>
            {offer.status === 'live' ? (
              <Badge variant="live" pulse>
                Live
              </Badge>
            ) : offer.status === 'upcoming' ? (
              <Badge variant="soon">Opens soon</Badge>
            ) : (
              <Badge variant="neutral">Closed</Badge>
            )}
          </div>
        )}
      </div>

      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Account menu"
            className="flex items-center gap-2.5 rounded-full p-1 pr-3 transition-colors hover:bg-olive-soft focus-visible:outline-2 focus-visible:outline-olive"
          >
            <Avatar name={user.name} className="size-8 text-[11px]" />
            <span className="hidden text-sm font-semibold text-ink sm:inline">
              {user.firstName}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>
              <div className="font-semibold text-ink">{user.name}</div>
              <div className="mt-0.5">{user.email}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => navigate('/profile')}>
              <UserRound className="size-4" aria-hidden />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                logout();
                navigate('/');
              }}
            >
              <LogOut className="size-4" aria-hidden />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
}
