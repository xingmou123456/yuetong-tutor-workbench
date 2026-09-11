# Design Contract · 月瞳家教工作台 MVP

## Style Tier & Aesthetic Direction
style: brand-themed
aesthetic: 温暖专业、有亲和力的家教工作台。采用「暖陶」视觉语言：柔和的奶油底色、陶土色主色、圆润有机的卡片、充足留白，营造安心、可信赖的辅导氛围。
tone keywords: 温暖 / 专业 / 清晰 / 亲和

## Design Tokens
```
color.primary:         #D97757
color.primary-hover:   #C25E3A
color.primary-soft:    #FDF0EB
color.secondary:       #E8A87C
color.bg:              #FDF8F3
color.surface:         #FFFFFF
color.surface-elevated:#FFFBF8
color.border:          #F0E6DC
color.divider:         #F5EDE6
color.text:            #2D2420
color.text-sub:        #7D6B62
color.text-muted:      #A89A90
color.success:         #6B9E75
color.success-soft:    #E8F5EA
color.warning:         #E5A853
color.warning-soft:    #FDF3E0
color.danger:          #D15A5A
color.danger-soft:     #FCEAEA

font.display:          "PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif
font.body:             "PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif
font.mono:             "SFMono-Regular", "Menlo", "Consolas", monospace

font.scale:            12 / 14 / 16 / 18 / 20 / 24 / 30 / 36 (px)
radius:                sm 8 / md 12 / lg 16 / xl 24
shadow:                sm 0 1px 3px rgba(45,36,32,0.05)
                       md 0 4px 14px rgba(45,36,32,0.08)
                       lg 0 12px 32px rgba(45,36,32,0.12)
spacing.unit:          4px (4/8/12/16/20/24/32/40/48)

layout.sidebar-w:      240px
layout.max-content:    1200px
layout.gutter:         24px
```

## Component Spec
- **Button**: 圆角 md，字体 14px 中等字重；primary 为陶土色底白字，hover 加深；secondary 为浅陶土底陶土字；ghost 为透明底 hover 浅灰。含 disabled 态。
- **Input / Select / Textarea**: 圆角 md，边框 #F0E6DC，focus 边框 primary + 柔和外发光，背景白。
- **Card**: 圆角 lg，白底，md 阴影，hover 轻微上浮（transform + shadow）。
- **Tag**: 圆角 full（胶囊），小字 12px，多种语义色（success/warning/primary/secondary）。
- **Modal / Drawer**: 覆盖层 rgba(45,36,32,0.45)，面板白底圆角 xl，居中或右侧滑出。
- **Nav-Sidebar**: 固定左侧 240px，桌面显示；图标 + 文字垂直列表，active 项左侧 4px 主色竖条 + 浅陶土背景。
- **Bottom Nav**: 固定底部，仅移动端显示；5 个等宽项，active 项图标主色 + 文字主色。
- **Empty State**: 居中插画占位 + 浅灰说明 + 操作按钮。
- **Toast**: 顶部居中滑入，自动消失。

## App Shell + Canonical Nav
- 每个页面固定包含：`<body data-page="xxx">` + `<aside class="app-nav">...</aside>` + `<main class="app-content">`。
- `.app-nav` 固定左侧，宽 240px；`.app-content` margin-left 240px。
- 移动端（≤768px）：`.app-nav` 隐藏；底部 `<nav class="bottom-nav">` 固定，高 64px + env(safe-area-inset-bottom)；`.app-content` margin-bottom 80px。
- active 规则：脚本读取 `body[data-page]`，给对应 `data-nav` 的链接添加 `.active` 类。
- Nav items（顺序固定）：
  1. 工作台 · layout-dashboard → index.html · data-nav="dashboard"
  2. 学生档案 · users → students.html · data-nav="students"
  3. 教案生成 · book-open → lesson-plan.html · data-nav="lesson-plan"
  4. 作业生成 · file-text → homework.html · data-nav="homework"
  5. 学习报告 · trending-up → report.html · data-nav="report"

## Page List
| Page | File | Responsibility | Key Components |
|------|------|----------------|----------------|
| 登录 | login.html | 账号密码登录（原型可任意登录） | 品牌展示、登录表单、原型提示 |
| 工作台 | index.html | 概览数据、快捷入口、最近动态、使用说明弹窗 | 统计卡片、快捷操作、最近反馈列表、免责声明 |
| 学生档案 | students.html | 学生增删改查、画像、课后反馈 | 学生卡片/列表、添加/编辑抽屉、反馈时间线 |
| 教案生成 | lesson-plan.html | 选学生、输知识点、AI 生成教案 | 表单、生成加载、教案编辑器、历史列表 |
| 作业生成 | homework.html | 配置作业参数、生成题目与解析 | 配置面板、题目卡片、答案区、导出/复制 |
| 学习报告 | report.html | 选学生+时间段、生成阶段报告 | 学生/时间选择、报告预览、导出 Word/PDF |

## Login & Disclaimer Flow
1. 用户从 login.html 进入，任意账号密码可模拟登录；登录后写入 `localStorage.yuetong_logged_in = 1`。
2. 进入 index.html 时，若 `localStorage.yuetong_seen_disclaimer` 未设置，自动弹出「使用说明」弹窗。
3. 弹窗内容明确平台定位：AI 辅助备课助手、生成内容可能存在瑕疵/重复/同质化、可结合 PPT/Word/WPS 等工具完成最终交付。
4. 用户需勾选「我已了解并同意」后方可关闭弹窗；顶部保留「使用说明」入口可重复查看。

## Mock Schema
```js
// students
{
  id, name, grade, subject, weakPoints, habits, personality, parentExpectation,
  feedbacks: [{ id, date, content, nextGoals }]
}

// lessonPlans
{
  id, studentId, studentName, topic, objectives, explanation, examples, interaction, homework, createdAt
}

// homeworks
{
  id, topic, difficulty, count, types,
  questions: [{ number, type, question, answer, analysis }]
}

// reports
{
  id, studentId, studentName, startDate, endDate,
  content, highlights, improvements, nextPlan
}
```

## Icon Set (Lucide inline SVG)
- layout-dashboard, users, book-open, file-text, trending-up
- plus, search, edit-2, trash-2, x, check, chevron-right, calendar, clock, bookmark, sparkles, download, copy, printer, more-horizontal, filter, arrow-left, save, loader
