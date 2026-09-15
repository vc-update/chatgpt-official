---
title: "ChatGPT两步验证怎么开？MFA、Passkey、恢复密钥与丢设备找回【2026年9月】"
description: "ChatGPT两步验证在设置的Security里开启，可选验证器App、推送通知、短信或Passkey，开启后对ChatGPT和API平台同时生效。本文给出逐步路径、Passkey不显示的原因、Advanced Account Security与恢复密钥规则，以及丢手机时的处理顺序。"
keywords: "ChatGPT两步验证,ChatGPT MFA,ChatGPT Passkey,ChatGPT恢复密钥,ChatGPT账号安全设置,ChatGPT二次验证怎么开"
date: "2026-09-15"
updated: "2026-09-15"
lastUpdated: 2026-09-15
sources:
  - "https://help.openai.com/en/articles/7967234-enabling-multi-factor-authentication-mfa-with-openai"
  - "https://help.openai.com/en/articles/20001039-passkeys-to-secure-your-openai-account"
  - "https://help.openai.com/en/articles/20001221-advanced-account-security"
  - "https://chatgpt.com/"
  - "https://help.openai.com/"
outline: deep
faq:
  - question: "ChatGPT两步验证在哪里开启？"
    answer: "在 ChatGPT 设置里进入 Security，找到 Multi-factor authentication，选择要启用的验证方式并按页面提示完成设置。官方说明开启后会应用到包括 ChatGPT 和 API 平台在内的 OpenAI 服务，不需要在两边分别配置。"
  - question: "ChatGPT两步验证有备用码吗？"
    answer: "官方 MFA 文档没有提供传统意义上的一次性备用码列表。丢失常用验证方式时的官方做法是在登录时选择 Try another method 换用其他已启用的方式。只有在启用 Advanced Account Security 后，才会在设置过程中拿到恢复密钥（recovery key），且每个恢复密钥只能使用一次。"
  - question: "为什么我的设置里看不到Passkey选项？"
    answer: "官方说明 Passkey 是否可用取决于账号的创建方式、账号是否绑定邮箱以及当前使用的登录方式。若账号没有邮箱地址，Security 设置里不会出现 Security keys & passkeys，该账号也无法使用 Passkey 登录。由组织 SSO 管理的账号仍通过组织登录，Passkey 作为 MFA 使用。"
  - question: "开启两步验证会把其他设备踢下线吗？"
    answer: "不会。官方 FAQ 明确说明启用 MFA 不会自动登出其他设备或会话。若你确实想清掉所有会话，需要在 Security 里单独执行 Log out of all devices，官方提示全部会话登出最多可能需要 30 分钟。"
  - question: "手机丢了、验证器App也没了怎么办？"
    answer: "先在登录页输入密码，到验证环节选择 Try another method，改用其他已启用的方式，例如 Passkey、推送通知、短信或邮箱。如果你启用了 Advanced Account Security 并丢失了全部 Passkey 和安全密钥，则需要使用恢复密钥；输入有效恢复密钥后，出于安全考虑账号会在 48 小时后才解锁。"
  - question: "Advanced Account Security值得开吗？"
    answer: "它面向账号被接管风险较高的用户，代价明确：会禁用密码登录、邮箱和短信验证码登录以及邮箱账号找回，会话时长也更短。开启前必须准备至少两种安全登录方式（其中一种要能跨设备）并妥善保存恢复密钥，否则同时丢失全部登录方式和恢复密钥可能导致永久失去账号。"
  - question: "管理员能强制整个工作区开启两步验证吗？"
    answer: "目前不能。官方 FAQ 说明 MFA 暂时无法在 ChatGPT 工作区或 API 平台组织层面强制启用，只能由每个成员自行在账号设置中开启。"
  - question: "两步验证能防住钓鱼网站吗？"
    answer: "取决于方式。短信和验证器 App 的一次性验证码仍可能在仿冒登录页被实时转发利用；Passkey 和硬件安全密钥基于设备侧密钥学凭证，抗钓鱼能力更强。无论用哪种方式，都不应在陌生页面输入 ChatGPT 密码或验证码。"
---

# ChatGPT两步验证怎么开？MFA、Passkey、恢复密钥与丢设备找回【2026年9月】

最后更新：2026-09-15

