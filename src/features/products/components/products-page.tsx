import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { DemoTag } from '@/components/common/demo-tag';
import { PageTransition } from '@/components/common/page-transition';

const TILES = [
  { icon: '🛢️', title: 'Offer', description: 'IPO & Rights Issue', to: '/offers' },
  { icon: '📈', title: 'Securities', description: 'Trade Securities' },
  { icon: '💼', title: 'Mutual Fund', description: 'Naira and USD' },
  { icon: '🏦', title: 'Fixed Income', description: 'Naira and USD' },
  { icon: '🛡️', title: 'Trust', description: 'Get a Trust Plan' },
  { icon: '🎛️', title: 'Managed Portfolio', description: 'Naira and USD' },
] as const;

export function ProductsPage() {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <h3 className="mb-3.5 text-lg font-bold text-ink">Invest</h3>
      <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(210px,1fr))]">
        {TILES.map((tile) => (
          <button
            key={tile.title}
            type="button"
            onClick={() =>
              'to' in tile && tile.to
                ? navigate(tile.to)
                : toast(`${tile.title} — coming after the IPO [DEMO]`)
            }
            className="rounded-btn border border-line bg-white p-5 text-left transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive motion-reduce:hover:translate-y-0"
          >
            <div className="text-[1.7rem]" aria-hidden>
              {tile.icon}
            </div>
            <h4 className="mt-2.5 text-[15px] font-bold text-ink">{tile.title}</h4>
            <p className="mt-0.5 text-[13px] text-muted">{tile.description}</p>
          </button>
        ))}
      </div>
      <p className="mt-[18px] text-xs leading-relaxed text-muted">
        The Dangote IPO is the launch focus — the other products are placeholders for features that
        come after. <DemoTag />
      </p>
    </PageTransition>
  );
}
