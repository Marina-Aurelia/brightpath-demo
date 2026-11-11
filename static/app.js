const views = [...document.querySelectorAll('.view')];
const navItems = [...document.querySelectorAll('.nav-item[data-view]')];
let currentLanguage = 'en';

const translationPairs = [
  ['今日学习', 'Today'], ['互动课程', 'Interactive Lessons'], ['学习进度', 'Progress'], ['AI 助教', 'AI Tutor'],
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
  ['掌握良好', 'Strong'], ['代数思维', 'Algebraic thinking'], ['正在发展', 'Developing'], ['几何', 'Geometry'], ['需要复习', 'Review']
];

const zhToEn = new Map(translationPairs);
const enToZh = new Map(translationPairs.map(([zh, en]) => [en, zh]));

function showView(id) {
  views.forEach(view => view.classList.toggle('active-view', view.id === id));
  navItems.forEach(item => item.classList.toggle('active', item.dataset.view === id));
  document.querySelector('.sidebar').classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
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
}

document.querySelectorAll('[data-view]').forEach(button => {
  button.addEventListener('click', () => showView(button.dataset.view));
});
document.querySelector('#continueLesson').addEventListener('click', () => showView('lesson'));
document.querySelector('.mobile-menu').addEventListener('click', () => document.querySelector('.sidebar').classList.toggle('open'));
document.querySelector('.language').addEventListener('click', () => applyLanguage(currentLanguage === 'en' ? 'zh' : 'en'));

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
  document.querySelector('.answer-feedback').textContent = currentLanguage === 'en'
    ? (correct ? '✓ Nice work. Subtracting 6 keeps the equation balanced.' : 'Not quite. Look for the operation that removes +6 first.')
    : (correct ? '✓ 做得很好！两边同时减 6，可以继续保持等式平衡。' : '还差一点。先找出能够消去 +6 的相反运算。');
  await sendTutorMessage(correct ? (currentLanguage === 'en' ? 'subtract 6 from both sides' : '等式两边同时减 6') : (currentLanguage === 'en' ? 'I need a hint' : '我需要一个提示'), 'chat');
});

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
    chat.insertAdjacentHTML('beforeend', `<div class="bubble tutor"><small>${currentLanguage === 'en' ? 'SOCRATIC MODE' : '启发式引导'}</small><p data-ai-en="${escapeAttribute(data.translation)}" data-ai-zh="${escapeAttribute(data.message)}">${escapeHtml(primary)}</p><button class="translate inline-translate">${currentLanguage === 'en' ? '中文解释' : 'English'}</button><p class="translation hidden">${escapeHtml(secondary)}</p></div>`);
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

applyLanguage('en');