ChatGPT 的两步验证在账号设置的 **Security** 里开启：进入 ChatGPT 设置 → 选择 Security → 在 Multi-factor authentication 下选择要启用的验证方式，按页面提示完成设置，下一次登录时生效。可选方式包括验证器 App 的一次性验证码、推送通知、短信或 WhatsApp 验证码，以及 Passkey。按官方说明，MFA 一旦启用就会应用到包括 ChatGPT 和 API 平台在内的 OpenAI 服务，不需要在两边分别配置。

本文只说明官方账号安全设置的位置、步骤、边界和失败处理顺序，不提供账号代操作、代找回、验证码代收或非官方登录入口。涉及具体选项是否出现，请以你登录后当前页面的实际显示为准：官方明确说明可用的 MFA 选项会因设备、国家/地区、账号层级以及账号最初的创建方式而不同。

## 先分清四个概念，再动手设置

中文教程里「两步验证」常被混着用，但官方设置页里其实是四个不同层级的东西。搞混会导致你以为已经加固了，实际留着最弱的一环。

| 概念 | 官方位置 | 作用 | 关键限制 |
| --- | --- | --- | --- |
| MFA（多因素验证） | Settings → Security → Multi-factor authentication | 登录时增加第二步验证 | 可用选项随设备、地区、账号层级和创建方式变化 |
| Passkey | Settings → Security → Passkeys | 可作为登录方式，也可作为 MFA 的一种 | 账号无邮箱时不出现；仅存本机未同步时丢设备即失效 |
| 安全密钥（Security key） | 同 Passkeys 区域 | 硬件形态的抗钓鱼凭证 | 需要 FIDO 兼容硬件 |
| Advanced Account Security | Settings → Security → Advanced Account Security | 强制 Passkey/安全密钥登录并关闭弱找回通道 | 仅部分个人账号可用，企业托管账号不可用 |

需要注意的是，MFA 和 Passkey 不是二选一。Passkey 既可以单独作为登录方式（输入邮箱后默认走 Passkey，不再需要密码和验证码），也可以在账号配置下作为额外的 MFA 验证步骤使用。

- 只开短信验证码，是四种里防护最弱的一档
- Passkey 不显示不代表账号异常，先确认账号是否绑定邮箱
- Advanced Account Security 是可选项，不是必须步骤
- 企业托管账号和已认领域名账号看不到 Advanced Account Security

延伸核对：[ChatGPT官网登录：验证码收不到、账号找回与异常登录排查](/guides/chatgpt-official-login-code-account-recovery-security-troubleshoot-20260724)。

## 开启 MFA 的完整路径

按官方文档，在 ChatGPT 里管理 MFA 的路径只有一条，API 平台侧也可以管理同一账号的设置：

1. 进入 ChatGPT 设置（Settings）。
2. 选择 **Security**。
3. 在 **Multi-factor authentication** 下，选择你要启用或管理的 MFA 选项。
4. 按页面提示完成设置或移除。

不同方式的后续步骤不同。官方列出的补充设置动作包括：用验证器 App 扫描二维码并输入一次性验证码；接收短信或 WhatsApp 验证码并输入确认；在启用短信或 WhatsApp 之前先填写手机号。设置完成后，MFA 会在你下一次登录时生效，而不是立即中断当前会话。

如果你启用了多种 MFA 方式，官方说明默认会优先使用其中最安全的一种，但你在登录时仍然可以选择任意一种已启用的方式。这一点对国内用户有实际意义：短信通道在跨境场景下并不总是可靠，多启用一种验证器 App 或 Passkey，可以在短信收不到时留一条退路。

- 设置入口固定在 Settings → Security，不在账号资料页
- 启用后下次登录生效，不会立刻打断当前会话
- 建议至少启用两种方式，避免单一通道失效
- 启用短信前需要先填写手机号

延伸核对：[ChatGPT 账号被锁或验证异常怎么办？官方帮助路径与安全排查](/guides/chatgpt-account-locked-verification-official-help-path-20260716)。

## Passkey：设置方式、默认行为与不显示的原因

Passkey 是存储在设备或安全密钥（例如 YubiKey）上的密码学凭证，由生物识别（Face ID、Touch ID）、设备 PIN 或硬件按键触碰保护，用于免密码登录 OpenAI 账号。设置路径是在网页端登录 ChatGPT 后进入 Settings → Security，在 **Passkeys** 下选择 **Add passkey**，按屏幕提示完成。之后可以继续添加或移除，管理位置同样在 Settings → Security 的 Passkeys 区域。

