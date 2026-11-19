const views = [...document.querySelectorAll('.view')];
const navItems = [...document.querySelectorAll('.nav-item[data-view]')];
let currentLanguage = 'en';
const repairInitialHtml = document.querySelector('#repairPanel').innerHTML;
let pointsBalance = Number(localStorage.getItem('brightpath-points') || 1240);
let questionRewardClaimed = false;
const feedbackCopy = {
  en: { retryEyebrow: 'KEEP GOING', retryTitle: 'Almost there', retryLead: 'Every attempt helps your brain build the path.', retryBody: 'Look for the operation that removes +6 first, then try again.', retryButton: 'I’ll try again' },
  zh: { retryEyebrow: '继续加油', retryTitle: '已经很接近了', retryLead: '每一次尝试，都在帮大脑搭建思考路径。', retryBody: '先找出能消去 +6 的相反运算，再试一次。', retryButton: '我再试一次' }
};
const extensionCopy = {
  en: { role: 'DEMO ROLE', roles: ['Student', 'Parent', 'Teacher'], evidence: 'How is mastery calculated? ↓', evidenceLines: ['Independent correct answers <b>68%</b>', 'Spaced reviews completed <b>4 / 5</b>', 'AI hint reliance <b>Low</b>'], goal: 'Manage notifications', message: 'Send message', goalDone: 'Notification preferences are ready to update.', messageDone: 'A secure message draft is ready for your learning adviser.', edit: 'Edit draft', approve: 'Approve for student view →', review: 'Content review required: edit the draft, verify sources, then approve publication.', editing: 'Editing mode enabled — this demo records a content revision.', published: 'Published to Year 7 Mathematics · student view updated', subjects: ['Mathematics', 'English', 'Science'] },
  zh: { role: '演示角色', roles: ['学生', '家长', '教师'], evidence: '掌握度如何计算？↓', evidenceLines: ['独立正确作答 <b>68%</b>', '已完成间隔复习 <b>4 / 5</b>', 'AI 提示依赖度 <b>低</b>'], goal: '管理通知', message: '发送消息', goalDone: '通知偏好已准备好更新。', messageDone: '已为你的学习顾问准备好一条安全消息草稿。', edit: '编辑初稿', approve: '批准发布到学生端 →', review: '需要内容审核：编辑初稿、核对来源后，再批准发布。', editing: '已进入编辑模式——本 Demo 会记录一次内容修订。', published: '已发布至七年级数学 · 学生端已更新', subjects: ['数学', '英语', '科学'] }
};
let selectedSubject = 'math';
let parentUnlocked = sessionStorage.getItem('brightpath-parent-unlocked') === 'true';
let contentUnlocked = sessionStorage.getItem('brightpath-content-unlocked') === 'true';
let entryMode = null;
let activeLearner = JSON.parse(sessionStorage.getItem('brightpath-active-learner') || 'null');
const learners = {
  '1001': { name: 'Mia Chen', initials: 'MC', grade: 'Year 7 · Victoria', mastery: '68%', minutes: '142', focus: 'Equation balance', points: 1240 },
  '1002': { name: 'James Liu', initials: 'JL', grade: 'Year 7 · Victoria', mastery: '84%', minutes: '168', focus: 'Algebraic reasoning', points: 1560 },
  '1003': { name: 'Ava Roberts', initials: 'AR', grade: 'Year 7 · Victoria', mastery: '61%', minutes: '96', focus: 'Comparing fractions', points: 980 }
};
const teacherCopy = {
  en: { nav: 'Teacher Hub', eyebrow: 'TEACHER HUB · YEAR 7 MATHEMATICS', title: 'Your class, at a glance', intro: 'See learning evidence, intervene early, and review AI-generated course drafts before they reach students.', today: 'TODAY', tasks: '3 review tasks', attention: '1 learner needs attention', labels: ['ACTIVE STUDENTS', 'INDEPENDENT MASTERY', 'DRAFTS TO REVIEW', 'EARLY SUPPORT'], subs: ['26 learning this week', '+6% from last week', '2 generated from recordings', 'Students need a check-in'], pulse: 'CLASS PULSE', algebra: 'Algebra · this week', live: 'Live evidence', mia: 'Building equation balance', james: 'Ready for extension', ava: 'Reviewing fraction concepts', developing: 'Developing', strong: 'Strong', review: 'Review', view: 'View', openClass: 'Open class evidence →', queue: 'REVIEW QUEUE', approval: 'Teacher approval needed', items: '3 items', draft: 'Year 7 Algebra recording', draftSub: '08:42 · transcript and 3 learning cards', quiz: 'Equation knowledge check', quizSub: '2 questions need answer feedback review', translation: 'Chinese learning support', translationSub: '1 translation flagged for teacher check', openStudio: 'Open Course Studio →', actions: 'TEACHER ACTIONS', human: 'Keep the next step human', actionBody: 'Use the evidence to prompt, support or extend—not to label students.', nudge: 'Send a gentle nudge', group: 'Create a support group', nudgeToast: 'A gentle prompt was prepared for Mia: “Explain what you would do to both sides.”', groupToast: 'Support group draft created: equation balance · 4 students.' },
  zh: { nav: '教师工作台', eyebrow: '教师工作台 · 七年级数学', title: '班级学习概览', intro: '查看学习证据、尽早支持需要帮助的学生，并在 AI 课程初稿发布前完成审核。', today: '今天', tasks: '3 项审核任务', attention: '1 位学生需要关注', labels: ['活跃学生', '独立掌握度', '待审核初稿', '早期支持'], subs: ['本周 26 人参与学习', '比上周提升 6%', '2 份来自课堂录音', '学生需要一次沟通'], pulse: '班级动态', algebra: '代数 · 本周', live: '实时学习证据', mia: '正在建立等式平衡概念', james: '可以进行拓展练习', ava: '正在复习分数概念', developing: '正在发展', strong: '掌握良好', review: '需要复习', view: '查看', openClass: '查看班级学习证据 →', queue: '审核队列', approval: '需要教师批准', items: '3 项', draft: '七年级代数课堂录音', draftSub: '08:42 · 转写稿和 3 张学习卡', quiz: '等式知识检测', quizSub: '2 道题需要审核答案反馈', translation: '中文学习支持', translationSub: '1 处译文需要教师核查', openStudio: '打开课程工作台 →', actions: '教师行动', human: '让下一步保持人的温度', actionBody: '利用学习证据进行启发、支持或拓展，而不是给学生贴标签。', nudge: '发送温和提示', group: '创建支持小组', nudgeToast: '已为 Mia 准备温和提示：“说说看，你会对等式两边分别做什么？”', groupToast: '已创建支持小组草稿：等式平衡 · 4 名学生。' }
};
const contentCopy = {
  en: { nav: 'Content Review', eyebrow: 'CONTENT & REVIEW CONSOLE · YEAR 7 MATHEMATICS', title: 'Review content before it reaches learners', intro: 'Approve curriculum mapping, questions, translations and AI feedback before they are published to student accounts.', today: 'TODAY', tasks: '3 review tasks', attention: '1 AI feedback item flagged', labels: ['PUBLISHED UNITS', 'CURRICULUM MAPPED', 'DRAFTS TO REVIEW', 'SAFETY FLAGS'], subs: ['Across Maths, English and Science', 'Checked against Year 7 outcomes', '2 generated from recordings', 'Needs reviewer decision'], pulse: 'RELEASE CHECKS', algebra: 'Algebra · release quality', live: 'Review evidence', mia: 'Curriculum mapping attached', james: 'Answer logic validated', ava: 'Chinese support checked', developing: 'Needs review', strong: 'Ready', review: 'Check source', view: 'Open', openClass: 'Open content evidence →', queue: 'REVIEW QUEUE', approval: 'Approval required', items: '3 items', draft: 'Year 7 Algebra recording', draftSub: '08:42 · transcript and 3 learning cards', quiz: 'Equation knowledge check', quizSub: '2 questions need answer feedback review', translation: 'Chinese learning support', translationSub: '1 translation flagged for review', openStudio: 'Open Course Studio →', actions: 'REVIEWER ACTIONS', human: 'Keep the release safe and clear', actionBody: 'Approve only curriculum-aligned, age-appropriate content with verified source context.', nudge: 'Flag for revision', group: 'Create review checklist', nudgeToast: 'Revision flag created for the current feedback item.', groupToast: 'Review checklist created for this release batch.' },
  zh: { nav: '内容审核', eyebrow: '内容与审核后台 · 七年级数学', title: '在内容到达学生前完成审核', intro: '审核课程映射、题目、译文和 AI 反馈后，才能发布到学生账户。', today: '今天', tasks: '3 项审核任务', attention: '1 条 AI 反馈被标记', labels: ['已发布单元', '课程映射完成度', '待审核初稿', '安全标记'], subs: ['覆盖数学、英语和科学', '已核对七年级学习成果', '2 份来自课堂录音', '需要审核决定'], pulse: '发布检查', algebra: '代数 · 发布质量', live: '审核证据', mia: '已附课程映射', james: '答案逻辑已验证', ava: '中文支持已核查', developing: '需要审核', strong: '可发布', review: '核查来源', view: '打开', openClass: '打开内容证据 →', queue: '审核队列', approval: '需要批准', items: '3 项', draft: '七年级代数课堂录音', draftSub: '08:42 · 转写稿和 3 张学习卡', quiz: '等式知识检测', quizSub: '2 道题需要审核答案反馈', translation: '中文学习支持', translationSub: '1 处译文被标记待审核', openStudio: '打开课程工作台 →', actions: '审核行动', human: '让发布安全、清晰、可追溯', actionBody: '只批准与课程标准一致、适龄且已核验来源语境的内容。', nudge: '标记需要修订', group: '创建审核清单', nudgeToast: '已为当前 AI 反馈建立修订标记。', groupToast: '已为本批内容创建审核清单。' }
};
const studioCopy = {
  en: ['Course Studio','COURSE STUDIO · TEACHER WORKFLOW','Turn a lesson recording into a reviewed course','Make a draft transcript, bilingual learning cards and a short check-for-understanding—then let a teacher approve it before students see it.','Ready to learn','STEP 1 · SOURCE','Add a class recording','Audio stays in the approved institution workspace. The demo only simulates the conversion flow.','Drop an audio file here','MP3, M4A or WAV · lesson recording','No recording selected','Generate reviewed draft →','✓ Requires teacher review before publication · Student data is not used to train the model.','STEP 2 · CREATE','From recording to learning flow','Ready','Working','Draft ready','Queued','Done','Transcribe and separate speakers','Timestamped source text with a confidence flag.','Find curriculum concepts','Map ideas to the selected year level and subject.','Build bilingual learning cards','Core idea, visual explanation and a common misconception.','Create a short knowledge check','Teacher edits and approves every student-facing item.','Creating course draft…','Generate another draft','STEP 3 · REVIEW','Draft course ready for teacher review','Based on: “Year 7 Algebra — balancing equations” · 08:42 recording','Draft only','KEY CONCEPT','Keep both sides balanced','When you subtract 6 from one side, subtract 6 from the other side too.','Source 02:14–03:01','BILINGUAL SUPPORT','像天平一样保持平衡','Use the balance-scale explanation before introducing inverse operations.','Teacher can edit translation','KNOWLEDGE CHECK','What should happen first?','For 2x + 6 = 18, choose the step that removes +6.','Review answer and feedback','Edit draft','Approve for student view →','· ready for draft generation','GREAT THINKING','Balanced Thinker','+10 learning points','You explained the first step correctly.','Keep learning →'],
  zh: ['课程工作台','课程工作台 · 教师工作流','把课堂录音转成可审核的课程','生成转写初稿、双语学习卡和小测，再由教师审核后发布给学生。','准备开始学习','第 1 步 · 课程来源','添加课堂录音','音频保留在机构批准的工作空间中。本 Demo 仅模拟转换流程。','将音频文件拖放到这里','MP3、M4A 或 WAV · 课堂录音','尚未选择录音','生成审核初稿 →','✓ 发布前必须经教师审核 · 学生数据不会用于训练模型。','第 2 步 · 生成课程','从录音到学习流程','准备就绪','处理中','初稿已生成','等待处理','已完成','转写并区分说话人','带时间戳的原始文本，并标记置信度。','识别课程知识点','映射到选定年级与学科课程标准。','生成双语学习卡','核心概念、图像化解释与常见误区。','创建简短知识检测','教师可编辑并审核所有面向学生的内容。','正在生成课程初稿…','再生成一份初稿','第 3 步 · 教师审核','课程初稿已准备好供教师审核','依据：“七年级代数——保持等式平衡” · 08:42 录音','仅为初稿','核心概念','保持等式两边平衡','如果一边减去 6，另一边也要减去 6。','来源 02:14–03:01','双语支持','像天平一样保持平衡','在介绍逆运算前，先用天平的解释建立直觉。','教师可编辑译文','知识检测','第一步应该做什么？','对于 2x + 6 = 18，选择可以消去 +6 的步骤。','审核答案与反馈','编辑初稿','批准发布到学生端 →','· 可以生成课程初稿','思路很棒','平衡思考者','+10 学习积分','你正确解释了第一步。','继续学习 →']
};

