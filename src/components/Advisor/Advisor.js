import React, { useState } from 'react'

import { Panel, PanelTitle, Muted, Row, Tag, SmallButton, ROLE_LABELS, pp } from 'components/Panel'

const Faixa = ({ s }) =>
  s.outside_range_share > 0.05 ? (
    <Tag tone="warn">{Math.round(s.outside_range_share * 100)}% of this gain is beyond real drafts</Tag>
  ) : null

const Alvos = ({ alvos }) =>
  (alvos || []).length ? (
    <span>
      {alvos.map((a) => (
        <Tag key={a.enemy} tone={a.favors === 'us' ? 'blue' : 'red'}>{a.favors === 'us' ? 'good into' : 'weak into'} {a.enemy}</Tag>
      ))}
    </span>
  ) : null

const Evidencia = ({ textos }) => {
  const [aberto, setAberto] = useState(false)
  const itens = Object.values(textos || {})
  if (!itens.length) return null
  return (
    <div style={{ marginTop: 6 }}>
      <SmallButton onClick={() => setAberto(!aberto)}>{aberto ? 'Hide evidence' : 'How reliable is this?'}</SmallButton>
      {aberto && itens.map((t, i) => <Muted key={i} style={{ marginTop: 4 }}>{t}</Muted>)}
    </div>
  )
}

// Os 3 primeiros picks (com a promessa calibrada contra a escolha típica de um profissional),
// os 3 primeiros bans (chance de o adversário escolher x ganho que daria a ele) e o plano piKL.
export const Advisor = ({ dados, carregando, onUsar, desabilitado }) => {
  if (carregando && !dados) return <Panel><PanelTitle>Suggestions</PanelTitle><Muted>Thinking…</Muted></Panel>
  if (!dados) return null
  const ban = dados.goal === 'ban'
  const top = dados.top3 || [dados.suggestion]
  const plano = dados.plan

  return (
    <Panel>
      <PanelTitle>{ban ? 'Top 3 bans' : 'Top 3 picks'}</PanelTitle>
      {top.map((s, i) => (
        <div key={`${s.champion}-${s.role}`} style={{ marginBottom: 8 }}>
          <Row>
            <span style={{ fontSize: i === 0 ? 16 : 14 }}>
              {i + 1}. <b>{s.champion}</b>{' '}
              {ROLE_LABELS[s.role] && <Muted as="span">({ban ? 'their ' : ''}{ROLE_LABELS[s.role]}{s.player ? `, ${s.player}` : ''})</Muted>}
              {s.uncertain && <Tag tone="warn">jungle: uncertain</Tag>}
              {s.pick_first && <Tag tone="blue">pick first</Tag>}
            </span>
            <SmallButton primary={i === 0} disabled={desabilitado} onClick={() => onUsar(s)}>Use</SmallButton>
          </Row>
          {ban ? (
            <Muted>
              Chance they pick it next: {Math.round(s.pick_probability * 100)}% · it would give them {pp(s.threat_pp)} ·
              expected win chance taken from them {pp(s.avoided_pp)}
            </Muted>
          ) : (
            <>
              <div>
                Promise {pp(s.promise_pp)} <Muted as="span">vs. the typical pro pick here</Muted>
                <Muted as="span"> · draft gain {pp(s.gain_pp)} (champion {pp(s.champion_pp)}, counters {pp(s.counters_pp)})</Muted>
              </div>
              <Muted>
                {s.player_games !== null && s.player_games !== undefined ? `${s.player ? `${s.player}: ` : ''}${s.player_games} pro games on it in this role · ` : ''}
                {s.pro_probability !== undefined ? `pros pick it here ${s.pro_probability < 0.01 ? '<1' : Math.round(s.pro_probability * 100)}% of the time` : ''}
              </Muted>
              <Alvos alvos={s.counter_targets} /> <Faixa s={s} />
            </>
          )}
        </div>
      ))}

      {!ban && dados.typical_pick && (
        <Muted>Most likely pro pick here: {dados.typical_pick.champion} ({Math.round(dados.typical_pick.probability * 100)}%)</Muted>
      )}

      {!ban && plano && plano.method === 'piKL' && (
        <div style={{ marginTop: 8 }}>
          <b>Draft plan</b>{' '}
          <Muted as="span">
            next: {plano.next.champion} ({ROLE_LABELS[plano.next.role] || plano.next.role}) · expected {pp(plano.expected_pp)}
            {' '}(model promise {pp(plano.promised_pp)}) over a typical pro continuation
          </Muted>
          <div>{plano.picks.map((p) => <Tag key={p.role} tone={p.next ? 'blue' : undefined}>{ROLE_LABELS[p.role]}: {p.champion}</Tag>)}</div>
        </div>
      )}
      {!ban && plano && plano.method !== 'piKL' && plano.picks && plano.picks.length > 1 && (
        <div style={{ marginTop: 8 }}>
          <b>Composition idea</b> <Muted as="span">({pp(plano.gain_pp)} if they picked nothing else)</Muted>
          <div>{plano.picks.map((p) => <Tag key={p.role}>{ROLE_LABELS[p.role]}: {p.champion}</Tag>)}</div>
        </div>
      )}
      <Muted style={{ marginTop: 6 }}>{dados.note}</Muted>
      <Evidencia textos={dados.validation} />
    </Panel>
  )
}
