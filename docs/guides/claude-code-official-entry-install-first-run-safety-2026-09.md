---
title: "Claude Code官方入口：安装前核对、首次运行与权限安全边界【2026年9月】"
description: "讲清 Claude Code 的官方入口到底是哪一个（claude.com/product/claude-code 与 code.claude.com 的关系）、安装前要核对什么、首次运行怎么跑通，以及这个能读写文件、执行命令的智能体工具在权限和数据上的安全边界，帮你避免误装山寨版。"
keywords: "Claude Code,claude code官网,claude code安装,Claude Code CLI,code.claude.com,Anthropic,claude code安装教程,Claude Code权限"
date: "2026-09-03"
updated: "2026-09-03"
outline: deep
faq:
  - question: "Claude Code 的官方入口到底是哪一个？"
    answer: "官方产品页是 claude.com/product/claude-code，官方文档在 code.claude.com，开源仓库在 github.com/anthropics/claude-code。这三处相互印证，其它以“中文站”“一键安装”名义出现的第三方镜像都不是官方入口，请以这三个官方地址为准。"
  - question: "使用 Claude Code 要不要付费？"
    answer: "Claude Code 需要登录 Anthropic 账号后使用，账号与订阅是使用前提。具体套餐、额度和计费方式会随官方调整，本文不列价格，请以 claude.com 登录后的实际页面为准。"
  - question: "原生 Windows 能直接用 Claude Code 吗？"
    answer: "官方文档说明原生 Windows 上推荐安装 Git for Windows，这样 Claude Code 才能使用 Bash 工具。具体前置依赖以 code.claude.com/docs 的“概述”与“快速开始”为准。"
  - question: "Claude Code 会不会随意改我的文件、跑我的命令？"
    answer: "Claude Code 是能读代码、改文件、执行命令的智能体工具，但按官方权限模型，敏感或有风险的操作会请求你确认。真正的安全边界取决于你在哪个目录运行它、授予了什么权限，建议只在具体项目目录里运行，别把家目录或含密钥的目录整个暴露给它。"
  - question: "Claude Code 能离线使用吗？"
    answer: "不能。它需要联网调用 Anthropic 的模型服务，也需要先登录账号。此外 Anthropic 有地区可用性限制，若看到 app-unavailable-in-region 提示，说明当前地区暂不在支持范围内。"
  - question: "Claude Code 和 Codex CLI 有什么区别？"
    answer: "两者都是终端里的编程智能体，能读写项目文件、执行命令。Claude Code 由 Anthropic 提供、基于 Claude 模型；Codex 由 OpenAI 提供、基于其模型。选择主要看你已有的账号、订阅和模型偏好，本文不做排名断言。"
productPromo: "manual"
lastUpdated: 2026-09-03
---

# Claude Code官方入口：安装前核对、首次运行与权限安全边界【2026年9月】

最后更新：2026-09-03

<div class="product-recommend-box seo-product-promo">

<p class="product-recommend-title">国内 Claude 与多模型 AI 平台推荐</p>

<p>国内使用 Claude、长文本写作或多模型工具时，可以按任务选择以下第三方平台：</p>

<ul>
  <li>
    <strong>🔥 国内直连/全能多模型（SnakeGPT）：</strong>
    <a href="https://share.snakegpt.vip/" target="_blank" rel="nofollow sponsored noopener noreferrer">snakegpt.vip</a>
    <span>据平台提供信息已运营三年；平台标称支持 GPT-5.6、Claude 5.0、Gemini 3.1 Pro、Grok 4.5 与 GPT-Image-2，无需翻墙。</span>
  </li>
  <li>
    <strong>🎨 多模型/多种绘图（GPTCat）：</strong>
    <a href="https://share.gptcat.cc/" target="_blank" rel="nofollow sponsored noopener noreferrer">gptcat.cc</a>
    <span>平台标称支持 GPT、Claude、Gemini、DeepSeek、Grok，以及 MJ、Nano Banana 与 GPT-Image-2 绘图。</span>
  </li>
</ul>

<p class="product-recommend-disclosure">以上均为邀请链接（仅指产品入口）；SnakeGPT 与 GPTCat 均为第三方服务，不是相关模型厂商的官方网站或官方产品；所列套餐、额度、型号与能力来自平台标称，具体功能与可用性以登录后的实际页面为准。请勿上传账号密码、API Key、合同或其他敏感资料。</p>

</div>

本文根据 Anthropic 官方产品页与文档整理，会随官方调整持续核对。

本站为独立教程博客，并非 Anthropic 或相关模型厂商的官方网站，也不提供 AI 模型对话功能。文中官方地址请以浏览器直接访问核验为准，手机或电脑上使用 Claude Code 均指打开官方产品或官方文档指引的方式，不是在本博客站内运行模型。