const translationPairs = [
  ['今日学习', 'Today'], ['互动课程', 'Interactive Lessons'], ['学习进度', 'Progress'], ['AI 助教', 'AI Tutor'], ['家长空间', 'Parent Dashboard'],
  ['七年级 · 维多利亚州', 'Year 7 · Victoria'], ['七年级', 'Year 7'], ['数学', 'Mathematics'],
  ['11 月 8 日 · 星期日', 'SUNDAY, 8 NOVEMBER'], ['早上好，Mia', 'Good morning, Mia'],
  ['今天的一小步，会成为明天的大进步。', 'Small steps today become big wins tomorrow.'],
  ['连续学习 5 天', '5 day streak'], ['最佳记录为 8 天', 'Your best is 8 days'],
  ['数学 · 预计 18 分钟', 'MATHEMATICS · 18 MIN'], ['第 3 课 / 共 6 课', 'Lesson 3 of 6'],
  ['解一元一次方程', 'Solving linear equations'],
  ['学习如何保持等式两边平衡，并一步步求出未知数。', 'Learn how to keep an equation balanced while finding the unknown.'],
  ['继续学习', 'Continue lesson'], ['今日计划', 'YOUR PLAN'], ['今天要完成', "Today's learning"], ['查看全部', 'View all'],
  ['一元一次方程', 'Linear equations'], ['继续完成互动课程', 'Continue your lesson'], ['12 分钟', '12 min'],
  ['英语', 'English'], ['寻找文本证据', 'Finding evidence'], ['阅读理解训练', 'Reading comprehension'], ['15 分钟', '15 min'],
  ['科学', 'Science'], ['力与运动', 'Forces & motion'], ['快速复习 · 5 道题', 'Quick review · 5 questions'],
  ['本周', 'THIS WEEK'], ['学习节奏', 'Learning rhythm'], ['142 分钟', '142 min'],
  ['掌握度', 'MASTERY'], ['你正在稳步进步', "You're building momentum"],
  ['本周代数思维提升了', 'Algebraic thinking improved by'], ['查看学习进度', 'See progress'],
  ['七年级数学 · 第 3 课', 'YEAR 7 MATHEMATICS · LESSON 3'], ['分步练习', 'GUIDED PRACTICE'],
  ['保持等式两边平衡', 'Keep both sides balanced'],
  ['等式就像一架平衡的天平。对一边进行的运算，也必须同样作用于另一边。', 'An equation is like a balanced scale. Whatever you do to one side, you must do to the other.'],
  ['求 x 的值', 'SOLVE FOR x'], ['第一步最适合做什么？', 'What is the best first step?'],
  ['等式两边同时加 6', 'Add 6 to both sides'], ['等式两边同时减 6', 'Subtract 6 from both sides'], ['等式两边同时除以 2', 'Divide both sides by 2'],
  ['← 上一步', '← Previous'], ['检查答案', 'Check answer'], ['Bright AI 助教', 'Bright AI Tutor'],
  ['正在陪你学习', 'Here to help'], ['启发式引导', 'SOCRATIC MODE'], ['给我一个提示', 'Give me a hint'],
  ['看一道相似例题', 'Show a similar example'], ['AI 可能会出错，请不要提供个人隐私信息。', "AI can make mistakes. Don't share personal information."],
  ['AI 个性化辅导', 'PERSONALISED AI TUTORING'], ['你好，Mia。哪里需要帮助？', 'Hi Mia. What can I help you with?'],
  ['我会结合当前课程逐步提示，不会一上来直接给出答案。', "I'll use your current lesson to guide you step by step instead of giving away the answer."],
  ['启发式模式', 'Socratic mode'], ['当前课程：一元一次方程', 'Current lesson: Linear equations'],
  ['当前学习内容', 'CURRENT CONTEXT'], ['正在练习', 'CURRENT PROBLEM'], ['你可以这样问', 'TRY ASKING'],
  ['为什么两边要做相同运算？', 'Why do we do the same thing to both sides?'], ['只给提示，不要答案', 'Give me a hint, not the answer'],
  ['出一道相似例题', 'Show me a similar example'], ['已连接课程知识库', 'Connected to the lesson knowledge base'],
  ['儿童安全模式', 'Child-safe mode'],
  ['你可以把不会的题目或步骤发给我。我会先了解你卡在哪里，再给一个小提示。', "Send me the question or step you're stuck on. I'll first find where you're blocked, then give you a small hint."],
  ['为什么要移项？', 'Why do we move terms?'], ['帮我检查步骤', 'Check my steps'],
  ['AI 回复仅用于学习辅助，关键知识和答案由课程规则校验。', 'AI responses support learning; key facts and answers are checked by course rules.'],
  ['学习证据', 'LEARNING EVIDENCE'], ['你的学习进度', 'Your progress'],
  ['掌握度综合独立作答、间隔复习和提示依赖情况计算。', 'Mastery combines independent answers, spaced review and hint use.'],
  ['独立掌握度', 'INDEPENDENT MASTERY'], ['本周提升 8%', 'Up 8% this week'], ['已完成课程', 'LESSONS COMPLETED'],
  ['本学期共 12 节', 'of 12 this term'], ['待复习', 'REVIEW DUE'], ['个知识点', 'knowledge points'],
  ['知识图谱', 'Knowledge map'], ['学习证据今日已更新', 'Evidence updated today'], ['数感', 'Number sense'],
  ['掌握良好', 'Strong'], ['代数思维', 'Algebraic thinking'], ['正在发展', 'Developing'], ['几何', 'Geometry'], ['需要复习', 'Review'],
  ['下一步最佳行动', 'NEXT BEST STEP'], ['完成方程的第一步', 'Complete the first equation step'], ['12 分钟 · 建立“保持平衡”的核心概念', '12 min · Build the core idea of keeping balance'], ['开始 →', 'Start →'], ['开始', 'Start'],
  ['复习提醒', 'REVIEW DUE'], ['分数比较', 'Comparing fractions'], ['上周需要提示 · 建议 4 分钟复习', 'Used a hint last week · 4 min refresh'], ['查看 →', 'View →'], ['查看', 'View'],
  ['独立证据', 'INDEPENDENT EVIDENCE'], ['7 次独立作答', '7 independent attempts'], ['掌握度只计入没有 AI 提示的答案', 'Mastery counts answers completed without AI hints'],
  ['已审核课程内容', 'REVIEWED COURSE CONTENT'], ['核心想法', 'CORE IDEA'], ['两边必须做同样的事', 'Do the same thing to both sides'], ['用图理解', 'SEE IT'], ['把等式想成平衡天平', 'Think of an equation as a balanced scale'], ['数学语言', 'MATHS LANGUAGE'], ['对等式两边应用逆运算', 'Apply inverse operations to both sides'], ['常见误区', 'COMMON TRAP'], ['不能只改变一边', 'You cannot change only one side'],
  ['发现一个可修复的卡点', 'A FIXABLE GAP WAS FOUND'], ['先处理 +6，再处理 2x', 'Handle +6 before 2x'], ['你选择了“先除以 2”。这会让左边仍有 +6，方程没有被简化。', 'You chose to divide first. That leaves +6 on the left, so the equation is not simplified.'], ['2 分钟双语回顾', '2-minute bilingual refresher'], ['再试一次', 'Try again'],
  ['课程依据', 'COURSE BASIS'], ['知识点：保持等式两边平衡', 'Knowledge point: keep both sides balanced'], ['推荐复习路径', 'RECOMMENDED REVIEW PATH'], ['接下来 7 天', 'Your next 7 days'], ['基于独立作答与提示使用', 'Based on independent answers and hint use'], ['今天', 'Today'], ['完成：保持等式平衡', 'Complete: Keep equations balanced'], ['12 分钟 · 完成 2 道独立验证题', '12 min · Complete 2 independent check questions'], ['周五', 'Friday'], ['复习：分数比较', 'Review: Comparing fractions'], ['4 分钟 · 上周曾使用提示', '4 min · A hint was used last week'], ['复习', 'Review'], ['下周一', 'Next Monday'], ['间隔复习：一元一次方程', 'Spaced review: Linear equations'], ['5 分钟 · 检验是否真正记住', '5 min · Check whether it really stuck'], ['计划', 'Scheduled'],
  ['课程：一元一次方程', 'Lesson: Linear equations'], ['已尝试：第 1 步', 'Attempt: Step 1'], ['提示：0', 'Hints: 0'], ['七年级数学', 'Year 7 Mathematics'], ['第 1 步', 'Step 1'],
  ['家长空间 · Mia Chen', 'PARENT DASHBOARD · MIA CHEN'], ['本周学习概览', 'This week at a glance'], ['把重点留给家庭：Mia 的努力、需要支持的一个小点，以及下一次自然的沟通机会。', 'A simple family view: Mia’s effort, one small area to support, and a natural prompt for your next conversation.'], ['本周学习状态', 'THIS WEEK’S LEARNING'], ['稳定投入', 'Steady engagement'], ['已完成 3 / 4 个计划任务', '3 of 4 planned tasks completed'], ['本周学习', 'THIS WEEK'], ['比上周多 18 分钟', '18 min more than last week'], ['独立完成', 'INDEPENDENT WORK'], ['7 次', '7 attempts'], ['没有使用 AI 提示的作答', 'Answers completed without AI hints'], ['需要复习', 'REVIEW DUE'], ['1 个重点', '1 priority'], ['分数比较 · 约 4 分钟', 'Comparing fractions · about 4 min'], ['建议关注', 'A HELPFUL FOCUS'], ['先巩固“等式平衡”', 'Build confidence with equation balance'], ['正在发展', 'DEVELOPING'], ['Mia 理解“对两边做同样的事”，但在遇到', 'Mia understands “do the same thing to both sides,” but when she saw'], ['时，曾尝试先除以 2。', 'she first tried dividing by 2.'], ['今晚可以这样聊', 'A CONVERSATION TO TRY TONIGHT'], ['“如果天平一边少了 6，另一边要怎样做才公平？”', '“If one side of a balance loses 6, what would make the other side fair too?”'], ['不需要讲答案；让 Mia 用自己的话解释即可。', 'No need to teach the answer—ask Mia to explain it in her own words.'], ['查看正在学习的课程 →', 'View current lesson →'], ['家庭支持计划', 'FAMILY SUPPORT PLAN'], ['约 21 分钟', 'about 21 min'], ['鼓励完成 2 道独立验证题', 'Encourage 2 independent check questions'], ['12 分钟 · 重点是解释思路', '12 min · Focus on explaining the thinking'], ['一起复习分数比较', 'Review comparing fractions together'], ['4 分钟 · 用生活例子即可', '4 min · A simple real-life example is enough'], ['间隔回顾一元一次方程', 'Spaced review: linear equations'], ['5 分钟 · 看是否真的记住', '5 min · See whether it really stuck'], ['AI 使用透明度', 'AI USE TRANSPARENCY'], ['本周 AI 助教如何帮助 Mia', 'How Bright AI supported Mia this week'], ['AI 提供的是分步提示和错误解释；独立掌握度不会把使用提示后的答案计入。', 'AI provided step-by-step hints and error explanations; answers completed after a hint are not counted as independent mastery.'], ['次提示请求', 'hint requests'], ['没有直接给出最终答案', 'No final answers given directly'], ['查看使用说明 →', 'View usage guidance →']
];

