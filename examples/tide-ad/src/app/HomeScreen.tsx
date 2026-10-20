import { Bank, Car, Confetti, CreditCard, ForkKnife, PiggyBank, ShoppingCart } from '@phosphor-icons/react';
import { ACCOUNTS, CATEGORIES, money, SAFE_TO_SPEND, USER } from '../mock-data';
import { color, radius } from '../theme';
import { Card, Dot, Label, Meter } from './bits';

export const CATEGORY_ICON = { Groceries: ShoppingCart, 'Eating out': ForkKnife, Transport: Car, Fun: Confetti } as const;
const ACCOUNT_ICON = [Bank, PiggyBank, CreditCard] as const;

/**
 * Home: what is safe to spend, where the month went, every account.
 * `count` runs the big number up from 0, `bars` grows the meters.
 */
export function HomeScreen({ count, bars }: { count: number; bars: number }): React.JSX.Element {
  return (
    <div style={{ padding: '6px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 13, color: color.text2, fontWeight: 500 }}>Good morning, {USER.name}</div>
          <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.6 }}>Your money</div>
        </div>
        <Dot tone="violet" size={38}>
          {USER.initials}
        </Dot>
      </div>

      <div style={{ background: color.accent, color: '#fff', borderRadius: radius.lg, padding: '18px 18px 16px' }}>
        <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.8 }}>Safe to spend this month</div>
        <div style={{ fontSize: 46, fontWeight: 800, letterSpacing: -1.6, fontVariantNumeric: 'tabular-nums', margin: '2px 0' }}>
          {money(Math.round(SAFE_TO_SPEND * count))}
        </div>
        <div style={{ fontSize: 13, opacity: 0.8 }}>after bills and your goals · 18 days to payday</div>
      </div>

      <Card style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Label>Spending this month</Label>
        {CATEGORIES.map((c) => {
          const Icon = CATEGORY_ICON[c.name as keyof typeof CATEGORY_ICON];
          return (
            <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Dot tone={c.tone}>
                <Icon size={17} weight="bold" />
              </Dot>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ fontWeight: 600 }}>{c.name}</span>
                  <span style={{ color: color.text2, fontVariantNumeric: 'tabular-nums' }}>
                    {money(c.spent)} of {money(c.limit)}
                  </span>
                </div>
                <Meter value={(c.spent / c.limit) * bars} fill={color.tone[c.tone].ink} />
              </div>
            </div>
          );
        })}
      </Card>

      <div style={{ display: 'flex', gap: 10 }}>
        {ACCOUNTS.map((a, i) => {
          const Icon = ACCOUNT_ICON[i];
          return (
            <Card key={a.name} style={{ flex: 1, padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Icon size={18} color={color.text2} />
              <div style={{ fontSize: 12, color: color.text2, fontWeight: 500 }}>{a.name}</div>
              <div style={{ fontSize: 15, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{money(a.amount)}</div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