先给结论：Claude Code 的官方入口只有三个相互印证的地址——产品页 [claude.com/product/claude-code](https://claude.com/product/claude-code)、官方文档 [code.claude.com](https://code.claude.com/docs/zh-CN/overview)、开源仓库 [github.com/anthropics/claude-code](https://github.com/anthropics/claude-code)。安装前先核对平台与依赖（原生 Windows 需 Git for Windows）、账号与地区可用性；首次运行时进入具体项目目录、登录授权、发出第一条指令；最重要的是理解它的权限边界：这是一个能读写文件、执行命令的智能体，务必按最小权限运行，别把敏感目录整个交给它。

## Claude Code 是什么：能动手的编程智能体

Claude Code 是 Anthropic 面向开发者推出的“智能体编程”（agentic coding）工具。和网页版 Claude 只在对话框里聊天不同，Claude Code 直接跑在你的终端里，能读取整个代码库、编辑文件、执行命令，并根据你的指令完成多步骤的开发任务。官方产品页把它定位为“理解你的代码库、编辑文件、运行命令”的 AI 编程助手。

按官方文档说明，除了终端 CLI，Claude Code 也能在网页、桌面应用、VS Code 和 JetBrains 等 IDE、Slack 中使用，并可通过 GitHub 集成。本文主要讲最常见的终端 CLI 入口和首次跑通流程。

这里要划清一条边界：Claude Code 的强大之处正是它能“动手”，而这也意味着它比普通聊天工具需要更谨慎的权限管理。理解这一点，是安全使用的前提。

## 官方入口核验：三个地址相互印证

搜索 “Claude Code 官网”“claude code 安装”时，结果里会混进大量第三方“中文站”“一键安装”页面。判断真假的方法很简单：只认下面三个官方地址，并让它们相互印证。

| 用途 | 官方地址 | 说明 |
| --- | --- | --- |
| 产品介绍 | https://claude.com/product/claude-code | Anthropic 官方产品页，介绍功能与定位 |
| 官方文档 | https://code.claude.com/docs/zh-CN/overview | 概述、安装、权限等权威说明（含中文） |
| 快速开始 | https://code.claude.com/docs/zh-CN/quickstart | 首次安装与运行的官方步骤 |
| 开源仓库 | https://github.com/anthropics/claude-code | Anthropic 官方 GitHub 仓库 |
| 账号与登录 | https://claude.com/ | Anthropic 账号登录入口 |

辨别山寨镜像的几个信号：

- 域名不是 `claude.com`、`code.claude.com` 或 `github.com/anthropics`，而是 `claude-zh.cn`、`claude-*.com` 等第三方后缀。
- 页面主打“一键安装脚本”“免登录直连”“配置自定义 API 服务”，却回避官方账号与授权流程。
- 让你先填手机号、支付信息，或下载来路不明的安装包。

只要访问的不是上面三个官方地址，就把它当作第三方资源看待——可以参考，但不要把它当作官方事实或授权来源。

## 安装前核对清单

在动手安装前，先花两分钟核对下面几项，能省掉后面大量排错时间。

- 操作系统：官方支持 macOS、Linux；原生 Windows 上，官方文档明确推荐安装 Git for Windows，这样 Claude Code 才能使用 Bash 工具。若不装，部分功能会受限。
- 运行环境：Claude Code 以 CLI 形式安装，需要基础的命令行环境。具体安装方式与前置依赖以 [code.claude.com/docs/zh-CN/quickstart](https://code.claude.com/docs/zh-CN/quickstart) 为准。
- 账号与订阅：使用 Claude Code 需要登录 Anthropic 账号，账号与订阅是使用前提。套餐、额度会随官方调整，本文不列价格。
- 地区可用性：Anthropic 有地区限制。若登录或使用时看到 [app-unavailable-in-region](https://claude.com/app-unavailable-in-region) 提示，说明当前地区暂不在官方支持范围内。
- 项目准备：想清楚要在哪个项目目录里运行它，避免直接在家目录或系统根目录启动（原因见后文权限章节）。

如果你更熟悉 OpenAI 的工具链，安装前的环境核对思路是相通的，可以对照 [Codex CLI怎么安装？npm安装、Windows/macOS配置与国内使用核对](/guides/codex-cli-install-npm-windows-macos-china-guide-2026-08) 里的环境准备部分。

## 地区与账号前置：先确认能登录

Claude Code 需要联网调用 Anthropic 的模型服务，也需要先登录账号，所以它无法离线使用。两个前置一定要先确认：

一是账号能不能正常登录。登录入口是官方 [claude.com](https://claude.com/)，支持 Google、邮箱等方式。如果账号本身登录不上，Claude Code 自然也授权不了。

二是地区是否可用。Anthropic 官方的 app-unavailable-in-region 页面写得很直接：“Claude 目前只在特定地区可用”，并提供“查看支持的国家/地区”入口。如果你确认自己应在支持范围内却仍看到该提示，官方建议联系支持。遇到这个提示时，问题通常出在网络出口所在地区，而不是 Claude Code 本身装错了。

## 首次安装：只认官方方法

安装环节请严格按官方 [快速开始](https://code.claude.com/docs/zh-CN/quickstart) 执行。官方会给出对应平台的 CLI 安装方式，这里说方法不编造命令输出：

1. 打开官方快速开始文档，选择你的平台（macOS / Linux / 原生 Windows）。
2. 原生 Windows 用户先确认已安装 Git for Windows。
3. 按官方文档给出的安装方式安装 Claude Code CLI。
4. 安装完成后，用官方文档指引的方式验证是否安装成功（例如查看版本信息）。

验证安装是否成功的自查点：命令能被识别、能返回版本信息、能进入登录/授权流程。如果命令找不到，多半是安装路径没进入系统的可执行搜索路径，或安装步骤没走完，回到官方文档重新核对即可。

不要从第三方“一键脚本”安装来路不明的版本。安装脚本会在你机器上执行命令，来源不明的脚本本身就是安全风险。

## 首次运行跑通：三步进入工作状态

装好之后，第一次跑通只需三步。核心是：先进对目录，再登录授权，最后发出第一条指令。

1. 进入项目目录。先在终端里 `cd` 到你要处理的具体项目文件夹，而不是在家目录或磁盘根目录启动。Claude Code 会以当前目录为工作范围。
2. 登录授权。首次运行时会引导你登录 Anthropic 账号并完成授权。按提示在浏览器完成登录即可。
3. 发出第一条指令。授权后，用自然语言描述你的需求，例如“看看这个项目是做什么的”“帮我修复这个报错”。它会读取相关文件、给出方案，涉及改文件或执行命令时会按权限设置请求确认。

第一次运行时会发生什么，可以有个心理预期：它会先扫描当前目录、理解项目结构，然后围绕你的指令行动。真正动手改动前，风险性操作通常需要你点头。这也是为什么“在哪个目录启动”这么关键。

## 权限与安全边界：把它关在正确的房间里

这是全篇最该认真读的部分。Claude Code 能读写文件、执行命令，安全边界主要由你决定，而不是工具默认帮你兜底。

按官方权限模型，Claude Code 对敏感或有风险的操作会请求确认，但这并不等于你可以随便在任意目录运行它。几条实用原则：

- 最小目录范围：只在具体项目目录里启动，不要在家目录（`~`）、桌面或磁盘根目录运行，避免它把无关文件都纳入工作范围。
- 隔离敏感目录：含有密钥、证书、`.env`、生产配置、私人文档的目录，不要暴露给它。需要时把项目和敏感资料分开存放。
- 认真对待确认提示：当它请求执行命令或改动文件时，看清楚要做什么再确认，尤其是删除、批量修改、拉取远程内容这类操作。
- 密钥处理原则：不要把真实 API Key、Token 直接写进对话或让它明文写进文件。示例里一律用 `<YOUR_API_KEY>` 这类占位符。密钥安全的做法可参考 [OpenAI API Key怎么保存才安全？环境变量、.env、GitHub泄露与撤销轮换指南](/guides/openai-api-key-env-github-leak-revoke-rotate-security-20260826)，思路对任何厂商都通用。
- 版本控制兜底：在有 Git 的项目里运行，任何误改都能通过 diff 和回滚找回，这是最实用的安全网。

一句话总结：Claude Code 越强，你越要主动收窄它的活动范围。别指望默认设置替你承担所有风险。

## 数据与隐私：先看官方说明再决定共享什么

Claude Code 会把相关代码和上下文发送到 Anthropic 的模型服务以完成任务，所以“共享什么”需要你有意识地控制。关于使用数据与反馈收集的具体说明，请以 [claude.com](https://claude.com/) 的隐私政策和 [官方文档](https://code.claude.com/docs/zh-CN/overview) 为准，这些条款会随官方更新，不要凭记忆或第三方转述当作事实。

几点实操建议：

- 个人使用：避免把含个人隐私、密钥、合同的目录纳入工作范围。
- 团队/企业使用：数据处理、留存和合规要求通常和个人版不同，落地前先让团队核对官方条款与所选套餐的说明。
- 谨慎表述：涉及“数据是否用于训练”“留存多久”这类问题，以官方最新政策为准，本文不替官方下结论。

## Claude Code 与 Codex CLI 等编程智能体的定位差异

如果你在几款终端编程智能体之间纠结，可以先看清定位，再按已有账号和模型偏好选，而不是看谁“更强”。

| 维度 | Claude Code | Codex CLI |
| --- | --- | --- |
| 提供方 | Anthropic | OpenAI |
| 底层模型 | Claude 系列 | OpenAI 模型 |
| 官方入口 | claude.com / code.claude.com | chatgpt.com/codex、openai.com |
| 核心形态 | 终端 CLI，兼有 IDE、网页等 | 终端 CLI，兼有桌面 App |
| 选择依据 | 已有 Anthropic 账号/偏好 Claude | 已有 OpenAI 账号/偏好其模型 |

这只是选择参考，不是排名断言。想了解 Codex 一侧的入口与安装，可以看 [Codex官网入口网页版：OpenAI Codex、ChatGPT、CLI与桌面App地址核验](/guides/openai-codex-official-entry-cli-cloud-2026-06) 和 [Codex下载：OpenAI Codex官方下载地址、Windows/macOS安装与真假辨别](/guides/codex-download-official-address-windows-macos-verify-2026-09)。想横向对比不同模型的能力取向，可参考 [ChatGPT、Claude、Gemini、Grok、DeepSeek 对比](/guides/chatgpt-models-comparison)。

## 首次运行常见问题排查

第一次跑不通，多半集中在下面几类，按定位思路逐一排查即可。

- 登录/授权失败：先确认 [claude.com](https://claude.com/) 账号本身能正常登录。授权环节要在浏览器里完成回调，若卡在回调页，检查是否被拦截或超时，重新发起授权。类似的 OAuth 回调排查思路可对照 [Codex CLI登录不上怎么办？OAuth回调、API Key、代理与项目目录排查](/guides/codex-cli-login-oauth-callback-api-key-proxy-troubleshoot-20260826)。
- 地区不可用：看到 app-unavailable-in-region 提示，说明当前地区不在支持范围，问题在网络出口地区，不是安装错误。
- 权限被拒 / 命令不执行：确认你是在有权限的目录里运行，且没有把它放在受系统保护的路径下。
- 找不到项目目录：先 `cd` 到目标项目再启动 Claude Code，确认当前工作目录就是你要处理的项目。
- 命令找不到（command not found）：安装没走完，或可执行文件路径没进入系统搜索路径，回到官方快速开始重新核对安装步骤。

排查时的通用原则：一次只改一个变量，先确认账号和地区这两个前置，再看目录和权限，最后才怀疑安装本身。

## 常见问题

问：Claude Code 的官方入口到底是哪一个？
答：官方产品页是 claude.com/product/claude-code，官方文档在 code.claude.com，开源仓库在 github.com/anthropics/claude-code。这三处相互印证，其它以“中文站”“一键安装”名义出现的第三方镜像都不是官方入口。

问：使用 Claude Code 要不要付费？
答：需要登录 Anthropic 账号后使用，账号与订阅是使用前提。具体套餐、额度和计费会随官方调整，本文不列价格，请以 claude.com 登录后的实际页面为准。

问：原生 Windows 能直接用吗？
答：官方文档说明原生 Windows 上推荐安装 Git for Windows，这样才能使用 Bash 工具。具体前置依赖以 code.claude.com/docs 的“概述”与“快速开始”为准。

问：Claude Code 会不会随意改我的文件、跑我的命令？
答：它是能读写文件、执行命令的智能体，但按官方权限模型，风险操作会请求确认。真正的安全边界取决于你在哪个目录运行、授予了什么权限，建议只在具体项目目录里运行。

问：能离线使用吗？
答：不能。它需要联网调用 Anthropic 的模型服务，也需要先登录账号，且受地区可用性限制。

问：Claude Code 和 Codex CLI 怎么选？
答：两者都是终端编程智能体，能读写项目文件、执行命令。Claude Code 由 Anthropic 提供、基于 Claude；Codex 由 OpenAI 提供、基于其模型。按已有账号、订阅和模型偏好选即可，本文不做排名断言。

## 结语：先核验官方入口，再按最小权限运行

Claude Code 值得用好，但顺序不能乱：第一步永远是核验官方入口——只认 claude.com/product/claude-code、code.claude.com 和 github.com/anthropics/claude-code；第二步核对平台、账号与地区；第三步进对目录、登录授权、跑通第一条指令；第四步、也是最关键的一步，按最小权限运行，把敏感目录和密钥挡在外面。把这条判断链走完，你既能享受智能体编程的效率，也能守住数据和文件的安全边界。
