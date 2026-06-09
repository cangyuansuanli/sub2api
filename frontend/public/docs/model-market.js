const defaultMarketData = {
  platforms: [],
  groups: [],
  models: [],
  billingModes: {}
};

let marketData = normalizeMarketData(window.CANGYUAN_MODEL_MARKET || defaultMarketData);
let lastDataSignature = "";

const state = {
  platform: "all",
  group: "all",
  query: "",
  activeModelId: null
};

const priceKeys = [
  ["input", "输入"],
  ["output", "输出"],
  ["cacheWrite", "缓存写入"],
  ["cacheRead", "缓存读取"]
];

const refs = {
  statModels: document.querySelector("#stat-models"),
  statPlatforms: document.querySelector("#stat-platforms"),
  statGroups: document.querySelector("#stat-groups"),
  statUnit: document.querySelector("#stat-unit"),
  platformTabs: document.querySelector("#platform-tabs"),
  groupTabs: document.querySelector("#group-tabs"),
  search: document.querySelector("#model-search"),
  modelSections: document.querySelector("#model-sections"),
  emptyState: document.querySelector("#empty-state"),
  updatedAt: document.querySelector("#updated-at"),
  unitDescription: document.querySelector("#unit-description"),
  modal: document.querySelector("#model-modal"),
  modalClose: document.querySelector("#modal-close"),
  modalContent: document.querySelector("#modal-content")
};

if (window.self !== window.top) {
  document.documentElement.classList.add("embedded");
}

function normalizeMarketData(data) {
  return {
    updatedAt: data?.updatedAt || "",
    currencySymbol: data?.currencySymbol || "沧耳",
    unitLabel: data?.unitLabel || "/M",
    pricePrecision: Number.isInteger(data?.pricePrecision) ? data.pricePrecision : 3,
    unitDescription: data?.unitDescription || "M = 1M tokens",
    platforms: Array.isArray(data?.platforms) ? data.platforms : [],
    groups: Array.isArray(data?.groups) ? data.groups : [],
    billingModes: data?.billingModes && typeof data.billingModes === "object" ? data.billingModes : {},
    models: Array.isArray(data?.models) ? data.models : []
  };
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function findPlatform(id) {
  return marketData.platforms.find((platform) => platform.id === id) || {
    id: "default",
    name: id || "未知平台",
    accent: "#6b7280",
    background: "#eef2f6"
  };
}

function findGroup(id) {
  return marketData.groups.find((group) => group.id === id);
}

function isModelVisible(model) {
  return !model.hidden;
}

function getVisibleModels() {
  return marketData.models.filter(isModelVisible);
}

function countVisibleModelsByGroup(groupId) {
  return getVisibleModels().filter((model) => (model.groupIds || []).includes(groupId)).length;
}

function getModelGroups(model) {
  const ids = Array.isArray(model.groupIds) ? model.groupIds : [];
  return ids.map(findGroup).filter((group) => group && !group.hidden);
}

function getVisibleGroups() {
  return marketData.groups.filter((group) => !group.hidden && !group.hiddenInFilters && countVisibleModelsByGroup(group.id) > 0);
}

function getVisiblePlatforms() {
  return marketData.platforms.filter((platform) => !platform.hidden && countModelsByPlatform(platform.id) > 0);
}

function getBillingLabel(mode) {
  return marketData.billingModes?.[mode] || mode || "按量";
}

function currencyIcon() {
  return `
    <svg class="baijing-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polygon points="12 2 2 7 12 22 22 7 12 2"></polygon>
      <polyline points="2 7 12 12 22 7"></polyline>
      <line x1="12" y1="22" x2="12" y2="12"></line>
    </svg>
  `;
}

function formatPriceHtml(value, options = {}) {
  const text = formatPrice(value, options);
  if (text === "-") return "-";
  const currencySymbol = options.currencySymbol ?? marketData.currencySymbol;
  if (currencySymbol !== "沧耳") return escapeHtml(text);
  return `${currencyIcon()}<span>${escapeHtml(text)}</span>`;
}

function formatPrice(value, options = {}) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "-";
  const precision = Number.isInteger(options.precision)
    ? options.precision
    : Number.isInteger(marketData.pricePrecision) ? marketData.pricePrecision : 3;
  const currencySymbol = options.currencySymbol ?? marketData.currencySymbol ?? "沧耳";
  const unitLabel = options.unitLabel ?? marketData.unitLabel ?? "/M";
  return `${currencySymbol}${Number(value).toFixed(precision)}${unitLabel}`;
}