const zhToEn = new Map(translationPairs);
const enToZh = new Map(translationPairs.map(([zh, en]) => [en, zh]));

function showView(id) {
  views.forEach(view => view.classList.toggle('active-view', view.id === id));
  navItems.forEach(item => item.classList.toggle('active', item.dataset.view === id));
  document.querySelector('.sidebar').classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (id === 'parent' && !parentUnlocked) openEntry('family');
  if (id === 'teacher' && !contentUnlocked) openEntry('content');
}

function translateTextNodes(language) {
  const map = language === 'en' ? zhToEn : enToZh;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    if (node.parentElement?.closest('script, style, .language, .translation, [data-ai-en]')) continue;
    const leading = node.nodeValue.match(/^\s*/)?.[0] ?? '';
    const trailing = node.nodeValue.match(/\s*$/)?.[0] ?? '';
    const value = node.nodeValue.trim();
    if (map.has(value)) node.nodeValue = `${leading}${map.get(value)}${trailing}`;
  }
}

function applyLanguage(language) {
  currentLanguage = language;
  translateTextNodes(language);
  document.documentElement.lang = language === 'en' ? 'en' : 'zh-CN';
  document.title = language === 'en' ? 'BrightPath — Learning demo' : 'BrightPath — 双语学习平台';

  const languageButton = document.querySelector('.language');
  languageButton.childNodes[0].nodeValue = language === 'en' ? '中文 ' : 'EN ';
  document.querySelector('#tutorMessage').placeholder = language === 'en' ? 'Ask your tutor…' : '输入你的问题……';
  document.querySelector('#fullTutorMessage').placeholder = language === 'en' ? 'For example: why do we subtract 6 first?' : '例如：为什么要先减去 6？';
  document.querySelector('.icon-button').setAttribute('aria-label', language === 'en' ? 'Notifications' : '通知');

  const weekdayLabels = language === 'en' ? ['M', 'T', 'W', 'T', 'F', 'S', 'S'] : ['一', '二', '三', '四', '五', '六', '日'];
  document.querySelectorAll('.week-bars small').forEach((label, index) => {
    label.textContent = weekdayLabels[index];
  });

  document.querySelector('.mastery-card > div > p:not(.eyebrow)').innerHTML = language === 'en'
    ? 'Algebraic thinking improved by <b>8%</b> this week.'
    : '本周代数思维提升了 <b>8%</b>。';

  const lessonPrimary = document.querySelector('#chat .bubble.tutor p:not(.translation)');
  const lessonSecondary = document.querySelector('#chat .bubble.tutor .translation');
  lessonPrimary.innerHTML = language === 'en'
    ? 'We want to get <b>x</b> by itself. Which operation would remove the <b>+6</b> from the left side?'
    : '我们要让 <b>x</b> 单独留在左边。什么运算可以消去左边的 <b>+6</b>？';
  lessonSecondary.textContent = language === 'en'
    ? '我们要让 x 单独留在左边。什么运算可以消去左边的 +6？'
    : 'We want to get x by itself. Which operation would remove the +6 from the left side?';

  document.querySelectorAll('.translate').forEach(button => {
    button.textContent = language === 'en' ? '中文解释' : 'English';
  });
  document.querySelectorAll('[data-ai-en]').forEach(element => {
    element.textContent = language === 'en' ? element.dataset.aiEn : element.dataset.aiZh;
    const secondary = element.parentElement.querySelector('.translation');
    if (secondary) secondary.textContent = language === 'en' ? element.dataset.aiZh : element.dataset.aiEn;
  });
  applyStudioLanguage(language);
  applyExtensionLanguage(language);
  applyTeacherLanguage(language);
  renderPoints();
}

