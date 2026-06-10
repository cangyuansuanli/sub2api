package handler

import (
	"strings"

	"github.com/Wei-Shaw/sub2api/internal/pkg/pagination"
	"github.com/Wei-Shaw/sub2api/internal/pkg/response"
	middleware2 "github.com/Wei-Shaw/sub2api/internal/server/middleware"
	"github.com/Wei-Shaw/sub2api/internal/service"

	"github.com/gin-gonic/gin"
)

// ImagePlaygroundHandler serves the embedded GPT Image Playground bootstrap API.
type ImagePlaygroundHandler struct {
	apiKeyService  *service.APIKeyService
	settingService *service.SettingService
}

// NewImagePlaygroundHandler creates a new ImagePlaygroundHandler.
func NewImagePlaygroundHandler(
	apiKeyService *service.APIKeyService,
	settingService *service.SettingService,
) *ImagePlaygroundHandler {
	return &ImagePlaygroundHandler{
		apiKeyService:  apiKeyService,
		settingService: settingService,
	}
}

type imagePlaygroundBootstrapResponse struct {
	PlaygroundURL       string `json:"playground_url"`
	APIKey              string `json:"api_key"`
	Model               string `json:"model"`
	APIMode             string `json:"api_mode"`
	StreamImages        bool   `json:"stream_images"`
	StreamPartialImages int    `json:"stream_partial_images"`
}

// GetBootstrap returns Playground URL and the user's first active API key.
// GET /api/v1/user/image-playground/bootstrap
func (h *ImagePlaygroundHandler) GetBootstrap(c *gin.Context) {
	subject, ok := middleware2.GetAuthSubjectFromContext(c)
	if !ok {
		response.Unauthorized(c, "User not authenticated")
		return
	}

	publicSettings, err := h.settingService.GetPublicSettings(c.Request.Context())
	if err != nil {
		response.ErrorFrom(c, err)
		return
	}
	if !publicSettings.ImagePlaygroundEnabled {
		response.NotFound(c, "Image playground is disabled")
		return
	}

	playgroundURL := strings.TrimSpace(publicSettings.ImagePlaygroundURL)
	if playgroundURL == "" {
		response.BadRequest(c, "Image playground URL is not configured")
		return
	}

	keys, _, err := h.apiKeyService.List(
		c.Request.Context(),
		subject.UserID,
		pagination.PaginationParams{
			Page:      1,
			PageSize:  1,
			SortBy:    "created_at",
			SortOrder: "asc",
		},
		service.APIKeyListFilters{Status: service.StatusActive},
	)
	if err != nil {
		response.ErrorFrom(c, err)
		return
	}
	if len(keys) == 0 || strings.TrimSpace(keys[0].Key) == "" {
		response.NotFound(c, "No active API key found")
		return
	}

	response.Success(c, imagePlaygroundBootstrapResponse{
		PlaygroundURL:       playgroundURL,
		APIKey:              keys[0].Key,
		Model:               publicSettings.ImagePlaygroundDefaultModel,
		APIMode:             "images",
		StreamImages:        true,
		StreamPartialImages: 1,
	})
}