设置完成后的默认行为值得留意：官方说明输入邮箱之后，Passkey 会成为默认登录方式，你不需要再输密码或 MFA 验证码。如果你更想用密码，在登录页选择 **Try another method** 换回其他方式即可。

看不到 Passkey 选项是常见问题，但通常不是账号故障。官方给出的原因是 Passkey 可用性取决于账号的创建方式、账号是否有邮箱地址，以及你当前使用的登录方式。其中最明确的一条是：**如果账号没有邮箱地址，Security 设置里不会出现 Security keys & passkeys，该账号也无法使用 Passkey 登录**。如果账号由使用单点登录（SSO）的组织管理，你会继续通过组织登录，Passkey 则作为 MFA 方式发挥作用。

还有一个容易被忽略的差别：Passkey 可能绑定在单一设备上，也可能跨设备同步，取决于你的配置。**仅存本机、未做同步的 Passkey，一旦丢失该设备就无法再使用。** 使用 iCloud 钥匙串这类提供方创建的同步 Passkey，则可能在同一账号登录的多台设备上都可用。部分平台还支持借用附近设备的 Passkey：在没有保存 Passkey 的笔记本上登录时，可以通过扫二维码或确认提示，用手机上的 Passkey 完成登录。

| 你的情况 | 会发生什么 | 建议动作 |
| --- | --- | --- |
| Passkey 只存在一台手机、未同步 | 手机丢失后该 Passkey 不可用 | 再加一个同步 Passkey 或硬件安全密钥 |
| 使用 iCloud 钥匙串等同步方案 | 同账号多设备可用 | 仍建议保留第二种验证方式 |
| 账号未绑定邮箱 | 设置里不出现 Passkey 相关选项 | 先确认账号登录路径，不必反复刷新设置页 |
| 组织 SSO 管理的账号 | 仍走组织登录，Passkey 作为 MFA | 设置策略以组织管理员说明为准 |

- Passkey 设置在网页端完成，路径为 Settings → Security → Passkeys
- 设置后输入邮箱即默认走 Passkey，可用 Try another method 换回密码
- 未同步的单设备 Passkey 有丢设备即失效的风险
- 选项不出现优先确认账号是否绑定邮箱，而不是怀疑账号被封

延伸核对：[ChatGPT官网怎么退出登录？共享设备与聊天记录隐私检查](/guides/chatgpt-official-logout-shared-device-chat-history-privacy-check-20260719)。

## Advanced Account Security：代价明确的高强度选项

Advanced Account Security 是面向个人 ChatGPT 账号的**可选**安全设置，通过更严格的登录要求降低账号被接管、未授权访问和数据暴露的风险。它不是所有人都需要开的功能，开启前必须清楚代价。

可用范围有明确边界。官方说明它面向受支持地区的符合条件的个人 ChatGPT 账号，**不适用于**企业托管账号，以及与已验证并认领的域名关联的账号。工作区关联账号是否可用取决于账号配置。判断方法很直接：如果网页端 Settings → Security 里没有出现 Advanced Account Security，就说明当前账号暂不可用。账号之后若变成企业托管，该功能可能被停用。

开启前需要准备两样东西：**至少两种安全登录方式，其中一种必须能跨设备使用**（可以是 Passkey、FIDO 兼容安全密钥，或两者组合）；以及妥善保存设置过程中给出的恢复密钥。官方给出的有效组合示例包括：一个 Passkey 加一个兼容硬件安全密钥；两个兼容 Passkey（其中至少一个可跨设备）；两个兼容硬件安全密钥。只存在单一设备上的 Passkey 可能不满足跨设备要求，设置流程会显示你的登录方式是否达标。

启用后发生的变化是一整套，不是单点加固：

| 变化 | 具体影响 |
| --- | --- |
| Passkey 和安全密钥用于登录 | 成为主要登录路径 |
| 密码登录被禁用 | 不能再用密码进入账号 |
| 邮箱和短信验证码登录被禁用 | 常用的验证码退路消失 |
| 邮箱账号找回被禁用 | 不能再通过邮箱走找回流程 |
| 邮箱登录通知被启用 | 有登录行为时会收到邮件提醒 |
| 活跃会话时长更短 | 需要更频繁重新登录 |
| 对话不用于训练模型 | 启用期间官方不将对话用于训练 |

