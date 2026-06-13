<template>
  <div ref="pageRoot" class="docsview-page">
<header class="mobile-topbar">
    <a class="mobile-brand" href="#overview" aria-label="沧元算力 文档首页">
      <img :src="`${CDN}/site/logo.png`" alt="">
      <span>沧元算力 文档</span>
    </a>
    <button class="menu-button" type="button" aria-label="打开目录" aria-controls="sidebar" aria-expanded="false">
      <span></span>
      <span></span>
      <span></span>
    </button>
  </header>

  <div class="app-shell">
    <aside class="sidebar" id="sidebar">
      <a class="sidebar-brand" href="#overview" aria-label="回到文档顶部">
        <img :src="`${CDN}/site/logo.png`" alt="">
        <span>
          <strong>沧元算力</strong>
          <small>用户使用文档</small>
        </span>
      </a>
      <nav class="sidebar-nav" aria-label="文档目录">
        <a href="#overview">总览</a>
        <a href="#quick-start">快速开始</a>
        <a href="#account">账号与 Key</a>
        <a href="#environment">基础环境</a>
        <a href="#tool-install">工具安装</a>
        <a href="#api-config">API 配置</a>
        <a href="#ccswitch">CCSwitch</a>
        <a href="#recommendations">工具推荐</a>
        <a href="#troubleshooting">计费与排查</a>
      </nav>
      <div class="sidebar-card">
        <span>API Base URL</span>
        <code>__SITE_ORIGIN__</code>
        <button class="copy-button inline" type="button" data-copy="__SITE_ORIGIN__">复制</button>
      </div>
    </aside>

    <main class="content" id="overview">
      <section class="hero-section">
        <div class="hero-copy">
          <p class="eyebrow">沧元算力 API Relay</p>
          <h1>沧元算力 用户使用文档</h1>
          <p>从注册、创建 API Key，到 Codex、Claude Code、CCSwitch 的安装配置和常见错误排查。面向新用户，也方便老用户快速定位配置项。</p>
          <div class="hero-actions">
            <a class="button primary" href="#quick-start">开始配置</a>
            <a class="button secondary" href="./models.html">查看模型广场</a>
            <a class="button secondary" href="/dashboard">用户后台</a>
          </div>
        </div>
        <div class="hero-panel">
          <div class="status-line">
            <span>服务入口</span>
            <strong>__SITE_HOST__</strong>
          </div>
          <div class="quick-links">
            <a href="/home">用户首页</a>
            <a href="/dashboard">用户后台</a>
            <a href="/keys">创建 Key</a>
          </div>
          <div class="base-box">
            <span>Base URL</span>
            <code>__SITE_ORIGIN__</code>
            <button class="copy-button" type="button" data-copy="__SITE_ORIGIN__">复制</button>
          </div>
        </div>
      </section>

      <section class="section dashboard-grid" aria-label="文档核心路径">
        <article class="path-card">
          <span>01</span>
          <h2>注册并创建 Key</h2>
          <p>完成账号注册，进入后台创建专属 API Key。每个软件建议单独使用一个 Key。</p>
          <a href="#account">查看步骤</a>
        </article>
        <article class="path-card">
          <span>02</span>
          <h2>准备基础环境</h2>
          <p>安装 Node.js 与 Git，确保 Codex CLI、Claude Code CLI、ZCF、CCSwitch 等工具可运行。</p>
          <a href="#environment">安装环境</a>
        </article>
        <article class="path-card">
          <span>03</span>
          <h2>选择工具形态</h2>
          <p>按 App、CLI、IDE 三类选择 Codex 或 Claude Code 的使用方式。</p>
          <a href="#tool-install">安装工具</a>
        </article>
        <article class="path-card">
          <span>04</span>
          <h2>连接沧元算力 API</h2>
          <p>使用 Base URL 和 API Key 接入，可用 CCSwitch 统一管理多个工具的供应商配置。</p>
          <a href="#api-config">开始配置</a>
        </article>
      </section>

      <section class="section" id="quick-start">
        <div class="section-heading">
          <p class="eyebrow">Quick Start</p>
          <h2>快速开始</h2>
          <p>第一次使用建议按顺序完成；已有账号时可以直接跳到创建 Key 和客户端配置。</p>
        </div>
        <div class="steps">
          <div class="step-item"><span>1</span><p>注册沧元算力 账号。</p></div>
          <div class="step-item"><span>2</span><p>登录用户后台。</p></div>
          <div class="step-item"><span>3</span><p>创建专属 API Key。</p></div>
          <div class="step-item"><span>4</span><p>安装 Node.js、Git 等基础环境。</p></div>
          <div class="step-item"><span>5</span><p>使用 CCSwitch、ZCF 或其他客户端配置工具接入。</p></div>
        </div>
        <div class="command-card">
          <div>
            <strong>客户端通用填写</strong>
            <p>文档和截图里只写占位符，不要公开真实 Key。</p>
          </div>
          <pre><button class="copy-button" type="button" data-copy="Base URL: __SITE_ORIGIN__&#10;API Key: sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx">复制</button><code>Base URL: __SITE_ORIGIN__
