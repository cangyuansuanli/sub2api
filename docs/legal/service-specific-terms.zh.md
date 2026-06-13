# 服务特定条款 / Service-Specific Terms

更新日期 / Last updated: 2026-05-16

## 中文版本

这些服务特定条款是服务条款的补充，适用于 沧元算力 的特定产品形态、API 接入能力、测试能力、配额、缓存、监控和服务可用性。若本文件与服务条款存在冲突，就相关特定服务而言，以本文件为准。

沧元算力 的托管服务不面向中国大陆境内提供。自建部署者、代理商、集成商或下游产品运营者不得将 沧元算力 托管服务或基于 沧元算力 的 AI 能力提供给中国大陆境内终端用户。

### 1. API 接入服务

沧元算力 提供统一 API 端点，用于接入不同上游 AI 大模型。实际可用模型、价格、倍率、路由、上下文能力、速率限制、返回格式和区域可用性，以主站后台、接口响应和当时服务配置为准。

你理解并同意：

- 上游模型可能调整价格、能力、模型名称、上下文长度、限流策略、访问权限、地区限制或政策要求；
- 某些模型可能仅在特定分组、套餐、订阅、区域或授权用户中可用；
- 请求可能因上游错误、网络波动、额度不足、限速、模型下线、风控、制裁、出口管制、地区限制或政策原因失败；
- 为保持兼容性，沧元算力 可能对请求或响应进行格式适配、模型映射、流式解析、错误包装、重试或路由调整；
- API 输出不构成专业意见、事实保证、法律意见、医疗意见、金融建议或其他受监管建议。

### 2. 中国大陆访问限制

沧元算力 不接受中国大陆境内注册、充值、创建 API Key 或调用 AI 服务。沧元算力 可以基于 IP、支付方式、账单信息、设备信号、登录行为、调用来源、终端用户分布、业务说明、风险情报或其他合理信号判断是否涉及中国大陆境内使用。

如检测到中国大陆境内使用或规避地区限制的迹象，沧元算力 可以拒绝请求、限制模型、暂停账号、冻结额度、拒绝退款、要求补充材料或终止服务。

你不得将 沧元算力 用于面向中国大陆境内提供生成式人工智能服务、深度合成服务、算法推荐服务、互联网信息服务、在线出版、新闻信息、音视频节目、广告投放、教育考试、金融服务、医疗健康、政务公共服务或其他在中国大陆受监管的服务。

### 3. 团队、托管、代理或集成使用

如果你以团队、企业、组织、代理服务、集成服务或二次分发形式向自己的用户提供基于 沧元算力 的能力，你需要告知用户：

- 他们正在使用由你管理或集成的 AI 服务；
- 你可能访问、管理或控制他们提交给你产品的数据；
- 沧元算力 服务受服务条款、使用政策、支持区域说明和隐私告知约束；
- AI 输出可能需要人工复核，不能作为唯一决策依据；
- 中国大陆境内终端用户不得使用基于 沧元算力 的 AI 服务。

你负责取得必要授权、同意和通知，并确保终端用户遵守 沧元算力 政策。你不得以代理、白标、镜像、转售、代充、共享账号或 API Key 分发方式规避 沧元算力 的地区限制、上游供应商政策或法律要求。

### 4. Beta、预览和测试服务

沧元算力 可能提供测试、预览、实验性、灰度或非正式发布能力。这类服务可能不稳定、不完整、不适合生产环境，并可能随时调整、暂停或下线。

除非另有明确说明，Beta 或预览能力按“现状”提供，沧元算力 不承诺其可用性、兼容性、准确性、性能或长期保留。

Beta、预览和测试服务不得用于高风险场景、面向公众的大规模发布、面向中国大陆境内终端用户的服务，或任何需要法定许可、备案、安全评估、内容审核或专业资质的场景。

### 5. 模型定制、知识库与微调

如果 沧元算力 后续提供微调、模型定制、知识库增强、向量检索、文件分析或其他需要使用你提供材料生成定制结果的服务，你应确保自己有权提交相关材料。

用于模型定制的材料仍属于你的用户内容。除非你明确授权，沧元算力 不会将这些材料用于训练自有通用模型或与无关客户共享。

你不得提交中国大陆国家秘密、工作秘密、重要数据、核心数据、关键信息基础设施数据，或未经合法出境程序和授权的中国大陆个人信息、敏感个人信息、未成年人个人信息。

### 6. 第三方云与上游模型