function applyTeacherLanguage(language) {
  const nav = document.querySelector('.nav-item[data-view="teacher"]');
  if (!nav) return;
  const c = teacherCopy[language];
  const set = (id, value) => { const el = document.querySelector(`#${id}`); if (el) el.textContent = value; };
  nav.querySelector('b').textContent = c.nav;
  set('teacherEyebrow', c.eyebrow); set('teacherTitle', c.title); set('teacherIntro', c.intro); set('teacherDayLabel', c.today); set('teacherDayValue', c.tasks); set('teacherDaySub', c.attention);
  ['teacherMetric1Label','teacherMetric2Label','teacherMetric3Label','teacherMetric4Label'].forEach((id, index) => set(id, c.labels[index])); ['teacherMetric1Sub','teacherMetric2Sub','teacherMetric3Sub','teacherMetric4Sub'].forEach((id, index) => set(id, c.subs[index]));
  set('classPulseLabel', c.pulse); set('classPulseTitle', c.algebra); set('classPulseBadge', c.live); set('miaStatus', c.mia); set('jamesStatus', c.james); set('avaStatus', c.ava); set('miaMastery', c.developing); set('jamesMastery', c.strong); set('avaMastery', c.review); ['openMia','openJames','openAva'].forEach(id => set(id, c.view)); set('openClass', c.openClass);
  set('reviewQueueLabel', c.queue); set('reviewQueueTitle', c.approval); set('reviewQueueCount', c.items); set('draftTitle', c.draft); set('draftSub', c.draftSub); set('quizTitle', c.quiz); set('quizSub', c.quizSub); set('translationTitle', c.translation); set('translationSub', c.translationSub); set('openStudio', c.openStudio); set('teacherActionsLabel', c.actions); set('teacherActionsTitle', c.human); set('teacherActionsBody', c.actionBody); set('sendNudge', c.nudge); set('createGroup', c.group);
}

