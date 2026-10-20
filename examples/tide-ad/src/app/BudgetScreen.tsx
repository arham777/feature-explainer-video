import { Warning } from '@phosphor-icons/react';
import { CATEGORIES, money, NUDGE } from '../mock-data';
import { color, radius, shadow } from '../theme';
import { Card, Dot, Meter, TideMark } from './bits';
import { CATEGORY_ICON } from './HomeScreen';

const WARN_AT = 0.85;

/**
 * Budgets, with the one the nudge is about filling up. `fill` is that
 * budget's share used (0 to 1); `nudge` slides the push notification in.
 */
export function BudgetScreen({ fill, nudge }: { fill: number; nudge: number }): React.JSX.Element {
  const pct = Math.round(fill * 100);
  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <div style={{ padding: '6px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.6 }}>Budgets</div>
          <div style={{ fontSize: 13, color: color.text2, fontWeight: 500 }}>October · {NUDGE.daysLeft} days left</div>
        </div>
        {CATEGORIES.map((c) => {
          const Icon = CATEGORY_ICON[c.name as keyof typeof CATEGORY_ICON];
          const isNudge = c.name === NUDGE.category;
          const used = isNudge ? fill : c.spent / c.limit;
          const hot = used >= WARN_AT;
          return (
            <Card key={c.name} style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Dot tone={c.tone}>
                  <Icon size={17} weight="bold" />
                </Dot>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{c.name}</div>
                  <div style={{ fontSize: 13, color: color.text2, fontVariantNumeric: 'tabular-nums' }}>
                    {money(Math.round(c.limit * used))} of {money(c.limit)}
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '4px 10px',
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: 700,
                    fontVariantNumeric: 'tabular-nums',
                    background: hot ? color.tone.coral.fill : color.fill,
                    color: hot ? color.tone.coral.ink : color.text2,
                  }}
                >
                  {hot ? <Warning size={14} weight="fill" /> : null}
                  {isNudge ? pct : Math.round(used * 100)}%
                </div>
              </div>
              <Meter value={used} fill={hot ? color.warn : color.tone[c.tone].ink} height={10} />
            </Card>
          );
        })}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 12,
          right: 12,
          top: 50,
          padding: '12px 14px',
          borderRadius: radius.lg,
          background: 'rgba(255,255,255,0.97)',
          boxShadow: shadow.float,
          display: 'flex',
          gap: 12,
          opacity: Math.min(1, nudge),
          transform: `translateY(${(1 - nudge) * -140}px)`,
        }}
      >
        <TideMark size={36} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ fontWeight: 700 }}>Tide</span>
            <span style={{ color: color.text3 }}>now</span>
          </div>
          <div style={{ fontSize: 14, lineHeight: 1.35, color: color.text }}>
            Heads up: {NUDGE.category} is at {Math.round(NUDGE.to * 100)}%, with {NUDGE.daysLeft} days to go.
          </div>
        </div>
      </div>
    </div>
  );
}
