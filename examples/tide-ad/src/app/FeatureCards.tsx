import { AirplaneTilt, Check, Receipt, Repeat } from '@phosphor-icons/react';
import { FORGOTTEN, GOAL, money, SPLIT } from '../mock-data';
import { color } from '../theme';
import { Card, Dot, Label, Meter } from './bits';

const WIDTH = 360;

function Head({ icon, children }: { icon: React.ReactNode; children: string }): React.JSX.Element {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ color: color.text2, display: 'flex' }}>{icon}</span>
      <Label>{children}</Label>
    </div>
  );
}

/** A subscription nobody has opened in months, with the one-tap cancel. */
export function SubscriptionCard(): React.JSX.Element {
  return (
    <Card style={{ width: WIDTH, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Head icon={<Repeat size={17} />}>Forgotten subscription</Head>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Dot tone="blue" size={42}>
          PV
        </Dot>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 17, fontWeight: 700 }}>{FORGOTTEN.name}</div>
          <div style={{ fontSize: 13, color: color.text2 }}>Last opened {FORGOTTEN.lastUsed}</div>
        </div>
        <div style={{ fontSize: 17, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{money(FORGOTTEN.price, 2)}</div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1, height: 40, borderRadius: 999, background: color.ink, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>
          Cancel it
        </div>
        <div style={{ flex: 1, height: 40, borderRadius: 999, background: color.fill, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, color: color.text2 }}>
          Keep
        </div>
      </div>
      <div style={{ fontSize: 13, color: color.success, fontWeight: 600 }}>Saves {money(FORGOTTEN.price * 12, 2)} a year</div>
    </Card>
  );
}

/** The dinner bill split four ways, everyone already paid. */
export function SplitCard(): React.JSX.Element {
  const each = SPLIT.total / SPLIT.people.length;
  return (
    <Card style={{ width: WIDTH, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Head icon={<Receipt size={17} />}>Split the bill</Head>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontSize: 17, fontWeight: 700 }}>{SPLIT.place}</div>
        <div style={{ fontSize: 17, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{money(SPLIT.total, 2)}</div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {SPLIT.people.map((p) => (
          <div key={p.initials} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '10px 0', borderRadius: 14, background: color.fill }}>
            <Dot tone={p.tone} size={34}>
              {p.initials}
            </Dot>
            <div style={{ fontSize: 13, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{money(each, 2)}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11.5, color: color.success, fontWeight: 600 }}>
              <Check size={12} weight="bold" /> Paid
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/** A savings goal filling from round-ups. `fill` animates the meter in. */
export function GoalCard({ fill = 1 }: { fill?: number }): React.JSX.Element {
  const share = GOAL.saved / GOAL.target;
  return (
    <Card style={{ width: WIDTH, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Head icon={<AirplaneTilt size={17} />}>Goal</Head>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontSize: 17, fontWeight: 700 }}>{GOAL.name}</div>
        <div style={{ fontSize: 15, color: color.text2, fontVariantNumeric: 'tabular-nums' }}>
          <b style={{ color: color.text }}>{money(GOAL.saved)}</b> of {money(GOAL.target)}
        </div>
      </div>
      <Meter value={share * fill} fill={color.accent} height={12} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
        <span style={{ color: color.success, fontWeight: 700 }}>+{money(GOAL.roundUps, 2)} in round-ups this week</span>
        <span style={{ color: color.text2, fontWeight: 600 }}>{Math.round(share * 100)}%</span>
      </div>
    </Card>
  );
}
