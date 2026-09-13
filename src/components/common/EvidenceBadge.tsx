import type { ReactElement } from 'react'
import type { EvidenceLevel } from '../../types/content'
import { Badge, type BadgeTone } from './Badge'
import { AlertTriangleIcon, CheckCircleIcon, EyeIcon, HelpCircleIcon } from './Icon'

export type { EvidenceLevel }

const EVIDENCE_LABEL: Record<EvidenceLevel, string> = {
  VISIBLE: 'Visible in footage',
  CONFIRMED: 'Confirmed',
  INFERRED: 'Inferred',
  THEORY: 'Theory',
}

const EVIDENCE_TONE: Record<EvidenceLevel, BadgeTone> = {
  VISIBLE: 'neutral',
  CONFIRMED: 'success',
  INFERRED: 'accent',
  THEORY: 'warning',
}

/**
 * Grades a single trailer observation — never confused with `StatusBadge`,
 * which grades a whole editorial entry. See `EvidenceLevel` in
 * `src/types/content.ts` for what each level means.
 */
function EvidenceIcon({ level }: { level: EvidenceLevel }): ReactElement {
  switch (level) {
    case 'VISIBLE':
      return <EyeIcon />
    case 'CONFIRMED':
      return <CheckCircleIcon />
    case 'INFERRED':
      return <HelpCircleIcon />
    case 'THEORY':
      return <AlertTriangleIcon />
  }
}

interface EvidenceBadgeProps {
  level: EvidenceLevel
}

export function EvidenceBadge({ level }: EvidenceBadgeProps) {
  return (
    <Badge tone={EVIDENCE_TONE[level]} icon={<EvidenceIcon level={level} />}>
      {EVIDENCE_LABEL[level]}
    </Badge>
  )
}
