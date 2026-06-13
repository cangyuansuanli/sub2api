package service

import (
	"context"
	"fmt"
	"strings"
)

const defaultLoginAgreementContentDate = "2026-06-11"

func defaultLoginAgreementDocuments() []LoginAgreementDocument {
	return []LoginAgreementDocument{
		{ID: "terms", Title: "服务条款"},
		{ID: "usage-policy", Title: "使用政策"},
		{ID: "supported-regions", Title: "支持的国家和地区"},
		{ID: "service-specific-terms", Title: "服务特定条款"},
	}
}

func mergeLoginAgreementDocumentsWithDefaults(docs []LoginAgreementDocument) []LoginAgreementDocument {
	defaults := defaultLoginAgreementDocuments()
	defaultByID := make(map[string]LoginAgreementDocument, len(defaults))
	for _, doc := range defaults {
		defaultByID[doc.ID] = doc
	}

	if len(docs) == 0 {
		return defaults
	}

	merged := make([]LoginAgreementDocument, 0, len(docs))
	seen := make(map[string]struct{}, len(docs))
	for _, doc := range docs {
		id := normalizeLoginAgreementDocumentID(doc.ID)
		if id == "" {
			continue
		}
		seen[id] = struct{}{}
		title := strings.TrimSpace(doc.Title)
		if title == "" {
			title = defaultByID[id].Title
		}
		merged = append(merged, LoginAgreementDocument{
			ID:        id,
			Title:     title,
			ContentMD: strings.TrimSpace(doc.ContentMD),
		})
	}

	for _, doc := range defaults {
		if _, ok := seen[doc.ID]; ok {
			continue
		}
		merged = append(merged, doc)
	}

	return normalizeLoginAgreementDocuments(merged)
}

func loginAgreementDocumentsNeedBootstrap(docs []LoginAgreementDocument) bool {
	return len(docs) == 0
}

func (s *SettingService) EnsureLoginAgreementDefaults(ctx context.Context) error {
	if s == nil || s.settingRepo == nil {
		return nil
	}

	keys := []string{
		SettingKeyLoginAgreementEnabled,
		SettingKeyLoginAgreementMode,
		SettingKeyLoginAgreementUpdatedAt,
		SettingKeyLoginAgreementDocuments,
	}
	settings, err := s.settingRepo.GetMultiple(ctx, keys)
	if err != nil {
		return fmt.Errorf("load login agreement settings: %w", err)
	}

	rawDocs := strings.TrimSpace(settings[SettingKeyLoginAgreementDocuments])
	docs := parseLoginAgreementDocuments(rawDocs)
	if !loginAgreementDocumentsNeedBootstrap(docs) && settings[SettingKeyLoginAgreementEnabled] == "true" {
		return nil
	}

	merged := mergeLoginAgreementDocumentsWithDefaults(docs)
	docJSON, err := marshalLoginAgreementDocuments(merged)
	if err != nil {
		return err
	}

	updates := map[string]string{
		SettingKeyLoginAgreementEnabled:   "true",
		SettingKeyLoginAgreementDocuments: docJSON,
	}
	if strings.TrimSpace(settings[SettingKeyLoginAgreementUpdatedAt]) == "" ||
		settings[SettingKeyLoginAgreementUpdatedAt] == "2026-03-31" {
		updates[SettingKeyLoginAgreementUpdatedAt] = defaultLoginAgreementContentDate
	}
	if strings.TrimSpace(settings[SettingKeyLoginAgreementMode]) == "" {
		updates[SettingKeyLoginAgreementMode] = defaultLoginAgreementMode
	}

	return s.settingRepo.SetMultiple(ctx, updates)
}