function calculateGroupPrice(model, key, group) {
  const baseValue = model.basePrices?.[key];
  if (baseValue !== null && baseValue !== undefined && !Number.isNaN(Number(baseValue))) {
    const multiplier = group?.multiplier ?? 1;
    return Number(baseValue) * Number(multiplier);
  }
  return model.prices?.[key];
}

function getCustomPrices(model) {
  return Array.isArray(model.customPrices) ? model.customPrices : [];
}

function hasCustomPrices(model) {
  return getCustomPrices(model).length > 0;
}

function getCustomPriceValue(item) {
  if (item?.value !== null && item?.value !== undefined) return item.value;
  if (item?.price !== null && item?.price !== undefined) return item.price;
  return null;
}

function formatCustomPriceHtml(item) {
  if (item?.text) return escapeHtml(item.text);
  return formatPriceHtml(getCustomPriceValue(item), {
    currencySymbol: item?.currencySymbol,
    unitLabel: item?.unitLabel ?? item?.unit ?? "/张",
    precision: Number.isInteger(item?.precision) ? item.precision : 2
  });
}

function getPrimaryGroup(model) {
  return getModelGroups(model)[0] || { name: "榛樿", description: "", multiplier: 1 };
}

function getDisplayGroup(model) {
  if (state.group !== "all") {
    const selectedGroup = getModelGroups(model).find((group) => group.id === state.group);
    if (selectedGroup) return selectedGroup;
  }
  return getPrimaryGroup(model);
}

function countModelsByPlatform(platformId) {
  return getVisibleModels().filter((model) => model.platform === platformId).length;
}

function countModelsByGroup(groupId) {
  return countVisibleModelsByGroup(groupId);
}

function modelMatches(model) {
  if (!isModelVisible(model)) return false;
  if (state.platform !== "all" && model.platform !== state.platform) return false;
  if (state.group !== "all" && !(model.groupIds || []).includes(state.group)) return false;

  const query = normalize(state.query);
  if (!query) return true;

  const searchable = [
    model.id,
    model.name,
    model.platform,
    ...(model.aliases || []),
    ...(model.capabilities || [])
  ].join(" ");

  return normalize(searchable).includes(query);
}

function getFilteredModels() {
  return getVisibleModels().filter(modelMatches);
}

function groupModelsByPlatform(models) {
  return models.reduce((sections, model) => {
    const platformId = model.platform || "default";
    if (!sections.has(platformId)) sections.set(platformId, []);
    sections.get(platformId).push(model);
    return sections;
  }, new Map());
}

function renderStats() {
  refs.statModels.textContent = String(getVisibleModels().length);
  refs.statPlatforms.textContent = String(getVisiblePlatforms().length);
  refs.statGroups.textContent = String(getVisibleGroups().length);
  refs.statUnit.textContent = marketData.unitLabel || "/M";
  refs.updatedAt.textContent = marketData.updatedAt ? `更新：${marketData.updatedAt}` : "";
  refs.unitDescription.textContent = marketData.unitDescription || "";
}

async function fetchMarketDataJson() {
  const response = await fetch(`./model-market-data.json?t=${Date.now()}`, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`模型配置加载失败: ${response.status}`);
  }

  return response.json();
}

function applyMarketData(nextData) {
  marketData = normalizeMarketData(nextData);
  lastDataSignature = JSON.stringify(marketData);
  render();

  if (!refs.modal.hidden && state.activeModelId) {
    const activeModel = marketData.models.find((item) => item.id === state.activeModelId);
    if (activeModel) renderModal(activeModel);
  }
}

async function loadMarketData() {
  try {
    const data = await fetchMarketDataJson();
    applyMarketData(data);
  } catch {
    applyMarketData(window.CANGYUAN_MODEL_MARKET || defaultMarketData);
  }
}

async function refreshMarketData() {
  try {
    const data = normalizeMarketData(await fetchMarketDataJson());
    const signature = JSON.stringify(data);
    if (signature !== lastDataSignature) {
      applyMarketData(data);
    }
  } catch {
    // Keep the last rendered data when the JSON endpoint is temporarily unavailable.
  }
}

function makeTabButton({ id, label, count, active, color, background, onClick }) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = active ? "active" : "";
  button.style.setProperty("--tab-color", color || "var(--accent-strong)");
  button.style.setProperty("--tab-bg", background || "var(--accent-soft)");
  button.setAttribute("role", "tab");
  button.setAttribute("aria-selected", String(active));
  button.innerHTML = `${escapeHtml(label)} <span class="tab-count">${count}</span>`;
  button.addEventListener("click", onClick);
  return button;
}

