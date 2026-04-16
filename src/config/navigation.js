import practiceIcon from '../../assets/icon/Practice.png';
import bookIcon from '../../assets/icon/Book.png';
import profileIcon from '../../assets/icon/Profile.png';

export const TABS = [
  {
    key: 'Practice',
    label: '首页',
    icon: practiceIcon,
    stack: 'PracticeStack',
  },
  { key: 'Book', label: '词库', icon: bookIcon, stack: 'BookStack' },
  { key: 'Profile', label: '我的', icon: profileIcon, stack: 'ProFileStack' },
];

export const TAB_ROUTE_MAP = TABS.reduce((acc, tab) => {
  acc[tab.key] = tab.stack;
  return acc;
}, {});