沧元算力 的部分能力由第三方云服务、上游模型供应商、支付服务、网络服务提供。你需要遵守相关第三方的政策和限制。

第三方服务的变更可能影响 沧元算力 的模型可用性、费用、响应速度、上下文长度、区域限制、安全策略、内容政策和数据处理方式。沧元算力 会尽力适配，但不保证第三方服务保持不变。

你理解并同意，为完成 API 调用，你提交的请求、上下文、文件、输出相关元数据和必要日志可能被传输给位于你所在地之外的上游供应商或基础设施提供商。你应自行确认你有权进行该等跨境传输，并不得提交中国大陆受限数据。

### 7. API 使用限制

你必须遵守 沧元算力 显示或配置的 API 使用限制，包括但不限于：

- 速率限制、并发限制和请求体大小限制；
- 分组、套餐、订阅或账号级额度限制；
- 模型、端点、客户端、区域或上游账号可用性限制；
- 缓存、重试、批处理、长连接和 WebSocket 使用限制；
- 风控、安全、反滥用、反欺诈和异常流量限制；
- 中国大陆访问限制、制裁限制和出口管制限制。

不得通过多账号、代理池、拆分请求、伪造来源、循环重试、共享凭证、代调用或其他方式规避限制。

### 8. 缓存、日志与调试

你可以在合法、合规并取得必要授权的前提下缓存模型输出，但必须自行承担缓存内容的审查、删除、更新、标识和安全保护责任。

沧元算力 可能记录必要日志和统计数据，用于计费、故障排查、风控、安全审计、质量分析、投诉处理和合规处理。日志可能包括账号标识、API Key 标识、请求时间、模型、端点、状态码、用量、费用、错误信息、请求来源、设备或网络元数据等。

沧元算力 不应在默认生产配置下长期保存完整提示词、上传文件、完整响应正文或敏感认证信息。若为排障、审计或安全事件处理需要短期开启调试日志，应采取最小化、脱敏、访问控制和限期清理措施。你不得要求 沧元算力 或自建部署者通过日志功能收集无权处理的数据。

### 9. 数据保留与删除

账号信息、账单记录、用量统计、错误日志、请求元数据和安全审计数据可能在必要期限内保留。你可以根据主站提供的功能删除 API Key、调整配置或联系支持处理账号相关请求。

服务终止后，沧元算力 会按适用法律、账务要求、争议处理、安全审计、反欺诈、制裁合规和上游供应商要求处理剩余数据。

如果你在自有产品中缓存或保存 沧元算力 输出、用户输入、日志或上游响应，你负责向终端用户提供删除、更正、访问、撤回同意、投诉和人工处理渠道。

### 10. AI 生成合成内容标识

API 输出可能不包含适用于所有司法辖区、平台或传播场景的生成合成内容标识。除非具体接口文档明确说明，沧元算力 不保证输出文件、文本、图片、音频、视频或元数据天然满足你发布地或传播地的标识要求。

你在下载、复制、导出、发布、传播或向公众展示 AI 生成合成内容时，应自行添加、保留和维护必要的显式标识、隐式标识、元数据、水印、来源说明或 AI 参与声明。

如果内容可能在中国大陆境内发布或传播，你不得删除、篡改、伪造、隐匿中国大陆法律要求的生成合成内容标识，也不得以 沧元算力 输出未自动标识为由免除你的发布者或传播者责任。

### 11. 服务可用性

沧元算力 会尽力提供稳定服务，但不承诺任何绝对正常运行时间。服务可能因维护、升级、上游故障、网络攻击、云服务异常、支付异常、政策变化、地区限制、制裁、出口管制、监管要求或不可抗力发生中断。

计划维护会尽量提前通知。紧急安全修复、上游服务故障、风控拦截、地区封锁或合规要求可能无法提前通知。

### 12. 自建部署说明

如果你基于开源项目或相关组件进行自建部署，你是该部署环境的独立运营者。你需要自行负责服务器所在地、用户所在地、上游模型、支付、日志、隐私、数据出境、内容安全、备案许可、税务、消费者保护、制裁与出口管制等合规事项。

自建部署不得使用 沧元算力 的品牌、域名、商标、文档或服务规则误导用户，使用户认为该部署由 沧元算力 官方运营或背书。

### 13. 更新和修改

沧元算力 可以根据产品、上游服务、法律法规、地区限制和运营情况更新本服务特定条款。重大变化会尽量通过站内公告、文档更新或其他合理方式提示。

---

## English Version