function renderTabs() {
  refs.platformTabs.replaceChildren();
  refs.platformTabs.appendChild(makeTabButton({
    id: "all",
    label: "全部",
    count: getVisibleModels().length,
    active: state.platform === "all",
    onClick: () => {
      state.platform = "all";
      render();
    }
  }));

  getVisiblePlatforms().forEach((platform) => {
    refs.platformTabs.appendChild(makeTabButton({
      id: platform.id,
      label: platform.name,
      count: countModelsByPlatform(platform.id),
      active: state.platform === platform.id,
      color: platform.accent,
      background: platform.background,
      onClick: () => {
        state.platform = platform.id;
        render();
      }
    }));
  });

  refs.groupTabs.replaceChildren();
  refs.groupTabs.appendChild(makeTabButton({
    id: "all",
    label: "全部",
    count: getVisibleModels().length,
    active: state.group === "all",
    onClick: () => {
      state.group = "all";
      render();
    }
  }));

  getVisibleGroups().forEach((group) => {
    refs.groupTabs.appendChild(makeTabButton({
      id: group.id,
      label: group.name,
      count: countModelsByGroup(group.id),
      active: state.group === group.id,
      onClick: () => {
        state.group = group.id;
        render();
      }
    }));
  });
}

function renderPriceItems(model) {
  const customPrices = getCustomPrices(model);
  if (customPrices.length) {
    return customPrices.map((item, index) => `
      <div class="price-item">
        <span class="price-label">${escapeHtml(item.label || item.name || `规格 ${index + 1}`)}</span>
        <span class="price-value${item.highlight || index === 0 ? " main" : ""}">${formatCustomPriceHtml(item)}</span>
      </div>
    `).join("");
  }

  const displayGroup = getDisplayGroup(model);
  return priceKeys.map(([key, label]) => {
    const isMain = key === "output";
    return `
      <div class="price-item">
        <span class="price-label">实际：${escapeHtml(label)}</span>
        <span class="price-value${isMain ? " main" : ""}">${formatPriceHtml(calculateGroupPrice(model, key, displayGroup))}</span>
      </div>
    `;
  }).join("");
}

function getModelBadges(model) {
  if (Array.isArray(model.badges) && model.badges.length) return model.badges;
  if (hasCustomPrices(model)) return ["图片生成", "按张计费"];
  return [];
}

function renderModelMetaPills(model, groups) {
  if (hasCustomPrices(model)) {
    return getModelBadges(model).map((badge) => `
      <span class="group-pill feature-pill">${escapeHtml(badge)}</span>
    `).join("");
  }

  return groups.length ? groups.map((group) => `
    <span class="group-pill">${escapeHtml(group.name)} · ${escapeHtml(group.multiplier)}x</span>
  `).join("") : `<span class="group-pill">默认 · 1x</span>`;
}

function renderModelCard(model) {
  const platform = findPlatform(model.platform);
  const groups = getModelGroups(model);
  const modelName = model.name || model.id;
  const customPricing = hasCustomPrices(model);
  const metaPills = renderModelMetaPills(model, groups);
  const footText = customPricing ? (model.pricingSummary || "按图片规格计费") : `${groups.length || 1} 个可用分组`;

  return `
    <article class="model-card" tabindex="0" role="button" data-model-id="${escapeHtml(model.id)}" aria-label="查看 ${escapeHtml(modelName)} 详情" style="--platform-color: ${escapeHtml(platform.accent)}; --platform-bg: ${escapeHtml(platform.background)};">
      <div class="card-head">
        <div class="model-title-block">
          <div class="model-title-row">
            <button class="model-name-button" type="button" data-copy-model="${escapeHtml(modelName)}" aria-label="复制模型名称 ${escapeHtml(modelName)}">${escapeHtml(modelName)}</button>
            <button class="copy-model-button" type="button" data-copy-model="${escapeHtml(modelName)}" aria-label="复制模型名称 ${escapeHtml(modelName)}" title="复制模型名称">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 8.75A2.75 2.75 0 0 1 10.75 6h5.5A2.75 2.75 0 0 1 19 8.75v7.5A2.75 2.75 0 0 1 16.25 19h-5.5A2.75 2.75 0 0 1 8 16.25v-7.5Zm2.75-1.25A1.25 1.25 0 0 0 9.5 8.75v7.5a1.25 1.25 0 0 0 1.25 1.25h5.5a1.25 1.25 0 0 0 1.25-1.25v-7.5a1.25 1.25 0 0 0-1.25-1.25h-5.5Z"></path>
                <path d="M5 5.75A2.75 2.75 0 0 1 7.75 3h6.5a.75.75 0 0 1 0 1.5h-6.5A1.25 1.25 0 0 0 6.5 5.75v8.5a.75.75 0 0 1-1.5 0v-8.5Z"></path>
              </svg>
            </button>
          </div>
          <div class="model-sub">
            <span class="tag platform-tag">${escapeHtml(platform.name)}</span>
            <span class="tag">${escapeHtml(getBillingLabel(model.billingMode))}</span>
          </div>
        </div>
        <span class="status-dot" aria-label="可用"></span>
      </div>
      <div class="price-grid">
        ${renderPriceItems(model)}
      </div>
      <div class="group-row">${metaPills}</div>
      <div class="card-foot">
        <span>${escapeHtml(footText)}</span>
        <span>查看详情</span>
      </div>
    </article>
  `;
}