function applyExtensionLanguage(language) {
  const c = extensionCopy[language];
  document.querySelector('.role-switcher > small').textContent = c.role;
  document.querySelectorAll('.role-switcher button').forEach((button, index) => { button.textContent = c.roles[index]; });
  document.querySelector('#evidenceToggle').textContent = c.evidence;
  document.querySelectorAll('#evidenceDetails span').forEach((line, index) => { line.innerHTML = c.evidenceLines[index]; });
  document.querySelector('#setWeeklyGoal').textContent = c.goal;
  document.querySelector('#messageTeacher').textContent = c.message;
  document.querySelector('#teacherReviewNote').textContent = c.review;
  document.querySelector('#editDraft').textContent = c.edit;
  document.querySelector('#approveDraft').textContent = c.approve;
  document.querySelectorAll('.subject-picker button').forEach((button, index) => { button.textContent = c.subjects[index]; });
  applySubjectSample();
  applyParentGateLanguage(language);
  renderEntry(language);
}

function renderEntry(language) {
  const c = language === 'en'
    ? { lang: '中文', eyebrow: 'BRIGHTPATH LEARNING', title: 'Choose how you’re joining today', body: 'A private learning space for students and a separate family centre for parents.', child: ['Student sign-in', 'Use your student ID to open your learning space'], family: ['Parent sign-in', 'Student ID plus parent password'], studentKey: ['STUDENT SIGN-IN', 'Enter your student ID', 'Your private learning space includes courses, mistakes, points and parent feedback.', 'Student ID', 'Continue', 'Demo student IDs: 1001 Mia · 1002 James · 1003 Ava'], familyKey: ['PARENT SIGN-IN', 'Enter student ID and parent password', 'This opens your private family centre and one linked student learning summary.', 'Student ID', 'Continue', 'Demo parent password: parent123'], passwordLabel: 'Parent password', error: 'That ID or password does not match. Please try again.' }
    : { lang: 'EN', eyebrow: 'BRIGHTPATH 学习平台', title: '选择今天的登录方式', body: '为学生提供独立学习空间，为家长提供独立家庭中心。', child: ['学生登录', '使用学号进入个人学习空间'], family: ['家长登录', '学号加家长密码'], studentKey: ['学生登录', '输入你的学号', '你的私密学习空间包括课程、错题、积分和家长反馈。', '学号', '继续', 'Demo 学号：1001 Mia · 1002 James · 1003 Ava'], familyKey: ['家长登录', '输入孩子学号和家长密码', '打开私密家庭中心和一个关联学生的学习汇总入口。', '孩子学号', '继续', 'Demo 家长密码：parent123'], passwordLabel: '家长密码', error: '学号或密码不正确，请重试。' };
  document.querySelector('#entryLanguage').textContent = c.lang; document.querySelector('#entryEyebrow').textContent = c.eyebrow; document.querySelector('#entryTitle').textContent = c.title; document.querySelector('#entryBody').textContent = c.body;
  [['entryChildTitle','entryChildSub',c.child],['entryFamilyTitle','entryFamilySub',c.family]].forEach(([title, sub, value]) => { document.querySelector(`#${title}`).textContent = value[0]; document.querySelector(`#${sub}`).textContent = value[1]; });
  const key = entryMode === 'child' ? c.studentKey : c.familyKey;
  document.querySelector('#entryKeyEyebrow').textContent = key[0]; document.querySelector('#entryKeyTitle').textContent = key[1]; document.querySelector('#entryKeyBody').textContent = key[2]; document.querySelector('#entryKeyLabel').textContent = key[3]; document.querySelector('#entryKeySubmit').textContent = key[4]; document.querySelector('#entryKeyHint').textContent = key[5]; document.querySelector('#entryKeyError').dataset.message = c.error;
  document.querySelector('#parentPasswordLabel').textContent = c.passwordLabel;
  document.querySelector('#parentPasswordRow').classList.toggle('hidden', entryMode !== 'family');
}

function applyLearner(id) {
  const learner = learners[id];
  if (!learner) return false;
  activeLearner = { id, ...learner };
  sessionStorage.setItem('brightpath-active-learner', JSON.stringify(activeLearner));
  pointsBalance = learner.points;
  document.querySelector('.profile-card .avatar').textContent = learner.initials[0];
  document.querySelector('.profile-card strong').textContent = learner.name;
  document.querySelector('.profile-card small').textContent = learner.grade;
  document.querySelector('#dashboard .welcome-row h1').innerHTML = `Good morning, ${learner.name.split(' ')[0]} <span>👋</span>`;
  document.querySelector('#dashboard .mastery-card .ring span').innerHTML = `${learner.mastery.replace('%','')}<small>%</small>`;
  document.querySelector('#dashboard .week-card .card-title span').textContent = `${learner.minutes} minutes`;
  document.querySelector('#parent .parent-hero .eyebrow').textContent = `PARENT CENTRE · LINKED TO ${learner.name.toUpperCase()}`;
  document.querySelector('#parent .parent-plan h3').textContent = `Linked student: ${learner.name}`;
  const feedback = localStorage.getItem(`brightpath-parent-feedback-${id}`) || '“I noticed you kept trying even when the equation felt tricky. I’m proud of your patience—keep going!”';
  document.querySelector('#studentParentFeedback').textContent = feedback;
  document.querySelector('#studentParentFeedbackMeta').textContent = `From your parent · ${currentLanguage === 'en' ? 'today' : '今天'}`;
  renderPoints();
  return true;
}

function openTeacherStudent(id) {
  if (!applyLearner(id)) { showToast(currentLanguage === 'en' ? 'No learner matches that student ID.' : '没有匹配该学号的学生。'); return; }
  const learner = activeLearner;
  const summary = document.querySelector('#teacherStudentSummary');
  summary.innerHTML = `<div><p class="eyebrow">INDIVIDUAL LEARNER · ${learner.id}</p><h3>${learner.name}</h3><p>Independent mastery <b>${learner.mastery}</b> · ${learner.minutes} minutes this week · Current focus: <b>${learner.focus}</b></p></div><div><button class="secondary-button" id="openStudentLearning">Open student learning view →</button></div>`;
  summary.classList.remove('hidden');
  summary.querySelector('#openStudentLearning').addEventListener('click', () => showView('dashboard'));
}

function openEntry(mode = null) {
  entryMode = mode;
  const gate = document.querySelector('#entryGate');
  gate.classList.remove('hidden');
  document.querySelector('#entryChoices').classList.toggle('hidden', Boolean(mode));
  document.querySelector('#entryKeyForm').classList.toggle('hidden', !mode);
  document.querySelector('#entryKeyInput').value = '';
  document.querySelector('#parentPasswordInput').value = '';
  document.querySelector('#entryKeyError').classList.add('hidden');
  renderEntry(currentLanguage);
}