API Key: sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</code></pre>
        </div>
      </section>

      <section class="section" id="account">
        <div class="section-heading">
          <p class="eyebrow">Account</p>
          <h2>账号与 Key</h2>
          <p>后台入口、邮箱验证、创建 Key 和安全注意事项都集中在这里。</p>
        </div>
        <div class="split-layout">
          <div>
            <h3>注册账号</h3>
            <ol class="clean-list">
              <li>打开 <a href="/home">/home</a>。</li>
              <li>点击注册或登录入口。</li>
              <li>使用邮箱注册账号，目前仅支持 <code>@qq.com</code>、<code>@163.com</code>、<code>@gmail.com</code>。</li>
              <li>如果系统要求验证邮箱，请前往邮箱完成验证。</li>
              <li>注册完成后进入用户后台。</li>
            </ol>
            <details class="soft-detail">
              <summary>收不到验证邮件</summary>
              <ol>
                <li>检查垃圾邮件、广告邮件、订阅邮件文件夹。</li>
                <li>确认邮箱地址没有输错。</li>
                <li>等待 1-3 分钟后重新发送。</li>
                <li>仍无法收到时请联系管理员。</li>
              </ol>
            </details>
          </div>
          <figure>
            <img :src="`${CDN}/docs/登陆页面.png`" alt="沧元算力 注册入口截图">
          </figure>
        </div>

        <div class="split-layout reverse">
          <div>
            <h3>创建专属 Key</h3>
            <ol class="clean-list">
              <li>进入 <a href="/keys">/keys</a>。</li>
              <li>点击“添加 Key”或“创建 Key”。</li>
              <li>填写 Key 名称，例如 <code>我的电脑</code>、<code>Cherry Studio</code>、<code>Codex</code>。</li>
              <li>按个人需求选择可用分组，不确定时保持默认。</li>
              <li>创建成功后立即复制并妥善保存。</li>
            </ol>
            <div class="warning">
              <strong>Key 安全提醒</strong>
              <p>不要公开完整 Key。反馈问题时只保留前 6 位和后 4 位；怀疑泄露时立即删除旧 Key 并创建新 Key。</p>
            </div>
          </div>
          <div class="image-stack">
            <figure><img :src="`${CDN}/docs/创建 Key 按钮.png`" alt="创建 Key 按钮截图"></figure>
            <figure><img :src="`${CDN}/docs/创建 Key 表单1.png`" alt="创建 Key 表单截图"></figure>
            <figure><img :src="`${CDN}/docs/创建 Key 表单-URL.png`" alt="创建 Key URL 截图"></figure>
          </div>
        </div>

        <div class="table-wrap">
          <table>
            <thead><tr><th>后台功能</th><th>说明</th></tr></thead>
            <tbody>
              <tr><td>个人资料</td><td>查看账号、余额、套餐或分组状态</td></tr>
              <tr><td>API 密钥</td><td>创建、复制、删除 API Key</td></tr>
              <tr><td>使用记录</td><td>查看请求量、消耗、模型调用情况</td></tr>
              <tr><td>模型信息</td><td>查看当前分组可用模型</td></tr>
              <tr><td>公告通知</td><td>查看维护通知、模型变更、故障说明</td></tr>
              <tr><td>渠道状态</td><td>查看当前模型和渠道可用性</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="section" id="environment">
        <div class="section-heading">
          <p class="eyebrow">Environment</p>
          <h2>基础环境安装</h2>
          <p>本章只处理电脑上需要先准备什么。安装完基础环境后，再安装 Codex 或 Claude Code。</p>
        </div>
        <div class="two-col">
          <article class="info-card" data-tabs>
            <div class="card-head">
              <h3>Node.js</h3>
              <div class="tab-list" role="tablist" aria-label="Node.js 安装平台">
                <button class="tab-button active" type="button" data-tab-target="node-win">Windows</button>
                <button class="tab-button" type="button" data-tab-target="node-mac">macOS</button>
              </div>
            </div>
            <div class="tab-panel active" data-tab-panel="node-win">
              <ol>
                <li>打开 Node.js 官网：<a href="https://nodejs.org/zh-cn/download">https://nodejs.org/zh-cn/download</a></li>
                <li>下载 LTS 长期支持版本的 Windows Installer <code>.msi</code>。</li>
                <li>运行安装包，采用默认配置安装。</li>
              </ol>
              <figure><img :src="`${CDN}/docs/下载Node.js.png`" alt="Node.js 下载页面截图"></figure>
            </div>
            <div class="tab-panel" data-tab-panel="node-mac">
              <p>macOS 推荐先用官网安装包，适合大多数小白用户；已经熟悉终端并装过 Homebrew 的用户，再用 Homebrew 管理 Node.js。</p>
              <div class="install-note">
                <strong>方式一：官网安装，推荐小白用户</strong>
                <ol>
                  <li>打开 Node.js 官网：<a href="https://nodejs.org/zh-cn/download">https://nodejs.org/zh-cn/download</a></li>
                  <li>选择 LTS 长期支持版本。</li>
                  <li>如果是 M1、M2、M3、M4、M5 等芯片，下载 macOS Apple Silicon 安装包。</li>
                  <li>如果是较早期 Intel Mac，下载 macOS Intel 安装包。</li>
                  <li>打开下载的 <code>.pkg</code> 安装包，按提示一路继续安装。</li>
                  <li>安装完成后，打开“终端”验证版本。</li>
                </ol>
              </div>
              <div class="command-list two">
                <div class="terminal-command">
                  <span>验证 Node.js</span>
                  <pre><button class="copy-button" type="button" data-copy="node --version">复制</button><code>node --version</code></pre>
                </div>
                <div class="terminal-command">
                  <span>验证 npm</span>
                  <pre><button class="copy-button" type="button" data-copy="npm --version">复制</button><code>npm --version</code></pre>
                </div>
              </div>
              <div class="install-note">
                <strong>方式二：Homebrew 安装，适合已有 Homebrew 的用户</strong>
                <p>Homebrew 是 macOS 的软件包管理工具。已经装过 Homebrew 时，用它安装和升级 Node.js 会更方便；如果只是为了装 Node.js，不需要强行先学 Homebrew。</p>
              </div>
              <div class="command-list">
                <div class="terminal-command">
                  <span>检查是否已安装 Homebrew</span>
                  <pre><button class="copy-button" type="button" data-copy="brew --version">复制</button><code>brew --version</code></pre>
                </div>
                <div class="terminal-command">
                  <span>未安装 Homebrew 时，先安装 Homebrew</span>
                  <pre><button class="copy-button" type="button" data-copy="/bin/bash -c &quot;$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)&quot;">复制</button><code>/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"</code></pre>
                </div>
                <div class="terminal-command">
                  <span>用 Homebrew 安装 Node.js</span>
                  <pre><button class="copy-button" type="button" data-copy="brew install node">复制</button><code>brew install node</code></pre>
                </div>
              </div>
              <div class="warning">
                <strong>如果命令提示找不到 node</strong>
                <p>关闭终端重新打开后再验证。仍然不行时，多半是 PATH 没刷新或 Homebrew 安装后没有按提示配置 shell 环境。</p>
              </div>
            </div>
            <pre><button class="copy-button" type="button" data-copy="node -v&#10;npm -v">复制</button><code>node -v