设置流程是：在 ChatGPT 进入 Settings → 选择 Security → 选择 Advanced Account Security（移动端会被跳转到浏览器完成）→ 选择 **Enroll** → 在安全设置页选择 Continue → 添加至少两种安全登录方式（含一种可跨设备）→ 保存恢复密钥并确认已保存。**初次设置完成后你会被登出所有设备**，需要用其中一个 Passkey 或安全密钥重新登录。

最需要提前想清楚的一句话：因为该功能会禁用标准的短信和邮箱账号找回，**同时丢失全部登录方式和恢复密钥可能导致你永久失去这个账号**。如果你不能保证长期妥善保管恢复密钥，普通 MFA 加同步 Passkey 是更稳妥的组合。

- 只面向符合条件的个人账号，企业托管账号不可用
- 需要两种安全登录方式，其中一种能跨设备
- 开启后密码、邮箱和短信登录及邮箱找回全部关闭
- 初次设置后会登出所有设备
- 全部登录方式和恢复密钥同时丢失可能无法找回账号

## 恢复密钥怎么用：一次性，且要等 48 小时

恢复密钥（recovery key）只在启用 Advanced Account Security 的流程中提供，用于在丢失登录方式时重新获得账号访问权。它和很多平台的「备用码」不同，规则更严格：

**每个恢复密钥只能使用一次。** 输入有效恢复密钥后，账号恢复流程开始，但出于安全考虑，账号会在输入后 **48 小时**才解锁；等待期结束后再按提示完成恢复。这个 48 小时的冷静期意味着恢复密钥不是应急即时通道，不能指望它在赶时间时立刻救回账号。

所以正确做法是把恢复密钥当成离线资产保管，而不是存在同一台随时可能丢的设备里。存进你正在用来登录的手机备忘录，等于把钥匙和锁放在同一个包里。

- 恢复密钥仅在 Advanced Account Security 设置过程中获得
- 每个恢复密钥只能用一次，用完即失效
- 输入有效密钥后需等 48 小时账号才解锁
- 不要与登录设备存放在同一处

延伸核对：[OpenAI API Key怎么保存才安全？环境变量、泄露与撤销轮换](/guides/openai-api-key-env-github-leak-revoke-rotate-security-20260826)。

## 手机丢了、验证器 App 没了：按顺序处理

不要先去搜「ChatGPT 解锁」「代找回」，也不要立刻反复尝试登录。按官方给出的路径逐层处理：

第一步，用常规登录流程走到验证环节。登录 ChatGPT，输入密码，在提示验证身份时选择 **Try another method**，然后选择另一种可用选项，例如 Passkey、推送通知、验证器 App、短信或邮箱。这一步能解决的前提是你此前启用了不止一种方式 —— 这也是前面建议至少启用两种的原因。

第二步，判断你是否启用了 Advanced Account Security。如果启用了并且丢失了全部 Passkey 和安全密钥，那么邮箱和短信这两条退路已经被关闭，唯一通道是恢复密钥，并且要接受 48 小时等待期。如果没有启用，邮箱验证码等常规方式通常仍然可用。

第三步，如果怀疑不只是丢设备而是账号可能已被他人访问，在恢复访问后到 Settings → Security 执行 **Log out of all devices**，官方提示全部会话登出最多可能需要 30 分钟。注意这个动作和启用 MFA 是两件事：官方 FAQ 明确说明启用 MFA 不会自动登出其他设备或会话。

| 你的状态 | 可用通道 | 注意 |
| --- | --- | --- |
| 启用了多种 MFA，丢了一种 | Try another method 换用其他方式 | 最顺畅的情况 |
| 只启用了验证器 App，手机丢失 | 视账号配置尝试其他可用选项 | 说明单一方式的风险 |
| 启用 Advanced Account Security，丢失全部 Passkey | 只能用恢复密钥 | 输入后需等 48 小时 |
| 全部登录方式和恢复密钥都丢失 | 可能无法恢复 | 官方已明确此风险 |

- 先走官方登录页的 Try another method，不要找第三方代找回
- 确认自己是否启用过 Advanced Account Security，两种情况退路不同
- 怀疑被他人访问时单独执行 Log out of all devices
- 全部会话登出最多需要 30 分钟

## 两步验证不是万能的：分清哪种抗钓鱼

