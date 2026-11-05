import React, { useEffect, useState } from 'react'

import { getScout } from 'api/adversario'
import { Panel, PanelTitle, Muted, Row, Tag, ROLE_LABELS } from 'components/Panel'

const lista = (itens, fmt) =>
  (itens || []).map((x) => <Tag key={x.champion}>{x.champion}{fmt ? ` ${fmt(x)}` : ''}</Tag>)

// Preparação: tendências de picks e bans do time adversário (dados profissionais anteriores).
export const Scout = ({ team, opponent, players, title = 'Opponent scouting' }) => {
  const [dados, setDados] = useState(null)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    if (!team) { setDados(null); return }
    setErro(null)
    getScout({ team, opponent, players })
      .then(setDados)
      .catch((err) => setErro(err?.response?.data?.error || err.message))
  }, [team, opponent, JSON.stringify(players)]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!team) return null
  if (erro) return <Panel><PanelTitle>{title}</PanelTitle><Muted>{erro}</Muted></Panel>
  if (!dados) return <Panel><PanelTitle>{title}</PanelTitle><Muted>Loading…</Muted></Panel>

  const pct = (x) => `${Math.round(x.value * 100)}%`
  return (
    <Panel>
      <PanelTitle>{title}: {dados.team.name} <Muted as="span">({dados.team.league}, last game {dados.team.last_game})</Muted></PanelTitle>
      <div><b>Likely first bans</b></div>
      <div>{lista(dados.likely_first_bans.slice(0, 6), pct)}</div>
      <div style={{ marginTop: 6 }}><b>Likely first picks</b></div>
      <div>{lista(dados.likely_first_picks.slice(0, 6), pct)}</div>
      <div style={{ marginTop: 6 }}><b>Team signature</b> <Muted as="span">(most picked / banned lately)</Muted></div>
      <div>{lista(dados.signature_picks.slice(0, 6))}</div>
      <div>{dados.signature_bans.slice(0, 6).map((x) => <Tag key={x.champion} tone="red">ban {x.champion}</Tag>)}</div>
      <div style={{ marginTop: 8 }}><b>Players</b></div>
      {dados.players.map((p) => (
        <Row key={p.role} style={{ alignItems: 'flex-start' }}>
          <div style={{ minWidth: 110 }}>{ROLE_LABELS[p.role]}: <b>{p.name || '—'}</b></div>
          <div style={{ flex: 1 }}>
            {p.recent.map((c) => <Tag key={c.champion}>{c.champion} ({c.games_in_role})</Tag>)}
          </div>
        </Row>
      ))}
      <Muted style={{ marginTop: 6 }}>{dados.note} Numbers in parentheses: games in that role.</Muted>
    </Panel>
  )
}
