// mock.js — 月瞳家教工作台 MVP 假数据与本地存储封装

const STORAGE_KEY = "yuetong_tutor_data_v2";

// 演示用示例数据（保留参考，但新用户默认不加载）
const DEFAULT_STUDENTS = [
  {
    id: "s1",
    name: "林小满",
    grade: "初一",
    subject: "数学",
    weakPoints: "一元一次方程应用题、几何证明入门",
    habits: "喜欢先自己思考，遇到卡壳会沉默较长时间",
    personality: "内向但认真，鼓励后更愿意开口",
    parentExpectation: "希望培养解题思路，期中考试能上80分",
    createdAt: "2026-08-15",
    feedbacks: [
      {
        id: "f1",
        date: "2026-09-05",
        content: "今日重点讲解一元一次方程行程问题，小满能独立列出等量关系，但对「相向而行」场景仍需画图辅助。",
        nextGoals: "完成5道行程问题变式，尝试口头复述思路"
      },
      {
        id: "f2",
        date: "2026-09-08",
        content: "继续练习方程应用题，正确率较上次提升，能主动用线段图分析。",
        nextGoals: "加入利润问题，强化设未知数的能力"
      }
    ]
  },
  {
    id: "s2",
    name: "陈雨桐",
    grade: "小学五年级",
    subject: "语文",
    weakPoints: "阅读理解概括段意、作文结构松散",
    habits: "阅读速度快但容易漏细节，喜欢讲故事",
    personality: "活泼外向，需要适时拉回注意力",
    parentExpectation: "提升阅读答题规范性，作文能写够400字",
    createdAt: "2026-08-20",
    feedbacks: [
      {
        id: "f3",
        date: "2026-09-06",
        content: "训练「找中心句」方法，雨桐能较快定位，但概括语言还不够简洁。",
        nextGoals: "每天精读1篇短文，用一句话概括主旨"
      }
    ]
  },
  {
    id: "s3",
    name: "周子轩",
    grade: "初三",
    subject: "英语",
    weakPoints: "完形填空上下文逻辑、写作高级句型",
    habits: "背单词积极，但语法运用时容易想当然",
    personality: "目标感强，偶尔会因成绩波动焦虑",
    parentExpectation: "中考英语冲刺110分，稳定完形和阅读",
    createdAt: "2026-08-22",
    feedbacks: [
      {
        id: "f4",
        date: "2026-09-07",
        content: "完形填空讲解「复现词」和「转折词」技巧，子轩恍然大悟，正确率从60%提到85%。",
        nextGoals: "限时完成2篇完形，整理高频连接词"
      }
    ]
  },
  {
    id: "s4",
    name: "赵一诺",
    grade: "小学三年级",
    subject: "数学",
    weakPoints: "乘法口诀不熟、应用题读题跳字",
    habits: "坐不住，需要穿插小游戏和肢体互动",
    personality: "天真活泼，喜欢被表扬，受挫易哭",
    parentExpectation: "巩固基础计算，培养读题耐心",
    createdAt: "2026-08-28",
    feedbacks: [
      {
        id: "f5",
        date: "2026-09-09",
        content: "用「购物小老板」游戏练习表内乘法，一诺参与度很高，但7、8的口诀仍不熟练。",
        nextGoals: "制作乘法卡片，每天抽背3分钟"
      }
    ]
  }
];

const DEFAULT_LESSON_PLANS = [
  {
    id: "lp1",
    studentId: "s1",
    studentName: "林小满",
    topic: "一元一次方程行程问题",
    objectives: "理解相遇、追及问题的等量关系；能画线段图辅助分析；正确列出并求解方程。",
    explanation: "行程问题的核心是「路程 = 速度 × 时间」。当两人相向而行时，总路程等于两人行走路程之和；同向追及时，快者比慢者多走初始距离。",
    examples: "例：甲乙两地相距300km，A车速度60km/h，B车速度40km/h，相向而行几小时相遇？\n解：设时间为t，则 60t + 40t = 300，解得 t = 3h。",
    interaction: "让学生先画线段图，再口头描述等量关系；教师只提示「总路程在哪里」。",
    homework: "完成练习册P32第1、3、5题，家长签字。",
    createdAt: "2026-09-05"
  },
  {
    id: "lp2",
    studentId: "s3",
    studentName: "周子轩",
    topic: "完形填空之逻辑连接词",
    objectives: "识别转折、因果、递进三类连接词；利用上下文复现词解题。",
    explanation: "完形填空中，however/but 表示转折，therefore/so 表示因果，besides/also 表示递进。空白处前后的逻辑关系是解题关键。",
    examples: "例：He failed the exam. ____, he didn't give up.（答案：However，表转折）",
    interaction: "学生先标出每空前后句的逻辑关系，再对比选项；教师总结高频词组。",
    homework: "整理本节课出现的10个连接词，各造一个句子。",
    createdAt: "2026-09-07"
  }
];

const DEFAULT_HOMEWORKS = [
  {
    id: "h1",
    topic: "一元一次方程应用题",
    difficulty: "中等",
    count: 5,
    types: ["选择题", "解答题"],
    createdAt: "2026-09-05",
    questions: [
      {
        number: 1,
        type: "选择题",
        question: "甲、乙两人从相距36km的两地同时出发相向而行，甲速5km/h，乙速4km/h，几小时相遇？",
        answer: "B. 4小时",
        analysis: "设t小时相遇，5t+4t=36，解得t=4。"
      },
      {
        number: 2,
        type: "解答题",
        question: "一件商品按成本价提高40%后标价，再打8折出售，售价为224元，求成本价。",
        answer: "成本价为200元。",
        analysis: "设成本价为x元，则 x(1+40%)×0.8=224，解得x=200。"
      }
    ]
  }
];

const DEFAULT_REPORTS = [
  {
    id: "r1",
    studentId: "s1",
    studentName: "林小满",
    startDate: "2026-09-01",
    endDate: "2026-09-08",
    content: "本周重点攻克一元一次方程应用题，涵盖行程、工程、利润三类情境。",
    highlights: "能独立画线段图分析行程问题；列方程正确率从50%提升至78%；课堂参与度提高，愿意主动提问。",
    improvements: "工程问题中「工作效率」概念仍较模糊；遇到多步骤题目时容易遗漏单位。",
    nextPlan: "下周继续工程问题专项训练，加入错题订正本；每次课预留5分钟口头复盘。"
  }
];

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("读取本地数据失败", e);
  }
  // 新用户默认空白，方便从零开始录入自己的学生与内容
  return {
    students: [],
    lessonPlans: [],
    homeworks: [],
    reports: []
  };
}

let DB = loadData();

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DB));
  } catch (e) {
    console.warn("保存本地数据失败", e);
  }
}

function resetData() {
  DB = { students: [], lessonPlans: [], homeworks: [], reports: [] };
  saveData();
}

// 暴露全局
window.YTData = {
  get DB() { return DB; },
  save: saveData,
  reset: resetData
};
