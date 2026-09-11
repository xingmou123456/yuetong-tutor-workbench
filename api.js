// api.js — 异步 API Stub，演示未来真实接口形态，当前返回 mock 数据

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
}

// ========== 学生档案 ==========

// TODO: replace with GET /api/students
async function fetchStudents() {
  await delay(300);
  return { code: 0, data: window.YTData.DB.students };
}

// TODO: replace with GET /api/students/:id
async function fetchStudent(id) {
  await delay(200);
  const student = window.YTData.DB.students.find((s) => s.id === id);
  return { code: student ? 0 : 404, data: student || null };
}

// TODO: replace with POST /api/students
async function createStudent(payload) {
  await delay(400);
  const student = { id: uid("s"), createdAt: new Date().toISOString().slice(0, 10), feedbacks: [], ...payload };
  window.YTData.DB.students.push(student);
  window.YTData.save();
  return { code: 0, data: student };
}

// TODO: replace with PUT /api/students/:id
async function updateStudent(id, payload) {
  await delay(400);
  const idx = window.YTData.DB.students.findIndex((s) => s.id === id);
  if (idx === -1) return { code: 404, data: null };
  window.YTData.DB.students[idx] = { ...window.YTData.DB.students[idx], ...payload };
  window.YTData.save();
  return { code: 0, data: window.YTData.DB.students[idx] };
}

// TODO: replace with DELETE /api/students/:id
async function deleteStudent(id) {
  await delay(300);
  window.YTData.DB.students = window.YTData.DB.students.filter((s) => s.id !== id);
  window.YTData.save();
  return { code: 0 };
}

// TODO: replace with POST /api/students/:id/feedbacks
async function addFeedback(studentId, feedback) {
  await delay(300);
  const student = window.YTData.DB.students.find((s) => s.id === studentId);
  if (!student) return { code: 404 };
  student.feedbacks.unshift({ id: uid("f"), date: new Date().toISOString().slice(0, 10), ...feedback });
  window.YTData.save();
  return { code: 0, data: student };
}

// ========== AI 教案 ==========

// TODO: replace with POST /api/ai/lesson-plan （调用 LLM）
async function generateLessonPlan({ studentId, topic }) {
  await delay(1200);
  const student = window.YTData.DB.students.find((s) => s.id === studentId);
  const studentName = student ? student.name : "学生";
  const subject = student ? student.subject : "";

  const templates = [
    {
      objectives: `理解${topic}的核心概念；能够独立完成基础${topic}题目；能用自己语言复述关键步骤。`,
      explanation: `${topic}是${subject}学习中的重要一环。本节课从生活实例出发，先建立直观理解，再抽象出一般方法。`,
      examples: `例题：请结合${topic}完成一道典型题目。\n解：先分析已知条件，再选择合适方法，最后检验答案合理性。`,
      interaction: `学生先尝试独立讲解思路，教师通过追问引导；设置2分钟小组讨论，鼓励学生互相补充。`,
      homework: `完成课后练习3题，并用自己的话总结${topic}的解题步骤。`
    }
  ];
  const t = templates[0];
  return {
    code: 0,
    data: {
      id: uid("lp"),
      studentId,
      studentName,
      topic,
      objectives: t.objectives,
      explanation: t.explanation,
      examples: t.examples,
      interaction: t.interaction,
      homework: t.homework,
      createdAt: new Date().toISOString().slice(0, 10)
    }
  };
}

// TODO: replace with POST /api/lesson-plans
async function saveLessonPlan(plan) {
  await delay(400);
  const existing = window.YTData.DB.lessonPlans.find((p) => p.id === plan.id);
  if (existing) {
    Object.assign(existing, plan);
  } else {
    window.YTData.DB.lessonPlans.unshift(plan);
  }
  window.YTData.save();
  return { code: 0, data: plan };
}

// TODO: replace with GET /api/lesson-plans
async function fetchLessonPlans() {
  await delay(300);
  return { code: 0, data: window.YTData.DB.lessonPlans };
}

// TODO: replace with DELETE /api/lesson-plans/:id
async function deleteLessonPlan(id) {
  await delay(300);
  window.YTData.DB.lessonPlans = window.YTData.DB.lessonPlans.filter((p) => p.id !== id);
  window.YTData.save();
  return { code: 0 };
}

// ========== 作业生成 ==========

// TODO: replace with POST /api/ai/homework
async function generateHomework({ topic, difficulty, count, types }) {
  await delay(1400);
  const questions = [];
  for (let i = 1; i <= count; i++) {
    const type = types[i % types.length] || "解答题";
    questions.push({
      number: i,
      type,
      question: `【${type}】关于「${topic}」的第${i}道${difficulty}难度练习题（请根据实际题目替换）。`,
      answer: `答案${i}：略（请根据实际题目补充详细答案与解析）。`,
      analysis: `解析${i}：本题考查${topic}，解题关键在于理解概念并灵活运用。`
    });
  }
  const homework = {
    id: uid("h"),
    topic,
    difficulty,
    count,
    types,
    questions,
    createdAt: new Date().toISOString().slice(0, 10)
  };
  window.YTData.DB.homeworks.unshift(homework);
  window.YTData.save();
  return { code: 0, data: homework };
}

// ========== 学习报告 ==========

// TODO: replace with POST /api/ai/report
async function generateReport({ studentId, startDate, endDate }) {
  await delay(1300);
  const student = window.YTData.DB.students.find((s) => s.id === studentId);
  if (!student) return { code: 404, data: null };

  const feedbacks = student.feedbacks.filter((f) => f.date >= startDate && f.date <= endDate);
  const report = {
    id: uid("r"),
    studentId,
    studentName: student.name,
    startDate,
    endDate,
    content: `本阶段（${startDate} 至 ${endDate}）共记录 ${feedbacks.length} 次课后反馈，重点围绕${student.subject}的${student.weakPoints}展开。`,
    highlights: feedbacks.length
      ? "课堂参与积极，能按要求完成课后任务；薄弱知识点有明显改善。"
      : "暂无该时间段反馈记录，建议先填写课后反馈。",
    improvements: "对复杂综合题仍需加强审题；建议建立错题本并定期复盘。",
    nextPlan: "下一阶段继续巩固基础，每周增加1次限时小测，培养应试节奏。"
  };
  window.YTData.DB.reports.unshift(report);
  window.YTData.save();
  return { code: 0, data: report };
}

// 暴露全局
window.YTApi = {
  fetchStudents,
  fetchStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  addFeedback,
  generateLessonPlan,
  saveLessonPlan,
  fetchLessonPlans,
  deleteLessonPlan,
  generateHomework,
  generateReport
};
