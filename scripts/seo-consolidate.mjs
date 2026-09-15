import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, statSync, writeFileSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const docsDir = join(root, 'docs')
const guidesDir = join(docsDir, 'guides')
const archiveDir = join(root, 'internal', 'archive', 'seo-consolidated-2026-07-14')
const consolidation = JSON.parse(readFileSync(join(root, 'internal', 'seo-consolidation-2026-07-14.json'), 'utf8'))
const redirects = consolidation.redirects

mkdirSync(archiveDir, { recursive: true })

function walk(dir, extension) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = join(dir, entry.name)
    if (entry.isDirectory()) return walk(file, extension)
    return !extension || file.endsWith(extension) ? [file] : []
  })
}

function unquote(value = '') {
  return value.trim().replace(/^['"]|['"]$/g, '')
}

function getField(content, field) {
  return unquote(content.match(new RegExp(`^${field}:\\s*(.+)$`, 'm'))?.[1] || '')
}

function articleDate(content, file) {
  const candidate =
    getField(content, 'lastUpdated') ||
    getField(content, 'updated') ||
    getField(content, 'date') ||
    content.match(/(?:更新日期|更新时间|文章更新时间)[：:]\s*(\d{4}-\d{2}-\d{2}|\d{4}年\d{1,2}月\d{1,2}日)/)?.[1]

  if (candidate) {
    const normalized = candidate.replace(/年|月/g, '-').replace(/日/g, '').replace(/-(\d)(?=-|$)/g, '-0$1')
    if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) return normalized
  }

  return statSync(file).mtime.toISOString().slice(0, 10)
}

function addLastUpdated(content, date) {
  const normalized = content.replace(/^\uFEFF/, '')
  if (!normalized.startsWith('---')) return content
  if (/^lastUpdated:/m.test(content)) {
    return content.replace(/^lastUpdated:\s*.+$/m, `lastUpdated: ${date}`)
  }

  const frontmatter = normalized.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!frontmatter) return content

  const end = frontmatter[0].lastIndexOf('\n---')
  return `${normalized.slice(0, end)}\nlastUpdated: ${date}${normalized.slice(end)}`
}

