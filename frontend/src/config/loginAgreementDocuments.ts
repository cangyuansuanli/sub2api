import type { LoginAgreementDocument } from '@/types'
import termsMarkdown from '../../../docs/legal/terms.zh.md?raw'
import usagePolicyMarkdown from '../../../docs/legal/usage-policy.zh.md?raw'
import supportedRegionsMarkdown from '../../../docs/legal/supported-regions.zh.md?raw'
import serviceSpecificTermsMarkdown from '../../../docs/legal/service-specific-terms.zh.md?raw'

export const LOGIN_AGREEMENT_STORAGE_KEY = 'sub2api_login_agreement_consent'
export const LOGIN_AGREEMENT_UPDATED_AT = '2026-06-11'

export const defaultLoginAgreementDocuments: LoginAgreementDocument[] = [
  {
    id: 'terms',
    title: '服务条款',
    content_md: termsMarkdown.trim(),
  },
  {
    id: 'usage-policy',
    title: '使用政策',
    content_md: usagePolicyMarkdown.trim(),
  },
  {
    id: 'supported-regions',
    title: '支持的国家和地区',
    content_md: supportedRegionsMarkdown.trim(),
  },
  {
    id: 'service-specific-terms',
    title: '服务特定条款',
    content_md: serviceSpecificTermsMarkdown.trim(),
  },
]

const bundledDocumentsById = new Map(
  defaultLoginAgreementDocuments.map((doc) => [doc.id, doc]),
)

export function resolveLoginAgreementDocument(
  documentId: string,
): LoginAgreementDocument | null {
  const id = documentId.trim()
  if (!id) return null
  return bundledDocumentsById.get(id) ?? null
}

export function mergeLoginAgreementDocuments(
  documents: LoginAgreementDocument[] | undefined,
): LoginAgreementDocument[] {
  const source = Array.isArray(documents) ? documents : []
  if (source.length === 0) {
    return defaultLoginAgreementDocuments
  }

  const merged = source
    .map((doc) => {
      const id = (doc.id || '').trim()
      const fallback = id ? bundledDocumentsById.get(id) : undefined
      const title = (doc.title || fallback?.title || '').trim()
      const content = (doc.content_md || fallback?.content_md || '').trim()
      if (!title) return null
      return {
        id: id || title,
        title,
        content_md: content,
      }
    })
    .filter((doc): doc is LoginAgreementDocument => doc !== null)

  return merged.length > 0 ? merged : defaultLoginAgreementDocuments
}

export function shouldEnableLoginAgreement(
  settings: {
    login_agreement_enabled?: boolean
    login_agreement_documents?: LoginAgreementDocument[]
  },
  documents: LoginAgreementDocument[],
): boolean {
  if (settings.login_agreement_enabled === true && documents.length > 0) {
    return true
  }
  return documents.some((doc) => Boolean(doc.content_md?.trim()))
}

export function buildLoginAgreementRevision(
  updatedAt: string,
  documents: LoginAgreementDocument[],
): string {
  const date = updatedAt || LOGIN_AGREEMENT_UPDATED_AT
  return `${date}:${documents.map((doc) => `${doc.id}:${doc.title}`).join('|')}`
}