function renderSections() {
  const models = getFilteredModels();
  const sections = groupModelsByPlatform(models);

  refs.emptyState.hidden = models.length !== 0;

  const html = Array.from(sections.entries()).map(([platformId, sectionModels]) => {
    const platform = findPlatform(platformId);
    const initial = platform.name ? platform.name.slice(0, 1).toUpperCase() : "M";
    return `
      <section class="platform-section" style="--platform-color: ${escapeHtml(platform.accent)}; --platform-bg: ${escapeHtml(platform.background)};">
        <div class="section-title-row">
          <span class="platform-mark" aria-hidden="true">${escapeHtml(initial)}</span>
          <h2>${escapeHtml(platform.name)}</h2>
          <span class="section-count">${escapeHtml(sectionModels.length)} 个模型</span>
        </div>
        <div class="model-grid">
          ${sectionModels.map(renderModelCard).join("")}
        </div>
      </section>
    `;
  }).join("");

  refs.modelSections.innerHTML = html;
  refs.modelSections.querySelectorAll("[data-model-id]").forEach((card) => {
    card.addEventListener("click", () => openModal(card.getAttribute("data-model-id")));
    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openModal(card.getAttribute("data-model-id"));
    });
    bindCardMotion(card);
  });
  refs.modelSections.querySelectorAll("[data-copy-model]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      copyModelName(button);
    });
  });
}

function bindCardMotion(card) {
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!canHover) return;

  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const percentX = x / rect.width;
    const percentY = y / rect.height;
    const tiltX = (percentX - 0.5) * 5;
    const tiltY = (0.5 - percentY) * 5;

    card.style.setProperty("--spotlight-x", `${Math.round(percentX * 100)}%`);
    card.style.setProperty("--spotlight-y", `${Math.round(percentY * 100)}%`);
    card.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}deg`);
    card.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}deg`);
  });

  card.addEventListener("pointerleave", () => {
    card.style.setProperty("--spotlight-x", "50%");
    card.style.setProperty("--spotlight-y", "0%");
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
  });
}

async function copyModelName(button) {
  const modelName = button.getAttribute("data-copy-model");
  if (!modelName) return;

  try {
    await navigator.clipboard.writeText(modelName);
    showCopyFeedback(button, "已复制");
  } catch {
    fallbackCopy(modelName);
    showCopyFeedback(button, "已复制");
  }
}

function fallbackCopy(value) {
  const input = document.createElement("textarea");
  input.value = value;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.top = "-999px";
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  input.remove();
}

function showCopyFeedback(button, text) {
  const oldText = button.textContent;
  const isIconButton = button.classList.contains("copy-model-button");

  button.classList.add("copied");
  if (!isIconButton) button.textContent = text;
  if (isIconButton) button.setAttribute("aria-label", text);

  window.setTimeout(() => {
    button.classList.remove("copied");
    if (!isIconButton) button.textContent = oldText;
    if (isIconButton) button.setAttribute("aria-label", `复制模型名称 ${button.getAttribute("data-copy-model")}`);
  }, 1200);
}

function renderBasePriceRows(model) {
  const customPrices = getCustomPrices(model);
  if (customPrices.length) {
    return customPrices.map((item, index) => `
      <tr>
        <td>${escapeHtml(item.label || item.name || `规格 ${index + 1}`)}</td>
        <td><span class="price-code">${formatCustomPriceHtml(item)}</span></td>
      </tr>
    `).join("");
  }

  return priceKeys.map(([key, label]) => `
    <tr>
      <td>${escapeHtml(label)}</td>
      <td><span class="price-code">${formatPriceHtml(model.basePrices?.[key] ?? model.prices?.[key])}</span></td>
    </tr>
  `).join("");
}

