# BrightPath Rust Demo

一个基于《教育平台规划》P0 范围的最小端到端 Demo：

- 学生首页：今日任务、课程进度、学习节奏、掌握度
- 互动课程：Year 7 Mathematics / Solving linear equations
- AI Tutor：苏格拉底式分步提示、中英文解释、相似问题入口
- 学习进度：独立掌握度、复习任务和知识点证据
- iOS 风格：大圆角、毛玻璃、柔和渐变、轻量阴影、响应式布局

## 运行

项目不使用第三方 crate，因此无需下载项目依赖。本机已经在
`D:\Codex\toolchains\rust` 安装便携版 Rust 1.99.1 GNU 工具链。

直接启动：

```powershell
.\run-demo.ps1
```

也可以手动运行：

```powershell
cd D:\Codex\2026-11-07\gen-j\outputs\education-rust-demo
cargo +stable-x86_64-pc-windows-gnu run
```

浏览器打开 <http://127.0.0.1:8080>。

## Demo 架构

```text
Browser (HTML/CSS/JS)
        │
        ├── GET  /api/dashboard
        └── POST /api/tutor
                    │
             Rust std::net server
```

`POST /api/tutor` 目前返回可预测的脚本化教学回复，用于先验证交互。生产化时建议替换为：

```text
Axum API → Auth/家庭权限 → Curriculum RAG → Tutor Policy → LLM Adapter
                                │                  │
                         PostgreSQL/pgvector   Safety/Audit
```

## 下一阶段

1. 将标准库 HTTP 服务换成 Axum + Tokio，并增加结构化错误和日志。
2. 接 PostgreSQL，优先落地 `students`、`lessons`、`question_versions`、`student_attempts`、`student_mastery`、`tutoring_sessions`。
3. Tutor 请求必须携带学生、课程、题目版本和提示级别；不要把自由聊天直接接到模型。
4. 数学判题使用确定性验证器；AI 负责解释，不负责最终正确性判定。
5. 家长端只展示经授权的学习证据，不默认暴露完整儿童对话。

