package handler

import (
	"strings"

	"github.com/Wei-Shaw/sub2api/internal/pkg/response"
	"github.com/Wei-Shaw/sub2api/internal/service"

	"github.com/gin-gonic/gin"
)

// InfiniteCanvasHandler serves the embedded Infinite Canvas bootstrap API.
type InfiniteCanvasHandler struct {
	settingService *service.SettingService
}

// NewInfiniteCanvasHandler creates a new InfiniteCanvasHandler.
func NewInfiniteCanvasHandler(
	settingService *service.SettingService,
) *InfiniteCanvasHandler {
	return &InfiniteCanvasHandler{
		settingService: settingService,
	}
}

type infiniteCanvasBootstrapResponse struct {
	CanvasURL string `json:"canvas_url"`
	APIBaseURL string `json:"api_base_url"`
}

// GetBootstrap returns Infinite Canvas URL and Sub2API API base for iframe embed.
// GET /api/v1/user/infinite-canvas/bootstrap
func (h *InfiniteCanvasHandler) GetBootstrap(c *gin.Context) {
	publicSettings, err := h.settingService.GetPublicSettings(c.Request.Context())
	if err != nil {
		response.ErrorFrom(c, err)
		return
	}
	if !publicSettings.InfiniteCanvasEnabled {
		response.NotFound(c, "Infinite canvas is disabled")
		return
	}

	canvasURL := strings.TrimSpace(publicSettings.InfiniteCanvasURL)
	if canvasURL == "" {
		response.BadRequest(c, "Infinite canvas URL is not configured")
		return
	}

	apiBaseURL := strings.TrimSpace(publicSettings.APIBaseURL)
	if apiBaseURL == "" {
		response.BadRequest(c, "API base URL is not configured")
		return
	}

	response.Success(c, infiniteCanvasBootstrapResponse{
		CanvasURL:  canvasURL,
		APIBaseURL: apiBaseURL,
	})
}