function renderGroupRows(model) {
  const groups = getModelGroups(model);
  const rows = (groups.length ? groups : [{ name: "默认", description: "", multiplier: 1 }]).map((group) => `
    <tr>
      <td>
        <strong>${escapeHtml(group.name)}</strong>
        ${group.description ? `<br><span>${escapeHtml(group.description)}</span>` : ""}
      </td>
      <td>${escapeHtml(group.multiplier)}x</td>
      <td><span class="price-code">${formatPriceHtml(calculateGroupPrice(model, "input", group))}</span></td>
      <td><span class="price-code">${formatPriceHtml(calculateGroupPrice(model, "output", group))}</span></td>
      <td><span class="price-code">${formatPriceHtml(calculateGroupPrice(model, "cacheWrite", group))}</span></td>
      <td><span class="price-code">${formatPriceHtml(calculateGroupPrice(model, "cacheRead", group))}</span></td>
    </tr>
  `).join("");

  return rows;
}

function renderCustomGroupRows(model) {
  const groups = getModelGroups(model);
  return (groups.length ? groups : [{ name: "默认", description: "", multiplier: 1 }]).map((group) => `
    <tr>
      <td><strong>${escapeHtml(group.name)}</strong></td>
      <td>${escapeHtml(group.multiplier)}x</td>
      <td>${group.description ? escapeHtml(group.description) : "-"}</td>
    </tr>
  `).join("");
}

function renderModal(model) {
  const platform = findPlatform(model.platform);
  const capabilityHtml = (model.capabilities || []).map((item) => `<span>${escapeHtml(item)}</span>`).join("");
  const customPricing = hasCustomPrices(model);

  refs.modalContent.innerHTML = `
    <div class="modal-inner" style="--platform-color: ${escapeHtml(platform.accent)}; --platform-bg: ${escapeHtml(platform.background)};">
      <div class="modal-head">
        <span class="platform-mark" aria-hidden="true">${escapeHtml(platform.name.slice(0, 1).toUpperCase())}</span>
        <div>
          <h2 id="modal-title">${escapeHtml(model.name || model.id)}</h2>
          <div class="modal-meta">
            <span class="tag platform-tag">${escapeHtml(platform.name)}</span>
            <span class="tag">${escapeHtml(getBillingLabel(model.billingMode))}</span>
            <span class="tag">${escapeHtml((getModelGroups(model).length || 1))} 个分组</span>
          </div>
        </div>
      </div>

      <section class="modal-section">
        <h3>${customPricing ? "规格价格" : "模型基础价格"}</h3>
        <table class="detail-table">
          <thead>
            <tr>
              <th>计费项</th>
              <th>价格</th>
            </tr>
          </thead>
          <tbody>${renderBasePriceRows(model)}</tbody>
        </table>
      </section>

      ${customPricing ? `
        <section class="modal-section">
          <h3>计费说明</h3>
          <div class="pricing-note-card">${escapeHtml(model.pricingNote || "图片模型按规格/张计费，不参与 token 输入输出倍率。")}</div>
        </section>
      ` : `
        <section class="modal-section">
        <h3>分组倍率与价格</h3>
        <table class="detail-table">
          <thead>
            <tr>
              <th>分组</th>
              <th>倍率</th>
              <th>输入</th>
              <th>输出</th>
              <th>缓存写入</th>
              <th>缓存读取</th>
            </tr>
          </thead>
          <tbody>${renderGroupRows(model)}</tbody>
        </table>
      </section>
      `}

      ${capabilityHtml ? `
        <section class="modal-section">
          <h3>适用场景</h3>
          <div class="capability-list">${capabilityHtml}</div>
        </section>
      ` : ""}
    </div>
  `;
}

function openModal(modelId) {
  const model = marketData.models.find((item) => item.id === modelId);
  if (!model) return;

  state.activeModelId = modelId;
  renderModal(model);
  refs.modal.hidden = false;
  document.body.classList.add("modal-open");
  refs.modalClose.focus();
}

function closeModal() {
  refs.modal.hidden = true;
  document.body.classList.remove("modal-open");
  state.activeModelId = null;
}

function render() {
  renderStats();
  renderTabs();
  renderSections();
}

refs.search.addEventListener("input", (event) => {
  state.query = event.target.value;
  renderSections();
});

refs.modalClose.addEventListener("click", closeModal);

refs.modal.addEventListener("click", (event) => {
  if (event.target === refs.modal) closeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !refs.modal.hidden) closeModal();
});

loadMarketData();
window.setInterval(refreshMarketData, 30000);