npm -v</code></pre>
          </article>

          <article class="info-card" data-tabs>
            <div class="card-head">
              <h3>Git</h3>
              <div class="tab-list" role="tablist" aria-label="Git 安装平台">
                <button class="tab-button active" type="button" data-tab-target="git-win">Windows</button>
                <button class="tab-button" type="button" data-tab-target="git-mac">macOS</button>
              </div>
            </div>
            <p>Codex、Claude Code 和 Gemini CLI 在处理本地项目时经常需要 Git。</p>
            <div class="tab-panel active" data-tab-panel="git-win">
              <p>Windows 用户建议安装 Git for Windows。</p>
              <p>下载地址：<a href="https://git-scm.com/install/windows">https://git-scm.com/install/windows</a></p>
            </div>
            <div class="tab-panel" data-tab-panel="git-mac">
              <p>macOS 通常自带或可通过系统开发者工具获得 Git。已安装 Homebrew 的用户，也可以直接用 Homebrew 安装或更新 Git。</p>
              <div class="command-list">
                <div class="terminal-command">
                  <span>Homebrew 安装 Git</span>
                  <pre><button class="copy-button" type="button" data-copy="brew install git">复制</button><code>brew install git</code></pre>
                </div>
              </div>
            </div>
            <pre><button class="copy-button" type="button" data-copy="git --version">复制</button><code>git --version</code></pre>
          </article>
        </div>
      </section>

      <section class="section" id="tool-install">
        <div class="section-heading">
          <p class="eyebrow">Tools</p>
          <h2>工具安装</h2>
          <p>安装路径按“工具 -> 使用形态 -> 系统”组织。终端命令都拆成单条可复制，复制后可以直接粘贴执行；需要进入项目目录的步骤只用文字说明。</p>
        </div>

        <div class="tool-switch" data-tabs>
          <div class="tool-tabs tab-list" role="tablist" aria-label="选择工具">
            <button class="tab-button active" type="button" data-tab-target="codex-tool">Codex</button>
            <button class="tab-button" type="button" data-tab-target="claude-tool">Claude Code</button>
          </div>

          <div class="tab-panel active" data-tab-panel="codex-tool">
            <div class="tool-panel" data-tabs>
              <div class="tool-panel-head">
                <div>
                  <h3>Codex</h3>
                  <p>OpenAI 官方代码代理工具，支持 App、CLI 和 IDE 扩展。</p>
                </div>
                <div class="tab-list compact" role="tablist" aria-label="Codex 形态">
                  <button class="tab-button active" type="button" data-tab-target="codex-app">App</button>
                  <button class="tab-button" type="button" data-tab-target="codex-cli">CLI</button>
                  <button class="tab-button" type="button" data-tab-target="codex-ide">IDE</button>
                </div>
              </div>
              <div class="tab-panel active" data-tab-panel="codex-app">
                <div class="platform-tabs" data-tabs>
                  <div class="tab-list compact" role="tablist" aria-label="Codex App 系统">
                    <button class="tab-button active" type="button" data-tab-target="codex-app-windows">Windows</button>
                    <button class="tab-button" type="button" data-tab-target="codex-app-macos">macOS</button>
                  </div>
                  <div class="tab-panel active" data-tab-panel="codex-app-windows">
                    <div class="split-layout">
                      <div>
                        <p>Codex App 适合不想长期使用终端的用户。Windows 版从 Microsoft Store 安装，安装后从开始菜单启动。</p>
                        <div class="link-grid">
                          <a href="https://developers.openai.com/codex/app">官方文档</a>
                          <a href="https://apps.microsoft.com/detail/9N6XHWQH3HGV">Windows Microsoft Store</a>
                          <a href="https://chatgpt.com/codex">网络较好时：ChatGPT Codex</a>
                        </div>
                        <div class="install-note">
                          <strong>网络较好时</strong>
                          <p>如果有稳定的国际网络连接，可以直接访问 <a href="https://chatgpt.com/codex">https://chatgpt.com/codex</a> 使用 ChatGPT 里的 Codex 入口；如果访问不稳定，仍建议按下面的 Microsoft Store 方式安装本地 App。</p>
                        </div>
                        <div class="install-note">
                          <strong>Windows 安装</strong>
                          <ol>
                            <li>打开 Microsoft Store 的 Codex 页面。</li>
                            <li>点击“获取”或“安装”。</li>
                            <li>等待安装完成。</li>
                            <li>从开始菜单启动 Codex。</li>
                          </ol>
                        </div>
                        <div class="install-note">
                          <strong>首次使用</strong>
                          <ol>
                            <li>按提示登录 ChatGPT 账号或使用 OpenAI API Key。</li>
                            <li>点击添加项目或选择项目目录。</li>
                            <li>选择要处理的本地代码文件夹。</li>
                            <li>第一条任务建议先让它分析项目。</li>
                          </ol>
                        </div>
                      </div>
                      <figure><img :src="`${CDN}/docs/windows微软商店安装codexapp.png`" alt="Windows Microsoft Store 安装 Codex App 截图"></figure>
                    </div>
                  </div>
                  <div class="tab-panel" data-tab-panel="codex-app-macos">
                    <p>macOS 先确认芯片类型，再下载对应 DMG。Apple Silicon 指 M1、M2、M3、M4、M5 等芯片；Intel 指较早期 Mac。</p>
                    <div class="link-grid">
                      <a href="https://developers.openai.com/codex/app">官方文档</a>
                      <a href="https://persistent.oaistatic.com/codex-app-prod/Codex.dmg">macOS Apple Silicon</a>
                      <a href="https://persistent.oaistatic.com/codex-app-prod/Codex-latest-x64.dmg">macOS Intel</a>
                      <a href="https://chatgpt.com/codex">网络较好时：ChatGPT Codex</a>
                    </div>
                    <div class="install-note">
                      <strong>网络较好时</strong>
                      <p>如果有稳定的国际网络连接，可以直接访问 <a href="https://chatgpt.com/codex">https://chatgpt.com/codex</a> 使用 ChatGPT 里的 Codex 入口；如果访问不稳定，仍建议下载对应芯片版本的 DMG 安装本地 App。</p>
                    </div>
                    <div class="install-note">
                      <strong>macOS 安装</strong>
                      <ol>
                        <li>下载对应版本的 DMG。</li>
                        <li>双击打开 <code>Codex.dmg</code>。</li>
                        <li>将 Codex 拖入“应用程序”文件夹。</li>
                        <li>第一次打开时，如果 macOS 出现安全提示，按系统提示允许打开。</li>
                      </ol>
                    </div>
                    <div class="install-note">
                      <strong>已有 Homebrew 时</strong>
                      <p>如果已经习惯用 Homebrew 管理 App，也可以用 Homebrew 安装 Codex App。</p>
                    </div>
                    <div class="command-list">
                      <div class="terminal-command">
                        <span>Homebrew 安装 Codex App</span>
                        <pre><button class="copy-button" type="button" data-copy="brew install --cask codex-app">复制</button><code>brew install --cask codex-app</code></pre>
                      </div>
                    </div>
                    <div class="prompt-grid">
                      <code>请阅读这个项目，告诉我项目结构和启动方式。</code>
                      <code>检查这个项目有没有明显的报错风险，先分析，不要直接改代码。</code>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tab-panel" data-tab-panel="codex-cli">
                <div class="platform-tabs" data-tabs>
                  <div class="tab-list compact" role="tablist" aria-label="Codex CLI 系统">
                    <button class="tab-button active" type="button" data-tab-target="codex-cli-windows">Windows</button>
                    <button class="tab-button" type="button" data-tab-target="codex-cli-macos">macOS</button>
                  </div>
                  <div class="tab-panel active" data-tab-panel="codex-cli-windows">
                    <p>Windows 用户可以直接在 PowerShell 中运行 Codex。项目依赖 Linux 工具链时，再考虑 WSL2。</p>
                    <div class="install-choice recommended">
                      <div class="choice-copy">
                        <span>推荐安装</span>
                        <strong>npm 安装 Codex CLI</strong>
                        <p>已安装 Node.js 后，Windows 直接用这一条即可。</p>
                      </div>
                      <pre><button class="copy-button" type="button" data-copy="npm i -g @openai/codex">复制</button><code>npm i -g @openai/codex</code></pre>
                    </div>
                    <div class="command-group">
                      <h4>安装后常用命令</h4>
                      <div class="command-list two">
                        <div class="terminal-command">
                          <span>验证</span>
                          <pre><button class="copy-button" type="button" data-copy="codex --version">复制</button><code>codex --version</code></pre>
                        </div>
                        <div class="terminal-command">
                          <span>启动，先在终端进入项目目录</span>
                          <pre><button class="copy-button" type="button" data-copy="codex">复制</button><code>codex</code></pre>
                        </div>
                        <div class="terminal-command">
                          <span>升级到最新版</span>
                          <pre><button class="copy-button" type="button" data-copy="npm i -g @openai/codex@latest">复制</button><code>npm i -g @openai/codex@latest</code></pre>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="tab-panel" data-tab-panel="codex-cli-macos">
                    <p>macOS 在“终端”中安装和使用。小白用户可继续用 npm；已经安装 Homebrew 的用户，也可以用 Homebrew 安装 Codex CLI。进入项目目录后执行 <code>codex</code>，首次运行按提示登录 ChatGPT 账号或使用 API Key。</p>
                    <div class="install-options">
                      <div class="install-choice recommended">
                        <div class="choice-copy">
                          <span>推荐</span>
                          <strong>npm 安装</strong>
                          <p>已经按前面步骤安装 Node.js 的用户，用这一条即可。</p>
                        </div>
                        <pre><button class="copy-button" type="button" data-copy="npm i -g @openai/codex">复制</button><code>npm i -g @openai/codex</code></pre>
                      </div>
                      <div class="install-choice">
                        <div class="choice-copy">
                          <span>可选</span>
                          <strong>Homebrew 安装</strong>
                          <p>如果你已经习惯用 Homebrew 管理软件，可以用这一条。</p>
                        </div>
                        <pre><button class="copy-button" type="button" data-copy="brew install --cask codex">复制</button><code>brew install --cask codex</code></pre>
                      </div>
                    </div>
                    <div class="command-group">
                      <h4>安装后常用命令</h4>
                      <div class="command-list two">
                        <div class="terminal-command">
                          <span>验证</span>
                          <pre><button class="copy-button" type="button" data-copy="codex --version">复制</button><code>codex --version</code></pre>
                        </div>
                        <div class="terminal-command">
                          <span>启动，先在终端进入项目目录</span>
                          <pre><button class="copy-button" type="button" data-copy="codex">复制</button><code>codex</code></pre>
                        </div>
                      </div>
                    </div>
                    <details class="soft-detail">
                      <summary>更新命令</summary>
                      <div class="command-list two">
                        <div class="terminal-command">
                          <span>npm 更新</span>
                          <pre><button class="copy-button" type="button" data-copy="npm i -g @openai/codex@latest">复制</button><code>npm i -g @openai/codex@latest</code></pre>
                        </div>
                        <div class="terminal-command">
                          <span>Homebrew 更新</span>
                          <pre><button class="copy-button" type="button" data-copy="brew upgrade --cask codex">复制</button><code>brew upgrade --cask codex</code></pre>
                        </div>
                      </div>
                    </details>
                  </div>
                </div>
                <div class="prompt-grid">
                  <code>请阅读这个项目，说明主要目录和技术栈。</code>
                  <code>帮我找出这个报错可能来自哪里，先不要改代码。</code>
                  <code>实现这个小功能，完成后告诉我改了哪些文件。</code>
                </div>
              </div>
              <div class="tab-panel" data-tab-panel="codex-ide">
                <div class="platform-tabs" data-tabs>
                  <div class="tab-list compact" role="tablist" aria-label="Codex IDE 系统">
                    <button class="tab-button active" type="button" data-tab-target="codex-ide-windows">Windows</button>
                    <button class="tab-button" type="button" data-tab-target="codex-ide-macos">macOS</button>
                  </div>
                  <div class="tab-panel active" data-tab-panel="codex-ide-windows">
                    <p>Codex IDE 扩展适合希望在编辑器中直接使用 Codex 的用户。Windows 常用入口是 <code>Ctrl+Shift+X</code> 打开扩展市场。</p>
                    <div class="link-grid">
                      <a href="https://developers.openai.com/codex/ide">Codex IDE 官方文档</a>
                    </div>
                    <div class="two-col">
                      <div>
                        <h4>VS Code / Cursor / Windsurf</h4>
                        <ol>
                          <li>打开编辑器扩展市场。</li>
                          <li>搜索 <code>Codex</code>。</li>
                          <li>安装 OpenAI 官方 Codex 扩展。</li>
                          <li>安装完成后重启编辑器。</li>
                          <li>在侧边栏找到 Codex 图标，按提示登录。</li>
                        </ol>
                      </div>
                      <div>
                        <h4>JetBrains</h4>
                        <ol>
                          <li>打开 Plugins / 插件市场。</li>
                          <li>搜索 Codex。</li>
                          <li>安装对应插件并重启 IDE。</li>
                          <li>按插件页面提示登录。</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                  <div class="tab-panel" data-tab-panel="codex-ide-macos">
                    <p>macOS 常用 <code>Cmd+Shift+X</code> 打开 VS Code 扩展市场。Cursor、Windsurf 和 JetBrains 按各自插件市场入口安装。</p>
                    <div class="link-grid">
                      <a href="https://developers.openai.com/codex/ide">Codex IDE 官方文档</a>
                    </div>
                    <div class="two-col">
                      <div>
                        <h4>VS Code / Cursor / Windsurf</h4>
                        <ol>
                          <li>打开编辑器扩展市场。</li>
                          <li>搜索 <code>Codex</code>。</li>
                          <li>安装 OpenAI 官方 Codex 扩展。</li>
                          <li>安装完成后重启编辑器。</li>
                          <li>按提示登录 ChatGPT 账号或 API Key。</li>
                        </ol>
                      </div>
                      <div>
                        <h4>JetBrains</h4>
                        <ol>
                          <li>打开 JetBrains IDE 的 Plugins。</li>
                          <li>搜索 Codex 并安装。</li>
                          <li>完全重启 IDE。</li>
                          <li>按插件页面提示完成登录。</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="tab-panel" data-tab-panel="claude-tool">
            <div class="tool-panel" data-tabs>
              <div class="tool-panel-head">
                <div>
                  <h3>Claude Code</h3>
                  <p>Anthropic 官方代码代理工具，CLI 和 IDE 集成是主要使用方式。</p>
                </div>
                <div class="tab-list compact" role="tablist" aria-label="Claude Code 形态">
                  <button class="tab-button active" type="button" data-tab-target="claude-app">App</button>
                  <button class="tab-button" type="button" data-tab-target="claude-cli">CLI</button>
                  <button class="tab-button" type="button" data-tab-target="claude-ide">IDE</button>
                </div>
              </div>
              <div class="tab-panel active" data-tab-panel="claude-app">
                <div class="platform-tabs" data-tabs>
                  <div class="tab-list compact" role="tablist" aria-label="Claude App 系统">
                    <button class="tab-button active" type="button" data-tab-target="claude-app-windows">Windows</button>
                    <button class="tab-button" type="button" data-tab-target="claude-app-macos">macOS</button>
                  </div>
                  <div class="tab-panel active" data-tab-panel="claude-app-windows">
                    <p>Claude 桌面应用支持 Windows 和 Windows ARM64。安装后登录 Claude 账号，在 Code 相关入口中开始使用。</p>
                    <div class="link-grid">
                      <a href="https://claude.com/download">Claude Desktop 下载页</a>
                    </div>
                    <div class="install-note">
                      <strong>Windows 安装</strong>
                      <ol>
                        <li>打开 Claude 下载页。</li>
                        <li>选择 Windows 版本；ARM64 设备选择 Windows ARM64。</li>
                        <li>下载并运行安装包。</li>
                        <li>安装完成后启动 Claude。</li>
                        <li>登录 Claude 账号，找到 Code / Claude Code 入口。</li>
                      </ol>
                    </div>
                  </div>
                  <div class="tab-panel" data-tab-panel="claude-app-macos">
                    <p>macOS 版可以通过 Claude 下载页安装。已经安装 Homebrew 的用户，也可以用 Homebrew 安装 Claude Desktop。安装后登录 Claude 账号，在 Code 相关入口中连接本地项目。</p>
                    <div class="link-grid">
                      <a href="https://claude.com/download">Claude Desktop 下载页</a>
                    </div>
                    <div class="install-note">
                      <strong>macOS 安装</strong>
                      <ol>
                        <li>打开 Claude 下载页。</li>
                        <li>选择 macOS 版本。</li>
                        <li>下载完成后打开安装包。</li>
                        <li>将 Claude 拖入“应用程序”。</li>
                        <li>启动 Claude 并登录账号。</li>
                      </ol>
                    </div>
                    <div class="command-list">
                      <div class="terminal-command">
                        <span>Homebrew 安装 Claude Desktop</span>
                        <pre><button class="copy-button" type="button" data-copy="brew install --cask claude">复制</button><code>brew install --cask claude</code></pre>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="warning">
                  <strong>注意</strong>
                  <p>Claude 桌面应用本身可供多个计划使用，但 Claude Code 功能通常需要支持 Claude Code 的订阅或账号权限。如果界面中没有 Code 入口，请检查账号计划、地区可用性和应用版本。</p>
                </div>
              </div>
              <div class="tab-panel" data-tab-panel="claude-cli">
                <div class="platform-tabs" data-tabs>
                  <div class="tab-list compact" role="tablist" aria-label="Claude CLI 系统">
                    <button class="tab-button active" type="button" data-tab-target="claude-cli-windows">Windows</button>
                    <button class="tab-button" type="button" data-tab-target="claude-cli-macos">macOS</button>
                  </div>
                  <div class="tab-panel active" data-tab-panel="claude-cli-windows">
                    <p>Windows 原生环境推荐安装 Git for Windows。看到 <code>PS C:\</code> 说明你在 PowerShell；看到普通 <code>C:\</code> 说明你在 CMD。</p>
                    <div class="install-options">
                      <div class="install-choice recommended">
                        <div class="choice-copy">
                          <span>推荐</span>
                          <strong>PowerShell 原生安装</strong>
                          <p>大多数 Windows 用户打开 PowerShell 后复制这一条。</p>
                        </div>
                        <pre><button class="copy-button" type="button" data-copy="irm https://claude.ai/install.ps1 | iex">复制</button><code>irm https://claude.ai/install.ps1 | iex</code></pre>
                      </div>
                      <div class="install-choice">
                        <div class="choice-copy">
                          <span>可选</span>
                          <strong>CMD 原生安装</strong>
                          <p>只有在使用 CMD 时才选这一条。</p>
                        </div>
                        <pre><button class="copy-button" type="button" data-copy="curl -fsSL https://claude.ai/install.cmd -o install.cmd &amp;&amp; install.cmd &amp;&amp; del install.cmd">复制</button><code>curl -fsSL https://claude.ai/install.cmd -o install.cmd &amp;&amp; install.cmd &amp;&amp; del install.cmd</code></pre>
                      </div>
                    </div>
                    <details class="soft-detail">
                      <summary>其他安装方式</summary>
                      <div class="command-list two">
                        <div class="terminal-command">
                          <span>WinGet 安装</span>
                          <pre><button class="copy-button" type="button" data-copy="winget install Anthropic.ClaudeCode">复制</button><code>winget install Anthropic.ClaudeCode</code></pre>
                        </div>
                        <div class="terminal-command">
                          <span>npm 安装</span>
                          <pre><button class="copy-button" type="button" data-copy="npm install -g @anthropic-ai/claude-code">复制</button><code>npm install -g @anthropic-ai/claude-code</code></pre>
                        </div>
                      </div>
                    </details>
                    <div class="command-group">
                      <h4>安装后常用命令</h4>
                      <div class="command-list two">
                        <div class="terminal-command">
                          <span>验证</span>
                          <pre><button class="copy-button" type="button" data-copy="claude --version">复制</button><code>claude --version</code></pre>
                        </div>
                        <div class="terminal-command">
                          <span>启动，先在终端进入项目目录</span>
                          <pre><button class="copy-button" type="button" data-copy="claude">复制</button><code>claude</code></pre>
                        </div>
                      </div>
                    </div>
                    <details class="soft-detail">
                      <summary>更新命令</summary>
                      <div class="command-list two">
                        <div class="terminal-command">
                          <span>通用更新</span>
                          <pre><button class="copy-button" type="button" data-copy="claude update">复制</button><code>claude update</code></pre>
                        </div>
                        <div class="terminal-command">
                          <span>WinGet 更新</span>
                          <pre><button class="copy-button" type="button" data-copy="winget upgrade Anthropic.ClaudeCode">复制</button><code>winget upgrade Anthropic.ClaudeCode</code></pre>
                        </div>
                      </div>
                    </details>
                  </div>
                  <div class="tab-panel" data-tab-panel="claude-cli-macos">
                    <p>macOS 支持官方安装脚本、Homebrew 和 npm。官方不建议使用 <code>sudo npm install -g</code> 安装 Claude Code。</p>
                    <div class="install-options">
                      <div class="install-choice recommended">
                        <div class="choice-copy">
                          <span>推荐</span>
                          <strong>官方脚本安装</strong>
                          <p>第一次安装 Claude Code 时优先用这一条。</p>
                        </div>
                        <pre><button class="copy-button" type="button" data-copy="curl -fsSL https://claude.ai/install.sh | bash">复制</button><code>curl -fsSL https://claude.ai/install.sh | bash</code></pre>
                      </div>
                      <div class="install-choice">
                        <div class="choice-copy">
                          <span>可选</span>
                          <strong>Homebrew 安装</strong>
                          <p>已经用 Homebrew 管理软件时可选。</p>
                        </div>
                        <pre><button class="copy-button" type="button" data-copy="brew install --cask claude-code">复制</button><code>brew install --cask claude-code</code></pre>
                      </div>
                    </div>
                    <details class="soft-detail">
                      <summary>npm 安装方式</summary>
                      <div class="terminal-command">
                        <pre><button class="copy-button" type="button" data-copy="npm install -g @anthropic-ai/claude-code">复制</button><code>npm install -g @anthropic-ai/claude-code</code></pre>
                      </div>
                    </details>
                    <div class="command-group">
                      <h4>安装后常用命令</h4>
                      <div class="command-list two">
                        <div class="terminal-command">
                          <span>验证</span>
                          <pre><button class="copy-button" type="button" data-copy="claude --version">复制</button><code>claude --version</code></pre>
                        </div>
                        <div class="terminal-command">
                          <span>启动，先在终端进入项目目录</span>
                          <pre><button class="copy-button" type="button" data-copy="claude">复制</button><code>claude</code></pre>
                        </div>
                      </div>
                    </div>
                    <details class="soft-detail">
                      <summary>更新命令</summary>
                      <div class="command-list two">
                        <div class="terminal-command">
                          <span>通用更新</span>
                          <pre><button class="copy-button" type="button" data-copy="claude update">复制</button><code>claude update</code></pre>
                        </div>
                        <div class="terminal-command">
                          <span>Homebrew 更新</span>
                          <pre><button class="copy-button" type="button" data-copy="brew upgrade --cask claude-code">复制</button><code>brew upgrade --cask claude-code</code></pre>
                        </div>
                        <div class="terminal-command">
                          <span>npm 更新</span>
                          <pre><button class="copy-button" type="button" data-copy="npm install -g @anthropic-ai/claude-code@latest">复制</button><code>npm install -g @anthropic-ai/claude-code@latest</code></pre>
                        </div>
                      </div>
                    </details>
                  </div>
                </div>
                <figure><img :src="`${CDN}/docs/校验claude安装成功.png`" alt="Claude Code 安装成功校验截图"></figure>
              </div>
              <div class="tab-panel" data-tab-panel="claude-ide">
                <div class="platform-tabs" data-tabs>
                  <div class="tab-list compact" role="tablist" aria-label="Claude IDE 系统">
                    <button class="tab-button active" type="button" data-tab-target="claude-ide-windows">Windows</button>
                    <button class="tab-button" type="button" data-tab-target="claude-ide-macos">macOS</button>
                  </div>
                  <div class="tab-panel active" data-tab-panel="claude-ide-windows">
                    <p>Windows 先装好 Claude Code CLI，再安装 IDE 扩展。VS Code 系列要求 VS Code 1.98.0 或更高版本。</p>
                    <div class="link-grid">
                      <a href="https://code.claude.com/docs/en/ide-integrations">Claude Code IDE 官方文档</a>
                    </div>
                    <div class="two-col">
                      <div>
                        <h4>VS Code / Cursor / Windsurf</h4>
                        <ol>
                          <li>打开编辑器扩展市场。</li>
                          <li>搜索并安装 <code>Claude Code</code> 扩展。</li>
                          <li>重启编辑器或执行 <code>Developer: Reload Window</code>。</li>
                          <li>在侧边栏、状态栏或编辑器右上角打开 Claude Code。</li>
                        </ol>
                      </div>
                      <div>
                        <h4>JetBrains</h4>
                        <ol>
                          <li>打开 Plugins，搜索 <code>Claude Code</code>。</li>
                          <li>从 JetBrains Marketplace 安装插件。</li>
                          <li>完全重启 IDE。</li>
                          <li>在 IDE 终端运行 <code>claude</code>；外部终端会话可输入 <code>/ide</code> 连接。</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                  <div class="tab-panel" data-tab-panel="claude-ide-macos">
                    <p>macOS 同样先装好 Claude Code CLI，再接入编辑器。VS Code 系列可通过命令面板搜索 <code>Claude Code</code>。</p>
                    <div class="link-grid">
                      <a href="https://code.claude.com/docs/en/ide-integrations">Claude Code IDE 官方文档</a>
                    </div>
                    <div class="two-col">
                      <div>
                        <h4>VS Code / Cursor / Windsurf</h4>
                        <ol>
                          <li>打开编辑器扩展市场。</li>
                          <li>搜索并安装 <code>Claude Code</code> 扩展。</li>
                          <li>重启编辑器或执行 <code>Developer: Reload Window</code>。</li>
                          <li>使用侧边栏、状态栏或右上角入口打开 Claude Code。</li>
                        </ol>
                      </div>
                      <div>
                        <h4>JetBrains</h4>
                        <ol>
                          <li>打开 Settings / Preferences。</li>
                          <li>进入 Plugins，搜索 <code>Claude Code</code>。</li>
                          <li>从 JetBrains Marketplace 安装插件。</li>
                          <li>完全重启 IDE；外部终端会话可输入 <code>/ide</code> 连接。</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section" id="api-config">
        <div class="section-heading">
          <p class="eyebrow">Configuration</p>
          <h2>快速配置指南</h2>
          <p>上一章完成工具安装；本章处理让工具连接沧元算力 API。</p>
        </div>
        <div class="config-flow">
          <div><span>1</span>后台创建 API Key</div>
          <div><span>2</span>安装 Codex / Claude Code / Gemini CLI</div>
          <div><span>3</span>Claude Code 新用户可先运行 ZCF</div>
          <div><span>4</span>用 CCSwitch 统一管理 API 配置</div>
        </div>
        <div class="command-card">
          <div>
            <strong>沧元算力 API 连接信息</strong>
            <p>所有支持 OpenAI 兼容接口或自定义 API 供应商的工具，通常都需要填写下面两项。</p>
          </div>
          <pre><button class="copy-button" type="button" data-copy="Base URL: __SITE_ORIGIN__&#10;API Key: sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx">复制</button><code>Base URL: __SITE_ORIGIN__