function applyParentGateLanguage(language) {
  const copy = language === 'en'
    ? ['PARENT ACCESS', 'This space is for parents', 'Enter your family access key to view reports, goals and learning support.', 'Family access key', 'Enter key', 'Unlock', 'Demo key: 2026 · In production, use guardian sign-in or a managed PIN.', '← Return to child learning', 'That key does not match. Please try again.']
    : ['家长访问', '此页面仅供家长使用', '请输入家庭访问密钥，查看学习报告、目标和支持建议。', '家庭访问密钥', '输入密钥', '解锁', 'Demo 密钥：2026 · 正式产品应使用家长登录或受管 PIN。', '← 返回孩子学习页', '密钥不正确，请重试。'];
  const ids = ['parentGateEyebrow','parentGateTitle','parentGateBody','parentKeyLabel'];
  ids.forEach((id, index) => document.querySelector(`#${id}`).textContent = copy[index]);
  document.querySelector('#parentKeyInput').placeholder = copy[4]; document.querySelector('#unlockParent').textContent = copy[5]; document.querySelector('#parentGateHint').textContent = copy[6]; document.querySelector('#returnToChild').textContent = copy[7]; document.querySelector('#parentGateError').dataset.message = copy[8];
}

function applySubjectSample() {
  const samples = {
    math: { en: ['Keep both sides balanced', 'When you subtract 6 from one side, subtract 6 from the other side too.', '像天平一样保持平衡', 'What should happen first?', 'For 2x + 6 = 18, choose the step that removes +6.'], zh: ['保持等式两边平衡', '如果一边减去 6，另一边也要减去 6。', '像天平一样保持平衡', '第一步应该做什么？', '对于 2x + 6 = 18，选择可以消去 +6 的步骤。'] },
    english: { en: ['Use evidence from the text', 'Find the sentence that supports your answer before you explain it.', '先找证据，再表达观点', 'Which sentence is the best evidence?', 'Choose the line that directly supports the main idea.'], zh: ['用文本证据支持观点', '先找到支持答案的句子，再进行解释。', '先找证据，再表达观点', '哪一句是最好的证据？', '选择最直接支持中心思想的句子。'] },
    science: { en: ['Forces can change motion', 'Compare the direction and size of pushes before predicting movement.', '力会改变运动状态', 'What happens when forces are unbalanced?', 'Choose the prediction that matches the direction of the stronger force.'], zh: ['力会改变运动状态', '比较力的方向和大小，再预测物体如何运动。', '力会改变运动状态', '当力不平衡时会发生什么？', '选择符合较大力方向的预测。'] }
  };
  const values = samples[selectedSubject][currentLanguage];
  const cards = [...document.querySelectorAll('.result-grid article')];
  if (!cards.length) return;
  cards[0].querySelector('h3').textContent = values[0]; cards[0].querySelector('p').textContent = values[1]; cards[1].querySelector('h3').textContent = values[2]; cards[2].querySelector('h3').textContent = values[3]; cards[2].querySelector('p').textContent = values[4];
}

function showToast(message) {
  const toast = document.querySelector('#demoToast');
  toast.textContent = message;
  toast.classList.remove('hidden');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.add('hidden'), 3400);
}

function renderPoints() {
  const label = currentLanguage === 'en' ? 'BrightPoints' : '积分';
  const target = currentLanguage === 'en' ? '260 points to unlock the Coral Explorer accessory' : '再获得 260 积分即可解锁珊瑚探索者装饰';
  document.querySelector('#pointsBalance').textContent = pointsBalance.toLocaleString();
  document.querySelector('#pointsPill small').textContent = label;
  document.querySelector('.points-progress small').textContent = `${label} · ${currentLanguage === 'en' ? 'Level 3' : '等级 3'}`;
  document.querySelector('.points-progress strong').textContent = target;
  document.querySelector('#pointsTrack').style.width = `${Math.min(100, ((pointsBalance - 1000) / 500) * 100)}%`;
}

function awardPoints(amount, reason) {
  pointsBalance += amount;
  localStorage.setItem('brightpath-points', String(pointsBalance));
  document.querySelector('#rewardOverlay span').textContent = `+${amount} ${currentLanguage === 'en' ? 'learning points' : '学习积分'}`;
  document.querySelector('#rewardOverlay small').textContent = reason;
  renderPoints();
}

function applyStudioLanguage(language) {
  const c = studioCopy[language];
  const studio = document.querySelector('#studio');
  const studioNav = document.querySelector('.nav-item[data-view="studio"]');
  if (!studio || !studioNav) return;
  const set = (selector, value) => { const el = studio.querySelector(selector); if (el) el.textContent = value; };
  studioNav.querySelector('b').textContent = c[0];
  set('.studio-hero .eyebrow', c[1]); set('.studio-hero h1', c[2]); set('.studio-hero > div:first-child > p:last-child', c[3]); set('.studio-buddy small', c[4]);
  set('.upload-card > .eyebrow', c[5]); set('.upload-card h3', c[6]); set('.upload-card > p:nth-of-type(2)', c[7]); set('.audio-drop strong', c[8]); set('.audio-drop small', c[9]); set('#recordingFileName', recordingFile.files[0] ? `${recordingFile.files[0].name} ${c[48]}` : c[10]); set('#generateCourse', generateCourse.disabled ? c[28] : (studioResult.classList.contains('hidden') ? c[11] : c[29])); set('.privacy-line', c[12]);
  set('.conversion-card .eyebrow', c[13]); set('.conversion-card h3', c[14]); const status = studioStatus.dataset.state || 'ready'; set('#studioStatus', status === 'done' ? c[17] : status === 'working' ? c[16] : c[15]);
  const steps = [...studio.querySelectorAll('#conversionSteps li')]; [[20,21],[22,23],[24,25],[26,27]].forEach(([title, body], index) => { set(`#conversionSteps li:nth-child(${index + 1}) strong`, c[title]); set(`#conversionSteps li:nth-child(${index + 1}) p`, c[body]); const state = steps[index].dataset.state || (index === 0 ? 'ready' : 'queued'); set(`#conversionSteps li:nth-child(${index + 1}) b`, state === 'done' ? c[19] : state === 'working' ? c[16] : state === 'ready' ? c[15] : c[18]); });
  set('#studioResult .eyebrow', c[30]); set('#studioResult h2', c[31]); set('#studioResult .result-heading p', c[32]); set('#studioResult .result-heading > span', c[33]); const cards = [...studio.querySelectorAll('.result-grid article')]; [[34,35,36,37],[38,39,40,41],[42,43,44,45]].forEach((list, index) => { const card = cards[index]; if (!card) return; card.querySelector('small').textContent = c[list[0]]; card.querySelector('h3').textContent = c[list[1]]; card.querySelector('p').textContent = c[list[2]]; card.querySelector('em').textContent = c[list[3]]; }); set('.result-actions .secondary-button', c[46]); set('.result-actions .primary-button', c[47]);
  const reward = document.querySelector('#rewardOverlay'); reward.querySelector('p').textContent = c[49]; reward.querySelector('h2').textContent = c[50]; reward.querySelector('span').textContent = c[51]; reward.querySelector('small').textContent = c[52]; reward.querySelector('#closeReward').textContent = c[53];
  const retry = document.querySelector('#retryOverlay'); const feedback = feedbackCopy[language]; retry.querySelector('p').textContent = feedback.retryEyebrow; retry.querySelector('h2').textContent = feedback.retryTitle; retry.querySelector('strong').textContent = feedback.retryLead; retry.querySelector('small').textContent = feedback.retryBody; retry.querySelector('#closeRetry').textContent = feedback.retryButton;
}

