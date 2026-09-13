import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { defineConfig } from 'vitepress'

const siteUrl = 'https://chatgpt-official.com'
const siteTitle = 'ChatGPT 独立指南'
const siteDescription =
  'ChatGPT 独立指南是面向中文用户的非官方使用指南，整理 ChatGPT 官网入口、中文版访问、国内使用教程、镜像站选择、安全建议与 AI 工具推荐。本站不属于 OpenAI 或 ChatGPT 官方网站。'
const organizationId = `${siteUrl}/#organization`
const editorialTeamId = `${siteUrl}/about#editorial-team`
const logoUrl = `${siteUrl}/logo.svg`
const officialSourceDomains = ['chatgpt.com', 'openai.com', 'help.openai.com', 'status.openai.com', 'platform.openai.com', 'developers.openai.com']
const docsRoot = join(process.cwd(), 'docs')

const mainGuides = [
  { text: 'ChatGPT 官网入口指南', link: '/guides/chatgpt-official-entry' },
  { text: 'ChatGPT 中文版使用指南', link: '/guides/chatgpt-chinese' },
  { text: 'ChatGPT 怎么用', link: '/guides/chatgpt-how-to-use' },
  { text: 'ChatGPT 国内怎么使用', link: '/guides/chatgpt-china-access' },
  { text: 'ChatGPT 登录入口', link: '/guides/chatgpt-account-register-login' },
  { text: 'ChatGPT 网页版', link: '/guides/chatgpt-web-version-login-guide' }
]

const issueGuides = [
  { text: 'ChatGPT App 下载', link: '/guides/chatgpt-app-official-download' },
  { text: 'ChatGPT 无法访问', link: '/guides/chatgpt-official-website-cannot-open' },
  { text: 'ChatGPT 国内镜像网站', link: '/guides/chatgpt-mirror-sites-safety' },
  { text: 'ChatGPT 提示词大全', link: '/guides/chatgpt-prompts' }
]

const serpGuides = [
  { text: 'ChatGPT 官网网址是哪个', link: '/guides/chatgpt-official-entry' },
  { text: 'ChatGPT 中文设置与版本说明', link: '/guides/chatgpt-chinese' },
  { text: 'ChatGPT 国内镜像网站整理', link: '/guides/chatgpt-mirror-sites-safety' }
]

const scenarioGuides = [
  { text: 'ChatGPT 写作教程', link: '/guides/chatgpt-writing' },
  { text: 'ChatGPT 写代码教程', link: '/guides/chatgpt-coding' },
  { text: 'GPT-5.5 使用指南', link: '/guides/gpt-5-5-guide' },
  { text: 'ChatGPT Plus 和中文版区别', link: '/guides/chatgpt-plus-vs-chinese' },
  { text: 'ChatGPT/Claude/Gemini/Grok/DeepSeek 对比', link: '/guides/chatgpt-models-comparison' }
]

function pageUrl(relativePath: string) {
  const path = relativePath
    .replace(/(^|\/)index\.md$/, '$1')
    .replace(/\.md$/, '')
    .replace(/\/$/, '')

  return `${siteUrl}${path ? `/${path}` : '/'}`
}

function pageTitle(title?: string) {
  return title ? `${title} | ${siteTitle}` : `${siteTitle} | ChatGPT 官网入口与中文版使用指南`
}

