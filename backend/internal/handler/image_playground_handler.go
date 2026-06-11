package handler

import (
	"strings"

	"github.com/Wei-Shaw/sub2api/internal/pkg/response"
	"github.com/Wei-Shaw/sub2api/internal/service"

	"github.com/gin-gonic/gin"
)

// ImagePlaygroundHandler serves the embedded GPT Image Playground bootstrap API.
type ImagePlaygroundHandler struct {
	settingService *service.SettingService
}

// NewImagePlaygroundHandler creates a new ImagePlaygroundHandler.
func NewImagePlaygroundHandler(
	settingService *service.SettingService,
) *ImagePlaygroundHandler {
	return &ImagePlaygroundHandler{
		settingService: settingService,
	}
}

type imagePlaygroundBootstrapResponse struct {
	PlaygroundURL       string `json:"playground_url"`
	Model               string `json:"model"`
	APIMode             string `json:"api_mode"`
	StreamImages        bool   `json:"stream_images"`
	StreamPartialImages int    `json:"stream_partial_images"`
}

// GetBootstrap returns Playground URL and default model settings.
// API keys are entered by the user in the frontend and are not auto-selected.
// GET /api/v1/user/image-playground/bootstrap
func (h *ImagePlaygroundHandler) GetBootstrap(c *gin.Context) {
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

	response.Success(c, imagePlaygroundBootstrapResponse{
		PlaygroundURL:       playgroundURL,
		Model:               publicSettings.ImagePlaygroundDefaultModel,
		APIMode:             "images",
		StreamImages:        true,
		StreamPartialImages: 1,
	})
}