These Service-Specific Terms supplement the Terms of Service and apply to specific 沧元算力 product forms, API access capabilities, testing capabilities, quotas, caching, monitoring, and service availability. If these terms conflict with the Terms of Service, these terms control for the relevant specific service.

沧元算力 hosted services are not provided within Mainland China. Self-hosted deployers, agents, integrators, or downstream product operators may not provide 沧元算力 hosted services or AI capabilities based on 沧元算力 to end users located in Mainland China.

### 1. API Access Services

沧元算力 provides unified API endpoints for accessing different upstream AI models. The actually available models, prices, multipliers, routing, context capabilities, rate limits, response formats, and regional availability are subject to the main-site dashboard, API responses, and service configuration at the time.

You understand and agree that upstream models may change prices, capabilities, model names, context lengths, rate-limit strategies, access permissions, regional restrictions, or policy requirements; some models may be available only to specific groups, plans, subscriptions, regions, or authorized users; requests may fail due to upstream errors, network fluctuation, insufficient credits, rate limits, model retirement, risk control, sanctions, export controls, regional restrictions, or policy reasons; and 沧元算力 may adapt request or response formats, map models, parse streams, wrap errors, retry requests, or adjust routing to maintain compatibility. API output does not constitute professional advice, factual guarantee, legal advice, medical advice, financial advice, or other regulated advice.

### 2. Mainland China Access Restrictions

沧元算力 does not accept registration, top-up, API key creation, or AI service calls from within Mainland China. 沧元算力 may determine whether use involves Mainland China based on IP addresses, payment methods, billing information, device signals, login behavior, call sources, end-user distribution, business descriptions, risk intelligence, or other reasonable signals.

If signs of Mainland China use or regional-restriction circumvention are detected, 沧元算力 may refuse requests, restrict models, suspend accounts, freeze credits, refuse refunds, request additional materials, or terminate services.

You may not use 沧元算力 to provide into Mainland China generative AI services, deep synthesis services, algorithmic recommendation services, internet information services, online publishing, news information, audiovisual programs, advertising, education and exams, financial services, healthcare, government public services, or other services regulated in Mainland China.

### 3. Team, Hosted, Agent, or Integration Use

If you provide 沧元算力-based capabilities to your own users as a team, enterprise, organization, agent service, integration service, or secondary distributor, you must inform users that they are using an AI service managed or integrated by you; you may access, manage, or control data they submit to your product; 沧元算力 services are subject to the Terms of Service, Usage Policy, Supported Regions notice, and privacy disclosures; AI output may require human review and cannot be the sole basis for decisions; and end users in Mainland China may not use AI services based on 沧元算力.

You are responsible for obtaining necessary authorization, consent, and notice, and for ensuring that end users comply with 沧元算力 policies. You may not use agency, white-label, mirror, resale, top-up on behalf of others, shared account, or API key distribution methods to bypass 沧元算力 regional restrictions, upstream provider policies, or legal requirements.

### 4. Beta, Preview, and Testing Services

沧元算力 may provide testing, preview, experimental, gray-release, or informal-release capabilities. Such services may be unstable, incomplete, unsuitable for production, and may be changed, suspended, or removed at any time.

Unless expressly stated otherwise, beta or preview capabilities are provided “as is,” and 沧元算力 does not promise their availability, compatibility, accuracy, performance, or long-term retention.

Beta, preview, and testing services may not be used for high-risk scenarios, large-scale public releases, services directed at end users in Mainland China, or any scenario requiring statutory permission, filing, security assessment, content review, or professional qualification.

### 5. Model Customization, Knowledge Bases, and Fine-Tuning

If 沧元算力 later provides fine-tuning, model customization, knowledge-base enhancement, vector retrieval, file analysis, or other services that use materials you provide to generate customized results, you must ensure that you have the right to submit those materials.

Materials used for model customization remain your User Content. Unless you expressly authorize it, 沧元算力 will not use such materials to train its own general-purpose models or share them with unrelated customers.

You may not submit Mainland China state secrets, work secrets, important data, core data, critical information infrastructure data, or Mainland China personal information, sensitive personal information, or minors’ personal information without lawful export procedures and authorization.

### 6. Third-Party Cloud and Upstream Models

Some 沧元算力 capabilities are provided by third-party cloud services, upstream model providers, payment services, and network services. You must comply with the policies and restrictions of those third parties.

