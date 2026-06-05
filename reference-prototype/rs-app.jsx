// rs-app.jsx — routing, analyze overlay, tweaks, mount
(function () {
  const { useState, useEffect, useRef } = React;

  const TABS = ['analyze', 'dashboard', 'investors'];

  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "primary": "#3B4EE8",
    "radius": 22,
    "bg": "#F4F8FF"
  }/*EDITMODE-END*/;

  /* ---------- analyze sequence overlay ---------- */
  function AnalyzeOverlay({ url, onDone }) {
    const steps = [
      { t: 'Reading ' + (url.replace(/^https?:\/\//, '') || 'your site'), icon: 'globe' },
      { t: 'Parsing product & market', icon: 'target' },
      { t: 'Pulling revenue metrics', icon: 'coins' },
      { t: 'Estimating valuation', icon: 'pieChart' },
      { t: 'Matching investors', icon: 'investors' },
    ];
    const [done, setDone] = useState(0);
    useEffect(() => {
      if (done >= steps.length) { const id = setTimeout(onDone, 480); return () => clearTimeout(id); }
      const id = setTimeout(() => setDone(d => d + 1), done === 0 ? 520 : 460);
      return () => clearTimeout(id);
    }, [done]);

    return (
      <div style={{
        position: 'absolute', inset: 0, zIndex: 90, background: 'rgba(244,248,255,0.86)',
        backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '0 40px', animation: 'rs-fade .3s ease',
      }}>
        <div style={{ position: 'relative', marginBottom: 30 }}>
          <ScoreRing value={done >= steps.length ? 72 : Math.round((done / steps.length) * 72)} size={120} stroke={11} />
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
          }} />
        </div>
        <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: 4 }}>Analyzing your startup</div>
        <div style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 24 }}>Building your fundraising signal…</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 280 }}>
          {steps.map((s, i) => {
            const isDone = i < done, active = i === done;
            return (
              <div key={s.t} style={{
                display: 'flex', alignItems: 'center', gap: 11, opacity: i <= done ? 1 : 0.38,
                transition: 'opacity .3s ease',
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: 999, flexShrink: 0,
                  background: isDone ? 'var(--success)' : active ? 'var(--primary)' : 'var(--hairline)',
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background .3s ease',
                }}>
                  {isDone ? <Icon name="check" size={15} /> : active
                    ? <span style={{ width: 9, height: 9, borderRadius: 999, background: '#fff', animation: 'rs-fade .6s ease infinite alternate' }} />
                    : <Icon name={s.icon} size={14} color="var(--ink-4)" />}
                </div>
                <span style={{ fontSize: 13.5, fontWeight: 550, color: isDone || active ? 'var(--ink)' : 'var(--ink-3)' }}>{s.t}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ---------- app ---------- */
  function App() {
    const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
    const initial = (typeof location !== 'undefined' && location.hash.replace('#', '')) || 'analyze';
    const validInit = ['analyze', 'dashboard', 'plan', 'investors', 'deck', 'improve'].includes(initial) ? initial : 'analyze';
    const [hist, setHist] = useState([validInit]);
    const [dir, setDir] = useState('fwd');
    const [analyzing, setAnalyzing] = useState(false);
    const [url, setUrl] = useState('https://cursor.com');
    const [connected, setConnected] = useState({ Stripe: true });
    const screen = hist[hist.length - 1];

    // After entrance animations play, strip their classes so the settled DOM has
    // no active animations. html-to-image / PDF capture clones nodes and replays
    // CSS animations from 0% (opacity:0) — stripping keeps captures non-blank.
    useEffect(() => {
      const id = setTimeout(() => {
        document.querySelectorAll('.rise, .anim-fwd, .anim-back, .anim-tab')
          .forEach(el => el.classList.remove('rise', 'anim-fwd', 'anim-back', 'anim-tab'));
      }, 700);
      return () => clearTimeout(id);
    }, [screen, analyzing]);

    // deep-link / hash routing
    useEffect(() => {
      const onHash = () => {
        const h = location.hash.replace('#', '');
        if (['analyze', 'dashboard', 'plan', 'investors', 'deck', 'improve'].includes(h)) go(h);
      };
      window.addEventListener('hashchange', onHash);
      return () => window.removeEventListener('hashchange', onHash);
    }, [screen]);

    function go(to) {
      if (to === screen) return;
      if (TABS.includes(to)) { setDir('tab'); setHist([to]); }
      else { setDir('fwd'); setHist(h => [...h, to]); }
      // scroll reset handled by remount via key
    }

    function toggleConnector(name) {
      setConnected(c => ({ ...c, [name]: !c[name] }));
    }

    function renderScreen() {
      switch (screen) {
        case 'analyze': return <AnalyzeScreen url={url} setUrl={setUrl} connected={connected} toggleConnector={toggleConnector} onAnalyze={() => setAnalyzing(true)} />;
        case 'dashboard': return <DashboardScreen go={go} />;
        case 'plan': return <PlanScreen go={go} />;
        case 'investors': return <InvestorsScreen go={go} />;
        case 'deck': return <DeckScreen go={go} />;
        case 'improve': return <ImproveScreen go={go} />;
        default: return <AnalyzeScreen url={url} setUrl={setUrl} connected={connected} toggleConnector={toggleConnector} onAnalyze={() => setAnalyzing(true)} />;
      }
    }

    const animClass = dir === 'fwd' ? 'anim-fwd' : dir === 'back' ? 'anim-back' : 'anim-tab';
    let activeTab = 'dashboard';
    for (let i = hist.length - 1; i >= 0; i--) { if (TABS.includes(hist[i])) { activeTab = hist[i]; break; } }

    return (
      <div id="rs-root" data-screen={screen} data-active={activeTab} style={{
        '--primary': t.primary, '--r-card': t.radius + 'px', '--bg': t.bg,
      }}>
        <IOSDevice>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)', position: 'relative' }}>
            <div key={screen} className={animClass} style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
              {renderScreen()}
            </div>
            {screen !== 'analyze' && <BottomNav active={activeTab} onNav={go} />}
            {analyzing && <AnalyzeOverlay url={url} onDone={() => { setAnalyzing(false); setDir('fwd'); setHist(['dashboard']); }} />}
          </div>
        </IOSDevice>

        <TweaksPanel>
          <TweakSection label="Brand color" />
          <TweakColor label="Primary" value={t.primary}
            options={['#3B4EE8', '#2563EB', '#635BFF', '#4F46E5', '#0E7490']}
            onChange={(v) => setTweak('primary', v)} />
          <TweakSection label="Surface" />
          <TweakSlider label="Card radius" value={t.radius} min={12} max={28} step={1} unit="px"
            onChange={(v) => setTweak('radius', v)} />
          <TweakRadio label="Background" value={t.bg}
            options={[{ label: 'Light blue', value: '#F4F8FF' }, { label: 'White', value: '#FBFCFE' }]}
            onChange={(v) => setTweak('bg', v)} />
        </TweaksPanel>
      </div>
    );
  }

  ReactDOM.createRoot(document.getElementById('stage')).render(<App />);
})();
