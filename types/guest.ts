export interface GuestCheck {
  hasUsed: boolean
  essayId?: string
  usedAt?: string
}

export interface GuestLimitInfo {
  isGuest: boolean
  canSubmit: boolean
  essayId?: string
  message?: string
}
