import { ref } from 'vue'
import {
  LOGIN_AGREEMENT_STORAGE_KEY,
  LOGIN_AGREEMENT_UPDATED_AT,
  buildLoginAgreementRevision,
  mergeLoginAgreementDocuments,
  shouldEnableLoginAgreement,
} from '@/config/loginAgreementDocuments'
import type { LoginAgreementDocument } from '@/types'

export function useLoginAgreement() {
  const loginAgreementEnabled = ref(false)
  const loginAgreementDocuments = ref<LoginAgreementDocument[]>([])
  const loginAgreementUpdatedAt = ref('')
  const loginAgreementRevision = ref('')
  const agreementAccepted = ref(true)
  const showAgreementModal = ref(false)
  const loginAgreementMode = ref<'modal' | 'checkbox'>('modal')

  function hasAcceptedLoginAgreement(revision: string): boolean {
    if (!revision) return false
    try {
      const raw = localStorage.getItem(LOGIN_AGREEMENT_STORAGE_KEY)
      if (!raw) return false
      const parsed = JSON.parse(raw) as { revision?: string }
      return parsed.revision === revision
    } catch {
      return false
    }
  }

  function applyLoginAgreementSettings(settings: {
    login_agreement_enabled?: boolean
    login_agreement_mode?: string
    login_agreement_updated_at?: string
    login_agreement_revision?: string
    login_agreement_documents?: LoginAgreementDocument[]
  }): void {
    const documents = mergeLoginAgreementDocuments(settings.login_agreement_documents)
    loginAgreementDocuments.value = documents.filter((doc) => doc.title.trim())
    loginAgreementEnabled.value =
      shouldEnableLoginAgreement(settings, loginAgreementDocuments.value) &&
      loginAgreementDocuments.value.length > 0
    loginAgreementMode.value =
      settings.login_agreement_mode === 'checkbox' ? 'checkbox' : 'modal'
    loginAgreementUpdatedAt.value =
      settings.login_agreement_updated_at || LOGIN_AGREEMENT_UPDATED_AT
    loginAgreementRevision.value =
      settings.login_agreement_revision ||
      buildLoginAgreementRevision(loginAgreementUpdatedAt.value, loginAgreementDocuments.value)

    agreementAccepted.value =
      !loginAgreementEnabled.value || hasAcceptedLoginAgreement(loginAgreementRevision.value)
    showAgreementModal.value =
      loginAgreementEnabled.value &&
      !agreementAccepted.value &&
      loginAgreementMode.value !== 'checkbox'
  }

  function acceptLoginAgreement(): void {
    if (loginAgreementRevision.value) {
      localStorage.setItem(
        LOGIN_AGREEMENT_STORAGE_KEY,
        JSON.stringify({
          revision: loginAgreementRevision.value,
          accepted_at: new Date().toISOString(),
        }),
      )
    }
    agreementAccepted.value = true
    showAgreementModal.value = false
  }

  function rejectLoginAgreement(onReject?: () => void): void {
    localStorage.removeItem(LOGIN_AGREEMENT_STORAGE_KEY)
    agreementAccepted.value = false
    showAgreementModal.value = false
    onReject?.()
  }

  return {
    loginAgreementEnabled,
    loginAgreementDocuments,
    loginAgreementUpdatedAt,
    loginAgreementRevision,
    agreementAccepted,
    showAgreementModal,
    loginAgreementMode,
    applyLoginAgreementSettings,
    acceptLoginAgreement,
    rejectLoginAgreement,
  }
}
