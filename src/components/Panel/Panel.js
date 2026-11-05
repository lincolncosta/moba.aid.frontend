import styled from 'styled-components'

// Blocos visuais simples usados pelos painéis de análise, sugestão e preparação.
export const Panel = styled.div`
  background: rgba(0, 0, 0, 0.75);
  border: 1px solid rgba(255, 255, 0, 0.35);
  border-radius: 8px;
  padding: 12px 14px;
  color: white;
  font-size: 13px;
  line-height: 1.45;
`

export const PanelTitle = styled.div`
  font-weight: bold;
  font-size: 15px;
  margin-bottom: 8px;
  color: #ffe14d;
`

export const Muted = styled.div`
  opacity: 0.7;
  font-size: 12px;
`

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 2px 0;
`

export const Tag = styled.span`
  display: inline-block;
  border-radius: 4px;
  padding: 1px 6px;
  margin: 2px 4px 2px 0;
  font-size: 11px;
  background: ${({ tone }) =>
    tone === 'blue' ? 'rgba(30,144,255,0.35)' : tone === 'red' ? 'rgba(255,69,0,0.35)' : tone === 'warn' ? 'rgba(255,170,0,0.35)' : 'rgba(255,255,255,0.15)'};
`

export const Select = styled.select`
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: 1px solid #555;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 14px;
  max-width: 100%;
`

export const SmallButton = styled.button`
  cursor: pointer;
  background: ${({ primary }) => (primary ? 'yellow' : 'rgba(255,255,255,0.12)')};
  color: ${({ primary }) => (primary ? 'black' : 'white')};
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 12px;
  &:disabled { opacity: 0.4; cursor: default; }
`

export const ROLE_LABELS = { top: 'Top', jng: 'Jungle', mid: 'Mid', bot: 'Bot', sup: 'Support' }
export const ROLES = ['top', 'jng', 'mid', 'bot', 'sup']

export const pp = (v) => `${v > 0 ? '+' : ''}${(v || 0).toFixed(1)} pp`