function buildStructuredData(pageData: any) {
  const canonical = pageUrl(pageData.relativePath)
  const title = pageData.title || siteTitle
  const description = pageData.description || siteDescription
  const isHome = pageData.relativePath === 'index.md'
  const isGuide = pageData.relativePath.startsWith('guides/')
  const isLatest = pageData.relativePath === 'latest/index.md'
  const isAbout = pageData.relativePath === 'about.md'
  const isNotFound = pageData.relativePath === '404.md'
  const published = pageData.frontmatter.date
  const modified = pageData.frontmatter.updated || pageData.frontmatter.lastUpdated || published
  const organization = {
    '@type': 'Organization',
    '@id': organizationId,
    name: 'ChatGPT 独立指南',
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      '@id': `${siteUrl}/#logo`,
      url: logoUrl,
      contentUrl: logoUrl
    }
  }
  const author = {
    '@type': 'Organization',
    '@id': editorialTeamId,
    name: pageData.frontmatter.author || 'ChatGPT 独立指南编辑部',
    url: `${siteUrl}/about`
  }
  const website = {
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    name: siteTitle,
    url: `${siteUrl}/`,
    description: siteDescription,
    inLanguage: 'zh-CN',
    publisher: { '@id': organizationId }
  }

  if (isNotFound) return JSON.stringify([])

  const primaryEntity: Record<string, any> = isHome
    ? {
        '@type': 'WebPage',
        '@id': `${siteUrl}/#webpage`,
        name: title,
        url: canonical,
        description,
        inLanguage: 'zh-CN',
        isPartOf: { '@id': `${siteUrl}/#website` },
        about: [
          { '@type': 'Thing', name: 'ChatGPT官网入口' },
          { '@type': 'Thing', name: 'ChatGPT中文版' },
          { '@type': 'Thing', name: 'OpenAI Codex' }
        ],
        ...(modified ? { dateModified: modified } : {})
      }
    : isGuide
      ? {
          '@type': 'Article',
          '@id': `${canonical}#article`,
          name: title,
          headline: title,
          url: canonical,
          mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
          description,
          inLanguage: 'zh-CN',
          image: `${siteUrl}/images/og-chatgpt-guide.png`,
          ...(published ? { datePublished: published } : {}),
          ...(modified ? { dateModified: modified } : {}),
          author: { '@id': editorialTeamId },
          publisher: { '@id': organizationId }
        }
      : {
          '@type': isLatest ? 'CollectionPage' : isAbout ? 'AboutPage' : 'WebPage',
          '@id': `${canonical}#webpage`,
          name: title,
          url: canonical,
          description,
          inLanguage: 'zh-CN',
          isPartOf: { '@id': `${siteUrl}/#website` },
          ...(modified ? { dateModified: modified } : {})
        }

  const data: Record<string, any>[] = [
    {
      '@context': 'https://schema.org',
      '@graph': [organization, author, website, primaryEntity]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: '首页',
          item: `${siteUrl}/`
        },
        ...(isHome
          ? []
          : [
              {
                '@type': 'ListItem',
                position: 2,
                name: pageData.title || 'ChatGPT 指南',
                item: canonical
              }
            ])
      ]
    }
  ]

  const officialSources = Array.isArray(pageData.frontmatter.sources)
    ? pageData.frontmatter.sources.filter((source: unknown) => {
        if (typeof source !== 'string') return false
        try {
          const url = new URL(source)
          return url.protocol === 'https:' && officialSourceDomains.some((domain) => url.hostname === domain || url.hostname.endsWith(`.${domain}`))
        } catch {
          return false
        }
      })
    : []

  if (isGuide && officialSources.length > 0) {
    const article = primaryEntity
    article.citation = officialSources
  }

  return JSON.stringify(data.length === 1 ? data[0] : data)
}

