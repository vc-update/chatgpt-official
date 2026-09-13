---
title: "ChatGPT Work 是什么？Agent 为什么不见了、怎么用与 Codex 区别【2026年7月更新】"
description: "ChatGPT Work 是什么？本文根据 OpenAI 当前帮助文档说明 ChatGPT Agent 为什么不见了、Work 怎么用、与 Chat、Codex、Cloud Browser 的区别及安全边界。"
date: 2026-07-28
updated: 2026-07-28
lastUpdated: 2026-07-28
outline: deep
head:
  - - meta
    - name: keywords
      content: "ChatGPT Work,ChatGPT Agent不见了,ChatGPT Agent怎么用,ChatGPT Work怎么用,ChatGPT Work和Codex区别"
---

# ChatGPT Work 是什么？Agent 为什么不见了、怎么用与 Codex 区别【2026年7月更新】

更新时间：2026年7月28日

如果你今天还在搜索“ChatGPT Agent 怎么用”，最重要的结论是：**OpenAI 当前帮助文档已经说明，ChatGPT Agent 不再作为独立入口提供，较长的多步骤任务和成品交付转由 ChatGPT Work 承担；需要操作公开网页时，则可能使用 Cloud Browser。**

这不是简单改名。ChatGPT 现在把快速对话、通用长任务、代码任务和网页操作拆成了更清晰的工作方式。旧教程里要求选择 Agent 或输入 `/agent` 的步骤，可能已经不适用于当前界面。

> 独立声明：本站不是 OpenAI 或 ChatGPT 官方网站。功能名称、套餐权限和界面仍可能分批变化，请以你的 ChatGPT 页面和 OpenAI 当前帮助文档为准。

## 一句话区分 Chat、Work、Codex 和 Cloud Browser

| 功能 | 主要用途 | 适合任务 | 关键边界 |
| --- | --- | --- | --- |
| Chat | 快速对话与日常协助 | 问答、搜索、头脑风暴、改写 | 更强调即时交互 |
| Work | 较长的多步骤任务与成品交付 | 研究、文档、表格、PPT、报告、Site | 需要明确目标、资料和验收标准 |
| Codex | 软件开发与技术任务 | 写代码、调试、运行测试、审查改动 | 面向项目、仓库和开发工具 |
| Cloud Browser | 操作受支持的公开网页 | 查询库存、比较公开信息、填写部分公开表单 | 当前不能登录网站或完成付款 |

简单说：只想问一个问题，用 Chat；希望 AI 研究资料并交付一个完整结果，用 Work；要改代码和跑测试，用 Codex；需要在公开网页上查找或操作，再看 Cloud Browser 是否能完成。

## ChatGPT Agent 为什么不见了？

截至 2026 年 7 月 28 日，OpenAI 的 ChatGPT Agent 帮助页在概览中直接写明：Agent 已不再单独提供，长时间、多步骤任务和完成式交付改用 ChatGPT Work，受支持的浏览器工作流查看 Cloud Browser。

因此，遇到以下情况时不要反复寻找旧按钮：

- 工具菜单里没有 Agent；
- 输入 `/agent` 没有出现旧入口；
- 旧文章中的套餐次数、入口截图与当前界面不一致；
- 桌面端出现 Chat、Work、Codex，而不是以前的 Agent 模式。

更稳妥的做法是先看页面顶部或模式选择器里是否有 **Work**，再根据任务是否涉及代码或网页操作决定是否切换 Codex 或允许 Cloud Browser。

## ChatGPT Work 怎么用？

### 1. 先写“交付物”，不要只写主题

Work 更适合接收结果明确的任务。相比“研究新能源汽车”，下面这种写法更容易得到可检查的成品：

```text
研究 2026 年中国新能源汽车市场的公开资料，输出一份 10 页汇报 PPT：
1. 受众是公司管理层；
2. 先给结论，再给数据与来源；
3. 每页包含标题、3-5 个要点和建议图表；
4. 不使用无法核验的数字；
5. 交付前检查重复内容、过时资料和引用链接。
```

### 2. 补齐资料、限制和验收标准

一个可靠的 Work 任务通常包含四部分：

| 部分 | 应该写什么 |
| --- | --- |
| 目标 | 最终要解决什么问题 |
| 输入 | 文件、链接、背景信息、已有材料 |
| 限制 | 字数、时间范围、语言、不能使用的内容 |
| 验收 | 格式、引用、必须覆盖的章节、复核要求 |

如果需要分析本地资料，桌面端可在获得你的授权后使用指定文件或文件夹。只开放任务所需范围，不要把整个硬盘、密码文件、客户资料或密钥目录交给任务。

### 3. 在关键动作前停下来复核

Work 可以持续推进多步骤任务，但“能继续执行”不等于“可以不检查”。遇到以下节点应人工确认：

