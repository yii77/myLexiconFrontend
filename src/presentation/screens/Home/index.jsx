import React from 'react';
import { View, Text, Image } from 'react-native';

import { useHomeController } from './useHomeController';

import { BottomTabBar } from '../../widgets/BottomTabBar';

import { Page } from '../../components/ui/Page';
import { ImageButton, TextButton } from '../../components/ui/Button';
import { CustomText } from '../../components/ui/Font';
import { Dropdown } from '../../components/ui/Dropdown';

import styles from './style';
import generalStyles from '../../styles/general.style';
import atomStyles from '../../styles/atom.style';

import wordbookCover from '../../../../assets/bookCover/wordbook.jpg';
import settingsIcon from '../../../../assets/icon/settings.png';

export default function HomeScreen() {
  const {
    practiceWordbook,
    bookStats,
    todayNewWordCount,
    todayReviewWordCount,
    practiceModes,
    currentPracticeMode,
    navigateToLibrary,
    navigateToChangeBook,
    navigateToSettings,
    startLearning,
    selectMode,
    handleTabPress,
  } = useHomeController();

  return (
    <Page pageStyle={[atomStyles.gap16, atomStyles.paddingHorizontal16]}>
      <Header onSettings={navigateToSettings} />

      <PracticeWordbookCard
        hasBook={!!practiceWordbook}
        stats={bookStats}
        onChoose={navigateToLibrary}
        onChange={navigateToChangeBook}
      />

      <DailyTaskCard
        practiceModes={practiceModes}
        currentPracticeMode={currentPracticeMode}
        onSelectMode={selectMode}
        newCount={todayNewWordCount}
        reviewCount={todayReviewWordCount}
        onStart={startLearning}
      />

      <BottomTabBar
        activeTab="Practice"
        onTabPress={key => handleTabPress(key, 'Practice')}
      />
    </Page>
  );
}

const Header = React.memo(({ onSettings }) => (
  <View style={generalStyles.rowBetweenContainer}>
    <CustomText type="english" style={styles.dailyQuate}>
      own the moment
    </CustomText>
    <ImageButton
      imageSource={settingsIcon}
      onPress={onSettings}
      hitSlop={generalStyles.hitSlop5}
      imageStyle={generalStyles.largeIcon}
    />
  </View>
));

const PracticeWordbookCard = React.memo(
  ({ hasBook, stats, onChoose, onChange }) => {
    return (
      <View style={styles.wordbookContainer}>
        {hasBook ? (
          <View style={[atomStyles.flex, atomStyles.row]}>
            <Image source={wordbookCover} style={styles.wordbookImage} />

            <View style={[atomStyles.flex, atomStyles.justifyBetween]}>
              <View style={generalStyles.rowBetweenContainer}>
                <Text style={generalStyles.textTitleBlack}>{stats.name}</Text>
                <TextButton
                  title="更换"
                  onPress={onChange}
                  buttonStyle={styles.changeButton}
                  textStyle={styles.changeButtonText}
                />
              </View>

              <View style={styles.progressBar}>
                <View
                  style={[styles.progressFinish, { width: stats.progress }]}
                />
              </View>

              <View style={[atomStyles.row, atomStyles.gap16, atomStyles.top2]}>
                <InfoText label="学习中" value={stats.learning} />
                <InfoText label="已掌握" value={stats.mastered} />
                <InfoText label="未学习" value={stats.newCount} />
              </View>
            </View>
          </View>
        ) : (
          <View style={atomStyles.gap16}>
            <Text style={generalStyles.textPrompt}>当前未选择词书</Text>
            <TextButton
              title="选择词书"
              onPress={onChoose}
              buttonStyle={styles.chooseButton}
              textStyle={styles.chooseButtonText}
            />
          </View>
        )}
      </View>
    );
  },
);

const InfoText = ({ label, value }) => (
  <Text style={generalStyles.textSmallPrompt}>
    {label} {value}
  </Text>
);

const DailyTaskCard = React.memo(
  ({
    practiceModes,
    currentPracticeMode,
    onSelectMode,
    newCount,
    reviewCount,
    onStart,
  }) => (
    <View style={styles.dailyTaskCard}>
      <View style={generalStyles.rowBetweenContainer}>
        <Text style={styles.cardTitle}>今日学习</Text>
        <Dropdown
          options={practiceModes}
          value={currentPracticeMode}
          placeholder="选择模式"
          onSelect={onSelectMode}
          menuStyle={[styles.menuStyle, generalStyles.menuShadow]}
        />
      </View>
      <View style={styles.dailyTaskCardRow2}>
        <TaskCount label="新词" count={newCount} />
        <TaskCount label="复习" count={reviewCount} />
      </View>
      <TextButton
        title="开始学习"
        onPress={onStart}
        buttonStyle={styles.startButton}
        textStyle={styles.startText}
      />
    </View>
  ),
);

const TaskCount = ({ label, count }) => (
  <View style={atomStyles.alignCenter}>
    <Text style={styles.countNumber}>{count ?? 0}</Text>
    <Text style={[generalStyles.textPrompt, atomStyles.top4]}>{label}</Text>
  </View>
);