Changes to third-party services may affect 沧元算力 model availability, fees, response speed, context length, regional restrictions, safety strategies, content policies, and data processing methods. 沧元算力 will make reasonable efforts to adapt, but does not guarantee that third-party services will remain unchanged.

You understand and agree that, to complete API calls, the requests, context, files, output-related metadata, and necessary logs you submit may be transmitted to upstream providers or infrastructure providers located outside your location. You should independently confirm that you have the right to make such cross-border transfers and must not submit Mainland China restricted data.

### 7. API Usage Limits

You must comply with API usage limits shown or configured by 沧元算力, including rate limits, concurrency limits, request body size limits, group, plan, subscription, account-level quota limits, model, endpoint, client, region, upstream account availability limits, cache, retry, batch, long-connection and WebSocket limits, risk-control, security, anti-abuse, anti-fraud and abnormal traffic limits, Mainland China access restrictions, sanctions restrictions, and export-control restrictions.

You may not bypass limits through multiple accounts, proxy pools, request splitting, forged origins, retry loops, shared credentials, calling on behalf of others, or other methods.

### 8. Caching, Logs, and Debugging

You may cache model output where lawful, compliant, and properly authorized, but you are responsible for reviewing, deleting, updating, labeling, and protecting the cached content.

沧元算力 may record necessary logs and statistics for billing, troubleshooting, risk control, security audits, quality analysis, complaint handling, and compliance handling. Logs may include account identifiers, API key identifiers, request time, model, endpoint, status code, usage, cost, error information, request source, device metadata, or network metadata.

沧元算力 should not retain complete prompts, uploaded files, complete response bodies, or sensitive authentication information for a long period under default production configuration. If debugging logs must be temporarily enabled for troubleshooting, audit, or security incident handling, minimization, desensitization, access control, and time-limited cleanup measures should be adopted. You may not require 沧元算力 or self-hosted deployers to collect data through logs that they are not authorized to process.

### 9. Data Retention and Deletion

Account information, billing records, usage statistics, error logs, request metadata, and security audit data may be retained for the necessary period. You may delete API keys, adjust configurations, or contact support for account-related requests according to main-site features.

After service termination, 沧元算力 will handle remaining data according to applicable law, accounting requirements, dispute handling, security audit, anti-fraud, sanctions compliance, and upstream provider requirements.

If you cache or store 沧元算力 output, user input, logs, or upstream responses in your own product, you are responsible for providing end users with deletion, correction, access, consent withdrawal, complaint, and human handling channels.

### 10. AI-Generated and Synthetic Content Labels

API output may not include AI-generated or synthetic-content labels suitable for all jurisdictions, platforms, or distribution scenarios. Unless specific API documentation expressly states otherwise, 沧元算力 does not guarantee that output files, text, images, audio, video, or metadata naturally satisfy labeling requirements in your publication or distribution location.

When downloading, copying, exporting, publishing, distributing, or publicly displaying AI-generated or synthetic content, you should independently add, retain, and maintain necessary explicit labels, implicit labels, metadata, watermarks, source descriptions, or AI involvement declarations.

If content may be published or distributed within Mainland China, you may not remove, tamper with, forge, or conceal AI-generated or synthetic-content labels required by Mainland China law, and you may not use the absence of automatic labeling in 沧元算力 output as a reason to avoid your responsibility as publisher or distributor.

### 11. Service Availability

沧元算力 will make reasonable efforts to provide stable services, but does not promise any absolute uptime. Services may be interrupted due to maintenance, upgrades, upstream failures, network attacks, cloud service exceptions, payment exceptions, policy changes, regional restrictions, sanctions, export controls, regulatory requirements, or force majeure.

Planned maintenance will be announced in advance where reasonably possible. Emergency security fixes, upstream service failures, risk-control blocks, regional blocks, or compliance requirements may not allow advance notice.

### 12. Self-Hosted Deployment Notice

If you self-host based on open-source projects or related components, you are the independent operator of that deployment environment. You are responsible for compliance matters including server location, user location, upstream models, payments, logs, privacy, data export, content safety, filings and licenses, tax, consumer protection, sanctions, and export controls.

Self-hosted deployments may not use the 沧元算力 brand, domain name, trademarks, documentation, or service rules in a way that misleads users into believing the deployment is officially operated or endorsed by 沧元算力.

### 13. Updates and Modifications

沧元算力 may update these Service-Specific Terms according to products, upstream services, laws and regulations, regional restrictions, and operations. Material changes will be communicated where reasonably possible through site notices, documentation updates, or other reasonable methods.