- 对外发送邮件、提交表单或发布内容；
- 改动合同、财务、账号或权限信息；
- 使用客户、员工或未公开项目资料；
- 引用对业务决策有影响的数据；
- 生成可执行脚本或批量修改文件。

## Work 能用网页做什么？

OpenAI 当前对 Cloud Browser 的说明是：它可以在受支持的公开网站上导航、填写部分公开字段，并把网页操作与连接应用中的信息结合起来。

适合的例子包括：

- 比较公开商品库存或航班信息；
- 查找餐厅空位或公开联系方式；
- 在不需要登录的页面收集资料；
- 使用公开包裹追踪页查询状态；
- 对多个公开来源做交叉核对。

当前边界也很明确：**不能输入账号密码登录，不能调用密码管理器，不能完成付款。** 如果页面出现验证码、登录或支付，任务可能停止并把页面交回给你。

## Work、Codex 应该怎么选？

| 你的任务 | 建议模式 |
| --- | --- |
| 写调研报告、表格或 PPT | Work |
| 阅读资料并形成完整方案 | Work |
| 修改仓库代码、运行命令和测试 | Codex |
| 代码项目之外的普通问答 | Chat |
| 公开网页查询和比较 | Work + Cloud Browser |

两者可以接力：先用 Work 梳理需求、形成规格和验收清单，再用 Codex 修改代码；也可以让 Codex完成技术实现后，用 Work把结果整理成面向管理层的报告。

如果你在国内更关注代码、长文档或 Codex 类任务，也可以了解第三方平台 <a href="https://www.zeogpt.com/register?ref=MRNWDKC3" target="_blank" rel="nofollow sponsored noopener">ZeoGPT</a>。它不是 OpenAI 官方服务，功能、模型、额度与数据规则以平台实际页面为准；不要上传 API Key、生产环境凭据或未脱敏代码。

## 常见误区

### 把旧 Agent 教程当作当前入口说明

旧文章可能仍能解释“代理任务”的概念，但入口、名称、套餐和次数已经可能改变。判断当前产品状态时，应先看 OpenAI 最新帮助页和自己的界面。

### 让 Work 自己决定什么叫“完成”

没有验收标准时，AI 很容易交付一份看似完整但不符合业务要求的内容。至少要写明受众、篇幅、格式、来源和检查项。

### 为了自动化而提供密码

不要在聊天中粘贴密码、验证码、银行卡或恢复码。Cloud Browser 当前也不支持登录和支付，不应尝试绕过这个边界。

### 把 Work 当作 Codex

Work 可以处理通用任务，Codex 才是专门面向软件开发、仓库修改、测试和代码审查的工作区。开发场景可继续阅读 [Codex 官网入口、CLI、App 与云端任务说明](/guides/openai-codex-official-entry-cli-cloud-2026-06)。

## 相关阅读

- [ChatGPT 怎么用：从入门到高效工作流](/guides/chatgpt-how-to-use)
- [ChatGPT 写代码教程](/guides/chatgpt-coding)
- [ChatGPT 文件上传失败排查](/guides/chatgpt-file-upload-failed-limits-guide-20260728)
- [ChatGPT 怎么做 PPT：大纲、逐页内容与成品检查](/guides/chatgpt-ppt-workflow-prompts-guide-20260728)
- [GPT-5.6 Codex 与 ChatGPT Work 任务区别](https://gpthomechat.com/chatgpt/gpt-5-6-codex-chatgpt-work-max-ultra-china-guide-2026-07-12.html)

## 常见问题

### ChatGPT Agent 是完全不能用了吗？

当前 OpenAI 帮助页称 Agent 不再单独提供，并引导用户使用 Work 和 Cloud Browser。不同账号的界面可能分批更新，以实际页面为准。

### Work 可以直接生成 PPT 吗？

OpenAI 当前把 presentation 列为 Work 的适用交付物之一。是否能直接得到可下载文件、具体格式和排版质量取决于当前入口、权限和任务内容；应检查数据、引用与页面结构。

### Work 可以访问电脑文件吗？

OpenAI 当前说明，桌面端在获得授权后可以使用本地文件和桌面应用；Web 和移动端 Work 不能直接访问电脑本地文件。

### Work 是免费功能吗？

可用计划和地区会变化，官方说明使用“符合条件的付费计划”。不要按旧教程推断权限，以账号当前显示为准。

## 官方参考

- [ChatGPT Work and Codex](https://help.openai.com/en/articles/20001275-chatgpt-work-and-codex)
- [Using cloud browser in ChatGPT](https://help.openai.com/en/articles/20001280-using-cloud-browser-in-chatgpt)
- [ChatGPT agent 帮助页](https://help.openai.com/en/articles/11752874-chatgpt-agent)