API Key: sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</code></pre>
        </div>
        <article class="info-card">
          <h3>Claude Code 初始化：ZCF</h3>
          <p>ZCF 偏向 Claude Code 初始化，适合第一次配置 Claude Code，或需要重新整理 Claude Code 环境的用户。</p>
          <p>项目地址：<a href="https://github.com/UfoMiao/zcf">https://github.com/UfoMiao/zcf</a></p>
          <pre><button class="copy-button" type="button" data-copy="npx zcf">复制</button><code>npx zcf</code></pre>
          <ul>
            <li>只使用 Claude Code 时，可以先运行 ZCF，再用 CCSwitch 管理 API 供应商。</li>
            <li>同时使用 Codex、Claude Code、Gemini CLI 时，建议把 API 配置统一交给 CCSwitch。</li>
            <li>ZCF 不等于沧元算力 API Key，它主要负责初始化 Claude Code 环境。</li>
          </ul>
        </article>
      </section>

      <section class="section" id="ccswitch">
        <div class="section-heading">
          <p class="eyebrow">CCSwitch</p>
          <h2>编程工具统一配置</h2>
          <p>CCSwitch 适合统一管理 Claude Code、Codex、Gemini CLI 等工具的 API 供应商配置。</p>
        </div>
        <div class="split-layout">
          <div>
            <p>项目地址：<a href="https://github.com/farion1231/cc-switch">https://github.com/farion1231/cc-switch</a></p>
            <div class="feature-grid">
              <span>供应商配置切换</span>
              <span>端点速度测试</span>
              <span>系统提示预设</span>
              <span>MCP 管理</span>
              <span>Claude Skills</span>
              <span>配置备份恢复</span>
              <span>深度链接协议</span>
              <span>环境变量检测</span>
            </div>
          </div>
          <figure class="compact-figure"><img :src="`${CDN}/docs/ccswitch桌面图标.png`" alt="CCSwitch 桌面图标"></figure>
        </div>
        <figure><img :src="`${CDN}/docs/ccswitch界面示例.png`" alt="CCSwitch 界面示例"></figure>

        <div class="gallery-grid">
          <figure><img :src="`${CDN}/docs/ccswitch下载截图.png`" alt="CCSwitch 下载截图"><figcaption>下载最新 .msi 安装器</figcaption></figure>
          <figure><img :src="`${CDN}/docs/ccswitch添加供应商按钮.png`" alt="CCSwitch 添加供应商按钮"><figcaption>添加供应商入口</figcaption></figure>
          <figure><img :src="`${CDN}/docs/ccswitch添加供应商的配置.png`" alt="CCSwitch 添加供应商配置"><figcaption>填写 Base URL 和 API Key</figcaption></figure>
          <figure><img :src="`${CDN}/docs/ccswitch添加供应商-claudecode配置.png`" alt="Claude Code 配置示例"><figcaption>Claude Code 示例</figcaption></figure>
          <figure><img :src="`${CDN}/docs/ccswitch添加供应商-codex配置.png`" alt="Codex 配置示例"><figcaption>Codex 示例</figcaption></figure>
          <figure><img :src="`${CDN}/docs/ccswitch路由功能如何开启.png`" alt="CCSwitch 路由功能"><figcaption>路由功能</figcaption></figure>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>工具</th><th>建议配置方式</th></tr></thead>
            <tbody>
              <tr><td>Claude Code CLI</td><td>先用 ZCF 初始化，再用 CCSwitch 管理 API 供应商</td></tr>
              <tr><td>Codex CLI</td><td>安装 CLI 后，用 CCSwitch 或工具自身配置入口填写沧元算力 API</td></tr>
              <tr><td>Gemini CLI</td><td>安装 CLI 后，用 CCSwitch 统一管理 API 配置</td></tr>
              <tr><td>Codex / Claude Code App</td><td>按同样的 Base URL 和 API Key 填写</td></tr>
              <tr><td>IDE 扩展</td><td>先安装扩展，再按扩展提示登录或连接对应 CLI；需要 API 时使用 CCSwitch 中的供应商配置</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="section" id="recommendations">
        <div class="section-heading">
          <p class="eyebrow">Recommended</p>
          <h2>工具推荐</h2>
          <p>这些是围绕 Codex / Claude Code 使用体验的补充工具。按工具和系统拆开，方便用户直接找到自己的安装方式。</p>
        </div>
        <div class="recommend-grid">
          <article class="recommend-card" data-tabs>
            <div class="card-head">
              <div>
                <h3>AI Session Viewer</h3>
                <p>本地会话浏览器，用于浏览、搜索、统计 Claude Code 和 Codex CLI 的本地会话记录，并支持一键 Resume。</p>
              </div>
              <div class="tab-list compact" role="tablist" aria-label="AI Session Viewer 系统">
                <button class="tab-button active" type="button" data-tab-target="session-viewer-windows">Windows</button>
                <button class="tab-button" type="button" data-tab-target="session-viewer-macos">macOS</button>
              </div>
            </div>
            <div class="link-grid">
              <a href="https://github.com/zuoliangyu/AI-Session-Viewer">GitHub 项目</a>
              <a href="https://github.com/zuoliangyu/AI-Session-Viewer/releases">Releases 下载页</a>
            </div>
            <figure><img :src="`${CDN}/docs/AIsession viewer界面截图.png`" alt="AI Session Viewer 界面截图"></figure>
            <div class="tab-panel active" data-tab-panel="session-viewer-windows">
              <div class="install-note">
                <strong>Windows 推荐安装包</strong>
                <p>下载 <code>.msi</code> 安装版或 <code>.zip</code> 便携版。安装或解压后打开即可，应用会自动扫描本地 Claude / Codex 会话数据。</p>
              </div>
              <ul>
                <li>适合经常在 Windows 上使用 Claude Code CLI 或 Codex CLI 的用户。</li>
                <li>前提是本机已经产生过 <code>~/.claude/projects/</code> 或 <code>~/.codex/sessions/</code> 会话目录。</li>
              </ul>
            </div>
            <div class="tab-panel" data-tab-panel="session-viewer-macos">
              <div class="install-note">
                <strong>macOS 推荐安装包</strong>
                <p>下载 Universal <code>.dmg</code>，同时支持 Intel 和 Apple Silicon。安装后打开即可使用。</p>
              </div>
              <ul>
                <li>只读取本地文件，不联网、不上传任何数据。</li>
                <li>如果列表为空，先确认本机是否实际使用过 Claude Code 或 Codex CLI。</li>
              </ul>
            </div>
            <div class="mini-table">
              <span>Windows：.msi / .zip</span>
              <span>macOS：.dmg Universal</span>
              <span>Linux：.deb / .AppImage</span>
            </div>
          </article>

          <article class="recommend-card" data-tabs>
            <div class="card-head">
              <div>
                <h3>Codex Desktop Rebuild</h3>
                <p>便携版 Codex Desktop，主要补足插件、宠物、对话删除等体验。</p>
              </div>
              <div class="tab-list compact" role="tablist" aria-label="Codex Desktop Rebuild 系统">
                <button class="tab-button active" type="button" data-tab-target="codex-rebuild-windows">Windows</button>
                <button class="tab-button" type="button" data-tab-target="codex-rebuild-macos">macOS</button>
              </div>
            </div>
            <div class="link-grid">
              <a href="https://github.com/Haleclipse/CodexDesktop-Rebuild">GitHub 项目</a>
              <a href="https://github.com/Haleclipse/CodexDesktop-Rebuild/releases/tag/v26.513.31313">指定发布页</a>
            </div>
            <figure><img :src="`${CDN}/docs/codex 1.png`" alt="Codex Desktop Rebuild 截图"></figure>
            <div class="tab-panel active" data-tab-panel="codex-rebuild-windows">
              <ol>
                <li>打开发布页下载对应版本的压缩包。</li>
                <li>解压之后打开文件夹。</li>
                <li>双击 <code>Codex.exe</code> 使用。</li>
              </ol>
              <div class="install-note">
                <strong>建议固定位置</strong>
                <p>建议把便携版整个文件夹移动到固定位置，例如 <code>C:\Users\Wu\Apps\CodexDesktop-Rebuild</code>，之后运行里面的 <code>Codex.exe</code>。</p>
              </div>
            </div>
            <div class="tab-panel" data-tab-panel="codex-rebuild-macos">
              <div class="install-note">
                <strong>以发布页为准</strong>
                <p>这份文档目前主要记录 Windows 便携版用法。macOS 用户优先使用官方 Codex App；如果发布页提供 macOS 包，再按发布页说明安装。</p>
              </div>
              <div class="link-grid">
                <a href="https://developers.openai.com/codex/app">Codex App 官方文档</a>
                <a href="https://github.com/Haleclipse/CodexDesktop-Rebuild/releases/tag/v26.513.31313">Rebuild 发布页</a>
              </div>
            </div>
            <div class="warning">
              <strong>注意</strong>
              <p>便携版和官方 Codex App 是不同程序本体，但共用用户数据、配置、skills、登录状态和缓存。不建议同时打开；移动或更新时必须处理整个文件夹，不要只移动 <code>Codex.exe</code>。</p>
            </div>
          </article>
        </div>
      </section>

      <section class="section" id="troubleshooting">
        <div class="section-heading">
          <p class="eyebrow">Troubleshooting</p>
          <h2>调用、计费与排查</h2>
          <p>延迟、用量、常见错误和反馈模板集中在这里。</p>
        </div>
        <div class="two-col">
          <article class="info-card">
            <h3>延迟与速度</h3>
            <p>流式输出可以更快看到第一段内容，但完整生成仍需要时间。影响速度的因素包括模型大小、输入长度、输出长度、深度推理、长上下文、Agent 工具调用、账号池和网络状态。</p>
            <ul>
              <li>简短问答通常较快。</li>
              <li>长文档总结、代码生成、Agent 连续执行会更慢。</li>
              <li>输出几千 token 时，完整耗时达到几十秒是正常现象。</li>
            </ul>
          </article>
          <article class="info-card">
            <h3>计费与用量</h3>
            <p>请以后台展示为准。一般会根据模型、输入 token、输出 token、缓存、图片、长上下文、特殊能力、分组倍率或套餐规则计算消耗。</p>
            <figure><img :src="`${CDN}/docs/用户使用记录截图.png`" alt="用户使用记录截图"></figure>
          </article>
        </div>
        <div class="accordion">
          <details open><summary>401 Invalid API key</summary><p>常见原因：API Key 填错、Key 前后多了空格或换行、Key 已删除或过期、Authorization 格式不正确。</p><pre><button class="copy-button" type="button" data-copy="Authorization: Bearer sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx">复制</button><code>Authorization: Bearer sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</code></pre></details>
          <details><summary>API key is required</summary><p>请求没有带 Key。检查软件里是否填写 API Key，Header 是否包含 <code>Authorization: Bearer ...</code>，以及 Key 是否填到了错误位置。</p></details>
          <details><summary>403 group does not allow dispatch</summary><p>当前 Key 所属分组不允许使用该接口。可换用支持该接口的分组，或联系管理员确认当前分组是否开放 <code>/v1/messages</code>。</p></details>
          <details><summary>404 model not found</summary><p>常见原因：模型名称拼错、当前分组不支持该模型、模型已下线或临时维护。请复制后台显示的模型名。</p></details>
          <details><summary>429 rate limit</summary><p>请求频率过高、账号池繁忙或额度达到限制。降低并发、稍后重试、换模型或分组。</p></details>
          <details><summary>503 no available account</summary><p>系统暂时没有可调度上游账号。稍后重试、换模型测试，或联系管理员确认账号池状态。</p></details>
          <details><summary>Request timed out</summary><p>缩短输入、限制输出、开启流式输出，或将客户端超时时间调高到 120 秒以上。</p></details>
          <details><summary>中文变成问号或乱码</summary><p>通常是本地命令行编码问题。建议使用支持 UTF-8 的终端，并将 JSON 文件保存为 UTF-8。</p></details>
        </div>
        <div class="command-card">
          <div>
            <strong>反馈模板</strong>
            <p>不要提供完整 API Key、账号密码、邮箱验证码或私密聊天内容。</p>
          </div>
          <pre><button class="copy-button" type="button" data-copy="使用时间：&#10;使用软件：&#10;Base URL：&#10;模型：&#10;接口类型：/v1/chat/completions 或 /responses&#10;错误截图：&#10;错误文本、报错信息：&#10;已经做过的尝试以及推断：">复制</button><code>使用时间：
