---
title: "Codex CLI怎么安装？npm安装、Windows/macOS配置与国内使用核对【2026年8月】"
description: "面向开发者的 Codex CLI 安装与配置核对指南：区分 Codex CLI 与桌面 App、IDE 扩展，给出 npm/官方脚本安装、Windows 与 macOS/Linux 步骤、登录鉴权方式、国内网络排查与安全提示，全部以 OpenAI 官方仓库和文档为准。"
keywords: "Codex CLI,codex cli 安装,codex cli 教程,openai codex 终端,codex cli windows,codex cli 登录,codex cli 国内"
date: "2026-08-20"
updated: "2026-08-20"
outline: deep
faq:
  - question: "Codex CLI 的官方安装渠道是什么？"
    answer: "OpenAI 的 Codex CLI 是开源项目，官方源码与安装说明集中在 GitHub 仓库 https://github.com/openai/codex，官方产品说明可参考 https://openai.com/codex/。常见做法是通过 npm 全局安装 @openai/codex，也可用官方提供的其他包管理方式。具体命令、包名与支持平台以仓库 README 当前版本为准，不要从来路不明的第三方站点下载所谓“完整版”。"
  - question: "在 Windows 上能直接用 Codex CLI 吗？"
    answer: "可以。根据官方文档，Codex CLI 支持 macOS、Windows 和 Linux。在 Windows 上通常可以在 PowerShell 中原生运行，或结合 WSL 使用类 Linux 环境。安装前需要先装好 Node.js（用于 npm 安装方式），安装后把可执行文件所在目录加入 PATH，重开终端再验证 codex 命令。"
  - question: "Codex CLI 登录需要什么账号或订阅？"
    answer: "Codex CLI 一般支持用 ChatGPT 账号登录，或使用 OpenAI API Key 进行鉴权。哪些订阅层级（如 Plus、Pro、Business）可用、额度如何计算属于易变化信息，请以 https://help.openai.com/ 帮助中心与登录后的实际提示为准，本文不做承诺。"
  - question: "国内网络下 Codex CLI 连不上怎么办？"
    answer: "先确认网络能正常访问 OpenAI 相关服务，再检查代理是否对终端生效（很多代理只作用于浏览器）。可通过设置 HTTPS_PROXY 等环境变量让命令行走代理，并到 https://status.openai.com/ 查看 Codex 组件是否正常。若登录回调打不开，多为浏览器或回调地址被拦截。"
  - question: "Codex CLI 和桌面 App、VS Code 扩展有什么区别？"
    answer: "它们是同一 Codex 编程能力的不同入口：CLI 在终端运行，适合脚本化和服务器环境；桌面 App 与 IDE 扩展提供图形界面和编辑器内联体验。选择哪种取决于你的工作流，官方渠道核验可参考站内《Codex官网入口》一文。"
  - question: "为什么不建议用第三方“Codex 破解版/完整版”？"
    answer: "这类安装包可能捆绑恶意代码、窃取你的 API Key 或账号凭证，也无法获得官方更新。Codex CLI 本身是开源免费的，应始终从 GitHub 官方仓库或官方包管理渠道获取，不要为“免登录”“免费额度”下载不明来源的可执行文件。"
productPromo: "manual"
lastUpdated: 2026-08-20
---

# Codex CLI怎么安装？npm安装、Windows/macOS配置与国内使用核对【2026年8月】

最后更新：2026-08-20

<div class="product-recommend-box seo-product-promo">

<p class="product-recommend-title">国内 Codex 与多模型 API 开发工具推荐</p>

<p>国内进行 Codex、代码、脚本或多模型 API 开发时，可以按任务选择以下第三方工具：</p>

<ul>
  <li>
    <strong>💻 Codex/编程训练（ZeoGPT）：</strong>
    <a href="https://www.zeogpt.com/register?ref=MRNWDKC3" target="_blank" rel="nofollow sponsored noopener noreferrer">zeogpt.com</a>
    <span>Codex、代码、长文本和开发任务。</span>
  </li>
  <li>
    <strong>🔌 API/脚本接入（ZeoAPI）：</strong>
    <a href="https://www.zeoapi.com/register?aff=Pe3N" target="_blank" rel="nofollow sponsored noopener noreferrer">zeoapi.com</a>
    <span>多模型 API 接入、脚本和原型测试。</span>
  </li>
</ul>

<p class="product-recommend-disclosure">以上均为邀请链接。ZeoGPT 与 ZeoAPI 均为第三方服务，不是相关模型厂商的官方网站或官方产品；所列型号与能力来自平台标称，具体功能与可用性以登录后的实际页面为准。请勿上传账号密码、API Key、合同或其他敏感资料。</p>