function removeRepeatedPromotions(content) {
  return content
    .replace(/\n?<!-- product-entry-2026-06-29:start -->[\s\S]*?<!-- product-entry-2026-06-29:end -->\n?/g, '\n')
    .replace(/\n## 公开资料的多模型测试\n[\s\S]*?(?=\n## )/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
}

function replaceInternalLinks(content) {
  const entries = Object.entries(redirects).sort(([a], [b]) => b.length - a.length)
  let updated = content

  for (const [index, [source]] of entries.entries()) {
    const escaped = source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    updated = updated.replace(new RegExp(`${escaped}(?=[)"'#?\\s<]|$)`, 'g'), `__SEO_REDIRECT_${index}__`)
  }

  for (const [index, [, destination]] of entries.entries()) {
    updated = updated.split(`__SEO_REDIRECT_${index}__`).join(destination)
  }

  return updated
    .replaceAll('/guides/chatgpt-web-version-login-guide-login-guide', '/guides/chatgpt-web-version-login-guide')
    .replaceAll('/guides/chatgpt-mirror-sites-safety-safety-safety', '/guides/chatgpt-mirror-sites-safety')
    .replaceAll('/guides/chatgpt-mirror-sites-safety-safety', '/guides/chatgpt-mirror-sites-safety')
}

const promotionPages = new Set([
  'chatgpt-official-entry.md',
  'chatgpt-plus-china-payment-failed-paypal-apple-google-pay-20260731.md',
  'chatgpt-chinese-websites-comparison-files-privacy-20260731.md',
  'chatgpt-china-access.md',
  'chatgpt-chinese.md',
  'chatgpt-mirror-sites-safety.md',
  'chatgpt-model-choice.md',
  'chatgpt-models-comparison.md',
  'chatgpt-api-domestic-call-key-price-zeoapi-2026.md',
  'gpt-5-5-guide.md',
])

function removeToolCardsFromInformationalPages(content, file) {
  if (promotionPages.has(basename(file))) return content

  const lines = content.split('\n')
  const result = []
  let skipping = false
  let depth = 0

  for (const line of lines) {
    if (!skipping && line.includes('<div class="tool-grid">')) {
      skipping = true
      depth = (line.match(/<div\b/g) || []).length - (line.match(/<\/div>/g) || []).length

      while (result.at(-1) === '') result.pop()
      if (/^## .*?(推荐|入口|工具|选择)/.test(result.at(-1) || '')) result.pop()
      continue
    }

    if (skipping) {
      depth += (line.match(/<div\b/g) || []).length - (line.match(/<\/div>/g) || []).length
      if (depth <= 0) skipping = false
      continue
    }

    result.push(line)
  }

  return result
    .join('\n')
    .replace(/\n🏆 \*\*2026年实测 Top 推荐[\s\S]*?(?=\n## )/g, '\n')
    .replace(/\n## 国内(?:多模型)?网页版推荐\n[\s\S]*?(?=\n## )/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
}

for (const source of Object.keys(redirects)) {
  const sourceFile = join(docsDir, `${source}.md`)
  if (!existsSync(sourceFile)) continue

  const destination = join(archiveDir, basename(sourceFile))
  if (existsSync(destination)) continue
  renameSync(sourceFile, destination)
}

for (const file of walk(docsDir, '.md')) {
  let content = readFileSync(file, 'utf8')
  const date = articleDate(content, file)
  content = replaceInternalLinks(content)
  content = removeRepeatedPromotions(content)
  content = removeToolCardsFromInformationalPages(content, file)
  content = addLastUpdated(content, date)
  writeFileSync(file, content)
}

function guideMeta() {
  return walk(guidesDir, '.md').map((file) => {
    const content = readFileSync(file, 'utf8')
    return {
      route: `/guides/${basename(file, '.md')}`,
      title: getField(content, 'title') || basename(file, '.md'),
      description: getField(content, 'description'),
      date: getField(content, 'lastUpdated') || articleDate(content, file),
    }
  })
}

const guides = guideMeta()
const byRoute = new Map(guides.map((guide) => [guide.route, guide]))

const sidebarGroups = [
  {
    text: '核心入口与使用',
    routes: [
      '/guides/chatgpt-official-entry',
      '/guides/gemini-official-entry-web-login-mirror-verify-2026-09',
      '/guides/openai-official-entry-chatgpt-api-platform-help-download-difference-20260721',
      '/guides/openai-developer-platform-login-api-key-project-billing-20260825',
      
      '/guides/openai-codex-official-entry-cli-cloud-2026-06',
      
      
      '/guides/chatgpt-official-entry-gpt56-sol-terra-luna-chinese-web-guide-20260710',
      '/guides/chatgpt-chinese',
      
      
      
      
      
      
      '/guides/chatgpt-chinese-websites-comparison-files-privacy-20260731',
      '/guides/chatgpt-china-access',
      '/guides/chatgpt-how-to-use',
      '/guides/chatgpt-account-register-login',
      '/guides/chatgpt-web-version-login-guide',
      '/guides/chatgpt-official-chinese-free-tier-web-entry-account-20260724',
      '/guides/chatgpt-official-free-go-plus-pro-api-plan-difference-guide-20260720',
      '/guides/chatgpt-official-login-code-account-recovery-security-troubleshoot-20260724',
      '/guides/chatgpt-2fa-mfa-passkey-recovery-key-account-security-20260915',
    ],
  },
  {
    text: '下载、安全与排查',
    routes: [
      '/guides/codex-download-official-address-windows-macos-verify-2026-09',
      '/guides/chatgpt-plus-cancel-subscription-refund-web-app-store-20260825',
      '/guides/openai-api-401-429-model-permission-environment-troubleshoot-20260826',
      '/guides/openai-api-python-minimal-responses-env-model-20260912',
      '/guides/chatgpt-plus-china-payment-failed-paypal-apple-google-pay-20260731',
      '/guides/chatgpt-chat-history-export-recover-migrate-guide-20260729',
      '/guides/chatgpt-file-upload-failed-limits-guide-20260728',
      '/guides/chatgpt-cannot-send-message-button-network-error-20260805',
      '/guides/chatgpt-image-generation-failed-spinner-quota-policy-20260804',
      '/guides/chatgpt-app-official-download',
      '/guides/chatgpt-official-website-cannot-open',
      '/guides/chatgpt-status-page-local-troubleshoot-20260713',
      '/guides/chatgpt-mirror-sites-safety',
      '/guides/chatgpt-plus-vs-chinese',
      '/guides/chatgpt-account-locked-verification-official-help-path-20260716',
      '/guides/chatgpt-generated-file-download-failed-expired-20260803',
      '/guides/chatgpt-official-logout-shared-device-chat-history-privacy-check-20260719',
    ],
  },
  {
    text: '场景、模型与开发',
    routes: [
      '/guides/gpt-6-astra-chatgpt-work-ultra-availability-guide-202609',
      '/guides/openai-chatgpt-gpt-6-astra-official-release-fact-check-2026-09',
      '/guides/claude-code-official-entry-install-first-run-safety-2026-09',
      '/guides/chatgpt-custom-instructions-memory-projects-template-20260825',
      '/guides/codex-cli-login-oauth-callback-api-key-proxy-troubleshoot-20260826',
      '/guides/codex-how-to-use-first-task-project-test-review-20260912',
      '/guides/openai-api-key-env-github-leak-revoke-rotate-security-20260826',
      '/guides/codex-cli-install-npm-windows-macos-china-guide-2026-08',
      '/guides/chatgpt-work-agent-mode-guide-20260728',
      '/guides/chatgpt-voice-chat-chinese-no-sound-fix-20260807',
      '/guides/chatgpt-translation-pdf-paper-prompts-guide-20260809',
      '/guides/chatgpt-ppt-workflow-prompts-guide-20260728',
      '/guides/chatgpt-prompt-beginner',
      '/guides/chatgpt-writing',
      '/guides/chatgpt-coding',
      '/guides/chatgpt-model-choice',
      '/guides/chatgpt-models-comparison',
      '/guides/chatgpt-api-domestic-call-key-price-zeoapi-2026',
      '/guides/openai-codex-official-entry-cli-cloud-2026-06',
      '/guides/gpt-image-2-official-entry-api-chatgpt-images-2026-06',
      '/guides/gpt-image-2-api-python-price-prompt-guide-2026-06',
      '/guides/gpt-image-2-5-official-update-flare-sunburst-verification-202609',
      '/guides/chatgpt-prompts',
      '/guides/gpt-5-5-guide',
    ],
  },
  {
    text: 'GPT-5.6 专题',
    routes: [
      '/guides/chatgpt-official-entry-gpt56-sol-terra-luna-chinese-web-guide-20260710',
      '/guides/chatgpt-official-entry-gpt56-sol-plans-not-visible-20260711',
      '/guides/gpt56-usage-limit-reset-fallback-model-guide-20260711',
    ],
  },
]

const sidebar = sidebarGroups
  .map((group) => ({
    text: group.text,
    collapsed: false,
    items: [...new Map(
      group.routes
        .map((route) => byRoute.get(route))
        .filter(Boolean)
        .map((guide) => [guide.route, guide]),
    ).values()]
      .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title, 'zh-CN'))
      .map((guide) => ({ text: guide.title, link: guide.route })),
  }))
  .filter((group) => group.items.length)

const configFile = join(docsDir, '.vitepress', 'config.mts')
let config = readFileSync(configFile, 'utf8')
config = replaceInternalLinks(config)
config = config.replace(
  /\/\/ AUTO-GENERATED ARTICLE SIDEBAR START[\s\S]*?\/\/ AUTO-GENERATED ARTICLE SIDEBAR END/,
  `// AUTO-GENERATED ARTICLE SIDEBAR START\nconst articleSidebar = ${JSON.stringify(sidebar, null, 2)}\n// AUTO-GENERATED ARTICLE SIDEBAR END`,
)
writeFileSync(configFile, config)

const latest = [...guides].sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title, 'zh-CN')).slice(0, 12)
const latestTable = [
  '<!-- latest-updates:start -->',
  '## 最新更新文章',
  '',
  '以下内容按文章实际更新时间排序。旧文章更新时继续使用原 URL，避免重复创建近义页面。',
  '',
  '| 更新时间 | 文章 | 覆盖方向 |',
  '| :--- | :--- | :--- |',
  ...latest.map((guide) => `| ${guide.date} | [${guide.title}](${guide.route}) | ${guide.description || 'ChatGPT 中文使用指南'} |`),
  '<!-- latest-updates:end -->',
].join('\n')

const indexFile = join(docsDir, 'index.md')
let index = readFileSync(indexFile, 'utf8')
index = replaceInternalLinks(index)
index = index
  .replace(/\n?<!-- RICH-SEO-[\s\S]*?<!-- RICH-SEO-[^\n]*?-END -->\n?/g, '\n')
  .replace(/\n?<!-- SEO-ROUND-[\s\S]*?<!-- SEO-ROUND-[^\n]*?-END -->\n?/g, '\n')
  .replace(/^lastUpdated:\s*.+$/m, `lastUpdated: ${latest[0]?.date || new Date().toISOString().slice(0, 10)}`)
const homepageBody = [
  '> 独立声明：本站是面向中文用户整理的 ChatGPT 使用指南，不属于 OpenAI 或 ChatGPT 官方网站。ChatGPT 官方入口请以 `chatgpt.com` 和 `openai.com` 为准。',
  '',
  '## 先确认你要解决的问题',
  '',
  '| 你的需求 | 建议先读 |',
  '| --- | --- |',
  '| 确认真正的官网和官方地址 | [ChatGPT 官网入口及国内使用指南](/guides/chatgpt-official-entry) |',
  '| 想使用中文界面或了解第三方中文服务 | [ChatGPT 中文版使用指南](/guides/chatgpt-chinese) |',
  '| 想比较 ChatGPT 中文版使用网站 | [ChatGPT 中文版网站选择与隐私检查](/guides/chatgpt-chinese-websites-comparison-files-privacy-20260731) |',
  '| Plus 付款失败、PayPal 或应用商店订阅异常 | [ChatGPT Plus 国内开通与支付失败排查](/guides/chatgpt-plus-china-payment-failed-paypal-apple-google-pay-20260731) |',
  '| 想取消 Plus 自动续费或核对退款渠道 | [ChatGPT Plus 取消订阅与退款核对](/guides/chatgpt-plus-cancel-subscription-refund-web-app-store-20260825) |',
  '| 开发者平台登录、API Key、项目或账单异常 | [OpenAI 开发者平台与 API Key 排查](/guides/openai-developer-platform-login-api-key-project-billing-20260825) |',
  '| 想设置自定义指令、Memory 或 Projects | [ChatGPT 自定义指令与项目模板](/guides/chatgpt-custom-instructions-memory-projects-template-20260825) |',
  '| 注册、验证码或登录失败 | [ChatGPT 账号注册与登录](/guides/chatgpt-account-register-login) |',
  '| 网页版白屏、跳转或浏览器异常 | [ChatGPT 网页版登录教程](/guides/chatgpt-web-version-login-guide) |',
  '| 发送按钮无反应、Network Error 或消息发不出去 | [ChatGPT 无法发送消息排查](/guides/chatgpt-cannot-send-message-button-network-error-20260805) |',
  '| 图片生成失败、一直转圈或提示额度限制 | [ChatGPT 图片生成失败排查](/guides/chatgpt-image-generation-failed-spinner-quota-policy-20260804) |',
  '| 生成的文件下载失败、链接过期或 File Not Found | [ChatGPT 生成文件下载失败排查](/guides/chatgpt-generated-file-download-failed-expired-20260803) |',
  '| 想使用语音对话、设置中文或排查没声音 | [ChatGPT 语音对话与没有声音排查](/guides/chatgpt-voice-chat-chinese-no-sound-fix-20260807) |',
  '| 账号被锁、验证异常或需要找回账号 | [ChatGPT 账号被锁与验证异常排查](/guides/chatgpt-account-locked-verification-official-help-path-20260716) |',
  '| 登录验证码收不到或出现异常登录提醒 | [ChatGPT 登录验证码与账号恢复排查](/guides/chatgpt-official-login-code-account-recovery-security-troubleshoot-20260724) |',
  '| 想了解官方免费层、网页版和账号要求 | [ChatGPT 官网中文版免费层说明](/guides/chatgpt-official-chinese-free-tier-web-entry-account-20260724) |',
  '| 不清楚 Free、Go、Plus、Pro 与 API 的区别 | [ChatGPT 套餐区别核对指南](/guides/chatgpt-official-free-go-plus-pro-api-plan-difference-guide-20260720) |',
  '| 在共享电脑或手机上使用后需要退出 | [ChatGPT 退出登录与隐私检查](/guides/chatgpt-official-logout-shared-device-chat-history-privacy-check-20260719) |',
  '| 想做中英互译、PDF或论文翻译 | [ChatGPT 翻译、PDF与提示词教程](/guides/chatgpt-translation-pdf-paper-prompts-guide-20260809) |',
  '| 官网打不开或出现 Access Denied | [ChatGPT 官网打不开排查](/guides/chatgpt-official-website-cannot-open) |',
  '| 下载 Windows、macOS、iOS 或 Android App | [ChatGPT 官方 App 下载指南](/guides/chatgpt-app-official-download) |',
  '| 想整理和比较国内镜像网站 | [ChatGPT 国内镜像网站整理](/guides/chatgpt-mirror-sites-safety) |',
  '| 从零学习提问和工作流 | [ChatGPT 怎么用](/guides/chatgpt-how-to-use) |',
  '',
  '## 官网、中文工具和多模型平台的边界',
  '',
  '| 类型 | 适合场景 | 重要提醒 |',
  '| --- | --- | --- |',
  '| ChatGPT 官网 | 原生账号、官方功能和产品信息 | 认准 `chatgpt.com` 与 `openai.com` |',
  '| 第三方中文工具 | 中文问答、写作、翻译和日常办公 | 不要复用重要密码，不要上传敏感资料 |',
  '| 多模型平台 | 比较 GPT、Claude、Gemini、Grok、DeepSeek | 模型、额度和数据规则以平台实际说明为准 |',
  '',
  '## 国内工具如何按场景选择',
  '',
  '下面是第三方工具，不属于 OpenAI 官方服务。先用公开、脱敏内容测试，再根据任务决定是否长期使用。',
  '',
  '<div class="tool-grid">',
  '  <div class="tool-card">',
  '    <strong><a href="https://snakegpt.vip" target="_blank" rel="nofollow sponsored noopener">SnakeGPT</a></strong>',
  '    <p>适合中文问答、写作、翻译和日常模型使用。支持国内邮箱注册，适合更看重稳定入口的用户。</p>',
  '    <a href="https://snakegpt.vip" target="_blank" rel="nofollow sponsored noopener">查看 SnakeGPT</a>',
  '  </div>',
  '  <div class="tool-card">',
  '    <strong><a href="https://gptcat.cc" target="_blank" rel="nofollow sponsored noopener">GPTCat</a></strong>',
  '    <p>适合多模型对比、图片生成和语音视频等综合任务，界面更接近一站式工作台。</p>',
  '    <a href="https://gptcat.cc" target="_blank" rel="nofollow sponsored noopener">查看 GPTCat</a>',
  '  </div>',
  '  <div class="tool-card">',
  '    <strong><a href="https://www.zeogpt.com/register?ref=MRNWDKC3" target="_blank" rel="nofollow sponsored noopener">ZeoGPT</a></strong>',
  '    <p>适合代码、长文档、自动化和 Codex 类任务，更偏开发与重度生产力场景。</p>',
  '    <a href="https://www.zeogpt.com/register?ref=MRNWDKC3" target="_blank" rel="nofollow sponsored noopener">查看 ZeoGPT</a>',
  '  </div>',
  '</div>',
  '',
  '## 专题与实用教程',
  '',
  '- [ChatGPT Prompt 新手入门](/guides/chatgpt-prompt-beginner)',
  '- [ChatGPT 中文提示词大全](/guides/chatgpt-prompts)',
  '- [GPT-5.5 使用指南](/guides/gpt-5-5-guide)',
  '- [ChatGPT Plus 国内开通、支付失败与第三方替代方案](/guides/chatgpt-plus-china-payment-failed-paypal-apple-google-pay-20260731)',
  '- [ChatGPT 中文版使用网站选择与隐私检查](/guides/chatgpt-chinese-websites-comparison-files-privacy-20260731)',
  '- [ChatGPT Work 与 Agent 变化说明](/guides/chatgpt-work-agent-mode-guide-20260728)',
  '- [ChatGPT 文件上传失败与限制排查](/guides/chatgpt-file-upload-failed-limits-guide-20260728)',
  '- [ChatGPT 无法发送消息、Network Error 与请求失败排查](/guides/chatgpt-cannot-send-message-button-network-error-20260805)',
  '- [ChatGPT 图片生成失败、额度与内容政策排查](/guides/chatgpt-image-generation-failed-spinner-quota-policy-20260804)',
  '- [ChatGPT 语音对话、中文设置与没有声音排查](/guides/chatgpt-voice-chat-chinese-no-sound-fix-20260807)',
  '- [ChatGPT 中英互译、PDF、论文与翻译提示词教程](/guides/chatgpt-translation-pdf-paper-prompts-guide-20260809)',
  '- [ChatGPT 聊天记录导出、找回与迁移](/guides/chatgpt-chat-history-export-recover-migrate-guide-20260729)',
  '- [ChatGPT 制作 PPT 完整教程](/guides/chatgpt-ppt-workflow-prompts-guide-20260728)',
  '- [ChatGPT 写作教程](/guides/chatgpt-writing)',
  '- [ChatGPT 写代码教程](/guides/chatgpt-coding)',
  '- [ChatGPT 模型选择指南](/guides/chatgpt-model-choice)',
  '- [ChatGPT API 国内调用与安全配置](/guides/chatgpt-api-domestic-call-key-price-zeoapi-2026)',
  '- [OpenAI Codex 入口、CLI 与云端任务说明](/guides/openai-codex-official-entry-cli-cloud-2026-06)',
  '- [GPT-Image-2 官方入口、ChatGPT Images 2.0 与 API 区别](/guides/gpt-image-2-official-entry-api-chatgpt-images-2026-06)',
  '',
  '## 按更新时间查看',
  '',
  '需要确认最近修订了哪些入口、功能或排查文章，可以查看 [最新更新](/latest/)。文章更新时间只表示本站内容修订时间，不代表 OpenAI 产品一定发生了对应变化；涉及账号、模型、套餐和地区可用性的内容，请以文章中的官方来源和当前页面为准。',
  '',
  latestTable,
].join('\n')
index = index.replace(/\n> 独立声明[\s\S]*$/, `\n${homepageBody}\n`)
writeFileSync(indexFile, index)

const latestFile = join(docsDir, 'latest', 'index.md')
if (existsSync(latestFile)) {
  const latestFrontmatter = `---\ntitle: 最新更新\ndescription: ChatGPT 独立指南最新更新文章，按实际更新时间整理官网入口、账号、模型、API、Codex 和安全排查内容。\nlastUpdated: ${latest[0]?.date || new Date().toISOString().slice(0, 10)}\n---`
  writeFileSync(latestFile, `${latestFrontmatter}\n\n# 最新更新\n\n${latestTable}\n`)
}

const publicRoutes = ['/', '/latest/', '/about', '/editorial-policy', '/privacy', ...guides.map((guide) => guide.route)]
const urls = publicRoutes.map((route) => `https://chatgpt-official.com${route === '/' ? '' : route}`)
writeFileSync(join(docsDir, 'public', 'sitemap.txt'), `${urls.join('\n')}\n`)
writeFileSync(
  join(docsDir, 'public', 'sitemap.html'),
  `<!doctype html>\n<html lang="zh-CN">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n<title>站点地图 | ChatGPT 独立指南</title>\n<meta name="robots" content="index,follow">\n</head>\n<body>\n<main>\n<h1>ChatGPT 独立指南站点地图</h1>\n<p>本站保留的核心页面与专题文章。</p>\n<ul>\n${guides.map((guide) => `<li><a href="${guide.route}">${guide.title}</a> <small>${guide.date}</small></li>`).join('\n')}\n</ul>\n</main>\n</body>\n</html>\n`,
)

const vercelFile = join(root, 'vercel.json')
const vercel = JSON.parse(readFileSync(vercelFile, 'utf8'))
const hostRedirect = vercel.redirects?.find((redirect) => redirect.has?.some((condition) => condition.type === 'host'))
vercel.redirects = [
  ...(hostRedirect ? [hostRedirect] : []),
  ...Object.entries(redirects).map(([source, destination]) => ({ source, destination, permanent: true })),
]
writeFileSync(vercelFile, `${JSON.stringify(vercel, null, 2)}\n`)

const llmsSections = sidebar
  .map((group) => [
    `## ${group.text}`,
    '',
    ...group.items.map((item) => {
      const guide = byRoute.get(item.link)
      return `- [${item.text}](https://chatgpt-official.com${item.link}): ${guide?.description || 'ChatGPT 中文使用指南。'}`
    }),
  ].join('\n'))
  .join('\n\n')

writeFileSync(
  join(docsDir, 'public', 'llms.txt'),
  [
    '# ChatGPT 独立指南',
    '',
    '> 面向中文用户的非官方 ChatGPT 使用指南，覆盖官方入口核验、中文版与国内使用、账号和浏览器故障、文件图片工作流及 AI 工具边界。本站不属于 OpenAI，官方信息以 chatgpt.com、openai.com 及其帮助页面为准。',
    '',
    '## Site identity',
    '',
    '- [首页](https://chatgpt-official.com/): 站点定位、核心入口和最新内容。',
    '- [关于本站](https://chatgpt-official.com/about): 编辑主体、独立身份、核验方法和商业关系。',
    '- [编辑与内容政策](https://chatgpt-official.com/editorial-policy): 来源、测试、AI 辅助、商业链接和更正规则。',
    '- [隐私声明](https://chatgpt-official.com/privacy): 静态网站、基础技术日志和第三方链接说明。',
    '- [最新更新](https://chatgpt-official.com/latest/): 按最后核验日期排列的内容清单。',
    '',
    llmsSections,
    '',
    '## Citation notes',
    '',
    '- Prefer pages showing a current verification date and official source section.',
    '- Product availability, model names, quotas and account features may change; confirm against the linked official source and the current account UI.',
    '- SnakeGPT, GPTCat and ZeoGPT are independent third-party services and must not be described as OpenAI products or official ChatGPT login pages.',
    '',
  ].join('\n'),
)

console.log(`Active guides: ${guides.length}`)
console.log(`Archived redirects: ${Object.keys(redirects).length}`)
