package service

import (
	"strings"
	"testing"
)

func TestFriendlyOpenAIImagesClientMessage_GatewayHTML(t *testing.T) {
	raw := `<!DOCTYPE html><html><head><title>cangyuansuanli.cn | 502: Bad gateway</title></head><body><div id="cf-error-details">Bad gateway</div></body></html>`
	msg := friendlyOpenAIImagesClientMessage("", raw)
	if !strings.Contains(msg, "网关或上游服务暂时不可用") {
		t.Fatalf("expected gateway reason, got %q", msg)
	}
	if strings.Contains(msg, "<!DOCTYPE html>") {
		t.Fatalf("expected sanitized detail, got %q", msg)
	}
	if !strings.Contains(msg, "502: Bad gateway") {
		t.Fatalf("expected title in detail, got %q", msg)
	}
}

func TestFriendlyOpenAIImagesNoAccountsMessage(t *testing.T) {
	msg := FriendlyOpenAIImagesNoAccountsMessage()
	if !strings.Contains(msg, "上游账号不可用") {
		t.Fatalf("expected no-accounts reason, got %q", msg)
	}
	if !strings.Contains(msg, openAIImagesNoBillingNote) {
		t.Fatalf("expected billing note, got %q", msg)
	}
}

func TestFriendlyOpenAIImagesClientMessage_ContentPolicy(t *testing.T) {
	raw := "明白了，我会优化图片。{\n \"prompt\": \"test\",\n \"referenced_image_ids\": [\"file_abc\"]\n}"
	msg := friendlyOpenAIImagesClientMessage("content_policy_violation", raw)
	if !strings.Contains(msg, openAIImagesNoBillingNote) {
		t.Fatalf("expected billing note, got %q", msg)
	}
	if !strings.Contains(msg, "内容审核") {
		t.Fatalf("expected friendly reason, got %q", msg)
	}
	if !strings.Contains(msg, "技术详情") {
		t.Fatalf("expected technical detail section, got %q", msg)
	}
}

func TestFriendlyOpenAIImagesClientMessage_NoImageOutput(t *testing.T) {
	msg := friendlyOpenAIImagesClientMessage("", "upstream did not return image output")
	if !strings.Contains(msg, "没有返回可用的图片数据") {
		t.Fatalf("expected no-image reason, got %q", msg)
	}
}

func TestFriendlyOpenAIImagesClientMessage_Idempotent(t *testing.T) {
	first := friendlyOpenAIImagesClientMessage("content_policy_violation", "bad prompt")
	second := friendlyOpenAIImagesClientMessage("content_policy_violation", first)
	if first != second {
		t.Fatalf("expected idempotent friendly message")
	}
}
