package service

import (
	"strings"
	"unicode/utf8"
)

const openAIImagesNoBillingNote = "本次未成功生成图片，不会产生按次（图片）扣费。"

func FriendlyOpenAIImagesNoAccountsMessage() string {
	return friendlyOpenAIImagesClientMessage("api_error", "No available compatible accounts")
}

func friendlyOpenAIImagesClientMessage(code, message string) string {
	code = strings.TrimSpace(strings.ToLower(code))
	message = strings.TrimSpace(message)
	if message != "" && strings.Contains(message, openAIImagesNoBillingNote) {
		return message
	}

	reason, suggestions := classifyOpenAIImagesUserError(code, message)
	lines := []string{
		openAIImagesNoBillingNote,
		"",
		"原因：" + reason,
		"",
		"建议：",
	}
	for _, item := range suggestions {
		lines = append(lines, "· "+item)
	}
	if detail := trimOpenAIImagesUserErrorDetail(message); detail != "" {
		lines = append(lines, "", "—— 技术详情 ——", detail)
	}
	return strings.Join(lines, "\n")
}

func classifyOpenAIImagesUserError(code, message string) (reason string, suggestions []string) {
	lower := strings.ToLower(message)
	if looksLikeHTMLGatewayError(message) {
		return "网关或上游服务暂时不可用（502/503），请求未完成。", []string{
			"这通常表示 Cloudflare/反代或 Sub2API 上游渠道不可用，而不是提示词问题。",
			"请稍后重试；若持续出现，请联系管理员检查生图分组的上游账号。",
		}
	}
	switch {
	case strings.Contains(lower, "no available compatible accounts") ||
		strings.Contains(lower, "no available accounts") ||
		strings.Contains(message, "密钥无效") ||
		strings.Contains(message, "已失效") ||
		strings.Contains(lower, "upstream authentication failed") ||
		strings.Contains(lower, "upstream access forbidden"):
		return "生图分组的上游账号不可用（密钥失效、被禁用或无备用账号）。", []string{
			"请在 Sub2API 后台检查 GPT-Image-2 分组绑定的上游账号状态。",
			"需要重新登录 OAuth 或更新 API Key，并确认账号未被禁用。",
		}
	case code == "content_policy_violation" || strings.Contains(lower, "content_policy_violation") || looksLikeOpenAIImagesToolJSON(message):
		return "上游内容审核或安全策略拒绝了这次图生图/编辑请求。", []string{
			"简化提示词，避免敏感人像、露骨描述或对现有图片文字的精细篡改要求。",
			"更换参考图，或改用更中性的编辑描述后再试。",
			"若仍失败，可尝试固定尺寸（如 1024x1024）并降低质量档位。",
		}
	case code == "moderation_blocked" || strings.Contains(lower, "moderation_blocked"):
		return "请求或参考图未通过内容审核。", []string{
			"更换参考图或调整提示词后重试。",
			"避免涉及受限人物、商标或明显违规内容。",
		}
	case code == "rate_limit_exceeded" || strings.Contains(lower, "rate limit"):
		return "上游渠道触发限流，本次请求未完成。", []string{
			"稍等片刻后重试。",
			"若频繁出现，请联系管理员检查上游账号配额。",
		}
	case strings.Contains(lower, "upstream did not return image") ||
		strings.Contains(lower, "stream disconnected before image") ||
		strings.Contains(message, "未返回") && strings.Contains(message, "图片"):
		return "上游已响应，但没有返回可用的图片数据。", []string{
			"这通常是上游模型没有真正执行生图，或流式连接在出图前结束。",
			"可简化提示词后重试；若使用图生图，请确认参考图已成功上传。",
			"流式模式可保留以规避网关断连，但若多次空跑，请联系管理员检查上游账号。",
		}
	default:
		return "生图请求失败。", []string{
			"请稍后重试。",
			"若问题持续，请联系管理员并提供下方技术详情。",
		}
	}
}

func looksLikeHTMLGatewayError(message string) bool {
	lower := strings.ToLower(message)
	return strings.Contains(lower, "<!doctype html") ||
		strings.Contains(lower, "<html") ||
		strings.Contains(lower, "cf-error-details") ||
		strings.Contains(lower, "cloudflare") ||
		strings.Contains(lower, "bad gateway") ||
		strings.Contains(lower, "error code 502")
}

func looksLikeOpenAIImagesToolJSON(message string) bool {
	lower := strings.ToLower(message)
	trimmed := strings.TrimSpace(message)
	return strings.Contains(lower, "referenced_image_ids") ||
		strings.Contains(lower, "is_style_transfer") ||
		strings.Contains(lower, `"size": "auto"`) ||
		strings.HasPrefix(trimmed, "明白了") ||
		strings.HasPrefix(trimmed, "好的")
}

func trimOpenAIImagesUserErrorDetail(message string) string {
	message = strings.TrimSpace(message)
	if message == "" {
		return ""
	}
	if looksLikeHTMLGatewayError(message) {
		if titleStart := strings.Index(strings.ToLower(message), "<title>"); titleStart >= 0 {
			titleStart += len("<title>")
			if titleEnd := strings.Index(strings.ToLower(message[titleStart:]), "</title>"); titleEnd >= 0 {
				return strings.TrimSpace(message[titleStart : titleStart+titleEnd])
			}
		}
		return "HTTP 502 Bad Gateway"
	}
	const maxRunes = 1200
	if utf8.RuneCountInString(message) <= maxRunes {
		return message
	}
	runes := []rune(message)
	return string(runes[:maxRunes-3]) + "..."
}
