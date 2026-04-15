export const DEFAULT_SETTINGS = {
  // ============================
  // 学习配置
  // ============================
  daily_new_limit: 20, // 每天学习新词数
  daily_review_limit: 100, // 每天复习上限
  daily_total_limit: 150, // 每天记忆单词总数
  study_order: 'book', // 学习顺序：书籍顺序 / 字母 / 随机
  review_order: 'time', // 复习顺序：时间 / 字母 / 随机
  practice_mode: 'review_first', // 记忆模式：混合模式 / 先学新词 / 优先复习 / 只复习
  review_plan: [1, 4, 7, 15, 30, 60], // 间隔天数
  review_multiplier: [0.5, 0.7, 1, 1.3, 1.5], // 分数倍率
  brush_modes: {
    // 刷词模式
    enToCn: true, // 给出英文选释义
    cnToEn: true, // 给出释义选英文
    spelling: true, // 拼写
    recall: true, // 回想
  },
  brush_gesture_actions: {
    // 刷词卡片手势
    swipe_up: null, // 上滑行为
    swipe_down: 'view', // 下滑 → 查看单词
    swipe_left: 'dont_know', // 左滑 → 不认识
    swipe_right: 'mastered', // 右滑 → 已掌握
  },

  // ============================
  // 字体 / 主题配置
  // ============================
  english_font: {
    fontFamily: 'Times New Roman',
  },
  chinese_font: {
    fontFamily: '宋体',
  },

  // ============================
  // 词书单词浏览配置
  // ============================
  list_display_order: 'book_order', // 默认用词书顺序
  list_default_expand: true,

  // ============================
  // 笔记默认配置
  // ============================
  show_definition: true,
  definition_style_type: 'allInOne',
  display_type: 'col',
  note_default_style: {
    show_label: false,
    default_hidden: false,
    toggle_visible: false,
    font_family: 'Serif',
    font_size: '14',
    font_weight: 'Regular',
    font_color: '#212121',
    background_color: '#FFFFFF00',
    italic: false,
    next_col: '空格',
  },
};
