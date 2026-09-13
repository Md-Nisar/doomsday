import type { ReactElement } from 'react'
import type { RumorStatus } from '../../types/content'
import { Badge, type BadgeTone } from './Badge'
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  HelpCircleIcon,
  LayersIcon,
  XCircleIcon,
} from './Icon'

export type { RumorStatus }

const STATUS_LABEL: Record<RumorStatus, string> = {
  UNVERIFIED: 'Unverified',
  REPORTED: 'Reported',
  CORROBORATED: 'Corroborated',
  DISPUTED: 'Disputed',
  DEBUNKED: 'Debunked',
  CONFIRMED: 'Confirmed',
}

const STATUS_TONE: Record<RumorStatus, BadgeTone> = {
  UNVERIFIED: 'neutral',
  REPORTED: 'accent',
  CORROBORATED: 'accent',
  DISPUTED: 'warning',
  DEBUNKED: 'danger',
  CONFIRMED: 'success',
}

/**
 * Grades a rumor's lifecycle — never confused with `StatusBadge` (which
 * grades a whole editorial entry) or `EvidenceBadge` (which grades one
 * claim within a Trailer's analysis). See `RumorStatus` in
 * `src/types/content.ts` for what each stage means.
 */
function RumorStatusIcon({ status }: { status: RumorStatus }): ReactElement {
  switch (status) {
    case 'UNVERIFIED':
      return <HelpCircleIcon />
    case 'REPORTED':
      return <AlertTriangleIcon />
    case 'CORROBORATED':
      return <LayersIcon />
    case 'DISPUTED':
      return <AlertTriangleIcon />
    case 'DEBUNKED':
      return <XCircleIcon />
    case 'CONFIRMED':
      return <CheckCircleIcon />
  }
}

interface RumorStatusBadgeProps {
  status: RumorStatus
}

export function RumorStatusBadge({ status }: RumorStatusBadgeProps) {
  return (
    <Badge tone={STATUS_TONE[status]} icon={<RumorStatusIcon status={status} />}>
      {STATUS_LABEL[status]}
    </Badge>
  )
}