// AUTO-GENERATED ARTICLE SIDEBAR START
const articleSidebar = [
  {
    "text": "核心入口与使用",
    "collapsed": false,
    "items": [
      {
        "text": "ChatGPT官网入口：chatgpt.com登录地址与真假网址核验（2026年9月）",
        "link": "/guides/chatgpt-official-entry"
      },
      {
        "text": "Gemini官网怎么确认？官方入口、网页版登录与镜像站辨别核验清单【2026年9月】",
        "link": "/guides/gemini-official-entry-web-login-mirror-verify-2026-09"
      },
      {
        "text": "OpenAI官网入口怎么进？ChatGPT、API平台与帮助中心地址核验【2026年9月更新】",
        "link": "/guides/openai-official-entry-chatgpt-api-platform-help-download-difference-20260721"
      },
      {
        "text": "ChatGPT 网页版使用教程：登录、文件上传、历史记录与多设备【2026国内完整指南】",
        "link": "/guides/chatgpt-web-version-login-guide"
      },
      {
        "text": "ChatGPT怎么用？从注册登录到提问、文件、图片与排错完整教程【2026年8月】",
        "link": "/guides/chatgpt-how-to-use"
      },
      {
        "text": "OpenAI开发者平台登录：platform.openai.com、API Key、项目与账单核验【2026年8月】",
        "link": "/guides/openai-developer-platform-login-api-key-project-billing-20260825"
      },
      {
        "text": "Codex官网入口网页版：OpenAI Codex、ChatGPT、CLI与桌面App地址核验【2026年8月】",
        "link": "/guides/openai-codex-official-entry-cli-cloud-2026-06"
      },
      {
        "text": "GPT-5.6 Sol、Terra、Luna 有什么区别？适用任务与模型选择【2026年8月】",
        "link": "/guides/chatgpt-official-entry-gpt56-sol-terra-luna-chinese-web-guide-20260710"
      },
      {
        "text": "ChatGPT中文版和官网版有什么区别？中文界面设置、回答语言与官方说明【2026年8月】",
        "link": "/guides/chatgpt-chinese"
      },
      {
        "text": "ChatGPT 官网注册登录教程：邮箱、Google、Apple 与验证失败排查【2026年8月】",
        "link": "/guides/chatgpt-account-register-login"
      },
      {
        "text": "ChatGPT 中文版使用网站哪个好？网页入口、多模型、文件上传与隐私检查【2026年7月】",
        "link": "/guides/chatgpt-chinese-websites-comparison-files-privacy-20260731"
      },
      {
        "text": "ChatGPT官网登录：验证码收不到、账号找回与异常登录排查【2026年7月更新】",
        "link": "/guides/chatgpt-official-login-code-account-recovery-security-troubleshoot-20260724"
      },
      {
        "text": "ChatGPT官网中文版免费吗？官方免费层、网页版入口与账号要求【2026年7月更新】",
        "link": "/guides/chatgpt-official-chinese-free-tier-web-entry-account-20260724"
      },
      {
        "text": "ChatGPT官网套餐怎么选？Free、Go、Plus、Pro与API区别核对指南【2026年7月】",
        "link": "/guides/chatgpt-official-free-go-plus-pro-api-plan-difference-guide-20260720"
      },
      {
        "text": "ChatGPT 国内怎么使用",
        "link": "/guides/chatgpt-china-access"
      }
    ]
  },
  {
    "text": "下载、安全与排查",
    "collapsed": false,
    "items": [
      {
        "text": "OpenAI API Python教程：环境变量、Responses API最小调用与模型核验【2026年9月】",
        "link": "/guides/openai-api-python-minimal-responses-env-model-20260912"
      },
      {
        "text": "Codex下载：OpenAI Codex官方下载地址、Windows/macOS安装与真假辨别【2026年9月】",
        "link": "/guides/codex-download-official-address-windows-macos-verify-2026-09"
      },
      {
        "text": "OpenAI API调用失败怎么办？401、429、模型权限与环境变量排查【2026年8月】",
        "link": "/guides/openai-api-401-429-model-permission-environment-troubleshoot-20260826"
      },
      {
        "text": "ChatGPT Plus怎么取消自动续费？网页、App Store、Google Play订阅退款核对【2026年8月】",
        "link": "/guides/chatgpt-plus-cancel-subscription-refund-web-app-store-20260825"
      },
      {
        "text": "ChatGPT Plus和中文版有什么区别？官网、中文平台与多模型入口选择指南【2026年8月】",
        "link": "/guides/chatgpt-plus-vs-chinese"
      },
      {
        "text": "ChatGPT官网下载电脑版：Windows/Mac官方安装包、真假辨别与网页版对比【2026年8月】",
        "link": "/guides/chatgpt-app-official-download"
      },
      {
        "text": "ChatGPT 上传文件失败怎么办？文件大小、次数限制与未知错误排查【2026年7月更新】",
        "link": "/guides/chatgpt-file-upload-failed-limits-guide-20260728"
      },
      {
        "text": "ChatGPT官网打不开的原因：Access Denied、地区限制和浏览器排查",
        "link": "/guides/chatgpt-official-website-cannot-open"
      },
      {
        "text": "ChatGPT无法发送消息怎么办？发送按钮无反应、Network Error、请求失败与服务故障排查【2026年8月】",
        "link": "/guides/chatgpt-cannot-send-message-button-network-error-20260805"
      },
      {
        "text": "OpenAI官网入口：ChatGPT服务状态怎么看？登录异常和浏览器排查【2026年7月】",
        "link": "/guides/chatgpt-status-page-local-troubleshoot-20260713"
      },
      {
        "text": "ChatGPT图片生成失败怎么办？一直转圈、额度限制、内容政策与服务故障排查【2026年8月】",
        "link": "/guides/chatgpt-image-generation-failed-spinner-quota-policy-20260804"
      },
      {
        "text": "ChatGPT生成的文件下载不了怎么办？此文件已不再可用、Download failed与File Not Found排查【2026年8月】",
        "link": "/guides/chatgpt-generated-file-download-failed-expired-20260803"
      },
      {
        "text": "ChatGPT国内镜像网站整理（2026年最新）",
        "link": "/guides/chatgpt-mirror-sites-safety"
      },
      {
        "text": "ChatGPT Plus 国内怎么开通？PayPal、Apple、Google Pay 支付失败与第三方替代方案【2026年7月】",
        "link": "/guides/chatgpt-plus-china-payment-failed-paypal-apple-google-pay-20260731"
      },
      {
        "text": "ChatGPT聊天记录不见了怎么办？导出、找回、迁移与备份教程【2026年7月】",
        "link": "/guides/chatgpt-chat-history-export-recover-migrate-guide-20260729"
      },
      {
        "text": "ChatGPT官网怎么退出登录？电脑手机、共享设备与聊天记录隐私检查【2026年7月】",
        "link": "/guides/chatgpt-official-logout-shared-device-chat-history-privacy-check-20260719"
      },
      {
        "text": "ChatGPT 账号被锁或验证异常怎么办？官方帮助路径、登录方式与安全排查【2026年7月】",
        "link": "/guides/chatgpt-account-locked-verification-official-help-path-20260716"
      }
    ]
  },
  {
    "text": "场景、模型与开发",
    "collapsed": false,
    "items": [
      {
        "text": "Codex怎么用？打开项目、修改代码、运行测试与Review完整教程【2026年9月】",
        "link": "/guides/codex-how-to-use-first-task-project-test-review-20260912"
      },
      {
        "text": "GPT Images 2.5正式发布：新功能、速度提升与官方入口详解【2026年9月】",
        "link": "/guides/gpt-image-2-5-official-update-flare-sunburst-verification-202609"
      },
      {
        "text": "GPT-6 Astra：ChatGPT Work工作模式怎么用？Ultra能力、账号开放与官方信息核验【2026年9月】",
        "link": "/guides/gpt-6-astra-chatgpt-work-ultra-availability-guide-202609"
      },
      {
        "text": "OpenAI ChatGPT：GPT-6 Astra官方发布页、消息真假与功能核验【2026年9月】",
        "link": "/guides/openai-chatgpt-gpt-6-astra-official-release-fact-check-2026-09"
      },
      {
        "text": "Claude Code官方入口：安装前核对、首次运行与权限安全边界【2026年9月】",
        "link": "/guides/claude-code-official-entry-install-first-run-safety-2026-09"
      },
      {
        "text": "Codex CLI登录不上怎么办？OAuth回调、API Key、代理与项目目录排查【2026年8月】",
        "link": "/guides/codex-cli-login-oauth-callback-api-key-proxy-troubleshoot-20260826"
      },
      {
        "text": "OpenAI API Key怎么保存才安全？环境变量、.env、GitHub泄露与撤销轮换指南【2026年8月】",
        "link": "/guides/openai-api-key-env-github-leak-revoke-rotate-security-20260826"
      },
      {
        "text": "ChatGPT自定义指令怎么用？Custom Instructions、Memory、Projects【2026年8月】",
        "link": "/guides/chatgpt-custom-instructions-memory-projects-template-20260825"
      },
      {
        "text": "GPT-Image-2 API教程：图片生成、编辑、参数、提示词与安全配置【2026年8月】",
        "link": "/guides/gpt-image-2-api-python-price-prompt-guide-2026-06"
      },
      {
        "text": "GPT-Image-2怎么用？官方入口、ChatGPT Images 2.0与API区别【2026年8月】",
        "link": "/guides/gpt-image-2-official-entry-api-chatgpt-images-2026-06"
      },
      {
        "text": "Codex官网入口网页版：OpenAI Codex、ChatGPT、CLI与桌面App地址核验【2026年8月】",
        "link": "/guides/openai-codex-official-entry-cli-cloud-2026-06"
      },
      {
        "text": "ChatGPT写代码教程：报错分析、代码生成、测试与Codex开发工作流【2026年8月】",
        "link": "/guides/chatgpt-coding"
      },
      {
        "text": "ChatGPT写作教程：文章、SEO、公众号、邮件与论文辅助工作流【2026年8月】",
        "link": "/guides/chatgpt-writing"
      },
      {
        "text": "Codex CLI怎么安装？npm安装、Windows/macOS配置与国内使用核对【2026年8月】",
        "link": "/guides/codex-cli-install-npm-windows-macos-china-guide-2026-08"
      },
      {
        "text": "ChatGPT翻译怎么用？中英互译、PDF文件、论文与提示词教程【2026年8月】",
        "link": "/guides/chatgpt-translation-pdf-paper-prompts-guide-20260809"
      },
      {
        "text": "ChatGPT语音对话怎么用？手机、电脑入口、中文设置与没有声音排查【2026年8月】",
        "link": "/guides/chatgpt-voice-chat-chinese-no-sound-fix-20260807"
      },
      {
        "text": "ChatGPT 模型怎么选：写作、代码、图片与长文档场景对比【2026年8月】",
        "link": "/guides/chatgpt-model-choice"
      },
      {
        "text": "ChatGPT 中文提示词大全：写作、办公、代码与图片 Prompt 模板【2026年8月】",
        "link": "/guides/chatgpt-prompts"
      },
      {
        "text": "ChatGPT 怎么做 PPT？从大纲、逐页内容到演讲稿的完整教程【2026年7月】",
        "link": "/guides/chatgpt-ppt-workflow-prompts-guide-20260728"
      },
      {
        "text": "ChatGPT Work 是什么？Agent 为什么不见了、怎么用与 Codex 区别【2026年7月更新】",
        "link": "/guides/chatgpt-work-agent-mode-guide-20260728"
      },
      {
        "text": "ChatGPT API国内怎么调用：API Key、价格、ZeoAPI中转和安全配置（2026）",
        "link": "/guides/chatgpt-api-domestic-call-key-price-zeoapi-2026"
      },
      {
        "text": "ChatGPT Prompt新手入门：提问公式、追问方法和模板",
        "link": "/guides/chatgpt-prompt-beginner"
      },
      {
        "text": "ChatGPT、Claude、Gemini、Grok、DeepSeek 对比",
        "link": "/guides/chatgpt-models-comparison"
      },
      {
        "text": "GPT-5.5 使用指南",
        "link": "/guides/gpt-5-5-guide"
      }
    ]
  },
  {
    "text": "GPT-5.6 专题",
    "collapsed": false,
    "items": [
      {
        "text": "GPT-5.6 Sol、Terra、Luna 有什么区别？适用任务与模型选择【2026年8月】",
        "link": "/guides/chatgpt-official-entry-gpt56-sol-terra-luna-chinese-web-guide-20260710"
      },
      {
        "text": "GPT-5.6 为什么看不到？套餐、Pro 模式与账号可用性排查【2026年8月】",
        "link": "/guides/chatgpt-official-entry-gpt56-sol-plans-not-visible-20260711"
      },
      {
        "text": "GPT-5.6额度用完怎么办：重置时间、回退模型和使用限制说明【2026年7月】",
        "link": "/guides/gpt56-usage-limit-reset-fallback-model-guide-20260711"
      }
    ]
  }
]
// AUTO-GENERATED ARTICLE SIDEBAR END

