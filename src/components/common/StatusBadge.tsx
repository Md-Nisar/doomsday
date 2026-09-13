import type { ReactElement } from 'react'
import type { ContentStatus } from '../../types/content'
import { Badge, type BadgeTone } from './Badge'
import { AlertTriangleIcon, CheckCircleIcon, HelpCircleIcon } from './Icon'

export type { ContentStatus }

const STATUS_LABEL: Record<ContentStatus, string> = {
  confirmed: 'Confirmed',
  rumor: 'Rumor',
  theory: 'Theory',
}

const STATUS_TONE: Record<ContentStatus, BadgeTone> = {
  confirmed: 'success',
  rumor: 'warning',
  theory: 'accent',
}

/**
 * Confirmed / rumor / theory must read correctly without color — each
 * status pairs a distinct icon shape with its label and tone.
 */
function StatusIcon({ status }: { status: ContentStatus }): ReactElement {
  switch (status) {
    case 'confirmed':
      return <CheckCircleIcon />
    case 'rumor':
      return <AlertTriangleIcon />
    case 'theory':
      return <HelpCircleIcon />
  }
}

interface StatusBadgeProps {
  status: ContentStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge tone={STATUS_TONE[status]} icon={<StatusIcon status={status} />}>
      {STATUS_LABEL[status]}
    </Badge>
  )
}