使用软件：
Base URL：
模型：
接口类型：/v1/chat/completions 或 /responses
错误截图：
错误文本、报错信息：
已经做过的尝试以及推断：</code></pre>
        </div>
      </section>
    </main>
  </div>

  <div class="image-lightbox" aria-hidden="true">
    <button type="button" aria-label="关闭图片预览">关闭</button>
    <img alt="">
  </div>

  
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const CDN = (import.meta.env.VITE_STATIC_CDN || 'https://assets.cangyuansuanli.cn').replace(/\/$/, '')

const pageRoot = ref<HTMLElement | null>(null)

onMounted(() => {
  const root = pageRoot.value
  if (!root) return

  document.title = '沧元算力 用户使用文档'

  const siteOrigin = window.location.origin;
const siteHost = window.location.host;

function applySitePlaceholders(scope: ParentNode = root as ParentNode) {
  scope.querySelectorAll("[data-site-origin]").forEach((el) => {
    el.textContent = siteOrigin;
  });
  scope.querySelectorAll("[data-site-host]").forEach((el) => {
    el.textContent = siteHost;
  });
  scope.querySelectorAll("[data-copy]").forEach((el) => {
    const value = el.getAttribute("data-copy");
    if (!value) return;
    if (value.includes("__SITE_ORIGIN__")) {
      el.setAttribute("data-copy", value.replaceAll("__SITE_ORIGIN__", siteOrigin));
    }
    if (value.includes("__SITE_HOST__")) {
      el.setAttribute("data-copy", value.replaceAll("__SITE_HOST__", siteHost));
    }
  });
}

root.querySelectorAll('code, strong, pre code').forEach((el) => {
  if (el.textContent?.includes('__SITE_ORIGIN__')) {
    el.textContent = el.textContent.replaceAll('__SITE_ORIGIN__', siteOrigin)
  }
  if (el.textContent?.includes('__SITE_HOST__')) {
    el.textContent = el.textContent.replaceAll('__SITE_HOST__', siteHost)
  }
})
applySitePlaceholders();

const body = document.body;
const sidebar = root.querySelector("#sidebar");
const menuButton = root.querySelector(".menu-button");
const navLinks = Array.from(root.querySelectorAll<HTMLAnchorElement>(".sidebar-nav a"));
const sections = navLinks
  .map((link) => {
    const href = link.getAttribute("href");
    return href ? root.querySelector<HTMLElement>(href) : null;
  })
  .filter((el): el is HTMLElement => el instanceof HTMLElement);
let activeId = "";
let ticking = false;

function closeSidebar() {
  body.classList.remove("sidebar-open");
  menuButton?.setAttribute("aria-expanded", "false");
}

menuButton?.addEventListener("click", () => {
  const isOpen = body.classList.toggle("sidebar-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeSidebar);
});

document.addEventListener("click", (event) => {
  if (!body.classList.contains("sidebar-open")) return;
  const target = event.target as Node | null;
  if (sidebar?.contains(target) || menuButton?.contains(target)) return;
  closeSidebar();
});

function setActiveSection(id: string | undefined) {
  if (!id || id === activeId) return;
  activeId = id;

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${id}`;
    link.classList.toggle("active", isActive);

    if (isActive && sidebar && window.matchMedia("(min-width: 921px)").matches) {
      link.scrollIntoView({ block: "nearest" });
    }
  });
}

function updateActiveSection() {
  const marker = window.scrollY + Math.min(window.innerHeight * 0.28, 220);
  let current = sections[0]?.id;

  for (const section of sections) {
    if (section.offsetTop <= marker) {
      current = section.id;
    } else {
      break;
    }
  }

  if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
    current = sections[sections.length - 1]?.id;
  }

  setActiveSection(current);
  ticking = false;
}

function requestActiveSectionUpdate() {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(updateActiveSection);
}

window.addEventListener("scroll", requestActiveSectionUpdate, { passive: true });
window.addEventListener("resize", requestActiveSectionUpdate);
window.addEventListener("load", updateActiveSection);
updateActiveSection();

root.querySelectorAll(".copy-button").forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.getAttribute("data-copy");
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      const oldText = button.textContent;
      button.textContent = "已复制";
      button.classList.add("copied");
      window.setTimeout(() => {
        button.textContent = oldText;
        button.classList.remove("copied");
      }, 1400);
    } catch {
      const oldText = button.textContent;
      button.textContent = "复制失败";
      window.setTimeout(() => {
        button.textContent = oldText || "复制";
      }, 1400);
    }
  });
});

root.querySelectorAll("[data-tabs]").forEach((tabsRoot) => {
  const buttons = Array.from(tabsRoot.querySelectorAll(":scope > .tab-list .tab-button, :scope > .card-head .tab-list .tab-button, :scope > .tool-panel-head .tab-list .tab-button"));
  const panels = Array.from(tabsRoot.querySelectorAll(":scope > .tab-panel"));

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.getAttribute("data-tab-target");
      if (!target) return;

      buttons.forEach((item) => {
        item.classList.toggle("active", item === button);
      });

      panels.forEach((panel) => {
        panel.classList.toggle("active", panel.getAttribute("data-tab-panel") === target);
      });
    });
  });
});

const lightbox = root.querySelector(".image-lightbox");
const lightboxImage = lightbox?.querySelector<HTMLImageElement>("img");
const lightboxClose = lightbox?.querySelector("button");

function closeLightbox() {
  if (!lightbox || !lightboxImage) return;
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.removeAttribute("src");
  lightboxImage.removeAttribute("alt");
}

root.querySelectorAll<HTMLImageElement>("figure img").forEach((image) => {
  image.addEventListener("click", () => {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt || "图片预览";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  });
});

lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeSidebar();
    closeLightbox();
  }
});
})

onUnmounted(() => {
  document.body.classList.remove('menu-open', 'sidebar-open', 'modal-open')
})

</script>

<style src="./DocsView.css"></style>