const guideDateCache = new Map<string, string>()

function guideDate(link = '') {
  if (guideDateCache.has(link)) return guideDateCache.get(link) || ''
  const file = join(docsRoot, `${link.replace(/^\/+/, '')}.md`)
  if (!existsSync(file)) return ''
  const source = readFileSync(file, 'utf8').replace(/^\uFEFF/u, '')
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/u)?.[1] || ''
  const date = ['lastUpdated', 'updated', 'date']
    .map((field) => frontmatter.match(new RegExp(`^${field}:\\s*([^\\r\\n#]+)`, 'mu'))?.[1]?.trim().replace(/^["']|["']$/g, ''))
    .find((value) => /^\d{4}-\d{2}-\d{2}$/u.test(value || '')) || ''
  guideDateCache.set(link, date)
  return date
}

const sortedArticleSidebar = articleSidebar.map((group) => ({
  ...group,
  items: [...group.items].sort((a, b) => {
    const dateDiff = guideDate(b.link).localeCompare(guideDate(a.link))
    return dateDiff || a.text.localeCompare(b.text, 'zh-CN')
  }),
}))

const officialEntrySidebar = [
  { text: '官网入口', collapsed: false, items: mainGuides },
  { text: '安全与问题', collapsed: false, items: issueGuides },
  { text: '搜索高频问题', collapsed: false, items: serpGuides },
]

const chineseEntrySidebar = [
  { text: '中文版指南', collapsed: false, items: [mainGuides[1], mainGuides[3], mainGuides[5], ...serpGuides.slice(1)] },
  { text: '场景与模型', collapsed: false, items: scenarioGuides },
]

const domesticUseSidebar = [
  { text: '国内使用', collapsed: false, items: [mainGuides[3], mainGuides[4], mainGuides[5], issueGuides[0], issueGuides[1], issueGuides[2]] },
  { text: '镜像与安全', collapsed: false, items: serpGuides },
]

const promptSidebar = [
  { text: '提示词与场景', collapsed: false, items: [issueGuides[3], scenarioGuides[0], scenarioGuides[1], scenarioGuides[4]] },
]

const allGuidesSidebar = [
  { text: '官网入口', collapsed: false, items: mainGuides },
  { text: '安全与问题', collapsed: false, items: issueGuides },
  { text: '搜索高频问题', collapsed: false, items: serpGuides },
  { text: '场景与模型', collapsed: false, items: scenarioGuides },
]

export default defineConfig({
  lang: 'zh-CN',
  title: siteTitle,
  titleTemplate: false,
  description: siteDescription,
  srcDir: '.',
  cleanUrls: true,
  lastUpdated: true,
  useWebFonts: false,
  sitemap: {
    hostname: siteUrl,
    lastmodDateOnly: true
  },
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.svg' }],
    ['meta', { name: 'msvalidate.01', content: '283F4ED132291BB65C882E27214A15B8' }],
    ['meta', { name: 'theme-color', content: '#0f766e' }],
    ['meta', { name: 'referrer', content: 'strict-origin-when-cross-origin' }],
    ['meta', { property: 'og:site_name', content: siteTitle }],
    ['meta', { property: 'og:image', content: `${siteUrl}/images/og-chatgpt-guide.png` }],
    ['meta', { property: 'og:image:width', content: '1680' }],
    ['meta', { property: 'og:image:height', content: '900' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }]
  ],
  transformHead({ pageData }) {
    const title = pageTitle(pageData.title)
    const socialTitle = pageData.frontmatter.socialTitle
      ? pageTitle(pageData.frontmatter.socialTitle)
      : title
    const description = pageData.description || siteDescription
    const canonical = pageUrl(pageData.relativePath)

    const isGuide = pageData.relativePath.startsWith('guides/')
    const isNotFound = pageData.relativePath === '404.md'
    const structuredData = buildStructuredData(pageData)

    return [
      ['link', { rel: 'canonical', href: canonical }],
      ...(isNotFound ? ([['meta', { name: 'robots', content: 'noindex,follow' }]] as const) : []),
      ...(pageData.frontmatter.keywords
        ? ([['meta', { name: 'keywords', content: pageData.frontmatter.keywords }]] as const)
        : []),
      ['meta', { property: 'og:url', content: canonical }],
      ['meta', { property: 'og:type', content: isGuide ? 'article' : 'website' }],
      ['meta', { property: 'og:locale', content: 'zh_CN' }],
      ['meta', { property: 'og:title', content: socialTitle }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { name: 'twitter:title', content: socialTitle }],
      ['meta', { name: 'twitter:description', content: description }],
      ['meta', { name: 'twitter:image', content: `${siteUrl}/images/og-chatgpt-guide.png` }],
      ...(!isNotFound ? ([['script', { type: 'application/ld+json' }, structuredData]] as const) : [])
    ]
  },
  themeConfig: {
    logo: {
      src: '/logo.svg',
      alt: 'ChatGPT 独立指南'
    },
    siteTitle,
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            displayDetails: '显示详情',
            resetButtonTitle: '清除',
            backButtonTitle: '关闭',
            noResultsText: '没有找到结果',
            footer: {
              selectText: '选择',
              selectKeyAriaLabel: '回车',
              navigateText: '切换',
              navigateUpKeyAriaLabel: '上箭头',
              navigateDownKeyAriaLabel: '下箭头',
              closeText: '关闭',
              closeKeyAriaLabel: 'Esc'
            }
          }
        }
      }
    },
    nav: [
      { text: '首页', link: '/' },
      { text: '官网入口', link: '/guides/chatgpt-official-entry' },
      { text: '中文版', link: '/guides/chatgpt-chinese' },
      { text: '国内使用', link: '/guides/chatgpt-china-access' },
      { text: '提示词', link: '/guides/chatgpt-prompts' },
      { text: '最新更新', link: '/latest/' },
      { text: '更多指南', link: '/guides/chatgpt-account-register-login' },
      { text: '关于', link: '/about' },
      { text: '隐私声明', link: '/privacy' }
    ],
    sidebar: {
      '/guides/': sortedArticleSidebar
    },
    outline: {
      level: [2, 3],
      label: '本页目录'
    },
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    lastUpdated: {
      text: '最后更新',
      formatOptions: {
        dateStyle: 'medium',
        timeStyle: 'short'
      }
    },
    footer: {
      message: '本站为独立整理的中文 AI 使用指南，不属于 OpenAI 或 ChatGPT 官方网站。',
      copyright: 'Copyright © 2026 chatgpt-official.com'
    }
  }
})