一个需要说清的边界：开了两步验证不等于不会被钓鱼。短信验证码和验证器 App 的一次性验证码属于「可转述」的凭证 —— 仿冒登录页可以让你输入验证码后实时转发到真站完成登录，你输入的那一刻攻击就成立了。Passkey 和硬件安全密钥基于设备侧的密码学凭证，不存在可以被口述、截图或转发的验证码，因此抗钓鱼能力更强。官方也提供了 OpenAI + Yubico YubiKey 合作方案，符合条件的用户可以按优惠价获取硬件安全密钥。

这也决定了几条通用纪律：不要在陌生短链接、群消息转发的「登录页」上输入 ChatGPT 密码或验证码；不要把验证码截图、转发或口述给任何人，包括自称客服的人；不要为了「代开通」「代找回」把验证码或恢复密钥交给第三方。任何要求你提交官方密码、验证码或恢复密钥的页面都应视为高风险。

- 短信和验证器验证码仍可能被实时转发利用
- Passkey 和硬件密钥不产生可转述的验证码
- 验证码和恢复密钥不要截图、转发或口述
- 要求提交密码或恢复密钥的第三方页面一律不用

延伸核对：[ChatGPT国内镜像网站整理与安全边界](/guides/chatgpt-mirror-sites-safety)。

## 常见问题

### ChatGPT两步验证在哪里开启？

在 ChatGPT 设置里进入 Security，找到 Multi-factor authentication，选择要启用的验证方式并按提示完成。开启后按官方说明会应用到包括 ChatGPT 和 API 平台在内的 OpenAI 服务。

### ChatGPT有备用码吗？

官方 MFA 文档没有提供传统的一次性备用码列表。丢失常用方式时的官方做法是登录时选择 Try another method。恢复密钥只在启用 Advanced Account Security 的流程中提供，且每个只能用一次。

### 为什么设置里看不到 Passkey？

取决于账号创建方式、是否绑定邮箱和当前登录方式。账号没有邮箱地址时，Security 里不会出现 Security keys & passkeys。组织 SSO 管理的账号仍走组织登录。

### 开启两步验证会把其他设备踢下线吗？

不会。官方 FAQ 明确启用 MFA 不会自动登出其他设备或会话。需要清会话要单独执行 Log out of all devices，最多可能需要 30 分钟生效。

### 管理员能强制工作区成员开启 MFA 吗？

目前不能。官方说明 MFA 暂时无法在 ChatGPT 工作区或 API 平台组织层面强制启用。

### Advanced Account Security 开了能关吗？

它是可选设置，设置项在 Settings → Security。但开启后密码、邮箱和短信登录以及邮箱找回都会被禁用，是否保留应以你能否长期保管恢复密钥为前提判断，具体开关行为以当前页面显示为准。

### 国内用短信验证收不到怎么办？

短信通道在跨境场景下不总可靠。建议同时启用验证器 App 或 Passkey 作为第二条通道，不要把短信当作唯一验证方式。

### 两步验证和 ChatGPT 账号被锁是一回事吗？

不是。两步验证是你主动设置的登录保护；账号被锁或出现验证异常属于另一类问题，处理路径见[账号被锁与验证异常排查](/guides/chatgpt-account-locked-verification-official-help-path-20260716)。

## 官方参考与站内延伸阅读

- [OpenAI 帮助中心：启用或停用多因素验证（MFA）](https://help.openai.com/en/articles/7967234-enabling-multi-factor-authentication-mfa-with-openai)
- [OpenAI 帮助中心：使用 Passkey 保护你的 OpenAI 账号](https://help.openai.com/en/articles/20001039-passkeys-to-secure-your-openai-account)
- [OpenAI 帮助中心：Advanced Account Security](https://help.openai.com/en/articles/20001221-advanced-account-security)
- [ChatGPT 官方入口](https://chatgpt.com/)
- [ChatGPT官网登录：验证码收不到与账号找回排查](/guides/chatgpt-official-login-code-account-recovery-security-troubleshoot-20260724)
- [ChatGPT 账号被锁或验证异常怎么办](/guides/chatgpt-account-locked-verification-official-help-path-20260716)
- [ChatGPT官网怎么退出登录与隐私检查](/guides/chatgpt-official-logout-shared-device-chat-history-privacy-check-20260719)

官方设置项名称、可用范围、账号资格和地区支持可能随时变化。本文更新时间只代表本站内容修订时间，不代表你的账号一定已获得相同选项；涉及登录、找回和安全设置的操作，请以 ChatGPT 设置页当前显示和官方帮助中心为准。