document.querySelectorAll('[data-view]').forEach(button => {
  button.addEventListener('click', () => showView(button.dataset.view));
});
document.querySelectorAll('[data-role]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-role]').forEach(item => item.classList.toggle('active', item === button));
    showView(button.dataset.role === 'student' ? 'dashboard' : button.dataset.role === 'parent' ? 'parent' : 'teacher');
  });
});
document.querySelector('#continueLesson').addEventListener('click', () => showView('lesson'));
document.querySelector('.mobile-menu').addEventListener('click', () => document.querySelector('.sidebar').classList.toggle('open'));
document.querySelector('.language').addEventListener('click', () => applyLanguage(currentLanguage === 'en' ? 'zh' : 'en'));
document.querySelector('#entryLanguage').addEventListener('click', () => applyLanguage(currentLanguage === 'en' ? 'zh' : 'en'));
document.querySelectorAll('[data-entry]').forEach(button => button.addEventListener('click', () => {
  openEntry(button.dataset.entry);
}));
document.querySelector('#entryBack').addEventListener('click', () => openEntry());
document.querySelector('#entryKeyForm').addEventListener('submit', event => {
  event.preventDefault();
  const entered = document.querySelector('#entryKeyInput').value.trim().toUpperCase();
  const parentPassword = document.querySelector('#parentPasswordInput').value;
  const valid = entryMode === 'child' ? Boolean(learners[entered]) : entryMode === 'family' ? Boolean(learners[entered]) && parentPassword === 'parent123' : entered === 'T-2026';
  const error = document.querySelector('#entryKeyError');
  if (valid) {
    document.querySelector('#entryGate').classList.add('hidden');
    if (entryMode === 'child') { document.body.classList.remove('teacher-mode', 'parent-mode'); applyLearner(entered); showView('dashboard'); }
    else if (entryMode === 'family') { document.body.classList.remove('teacher-mode'); document.body.classList.add('parent-mode'); parentUnlocked = true; sessionStorage.setItem('brightpath-parent-unlocked', 'true'); applyLearner(entered); showView('parent'); }
    else { error.textContent = error.dataset.message; error.classList.remove('hidden'); }
  } else { error.textContent = error.dataset.message; error.classList.remove('hidden'); }
});
document.querySelector('#evidenceToggle').addEventListener('click', () => document.querySelector('#evidenceDetails').classList.toggle('hidden'));
document.querySelector('#setWeeklyGoal').addEventListener('click', () => { const message = extensionCopy[currentLanguage].goalDone; document.querySelector('#parentActionNote').textContent = message; showToast(message); });
document.querySelector('#messageTeacher').addEventListener('click', () => { const message = extensionCopy[currentLanguage].messageDone; document.querySelector('#parentActionNote').textContent = message; showToast(message); });
document.querySelector('#familySettings').addEventListener('click', () => { const message = currentLanguage === 'en' ? 'Account and privacy settings are ready to review.' : '账户与隐私设置已准备好查看。'; document.querySelector('#parentActionNote').textContent = message; showToast(message); });
document.querySelector('#sendParentFeedback').addEventListener('click', () => { const input = document.querySelector('#parentFeedbackInput'); const message = input.value.trim(); if (!message) { showToast(currentLanguage === 'en' ? 'Write a short message for your child first.' : '请先写一段给孩子的反馈。'); return; } const learnerId = activeLearner?.id || '1001'; localStorage.setItem(`brightpath-parent-feedback-${learnerId}`, `“${message}”`); document.querySelector('#parentActionNote').textContent = currentLanguage === 'en' ? 'Feedback sent to your child’s learning space.' : '反馈已发送到孩子的学习空间。'; input.value = ''; showToast(document.querySelector('#parentActionNote').textContent); });
document.querySelectorAll('.subject-picker button').forEach(button => button.addEventListener('click', () => { selectedSubject = button.dataset.subject; document.querySelectorAll('.subject-picker button').forEach(item => item.classList.toggle('active', item === button)); applySubjectSample(); }));
document.querySelector('#editDraft').addEventListener('click', () => { const message = extensionCopy[currentLanguage].editing; document.querySelector('#teacherReviewNote').textContent = message; showToast(message); });
document.querySelector('#approveDraft').addEventListener('click', () => { const message = extensionCopy[currentLanguage].published; document.querySelector('#teacherReviewNote').textContent = message; document.querySelector('#approveDraft').disabled = true; showToast(message); });
document.querySelector('#openStudio').addEventListener('click', () => showView('studio'));
document.querySelectorAll('#reviewDraft, #reviewQuiz, #reviewTranslation').forEach(button => button.addEventListener('click', () => { showView('studio'); showToast(currentLanguage === 'en' ? 'Opened the matching draft in Course Studio.' : '已在课程工作台中打开对应初稿。'); }));
document.querySelector('#sendNudge').addEventListener('click', () => showToast(teacherCopy[currentLanguage].nudgeToast));
document.querySelector('#createGroup').addEventListener('click', () => showToast(teacherCopy[currentLanguage].groupToast));
document.querySelector('#viewChildMode').addEventListener('click', () => showView('dashboard'));
document.querySelector('#learnerLookup').addEventListener('submit', event => { event.preventDefault(); openTeacherStudent(document.querySelector('#teacherStudentId').value.trim()); });
document.querySelectorAll('#openMia, #openJames, #openAva').forEach((button, index) => button.addEventListener('click', () => openTeacherStudent(['1001','1002','1003'][index])));
document.querySelector('#unlockParent').addEventListener('click', () => {
  const error = document.querySelector('#parentGateError');
  if (document.querySelector('#parentKeyInput').value === '2026') { parentUnlocked = true; sessionStorage.setItem('brightpath-parent-unlocked', 'true'); document.querySelector('#parentGate').classList.add('hidden'); error.classList.add('hidden'); showToast(currentLanguage === 'en' ? 'Parent access unlocked for this session.' : '本次会话的家长访问已解锁。'); }
  else { error.textContent = error.dataset.message; error.classList.remove('hidden'); }
});
document.querySelector('#parentKeyInput').addEventListener('keydown', event => { if (event.key === 'Enter') document.querySelector('#unlockParent').click(); });
document.querySelector('#returnToChild').addEventListener('click', () => { document.querySelector('#parentGate').classList.add('hidden'); showView('dashboard'); });

const recordingFile = document.querySelector('#recordingFile');
const recordingFileName = document.querySelector('#recordingFileName');
const generateCourse = document.querySelector('#generateCourse');
const studioStatus = document.querySelector('#studioStatus');
const studioResult = document.querySelector('#studioResult');

recordingFile.addEventListener('change', () => {
  recordingFileName.textContent = recordingFile.files[0]
    ? `${recordingFile.files[0].name} ${studioCopy[currentLanguage][48]}`
    : studioCopy[currentLanguage][10];
});

generateCourse.addEventListener('click', () => {
  const steps = [...document.querySelectorAll('#conversionSteps li')];
  generateCourse.disabled = true;
  generateCourse.textContent = studioCopy[currentLanguage][28];
  studioStatus.dataset.state = 'working';
  studioStatus.textContent = studioCopy[currentLanguage][16];
  studioResult.classList.add('hidden');
  steps.forEach((step, index) => {
    step.classList.toggle('active', index === 0);
    step.classList.remove('complete');
    step.dataset.state = index === 0 ? 'working' : 'queued';
    step.querySelector('b').textContent = index === 0 ? studioCopy[currentLanguage][16] : studioCopy[currentLanguage][18];
  });
  steps.forEach((step, index) => {
    setTimeout(() => {
      if (index > 0) {
        steps[index - 1].classList.remove('active');
        steps[index - 1].classList.add('complete');
        steps[index - 1].dataset.state = 'done';
        steps[index - 1].querySelector('b').textContent = studioCopy[currentLanguage][19];
      }
      step.classList.add('active');
      step.dataset.state = 'working';
      step.querySelector('b').textContent = studioCopy[currentLanguage][16];
      if (index === steps.length - 1) {
        setTimeout(() => {
          step.classList.remove('active');
          step.classList.add('complete');
          step.dataset.state = 'done';
          step.querySelector('b').textContent = studioCopy[currentLanguage][19];
          studioStatus.dataset.state = 'done';
          studioStatus.textContent = studioCopy[currentLanguage][17];
          generateCourse.textContent = studioCopy[currentLanguage][29];
          generateCourse.disabled = false;
          studioResult.classList.remove('hidden');
          studioResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 550);
      }
    }, index * 650);
  });
});

let selectedAnswer = null;
document.querySelectorAll('[data-answer]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-answer]').forEach(answer => answer.classList.remove('selected'));
    button.classList.add('selected');
    selectedAnswer = button;
    document.querySelector('.check-answer').disabled = false;
  });
});

