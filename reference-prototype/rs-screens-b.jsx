// rs-screens-b.jsx — Plan, Investors, Deck & Data Room, Improvement
(function () {
  const { useState } = React;

  const scrollStyle = {
    flex: 1, width: '100%', overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch',
  };
  const bodyPad = { padding: '4px 18px 26px' };

  /* ============================================================
     SCREEN 3 — FUNDRAISING PLAN
     ============================================================ */
  function PlanScreen({ go }) {
    const useOfFunds = [
      { label: 'Growth', v: 40, c: 'var(--primary)' },
      { label: 'Product', v: 25, c: '#6D5CF0' },
      { label: 'Content & localization', v: 20, c: 'var(--cyan)' },
      { label: 'Operations', v: 15, c: '#9AA4BD' },
    ];
    const valuationLogic = [
      { t: '$84k ARR', ok: true },
      { t: '8.5% monthly growth', ok: true },
      { t: 'Consumer subscription category', ok: true },
      { t: 'LATAM-first market discount', ok: 'neutral' },
      { t: 'US expansion upside', ok: true },
      { t: 'CAC still unknown', ok: false },
    ];

    return (
      <div className="rs-scroll" style={scrollStyle}>
        <AppHeader back onBack={() => go('dashboard')} title="Fundraising Plan" sub="Recommendation based on your signal" />
        <div style={bodyPad}>
          {/* recommended round */}
          <Card className="rise" pad={20} style={{ background: 'linear-gradient(160deg, var(--primary) 0%, var(--primary-600) 100%)', border: 'none', boxShadow: '0 14px 34px -10px rgba(49,64,206,0.55)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.72)' }}>Recommended round</span>
              <span style={{ fontSize: 12, fontWeight: 650, color: '#fff', background: 'rgba(255,255,255,0.18)', padding: '4px 11px', borderRadius: 999 }}>Pre-seed / Seed</span>
            </div>
            <div className="num" style={{ fontSize: 38, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em', margin: '14px 0 2px', lineHeight: 1 }}>$500k–$1.2M</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.72)', marginBottom: 18 }}>Suggested raise amount</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.16)' }}>
              <RoundStat label="Valuation" value="$3–6M" sub="pre-money" />
              <RoundStat label="Dilution" value="12–20%" />
              <RoundStat label="Runway" value="18 mo" />
            </div>
          </Card>

          {/* narrative */}
          <Card className="rise" style={{ marginTop: 14, animationDelay: '.05s' }}>
            <CardTitle icon="doc">Best investor narrative</CardTitle>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.5, color: 'var(--ink)', fontWeight: 500, letterSpacing: '-0.01em' }}>
              “LATAM-born social gaming app expanding to the US with proven organic traction and subscription revenue.”
            </p>
          </Card>

          {/* use of funds */}
          <Card className="rise" style={{ marginTop: 14, animationDelay: '.09s' }}>
            <CardTitle icon="pieChart">Use of funds</CardTitle>
            <div style={{ display: 'flex', height: 12, borderRadius: 999, overflow: 'hidden', marginBottom: 16 }}>
              {useOfFunds.map(f => <div key={f.label} style={{ width: f.v + '%', background: f.c }} />)}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {useOfFunds.map(f => (
                <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: f.c, flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 13.5, color: 'var(--ink)', fontWeight: 500 }}>{f.label}</span>
                  <span className="num" style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{f.v}%</span>
                </div>
              ))}
            </div>
          </Card>

          {/* valuation logic */}
          <Card className="rise" style={{ marginTop: 14, animationDelay: '.13s' }}>
            <CardTitle icon="coins">Why this valuation range?</CardTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {valuationLogic.map(b => {
                const color = b.ok === true ? 'var(--success)' : b.ok === false ? 'var(--danger)' : 'var(--ink-4)';
                const icon = b.ok === true ? 'check' : b.ok === false ? 'alert' : 'minusCircle';
                return (
                  <div key={b.t} style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                    <div style={{ color, display: 'flex' }}><Icon name={icon} size={18} /></div>
                    <span style={{ fontSize: 13.5, color: b.ok === false ? 'var(--danger)' : 'var(--ink)', fontWeight: b.ok === false ? 600 : 500 }}>{b.t}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          <Button full variant="dark" iconRight="arrowUpRight" style={{ marginTop: 18 }} onClick={() => go('investors')}>Match me with investors</Button>
        </div>
      </div>
    );
  }

  function RoundStat({ label, value, sub }) {
    return (
      <div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', fontWeight: 550, marginBottom: 4 }}>{label}</div>
        <div className="num" style={{ fontSize: 17, fontWeight: 600, color: '#fff', lineHeight: 1 }}>{value}</div>
        {sub && <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.55)', marginTop: 3 }}>{sub}</div>}
      </div>
    );
  }

  /* ============================================================
     SCREEN 4 — INVESTOR MATCHES
     ============================================================ */
  function InvestorsScreen({ go }) {
    const [active, setActive] = useState({});
    const filters = ['Stage', 'Geography', 'Industry', 'Ticket size', 'Recent activity'];
    const investors = [
      { name: 'LTV Capital', fit: 91, mono: 'LV', color: '#3B4EE8', why: ['Consumer subscription', 'Seed stage', 'Strong fit with recurring revenue'] },
      { name: 'Latitud Ventures', fit: 87, mono: 'La', color: '#12936A', why: ['LATAM founder ecosystem', 'Early-stage startups', 'Market expansion potential'] },
      { name: 'Hustle Fund', fit: 83, mono: 'HF', color: '#E8710A', why: ['Early traction', 'Founder-led growth', 'Fast-moving consumer apps'] },
      { name: '500 Global LATAM', fit: 81, mono: '500', color: '#6D5CF0', why: ['LATAM expansion', 'Early-stage portfolio', 'Consumer and SaaS exposure'] },
    ];

    return (
      <div className="rs-scroll" style={scrollStyle}>
        <AppHeader title="Investor Matches" sub="4 strong matches for your signal" right={<IconButton name="filter" />} />
        {/* filters */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '2px 18px 12px', scrollbarWidth: 'none' }} className="rs-scroll">
          {filters.map(f => (
            <button key={f} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5, padding: '8px 13px', borderRadius: 999,
              border: '1px solid var(--hairline)', background: 'var(--card)', color: 'var(--ink-2)',
              fontSize: 13, fontWeight: 550, whiteSpace: 'nowrap', boxShadow: 'var(--shadow-sm)', flexShrink: 0,
            }}>{f}<Icon name="chevDown" size={14} color="var(--ink-4)" /></button>
          ))}
        </div>

        <div style={bodyPad}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {investors.map((inv, i) => {
              const added = active[inv.name];
              return (
                <Card key={inv.name} className="rise" style={{ animationDelay: (i * 0.05) + 's' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                    <div style={{
                      width: 46, height: 46, borderRadius: 13, flexShrink: 0, background: inv.color, color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700,
                      fontSize: inv.mono.length > 2 ? 15 : 17, letterSpacing: '-0.02em',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25)',
                    }}>{inv.mono}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.01em' }}>{inv.name}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>Recently active · Seed</div>
                    </div>
                    <FitBadge value={inv.fit} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 15 }}>
                    {inv.why.map(w => (
                      <div key={w} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <Icon name="check" size={15} color="var(--success)" />
                        <span style={{ fontSize: 13, color: 'var(--ink-2)', fontWeight: 500 }}>{w}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 9 }}>
                    <Button size="sm" full icon="mail">Generate intro email</Button>
                    <button onClick={() => setActive(a => ({ ...a, [inv.name]: !a[inv.name] }))} style={{
                      width: 42, flexShrink: 0, borderRadius: 13, border: '1px solid ' + (added ? 'transparent' : 'var(--hairline)'),
                      background: added ? 'var(--primary-soft)' : 'var(--card)', color: added ? 'var(--primary)' : 'var(--ink-3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}><Icon name={added ? 'check' : 'bookmark'} size={18} /></button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  function FitBadge({ value }) {
    const c = value >= 90 ? 'var(--success)' : value >= 85 ? 'var(--primary)' : 'var(--cyan)';
    const bg = value >= 90 ? 'var(--success-soft)' : value >= 85 ? 'var(--primary-soft)' : 'var(--cyan-soft)';
    return (
      <div style={{ textAlign: 'center', background: bg, borderRadius: 13, padding: '7px 11px', flexShrink: 0 }}>
        <div className="num" style={{ fontSize: 19, fontWeight: 600, color: c, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 9.5, fontWeight: 600, color: c, letterSpacing: '0.04em', marginTop: 2 }}>FIT</div>
      </div>
    );
  }

  /* ============================================================
     SCREEN 5 — DECK & DATA ROOM
     ============================================================ */
  function DeckScreen({ go }) {
    const slides = [
      { n: 1, t: 'Cover', s: 'Strong' },
      { n: 2, t: 'Problem', s: 'Good' },
      { n: 3, t: 'Solution', s: 'Good' },
      { n: 4, t: 'Market', s: 'Needs work' },
      { n: 5, t: 'Product', s: 'Strong' },
      { n: 6, t: 'Traction', s: 'Strong' },
      { n: 7, t: 'Business Model', s: 'Good' },
      { n: 8, t: 'Competition', s: 'Needs work' },
      { n: 9, t: 'Go-to-market', s: 'Good' },
      { n: 10, t: 'Financials', s: 'Missing' },
      { n: 11, t: 'The Ask', s: 'Needs work' },
      { n: 12, t: 'Team', s: 'Good' },
    ];
    const counts = slides.reduce((a, s) => { a[s.s] = (a[s.s] || 0) + 1; return a; }, {});
    const dataRoom = [
      { t: 'Company overview', s: 'Done' },
      { t: 'Metrics summary', s: 'Done' },
      { t: 'Cap table', s: 'Missing' },
      { t: 'Financial model', s: 'Missing' },
      { t: 'Legal docs', s: 'Missing' },
      { t: 'Product screenshots', s: 'Done' },
      { t: 'Investor FAQ', s: 'Suggested' },
    ];

    return (
      <div className="rs-scroll" style={scrollStyle}>
        <AppHeader back onBack={() => go('dashboard')} title="Deck & Data Room" />
        <div style={bodyPad}>
          {/* pitch deck */}
          <Card className="rise">
            <CardTitle icon="layers" right={<span style={{ fontSize: 12, color: 'var(--ink-3)' }} className="num">12 slides</span>}>Pitch Deck</CardTitle>
            <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
              {['Strong', 'Good', 'Needs work', 'Missing'].filter(s => counts[s]).map(s => (
                <span key={s} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px',
                  borderRadius: 999, fontSize: 11.5, fontWeight: 600,
                  color: ({ Strong: 'var(--success)', Good: 'var(--primary)', 'Needs work': 'var(--warning)', Missing: 'var(--danger)' })[s],
                  background: ({ Strong: 'var(--success-soft)', Good: 'var(--primary-soft)', 'Needs work': 'var(--warning-soft)', Missing: 'var(--danger-soft)' })[s],
                }}><span className="num">{counts[s]}</span>{s}</span>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginBottom: 16 }}>
              {slides.map(sl => <SlideTile key={sl.n} {...sl} />)}
            </div>
            <Button full icon="spark" onClick={() => go('improve')}>Generate deck</Button>
          </Card>

          {/* data room */}
          <Card className="rise" style={{ marginTop: 14, animationDelay: '.06s' }}>
            <CardTitle icon="vault"
              right={<span className="num" style={{ fontSize: 13, fontWeight: 650, color: 'var(--warning)' }}>68% ready</span>}>
              Data Room Checklist
            </CardTitle>
            <ProgressBar value={68} color="var(--warning)" height={8} />
            <div style={{ marginTop: 6 }}>
              {dataRoom.map((d, i) => {
                const done = d.s === 'Done';
                const icon = done ? 'checkCircle' : d.s === 'Suggested' ? 'plusCircle' : 'minusCircle';
                const col = done ? 'var(--success)' : d.s === 'Suggested' ? 'var(--cyan)' : 'var(--ink-4)';
                return (
                  <div key={d.t} style={{
                    display: 'flex', alignItems: 'center', gap: 11, padding: '12px 0',
                    borderBottom: i === dataRoom.length - 1 ? 'none' : '1px solid var(--hairline-2)',
                  }}>
                    <Icon name={icon} size={19} color={col} />
                    <span style={{ flex: 1, fontSize: 13.5, fontWeight: 500, color: done ? 'var(--ink)' : 'var(--ink-2)' }}>{d.t}</span>
                    <StatusPill status={d.s} dot={false} />
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  function SlideTile({ n, t, s }) {
    const map = { Strong: 'var(--success)', Good: 'var(--primary)', 'Needs work': 'var(--warning)', Missing: 'var(--danger)' };
    const c = map[s];
    return (
      <div style={{
        border: '1px solid var(--hairline)', borderRadius: 13, padding: '11px 12px', background: 'var(--bg)',
        display: 'flex', flexDirection: 'column', gap: 9,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="num" style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-4)' }}>{String(n).padStart(2, '0')}</span>
          <span style={{ width: 7, height: 7, borderRadius: 999, background: c }} />
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.01em' }}>{t}</div>
        <span style={{ fontSize: 11, fontWeight: 600, color: c }}>{s}</span>
      </div>
    );
  }

  /* ============================================================
     SCREEN 6 — IMPROVEMENT PLAN
     ============================================================ */
  function ImproveScreen({ go }) {
    const actions = [
      { t: 'Add CAC estimate', impact: 8, d: 'Connect Meta Ads or enter acquisition spend manually.', icon: 'coins' },
      { t: 'Improve retention proof', impact: 10, d: 'Add cohort retention or repeat usage metrics.', icon: 'refresh' },
      { t: 'Strengthen market story', impact: 6, d: 'Clarify why this can become a venture-scale company.', icon: 'globe' },
      { t: 'Fix competition slide', impact: 5, d: 'Show why your wedge is different from existing party games.', icon: 'target' },
    ].sort((a, b) => b.impact - a.impact);
    const potential = Math.min(98, 72 + actions.reduce((a, b) => a + b.impact, 0));

    return (
      <div className="rs-scroll" style={scrollStyle}>
        <AppHeader back onBack={() => go('dashboard')} title="Improve your score" />
        <div style={bodyPad}>
          {/* projection banner */}
          <Card className="rise" pad={18} style={{ background: 'linear-gradient(160deg, #FBFCFF 0%, var(--primary-tint) 100%)' }}>
            <Eyebrow>Score projection</Eyebrow>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 12 }}>
              <div className="num" style={{ fontSize: 32, fontWeight: 600, color: 'var(--ink-3)' }}>72</div>
              <div style={{ flex: 1, position: 'relative', height: 8 }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: 999, background: 'var(--hairline)' }} />
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: potential + '%', borderRadius: 999, background: 'linear-gradient(90deg, var(--primary), var(--success))' }} />
                <Icon name="arrowUpRight" size={16} color="var(--success)" style={{ position: 'absolute', right: -4, top: -22 }} />
              </div>
              <div className="num" style={{ fontSize: 32, fontWeight: 600, color: 'var(--success)' }}>{potential}</div>
            </div>
            <p style={{ margin: '14px 0 0', fontSize: 13, lineHeight: 1.45, color: 'var(--ink-2)' }}>
              Completing all 4 actions could lift you to <strong style={{ color: 'var(--ink)' }}>{potential}/100</strong> — comfortably Seed-ready.
            </p>
          </Card>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 14 }}>
            {actions.map((a, i) => (
              <Card key={a.t} className="rise" pad={16} style={{ animationDelay: (i * 0.05) + 's' }}>
                <div style={{ display: 'flex', gap: 13 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 11, flexShrink: 0,
                    background: i === 0 ? 'var(--primary)' : 'var(--primary-soft)', color: i === 0 ? '#fff' : 'var(--primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}><Icon name={a.icon} size={19} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                      <span style={{ fontSize: 14.5, fontWeight: 650, color: 'var(--ink)', letterSpacing: '-0.01em' }}>{a.t}</span>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: 12, fontWeight: 700,
                        color: 'var(--success)', background: 'var(--success-soft)', padding: '4px 9px', borderRadius: 999, flexShrink: 0,
                      }}><Icon name="trendUp" size={13} />+{a.impact}</span>
                    </div>
                    <p style={{ margin: '5px 0 0', fontSize: 13, lineHeight: 1.45, color: 'var(--ink-2)' }}>{a.d}</p>
                    {i === 0 && (
                      <div style={{ marginTop: 12 }}>
                        <Button size="sm" icon="bolt" onClick={() => go('dashboard')}>Start with highest impact</Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  Object.assign(window, { PlanScreen, InvestorsScreen, DeckScreen, ImproveScreen });
})();
