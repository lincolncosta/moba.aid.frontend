import React from 'react'

import { Panel, PanelTitle, Muted, Row, Tag, ROLE_LABELS, pp } from 'components/Panel'

const cor = (v) => (v > 0 ? '#4aa8ff' : v < 0 ? '#ff7a4d' : 'white')

const Barra = ({ pBlue }) => (
  <div style={{ display: 'flex', height: 14, borderRadius: 7, overflow: 'hidden', margin: '6px 0' }}>
    <div style={{ width: `${pBlue * 100}%`, background: '#1E90FF' }} />
    <div style={{ flex: 1, background: '#FF4500' }} />
  </div>
)

const Bloco = ({ label, v, forte }) => (
  <Row>
    <span style={{ fontWeight: forte ? 'bold' : 'normal' }}>{label}</span>
    <span style={{ color: cor(v), fontWeight: forte ? 'bold' : 'normal' }}>{pp(v)} {v > 0 ? 'blue' : v < 0 ? 'red' : ''}</span>
  </Row>
)

// Explicação da previsão do modelo base: lado + força (times, jogadores) + draft (campeões, counters),
// em pontos percentuais para o azul (valores de Shapley; somam a previsão).
export const Analysis = ({ dados, final }) => {
  if (!dados) return null
  const { blocks, summary, reference } = dados
  const b = Object.fromEntries(blocks.map((x) => [x.block, x.pp_blue]))
  const comp = dados.composition || {}

  return (
    <Panel>
      <PanelTitle>{final ? 'Prediction' : 'Live analysis'}</PanelTitle>
      <Row>
        <b style={{ color: '#4aa8ff' }}>Blue {Math.round(dados.p_blue * 100)}%</b>
        <Muted>confidence: {dados.confidence}</Muted>
        <b style={{ color: '#ff7a4d' }}>Red {Math.round((1 - dados.p_blue) * 100)}%</b>
      </Row>
      <Barra pBlue={dados.p_blue} />

      <Muted>Starting point: {Math.round(reference.p_blue * 100)}% for blue in a mirror match (side only).</Muted>
      <Bloco label="Side" v={summary.side_pp} />
      <Bloco label="Strength (teams + players)" v={summary.strength_pp} forte />
      <div style={{ paddingLeft: 12 }}>
        <Bloco label="Teams" v={b.times} />
        <Bloco label="Players" v={b.jogadores} />
      </div>
      <Bloco label="Draft (champions + counters)" v={summary.draft_pp} forte />
      <div style={{ paddingLeft: 12 }}>
        <Bloco label="Champions" v={b.campeoes} />
        <Bloco label="Counters" v={b.counters} />
      </div>
      {!dados.draft_in_range && (
        <div style={{ marginTop: 4 }}><Tag tone="warn">Draft edge beyond 95% of real drafts: the model is extrapolating</Tag></div>
      )}

      <div style={{ marginTop: 10 }}><b>Players, lane by lane</b></div>
      {dados.players.map((p) => (
        <Row key={p.role}>
          <span>{ROLE_LABELS[p.role]}: {p.blue || '—'} vs {p.red || '—'}</span>
          <span style={{ color: cor(p.pp_blue) }}>{pp(p.pp_blue)}</span>
        </Row>
      ))}

      <div style={{ marginTop: 10 }}><b>Champions, lane by lane</b></div>
      {dados.draft_lanes.map((l) => (
        <Row key={l.role}>
          <span>
            {ROLE_LABELS[l.role]}: {l.blue || '—'} vs {l.red || '—'}
            {l.uncertain && <Tag tone="warn">uncertain</Tag>}
          </span>
          <span style={{ color: cor(l.pp_blue) }}>{pp(l.pp_blue)}</span>
        </Row>
      ))}

      {dados.counters.length > 0 && (
        <>
          <div style={{ marginTop: 10 }}><b>Strongest matchups</b> <Muted as="span">(ordering only)</Muted></div>
          <div>
            {dados.counters.map((c) => (
              <Tag key={`${c.blue}-${c.red}`} tone={c.favors}>
                {c.favors === 'blue' ? `${c.blue} › ${c.red}` : `${c.red} › ${c.blue}`}
              </Tag>
            ))}
          </div>
        </>
      )}

      <div style={{ marginTop: 10 }}><b>Lane phase</b> <Muted as="span">(gold difference at 15 min, not win chance)</Muted></div>
      {dados.lanes.lanes.map((l) => (
        <Row key={l.role}>
          <span>{ROLE_LABELS[l.role]}</span>
          <span style={{ color: cor(l.gold_diff_15) }}>
            {l.gold_diff_15 > 0 ? '+' : ''}{l.gold_diff_15} g
            <Muted as="span"> (players {l.players}, champions {l.champions}, matchup {l.matchup})</Muted>
          </span>
        </Row>
      ))}
      <Muted>Typical error per lane: ±{dados.lanes.lanes[0]?.typical_error} gold.</Muted>

      {(comp.blue || comp.red) && (
        <>
          <div style={{ marginTop: 10 }}><b>Composition profile</b></div>
          {['blue', 'red'].map((s) => comp[s] && (
            <div key={s}>
              <span style={{ color: s === 'blue' ? '#4aa8ff' : '#ff7a4d' }}>{s === 'blue' ? 'Blue' : 'Red'}:</span>{' '}
              {comp[s].complete
                ? `damage concentration: percentile ${comp[s].damage_concentration_pct}, frontline: percentile ${comp[s].frontline_pct} (vs. real pro compositions)`
                : 'profile shown when all five champions are picked'}
              {comp[s].tags.map((t) => <Tag key={t}>{t}</Tag>)}
              <div>
                {comp[s].roles.filter((r) => r.champion && r.player_games_on_champion !== null).map((r) => (
                  <Tag key={r.role}>{r.champion}: {r.player_games_on_champion} pro games</Tag>
                ))}
              </div>
            </div>
          ))}
          <Muted>{(comp.blue || comp.red).note}</Muted>
        </>
      )}

      {dados.notes.length > 0 && <Muted style={{ marginTop: 8 }}>{dados.notes.join(' ')}</Muted>}
    </Panel>
  )
}