</div>

本站为独立教程博客，并非 OpenAI 或 Codex 的官方网站，也不提供 AI 模型对话功能。手机版所说的“使用”均指打开对应产品或官方网站，而不是在本博客站内运行模型。

直接回答：Codex CLI 是 OpenAI 推出的开源终端编程智能体，官方源码在 GitHub 仓库 [github.com/openai/codex](https://github.com/openai/codex)。最常见的安装方式是先装好 Node.js，再用 npm 全局安装（命令形如 `npm install -g @openai/codex`），也可按仓库说明使用其他包管理方式；它支持 macOS、Windows 和 Linux。安装后运行 `codex` 命令，用 ChatGPT 账号或 OpenAI API Key 登录即可。由于命令、包名、订阅要求会随版本变化，安装前请以官方仓库 README 与 [openai.com/codex/](https://openai.com/codex/) 的当前说明为准。

## Codex CLI 是什么：终端里的编程智能体

Codex CLI 是一个跑在命令行里的 AI 编程助手。和在网页里聊天不同，它能读取你当前目录的代码、按你的指令修改文件、运行命令并根据结果继续迭代，属于“智能体（agent）”式的编程工具。它适合这几类场景：

- 在服务器或没有图形界面的环境里让 AI 协助改代码、跑测试。
- 把 AI 编程动作写进脚本或 CI 流程，做可重复的自动化。
- 习惯键盘和终端的开发者，不想在浏览器和编辑器之间来回切换。

需要先建立一个概念：Codex 不是单一产品，而是 OpenAI 一组编程入口的统称，包含终端里的 CLI、云端任务、桌面/IDE 内的体验等多种形态。本文只聚焦 CLI 的安装与配置。想先厘清各入口的官方渠道，可以看站内的《[Codex官网入口：chatgpt.com/codex、CLI与桌面App官方渠道核验清单](/guides/openai-codex-official-entry-cli-cloud-2026-06)》。

## 官方下载渠道核对：先认准这几个入口

安装任何 AI 工具，第一步都是确认渠道。Codex CLI 是开源项目，唯一权威的源码位置是 GitHub 官方仓库，配套说明分布在 OpenAI 的产品页和帮助中心。以下是建议用来核对的官方入口，请自行打开复核当前信息：

- 源码与安装说明：[https://github.com/openai/codex](https://github.com/openai/codex)
- 产品介绍页：[https://openai.com/codex/](https://openai.com/codex/)
- 帮助中心（含 Codex 分类，可切换中文）：[https://help.openai.com/](https://help.openai.com/) 与 [https://help.openai.com/zh-hans-cn](https://help.openai.com/zh-hans-cn)
- 服务状态（含 Codex 组件）：[https://status.openai.com/](https://status.openai.com/)

需要提醒的是：搜索结果里有大量看似“官方文档”的第三方镜像域名（例如带 ac.cn、cnblog 之类后缀的站点），它们不是 OpenAI 官方渠道，内容可能滞后或掺入推广。判断真假时，以上述 github.com 与 openai.com 官方域名为准。

## Windows 安装：npm 与 PowerShell 运行

Windows 上安装 Codex CLI 最常见的路径是通过 npm。步骤如下：

1. 安装 Node.js。到 Node.js 官网下载 LTS 版本安装，安装完成后在 PowerShell 里执行 `node -v` 和 `npm -v` 确认可用。Codex CLI 对 Node 版本可能有最低要求，若安装时报版本过低，请按仓库 README 指定的版本升级。
2. 全局安装 Codex CLI。在 PowerShell 中执行官方文档给出的安装命令（当前常见形式为 `npm install -g @openai/codex`）。以仓库 README 的最新命令与包名为准。
3. 检查 PATH。npm 全局安装的可执行文件会放在 npm 全局目录下。如果安装后提示 `codex` 不是可识别的命令，通常是该目录没进 PATH，或者终端没重开。执行 `npm config get prefix` 查看全局路径，把对应目录加入系统环境变量 PATH，然后关闭并重新打开 PowerShell。
4. 首次运行与登录。在项目目录下执行 `codex`，按提示完成登录（详见下文鉴权一节）。

根据官方文档，Windows 上可以在 PowerShell 中原生运行 Codex，也可以结合 Windows 沙盒 / WSL 使用类 Linux 环境。如果你在原生 Windows 上遇到路径、权限或 shell 兼容问题，切换到 WSL 往往更省心。

## macOS 与 Linux 安装步骤

macOS 与 Linux 的思路一致，同样以 npm 为主，部分平台可用包管理器：

1. 准备 Node.js。macOS 可用 Homebrew（`brew install node`）或官方安装包；Linux 建议用发行版包管理器或 nvm 管理 Node 版本。装好后 `node -v`、`npm -v` 验证。
2. 全局安装：`npm install -g @openai/codex`（以仓库 README 为准）。如果安装到系统目录时报权限错误，优先用 nvm 之类的版本管理器把 Node 装到用户目录，避免直接 `sudo` 全局装包。
3. 若官方仓库提供了 Homebrew 等其他安装方式，也可按 README 选择更顺手的一种，不要混用多个渠道以免版本冲突。
4. 验证：新开终端执行 `codex --help`，能看到帮助信息即安装成功。

下面这张表帮你快速对照三个平台的关键点：

| 平台 | 前置条件 | 主要安装方式 | 常见坑 |
| --- | --- | --- | --- |
| Windows | Node.js（LTS） | `npm install -g @openai/codex`；可选 WSL | PATH 未更新、终端未重开、原生 shell 兼容性 |
| macOS | Node.js（Homebrew/官方包） | npm 全局安装；可选官方其他渠道 | 权限报错，建议用 nvm 装 Node |
| Linux | Node.js（nvm/包管理器） | npm 全局安装 | 全局目录权限、缺少构建依赖 |

表中的命令为常见形式，实际以官方仓库当前 README 为准。

## 登录与鉴权配置：账号或 API Key

装好之后，Codex CLI 需要鉴权才能调用模型。官方一般支持两类方式：

- 用 ChatGPT 账号登录：首次运行 `codex` 时会引导你在浏览器完成授权，回到终端即可继续。这种方式适合已有 ChatGPT 订阅的用户。哪些订阅层级可用、每类账号的额度与限制属于易变化信息，请以 [help.openai.com](https://help.openai.com/) 与登录后的实际页面为准。
- 用 OpenAI API Key 鉴权：适合走 API 计费、脚本化或团队环境。把密钥配置到环境变量后由 CLI 读取。示例：

```bash
## 仅为示例，请勿把真实密钥写进公开脚本或提交到仓库
export OPENAI_API_KEY="<YOUR_API_KEY>"
codex
```

安全提醒：API Key 等同于账单权限，绝不要硬编码进代码、粘贴到聊天工具或截图里。建议用环境变量或密钥管理工具存放，并定期轮换。关于国内如何申请与安全使用 API Key，可参考站内的《[ChatGPT API国内怎么调用：API Key、价格、ZeoAPI中转和安全配置](/guides/chatgpt-api-domestic-call-key-price-zeoapi-2026)》以及《[ChatGPT 官网注册登录教程](/guides/chatgpt-account-register-login)》。

## 国内网络受限时的连接排查

国内环境下最常见的问题不是安装失败，而是安装完却连不上。按下面顺序排查：

1. 确认基础网络。先在浏览器里能正常打开 OpenAI 相关服务，再回到终端。若浏览器都打不开，问题在网络层，可先看《[ChatGPT 国内怎么使用](/guides/chatgpt-china-access)》和《[ChatGPT官网打不开的原因](/guides/chatgpt-official-website-cannot-open)》。
2. 让代理对命令行生效。很多代理只作用于浏览器，终端不会自动走代理。可临时设置环境变量：

```bash
## macOS / Linux 示例
export HTTPS_PROXY="http://127.0.0.1:7890"
export HTTP_PROXY="http://127.0.0.1:7890"
```

Windows PowerShell 里用 `$env:HTTPS_PROXY="http://127.0.0.1:7890"` 设置，端口以你的代理软件为准。

3. 登录回调打不开。用 ChatGPT 账号登录时会跳浏览器，如果回调地址（多为 localhost 端口）被拦截或占用，会卡在授权步骤。检查是否有防火墙/安全软件拦截该端口，必要时换用 API Key 方式。
4. 查服务状态。到 [status.openai.com](https://status.openai.com/) 看 Codex 组件是否正常。若是官方侧故障，等待恢复即可，别反复重装。排查思路也可参考《[OpenAI官网入口：ChatGPT服务状态怎么看](/guides/chatgpt-status-page-local-troubleshoot-20260713)》。

## Codex CLI 与桌面 App、IDE 扩展的区别

同样是 Codex 能力，入口不同，适用场景也不同：

| 形态 | 运行位置 | 适合谁 |
| --- | --- | --- |
| Codex CLI | 终端 / 命令行 | 喜欢脚本化、服务器环境、无图形界面场景 |
| 桌面 App | 独立客户端 | 想要图形界面、任务管理与可视化的用户 |
| IDE / VS Code 扩展 | 编辑器内 | 希望在写代码时内联调用、直接改当前文件的开发者 |

如果你主要在编辑器里写代码，扩展或桌面 App 可能更顺手；如果要接自动化流程、跑在远端机器上，CLI 更合适。想了解 Codex 与 ChatGPT 内“Work / Agent”能力的关系，可以看《[ChatGPT Work 是什么？Agent 为什么不见了、怎么用与 Codex 区别](/guides/chatgpt-work-agent-mode-guide-20260728)》；想先用网页版打好写代码的基础，可参考《[ChatGPT 写代码教程](/guides/chatgpt-coding)》。

## 安装避坑清单：常见错误与对策

- 从第三方站点下载“Codex 完整版/破解版 exe”：Codex CLI 是开源免费的，正确做法是 GitHub 官方仓库或官方包渠道。不明来源的安装包有捆绑木马、盗取密钥的风险。
- `codex: command not found` / 不是可识别命令：PATH 没更新或终端没重开。检查 npm 全局目录并加入 PATH。
- Node 版本过低导致安装或运行报错：按仓库 README 指定版本升级 Node，推荐用 nvm 管理多版本。
- 直接 `sudo npm install -g`：容易造成权限混乱，建议改用 nvm 把 Node 装到用户目录。
- 代理只配了浏览器：命令行需要单独设置 `HTTPS_PROXY` / `HTTP_PROXY`。
- 把 API Key 写进代码或提交到仓库：务必用环境变量存放，泄露后立即在官方后台吊销并轮换。
- 混用多个安装渠道：npm、Homebrew 各装一份会导致版本冲突，选定一种并保持更新。

## 事实边界与免责说明

本文所写的安装命令、支持平台、登录方式来自 OpenAI 官方仓库与文档的公开信息，但 Codex CLI 更新频繁，具体包名、命令参数、Node 版本要求、可用订阅层级与地区可用性都可能变化。上文提供的官方链接是供你复核的入口，不代表本文已逐条验证到最新版本。涉及订阅、额度、价格与地区限制的问题，请以官方页面和你账号登录后的实际显示为准。本站是独立教程博客，不隶属于 OpenAI，也不提供模型对话或代下载服务。

## 常见问题

问：Codex CLI 的官方安装渠道是什么？
答：OpenAI 的 Codex CLI 是开源项目，官方源码与安装说明集中在 GitHub 仓库 https://github.com/openai/codex，官方产品说明可参考 https://openai.com/codex/。常见做法是通过 npm 全局安装 @openai/codex，也可按仓库说明使用其他包管理方式。具体命令、包名与支持平台以仓库 README 当前版本为准，不要从来路不明的第三方站点下载所谓“完整版”。

问：在 Windows 上能直接用 Codex CLI 吗？
答：可以。根据官方文档，Codex CLI 支持 macOS、Windows 和 Linux。在 Windows 上通常可以在 PowerShell 中原生运行，或结合 WSL 使用类 Linux 环境。安装前需要先装好 Node.js（用于 npm 安装方式），安装后把可执行文件所在目录加入 PATH，重开终端再验证 codex 命令。

问：Codex CLI 登录需要什么账号或订阅？
答：Codex CLI 一般支持用 ChatGPT 账号登录，或使用 OpenAI API Key 进行鉴权。哪些订阅层级（如 Plus、Pro、Business）可用、额度如何计算属于易变化信息，请以 https://help.openai.com/ 帮助中心与登录后的实际提示为准，本文不做承诺。

问：国内网络下 Codex CLI 连不上怎么办？
答：先确认网络能正常访问 OpenAI 相关服务，再检查代理是否对终端生效（很多代理只作用于浏览器）。可通过设置 HTTPS_PROXY 等环境变量让命令行走代理，并到 https://status.openai.com/ 查看 Codex 组件是否正常。若登录回调打不开，多为浏览器或回调地址被拦截。

问：Codex CLI 和桌面 App、VS Code 扩展有什么区别？
答：它们是同一 Codex 编程能力的不同入口：CLI 在终端运行，适合脚本化和服务器环境；桌面 App 与 IDE 扩展提供图形界面和编辑器内联体验。选择哪种取决于你的工作流，官方渠道核验可参考站内《Codex官网入口》一文。

问：为什么不建议用第三方“Codex 破解版/完整版”？
答：这类安装包可能捆绑恶意代码、窃取你的 API Key 或账号凭证，也无法获得官方更新。Codex CLI 本身是开源免费的，应始终从 GitHub 官方仓库或官方包管理渠道获取，不要为“免登录”“免费额度”下载不明来源的可执行文件。