document.querySelector('.check-answer').addEventListener('click', async () => {
  if (!selectedAnswer) return;
  const correct = selectedAnswer.dataset.answer === 'correct';
  selectedAnswer.classList.add(correct ? 'correct' : 'wrong');
  const repairPanel = document.querySelector('#repairPanel');
  document.querySelector('.answer-feedback').textContent = currentLanguage === 'en'
    ? (correct ? '✓ Nice work. Subtracting 6 keeps the equation balanced.' : 'Not quite. Look for the operation that removes +6 first.')
    : (correct ? '✓ 做得很好！两边同时减 6，可以继续保持等式平衡。' : '还差一点。先找出能够消去 +6 的相反运算。');
  if (correct) {
    repairPanel.classList.add('hidden');
    if (!questionRewardClaimed) {
      questionRewardClaimed = true;
      awardPoints(10, currentLanguage === 'en' ? 'You explained the first step correctly.' : '你正确解释了第一步。');
    }
    showReward();
    await sendTutorMessage(currentLanguage === 'en' ? 'subtract 6 from both sides' : '等式两边同时减 6', 'chat');
  } else {
    repairPanel.classList.remove('hidden');
    showRetryEncouragement();
    await sendTutorMessage(currentLanguage === 'en' ? 'I divided first. Can you help me understand why?' : '我先除以 2 了，为什么不行？', 'chat');
  }
});

function bindRepairActions() {
  document.querySelector('#showRefresher')?.addEventListener('click', showRefresher);
  document.querySelector('#retryQuestion')?.addEventListener('click', resetQuestion);
}

function showRefresher() {
  const panel = document.querySelector('#repairPanel');
  const isEnglish = currentLanguage === 'en';
  panel.innerHTML = isEnglish
    ? '<div class="repair-symbol">✓</div><div><small>2-MINUTE REFRESHER</small><h3>Undo addition before division</h3><p>To make <b>2x + 6</b> simpler, first undo the <b>+6</b>. Subtract 6 from both sides: <b>2x = 12</b>. Then divide both sides by 2.</p><div><button class="primary-button" id="resumePractice">I understand — try again</button></div></div>'
    : '<div class="repair-symbol">✓</div><div><small>2 分钟回顾</small><h3>先撤销加法，再处理乘法</h3><p>要让 <b>2x + 6</b> 更简单，先撤销 <b>+6</b>。等式两边同时减去 6：<b>2x = 12</b>。然后再等式两边除以 2。</p><div><button class="primary-button" id="resumePractice">我明白了，再试一次</button></div></div>';
  document.querySelector('#resumePractice').addEventListener('click', resetQuestion);
}

bindRepairActions();

function resetQuestion() {
  selectedAnswer = null;
  questionRewardClaimed = false;
  document.querySelectorAll('[data-answer]').forEach(answer => answer.classList.remove('selected', 'wrong', 'correct'));
  document.querySelector('.check-answer').disabled = true;
  document.querySelector('.answer-feedback').textContent = '';
  const panel = document.querySelector('#repairPanel');
  panel.innerHTML = repairInitialHtml;
  panel.classList.add('hidden');
  bindRepairActions();
  translateTextNodes(currentLanguage);
}

document.querySelector('.translate').addEventListener('click', event => {
  event.currentTarget.nextElementSibling.classList.toggle('hidden');
});

document.querySelectorAll('.quick-prompts button').forEach(button => {
  button.addEventListener('click', () => sendTutorMessage(button.textContent, button.parentElement.dataset.chat));
});

document.querySelectorAll('.tutor-input').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    const input = form.querySelector('input');
    const message = input.value.trim();
    if (message) sendTutorMessage(message, form.dataset.chat);
    input.value = '';
  });
});

document.querySelectorAll('[data-prompt]').forEach(button => {
  button.addEventListener('click', () => sendTutorMessage(button.textContent, 'fullTutorChat'));
});

async function sendTutorMessage(message, chatId = 'chat') {
  const chat = document.querySelector(`#${chatId}`);
  chat.insertAdjacentHTML('beforeend', `<div class="bubble user"><p>${escapeHtml(message)}</p></div>`);
  try {
    const response = await fetch('/api/tutor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, lesson_id: 'math-y7-linear-03', mode: 'Socratic' })
    });
    const data = await response.json();
    const primary = currentLanguage === 'en' ? data.translation : data.message;
    const secondary = currentLanguage === 'en' ? data.message : data.translation;
    const citation = currentLanguage === 'en' ? 'Source: Reviewed Year 7 Mathematics lesson · Algebra' : '依据：已审核七年级数学课程 · 代数';
    chat.insertAdjacentHTML('beforeend', `<div class="bubble tutor"><small>${currentLanguage === 'en' ? 'SOCRATIC MODE' : '启发式引导'}</small><p data-ai-en="${escapeAttribute(data.translation)}" data-ai-zh="${escapeAttribute(data.message)}">${escapeHtml(primary)}</p><span class="bubble-citation">${citation}</span><button class="translate inline-translate">${currentLanguage === 'en' ? '中文解释' : 'English'}</button><p class="translation hidden">${escapeHtml(secondary)}</p></div>`);
    chat.querySelectorAll('.inline-translate').forEach(button => {
      button.onclick = () => button.nextElementSibling.classList.toggle('hidden');
    });
  } catch {
    const fallback = currentLanguage === 'en'
      ? 'Start by undoing +6. What is the opposite operation?'
      : '先想一想：+6 的相反运算是什么？我们从这一步开始。';
    chat.insertAdjacentHTML('beforeend', `<div class="bubble tutor"><p>${fallback}</p></div>`);
  }
  chat.scrollTop = chat.scrollHeight;
}

function escapeHtml(value) {
  const div = document.createElement('div');
  div.textContent = value;
  return div.innerHTML;
}

function escapeAttribute(value) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function showReward() {
  const overlay = document.querySelector('#rewardOverlay');
  const field = overlay.querySelector('.confetti-field');
  field.innerHTML = Array.from({ length: 34 }, (_, index) => `<i style="--x:${(index * 37) % 96}%;--d:${.45 + (index % 8) * .09}s;--r:${(index * 47) % 360}deg"></i>`).join('');
  overlay.classList.remove('hidden');
}

document.querySelector('#closeReward').addEventListener('click', () => document.querySelector('#rewardOverlay').classList.add('hidden'));

function showRetryEncouragement() {
  const overlay = document.querySelector('#retryOverlay');
  overlay.classList.remove('hidden');
}

document.querySelector('#closeRetry').addEventListener('click', () => {
  document.querySelector('#retryOverlay').classList.add('hidden');
  document.querySelector('#retryQuestion')?.click();
});

applyLanguage('en');
