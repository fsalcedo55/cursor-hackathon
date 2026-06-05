// rs-screens-a.jsx — Onboarding (Analyze) + Dashboard
(function () {
  const { useState } = React;

  const scrollStyle = {
    flex: 1, width: '100%', overflowY: 'auto', overflowX: 'hidden',
    WebkitOverflowScrolling: 'touch',
  };
  const bodyPad = { padding: '4px 18px 26px' };

  /* ============================================================
     SCREEN 1 — ONBOARDING / ANALYZE STARTUP
     ============================================================ */
  function AnalyzeScreen({ url, setUrl, connected, toggleConnector, onAnalyze }) {
    const connectors = ['Stripe', 'RevenueCat', 'App Store', 'Google Play', 'GA4', 'Firebase', 'Shopify', 'Meta Ads'];
    const features = [
      { icon: 'target', t: 'Fundraising readiness score' },
      { icon: 'doc', t: 'Investor-ready narrative' },
      { icon: 'coins', t: 'Valuation estimate' },
      { icon: 'investors', t: 'VC matching' },
      { icon: 'vault', t: 'Data room checklist' },
    ];
    const nConn = Object.values(connected).filter(Boolean).length;

    return (
      <div className="rs-scroll" style={scrollStyle}>
        {/* brand bar */}
        <div style={{ padding: '54px 18px 6px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Logomark size={30} />
          <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em' }}>RaiseSignal</span>
        </div>

        <div style={bodyPad}>
          {/* hero */}
          <div className="rise" style={{ marginTop: 18, marginBottom: 22 }}>
            <Eyebrow style={{ color: 'var(--primary)' }}>Fundraising OS</Eyebrow>
            <h1 style={{
              fontSize: 34, lineHeight: 1.05, fontWeight: 700, color: 'var(--ink)',
              letterSpacing: '-0.03em', margin: '10px 0 10px', textWrap: 'balance',
            }}>Get investor-ready</h1>
            <p style={{ fontSize: 15, lineHeight: 1.5, color: 'var(--ink-2)', margin: 0, maxWidth: 320 }}>
              Paste your startup URL. We'll analyze your business, metrics, market, valuation, deck, and investor fit.
            </p>
          </div>

          {/* URL input card */}
          <Card className="rise" pad={16} style={{ animationDelay: '.05s' }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-3)', letterSpacing: '0.01em' }}>Startup URL</label>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 9, marginTop: 8, marginBottom: 14,
              padding: '12px 14px', borderRadius: 13, background: 'var(--bg)', border: '1px solid var(--hairline)',
            }}>
              <Icon name="globe" size={19} color="var(--ink-4)" />
              <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://yourstartup.com"
                style={{
                  border: 'none', outline: 'none', background: 'transparent', flex: 1, minWidth: 0,
                  fontSize: 15, fontFamily: 'var(--mono)', color: 'var(--ink)', letterSpacing: '-0.01em',
                }} />
            </div>
            <Button full icon="spark" onClick={onAnalyze}>Analyze startup</Button>
          </Card>

          {/* connectors */}
          <div style={{ marginTop: 24, marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Eyebrow>Connect metrics · optional</Eyebrow>
            {nConn > 0 && <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--success)' }}>{nConn} connected</span>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
            {connectors.map(name => {
              const on = connected[name];
              return (
                <button key={name} onClick={() => toggleConnector(name)} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '11px 12px', borderRadius: 14,
                  background: 'var(--card)', textAlign: 'left',
                  border: '1px solid ' + (on ? 'var(--primary)' : 'var(--hairline)'),
                  boxShadow: on ? '0 4px 14px -6px rgba(49,64,206,0.45)' : 'var(--shadow-sm)',
                  transition: 'all .16s ease',
                }}>
                  <ConnectorGlyph name={name} size={30} />
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</span>
                  <div style={{
                    width: 19, height: 19, borderRadius: 999, flexShrink: 0,
                    border: on ? 'none' : '1.6px solid var(--hairline)',
                    background: on ? 'var(--primary)' : 'transparent', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{on && <Icon name="check" size={12} strokeWidth={3} />}</div>
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 14, color: 'var(--ink-3)' }}>
            <Icon name="info" size={15} />
            <span style={{ fontSize: 12.5 }}>You can start without connecting anything.</span>
          </div>

          {/* feature card */}
          <Card className="rise" tone="tint" style={{ marginTop: 22, background: 'linear-gradient(165deg, #FBFCFF 0%, var(--primary-tint) 100%)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
              <Icon name="rocket" size={19} color="var(--primary)" />
              <span style={{ fontSize: 15, fontWeight: 650, color: 'var(--ink)', letterSpacing: '-0.01em' }}>Everything you need to raise with confidence</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {features.map(f => (
                <div key={f.t} style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 9, background: 'rgba(255,255,255,0.9)', color: 'var(--primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)',
                  }}><Icon name={f.icon} size={16} /></div>
                  <span style={{ fontSize: 14, fontWeight: 550, color: 'var(--ink)' }}>{f.t}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  /* ============================================================
     SCREEN 2 — FUNDRAISING DASHBOARD
     ============================================================ */
  function DashboardScreen({ go }) {
    const breakdown = [
      { label: 'Product Clarity', v: 82 },
      { label: 'Market Opportunity', v: 74 },
      { label: 'Traction', v: 68 },
      { label: 'Business Model', v: 71 },
      { label: 'Investor Fit', v: 76 },
    ];
    const issues = [
      'Retention story is weak',
      'CAC is missing',
      'Competitor positioning is unclear',
      'Valuation needs stronger support',
      'Deck lacks a strong “why now”',
    ];
    const metrics = [
      { label: 'MRR', value: '$7,000' },
      { label: 'ARR', value: '$84,000' },
      { label: 'MoM Growth', value: '8.5%', trend: <TrendChip value="8.5" positive /> },
      { label: 'ARPU', value: '$4.90' },
      { label: 'Churn', value: '6.2%', accent: 'var(--warning)' },
      { label: 'Est. LTV', value: '$79' },
    ];

    return (
      <div className="rs-scroll" style={scrollStyle}>
        <AppHeader brand title="RaiseSignal" right={<IconButton name="bell" badge />} />

        <div style={bodyPad}>
          {/* readiness hero */}
          <Card className="rise" pad={20} style={{
            background: 'linear-gradient(160deg, #FBFCFF 0%, var(--primary-tint) 100%)',
            overflow: 'hidden',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <div>
                <Eyebrow>Fundraising Readiness Score</Eyebrow>
                <div style={{ marginTop: 8 }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 11px', borderRadius: 999,
                    background: 'var(--success-soft)', color: 'var(--success)', fontSize: 12, fontWeight: 650,
                  }}><Icon name="checkCircle" size={14} />Seed-ready</span>
                </div>
              </div>
              <ScoreRing value={72} size={104} stroke={11} suffix="/100" />
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.45, color: 'var(--ink-2)', margin: '14px 0 16px' }}>
              You look <strong style={{ color: 'var(--ink)' }}>Seed-ready</strong>, but need stronger retention proof.
            </p>
            <div style={{ display: 'flex', gap: 9 }}>
              <Button size="sm" full icon="bolt" onClick={() => go('improve')}>Improve score</Button>
              <Button size="sm" full variant="secondary" icon="flag" onClick={() => go('plan')}>View plan</Button>
            </div>
          </Card>

          {/* score breakdown */}
          <Card className="rise" style={{ marginTop: 14, animationDelay: '.04s' }}>
            <CardTitle icon="sliders">Score breakdown</CardTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {breakdown.map((b, i) => (
                <div key={b.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 7 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 550, color: 'var(--ink)' }}>{b.label}</span>
                    <span className="num" style={{ fontSize: 14, fontWeight: 600, color: scoreColor(b.v) }}>{b.v}</span>
                  </div>
                  <ProgressBar value={b.v} delay={i * 90} />
                </div>
              ))}
            </div>
          </Card>

          {/* critical insights */}
          <Card className="rise" style={{ marginTop: 14, animationDelay: '.08s' }}>
            <CardTitle icon="alert" iconColor="var(--warning)"
              right={<span style={{ fontSize: 12, fontWeight: 650, color: 'var(--warning)', background: 'var(--warning-soft)', padding: '3px 9px', borderRadius: 999 }}>5</span>}>
              Top issues before fundraising
            </CardTitle>
            <div>
              {issues.map((t, i) => (
                <div key={t} onClick={() => go('improve')} style={{
                  display: 'flex', alignItems: 'center', gap: 11, padding: '11px 0', cursor: 'pointer',
                  borderBottom: i === issues.length - 1 ? 'none' : '1px solid var(--hairline-2)',
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--warning)', flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 13.5, color: 'var(--ink)', fontWeight: 500 }}>{t}</span>
                  <Icon name="chevR" size={16} color="var(--ink-4)" />
                </div>
              ))}
            </div>
          </Card>

          {/* startup summary */}
          <Card className="rise" style={{ marginTop: 14, animationDelay: '.12s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 15 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 13, flexShrink: 0,
                background: 'linear-gradient(145deg, #6D5CF0, #3B4EE8)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 19,
                boxShadow: '0 4px 12px -4px rgba(49,64,206,0.5)',
              }}>T</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.01em' }}>Tomanji</div>
                <div style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>Consumer Social · Party Games</div>
              </div>
              <span style={{
                fontSize: 11.5, fontWeight: 600, color: 'var(--success)', background: 'var(--success-soft)',
                padding: '5px 10px', borderRadius: 999,
              }}>Revenue-generating</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '13px 18px', marginBottom: 15 }}>
              <SummaryItem label="Business model" value="Subscription + IAP" />
              <SummaryItem label="Main market" value="Chile / LATAM" />
            </div>
            <div style={{
              padding: '12px 14px', borderRadius: 13, background: 'var(--bg)', borderLeft: '3px solid var(--primary)',
            }}>
              <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5, color: 'var(--ink-2)', fontStyle: 'italic' }}>
                “A mobile party game platform that helps groups break the ice through social challenges and dynamic game modes.”
              </p>
            </div>
          </Card>

          {/* revenue metrics */}
          <Card className="rise" style={{ marginTop: 14, animationDelay: '.16s' }}>
            <CardTitle icon="coins" right={<span style={{ fontSize: 12, color: 'var(--ink-3)' }}>via Stripe</span>}>Revenue metrics</CardTitle>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '18px 12px' }}>
              {metrics.map(m => <MetricStat key={m.label} {...m} />)}
            </div>
            <Divider m={15} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <MetricStat label="CAC" value="Unknown" missing mono={false} />
              <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--danger)', background: 'var(--danger-soft)', padding: '4px 10px', borderRadius: 999 }}>Missing</span>
            </div>
            <div style={{
              display: 'flex', gap: 10, marginTop: 14, padding: '12px 13px', borderRadius: 13,
              background: 'var(--warning-soft)',
            }}>
              <Icon name="alert" size={18} color="var(--warning)" style={{ marginTop: 1, flexShrink: 0 }} />
              <div style={{ fontSize: 12.5, lineHeight: 1.45, color: '#7A5407' }}>
                <strong style={{ color: '#5E4106' }}>Missing critical metric.</strong> You need CAC or a channel-level acquisition estimate before serious VC conversations.
              </div>
            </div>
          </Card>

          {/* quick links */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11, marginTop: 14 }}>
            <NavCard icon="layers" title="Deck & Data Room" sub="68% ready" onClick={() => go('deck')} />
            <NavCard icon="flag" title="Fundraising Plan" sub="$500k–1.2M" onClick={() => go('plan')} />
          </div>
        </div>
      </div>
    );
  }

  function SummaryItem({ label, value }) {
    return (
      <div>
        <div style={{ fontSize: 11.5, color: 'var(--ink-3)', fontWeight: 550, marginBottom: 3 }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{value}</div>
      </div>
    );
  }

  function NavCard({ icon, title, sub, onClick }) {
    return (
      <button onClick={onClick} style={{
        textAlign: 'left', background: 'var(--card)', borderRadius: 'var(--r-card)', padding: 15,
        border: '1px solid var(--hairline)', boxShadow: 'var(--shadow-md)',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10, background: 'var(--primary-soft)', color: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icon name={icon} size={18} /></div>
          <Icon name="arrowUpRight" size={18} color="var(--ink-4)" />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 650, color: 'var(--ink)', letterSpacing: '-0.01em' }}>{title}</div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{sub}</div>
        </div>
      </button>
    );
  }

  Object.assign(window, { AnalyzeScreen, DashboardScreen });
})();
