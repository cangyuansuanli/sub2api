window.CANGYUAN_MODEL_MARKET = {
  "updatedAt": "2026-06-05",
  "currencySymbol": "沧耳",
  "unitLabel": "/M",
  "pricePrecision": 3,
  "unitDescription": "沧耳为沧元算力站内货币；1 元 = 1 沧耳，1 沧耳等价于 1 美元 API 使用力；M = 1M tokens；图片模型按规格/张计费",
  "platforms": [
    {
      "id": "openai",
      "name": "OpenAI",
      "accent": "#10a37f",
      "background": "#e8f6f1"
    },
    {
      "id": "anthropic",
      "name": "Claude",
      "accent": "#b65c31",
      "background": "#fff3ec"
    }
  ],
  "groups": [
    {
      "id": "official",
      "name": "GPT-Plus",
      "description": "推荐 GPT-Plus 分组，倍率 0.11x",
      "multiplier": 0.11
    },
    {
      "id": "gpt-special",
      "name": "特价GPT",
      "description": "GPT 特价分组，倍率 0.09x",
      "multiplier": 0.09
    },
    {
      "id": "gpt-pro",
      "name": "GPT-Pro",
      "description": "GPT Pro 分组，倍率 0.2x",
      "multiplier": 0.2
    },
    {
      "id": "gpt-image",
      "name": "GPT-Image",
      "description": "图片生成分组，按图片规格计费",
      "multiplier": 1,
      "hiddenInFilters": true
    },
    {
      "id": "claude-max",
      "name": "CCMAX",
      "description": "CCMAX 分组，倍率 1.4x",
      "multiplier": 1.4
    },
    {
      "id": "claude-022",
      "name": "CC-逆向",
      "description": "CC-逆向分组，倍率 0.21x",
      "multiplier": 0.21
    }
  ],
  "billingModes": {
    "usage": "按量"
  },
  "models": [
    {
      "id": "gpt-5.5",
      "name": "gpt-5.5",
      "platform": "openai",
      "billingMode": "usage",
      "groupIds": [
        "official",
        "gpt-special",
        "gpt-pro"
      ],
      "status": "stable",
      "capabilities": [
        "复杂推理",
        "代码生成",
        "Agent 工作流",
        "支持 GPT-Plus、特价GPT、GPT-Pro 分组"
      ],
      "basePrices": {
        "input": 5,
        "output": 30,
        "cacheWrite": 0,
        "cacheRead": 0.5
      },
      "prices": {
        "input": 0.55,
        "output": 3.3,
        "cacheWrite": 0,
        "cacheRead": 0.055
      }
    },
    {
      "id": "gpt-5.4",
      "name": "gpt-5.4",
      "platform": "openai",
      "billingMode": "usage",
      "groupIds": [
        "official",
        "gpt-special",
        "gpt-pro"
      ],
      "status": "stable",
      "capabilities": [
        "通用问答",
        "代码辅助",
        "文档处理",
        "支持 GPT-Plus、特价GPT、GPT-Pro 分组"
      ],
      "basePrices": {
        "input": 2.5,
        "output": 15,
        "cacheWrite": 0,
        "cacheRead": 0.25
      },
      "prices": {
        "input": 0.275,
        "output": 1.65,
        "cacheWrite": 0,
        "cacheRead": 0.028
      }
    },
    {
      "id": "gpt-5.4-mini",
      "name": "gpt-5.4-mini",
      "platform": "openai",
      "billingMode": "usage",
      "groupIds": [
        "official",
        "gpt-special",
        "gpt-pro"
      ],
      "status": "stable",
      "capabilities": [
        "轻量任务",
        "低成本",
        "快速响应",
        "支持 GPT-Plus、特价GPT、GPT-Pro 分组"
      ],
      "basePrices": {
        "input": 0.75,
        "output": 4.5,
        "cacheWrite": 0,
        "cacheRead": 0.075
      },
      "prices": {
        "input": 0.083,
        "output": 0.495,
        "cacheWrite": 0,
        "cacheRead": 0.008
      }
    },
    {
      "id": "gpt-image-2",
      "name": "gpt-image-2",
      "platform": "openai",
      "billingMode": "usage",
      "groupIds": [
        "gpt-image"
      ],
      "status": "stable",
      "capabilities": [
        "图片生成",
        "按图片规格计费",
        "1K / 2K：0.06 沧耳/张",
        "4K：0.10 沧耳/张"
      ],
      "badges": [
        "图片生成",
        "按张计费"
      ],
      "pricingSummary": "按规格计费",
      "pricingNote": "gpt-image-2 为图片模型，按生成图片规格/张计费，不参与 token 输入、输出、缓存倍率计算。",
      "prices": {
        "input": null,
        "output": null,
        "cacheWrite": null,
        "cacheRead": null
      },
      "customPrices": [
        {
          "label": "1K / 2K",
          "value": 0.06,
          "unitLabel": "/张",
          "precision": 2,
          "highlight": true
        },
        {
          "label": "4K",
          "value": 0.1,
          "unitLabel": "/张",
          "precision": 2
        }
      ]
    },
    {
      "id": "claude-opus-4-8",
      "name": "claude-opus-4-8",
      "platform": "anthropic",
      "billingMode": "usage",
      "groupIds": [
        "claude-max",
        "claude-022"
      ],
      "status": "stable",
      "aliases": [
        "opus-4.8",
        "claude-opus-4.8"
      ],
      "capabilities": [
        "支持 CCMAX、CC-逆向分组",
        "复杂推理",
        "长上下文",
        "官方 Opus 4.8 基础价格计算"
      ],
      "basePrices": {
        "input": 5,
        "output": 25,
        "cacheWrite": 6.25,
        "cacheRead": 0.5
      },
      "prices": {
        "input": 7,
        "output": 35,
        "cacheWrite": 8.75,
        "cacheRead": 0.7
      }
    },
    {
      "id": "claude-opus-4-7",
      "name": "claude-opus-4-7",
      "platform": "anthropic",
      "billingMode": "usage",
      "groupIds": [
        "claude-max",
        "claude-022"
      ],
      "status": "stable",
      "capabilities": [
        "支持 CCMAX、CC-逆向分组",
        "复杂推理",
        "长上下文",
        "官方 Opus 4.7 基础价格计算"
      ],
      "basePrices": {
        "input": 5,
        "output": 25,
        "cacheWrite": 6.25,
        "cacheRead": 0.5
      },
      "prices": {
        "input": 7,
        "output": 35,
        "cacheWrite": 8.75,
        "cacheRead": 0.7
      }
    },
    {
      "id": "claude-opus-4-6",
      "name": "claude-opus-4-6",
      "platform": "anthropic",
      "billingMode": "usage",
      "groupIds": [
        "claude-max",
        "claude-022"
      ],
      "status": "stable",
      "capabilities": [
        "支持 CCMAX、CC-逆向分组",
        "复杂推理",
        "代码与文档处理",
        "官方 Opus 4.6 基础价格计算"
      ],
      "basePrices": {
        "input": 5,
        "output": 25,
        "cacheWrite": 6.25,
        "cacheRead": 0.5
      },
      "prices": {
        "input": 7,
        "output": 35,
        "cacheWrite": 8.75,
        "cacheRead": 0.7
      }
    },
    {
      "id": "claude-sonnet-4-6",
      "name": "claude-sonnet-4-6",
      "platform": "anthropic",
      "billingMode": "usage",
      "groupIds": [
        "claude-max",
        "claude-022"
      ],
      "status": "stable",
      "capabilities": [
        "支持 CCMAX、CC-逆向分组",
        "代码与 Agent 任务",
        "长上下文",
        "官方 Sonnet 4.6 基础价格计算"
      ],
      "basePrices": {
        "input": 3,
        "output": 15,
        "cacheWrite": 3.75,
        "cacheRead": 0.3
      },
      "prices": {
        "input": 4.2,
        "output": 21,
        "cacheWrite": 5.25,
        "cacheRead": 0.42
      }
    },
    {
      "id": "claude-haiku-4-5",
      "name": "claude-haiku-4-5",
      "platform": "anthropic",
      "billingMode": "usage",
      "groupIds": [
        "claude-max",
        "claude-022"
      ],
      "status": "stable",
      "capabilities": [
        "支持 CCMAX、CC-逆向分组",
        "轻量任务",
        "快速响应",
        "官方 Haiku 4.5 基础价格计算"
      ],
      "basePrices": {
        "input": 1,
        "output": 5,
        "cacheWrite": 1.25,
        "cacheRead": 0.1
      },
      "prices": {
        "input": 1.4,
        "output": 7,
        "cacheWrite": 1.75,
        "cacheRead": 0.14
      }
    }
  ]
}
;
