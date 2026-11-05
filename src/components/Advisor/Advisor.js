import React from 'react'

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

// Sugestões para o time do usuário: pick guloso com a regra da importância, alternativas
// e plano; ban = chance de o adversário escolher x ganho que daria a ele.
export const Advisor = ({ dados, carregando, onUsar, desabilitado }) => {
  if (carregando && !dados) return <Panel><PanelTitle>Suggestions</PanelTitle><Muted>Thinking…</Muted></Panel>
  if (!dados) return null
  const s = dados.suggestion
  const ban = dados.goal === 'ban'

  return (
    <Panel>
      <PanelTitle>{ban ? 'Ban suggestion' : 'Pick suggestion'}</PanelTitle>
      <Row>
        <span style={{ fontSize: 16 }}>
          <b>{s.champion}</b> {ROLE_LABELS[s.role] && <Muted as="span">({ban ? 'their ' : ''}{ROLE_LABELS[s.role]}{s.player ? `, ${s.player}` : ''})</Muted>}
          {s.uncertain && <Tag tone="warn">jungle: uncertain</Tag>}
        </span>
        <SmallButton primary disabled={desabilitado} onClick={() => onUsar(s)}>Use</SmallButton>
      </Row>
      {ban ? (
        <Muted>Chance they pick it now: {Math.round(s.pick_probability * 100)}% · it would give them {pp(s.threat_pp)}</Muted>
      ) : (
        <>
          <div>Draft gain {pp(s.gain_pp)} <Muted as="span">(champion {pp(s.champion_pp)}, counters {pp(s.counters_pp)})</Muted></div>
          {s.player_games !== null && s.player_games !== undefined && <Muted>{s.player ? `${s.player}: ` : ''}{s.player_games} pro games on it in this role</Muted>}
          <Muted>{s.why}</Muted>
          <Alvos alvos={s.counter_targets} /> <Faixa s={s} />
        </>
      )}

      <div style={{ marginTop: 8 }}><b>Alternatives</b></div>
      {dados.alternatives.map((a) => (
        <Row key={`${a.champion}-${a.role}`}>
          <span>
            {a.champion} <Muted as="span">{ROLE_LABELS[a.role]}{a.player ? ` · ${a.player}` : ''}</Muted>
            {a.uncertain && <Tag tone="warn">uncertain</Tag>}
          </span>
          <span>
            {ban
              ? <Muted as="span">{Math.round(a.pick_probability * 100)}% · {pp(a.threat_pp)}</Muted>
              : <Muted as="span">{pp(a.gain_pp)}{a.player_games ? ` · ${a.player_games} games` : ''}</Muted>}
            {' '}<SmallButton disabled={desabilitado} onClick={() => onUsar(a)}>Use</SmallButton>
          </span>
        </Row>
      ))}

      {!ban && dados.plan && dados.plan.picks.length > 1 && (
        <div style={{ marginTop: 8 }}>
          <b>Composition idea</b> <Muted as="span">({pp(dados.plan.gain_pp)} if they picked nothing else)</Muted>
          <div>{dados.plan.picks.map((p) => <Tag key={p.role}>{ROLE_LABELS[p.role]}: {p.champion}</Tag>)}</div>
          {dados.plan.outside_range_share > 0.05 && (
            <Tag tone="warn">{Math.round(dados.plan.outside_range_share * 100)}% of this gain is beyond real drafts</Tag>
          )}
        </div>
      )}
      <Muted style={{ marginTop: 6 }}>{dados.note}</Muted>
    </Panel>
  )
}
