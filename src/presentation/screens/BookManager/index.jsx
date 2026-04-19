import { useCallback, memo } from 'react';
import {
  SectionList,
  Text,
  TouchableOpacity,
  View,
  Image,
  Pressable,
} from 'react-native';

import { Page } from '../../components/ui/Page';
import { ImageButton, TextButton } from '../../components/ui/Button';
import { Dropdown } from '../../components/ui/Dropdown';
import { CustomText } from '../../components/ui/Font';

import { BottomTabBar } from '../../widgets/BottomTabBar';

import styles from './style';
import generalStyles from '../../styles/general.style';
import atomStyles from '../../styles/atom.style';

import { useBookManagerController } from './useBookManagerController';

import downIcon from '../../../../assets/icon/down.png';
import sortIcon from '../../../../assets/icon/sort.png';
import settingsIcon from '../../../../assets/icon/settings.png';
import rightIcon from '../../../../assets/icon/right.png';
import selectedIcon from '../../../../assets/icon/boldselect.png';
import emptyIcon from '../../../../assets/icon/empty.png';

export default function BookManagerScreen() {
  const {
    displayBook,
    displayOrder,
    displayOrderValue,
    displayOrderOptions,
    realSections,
    displaySections,
    expandedKeys,
    selectMode,
    selectedWords,
    isAllSelected,
    navigateToWordDetail,
    openRenameUnitModal,
    updateDisplayOrder,
    toggleSection,
    isSectionSelected,
    setSelectedWords,
    enterSelectMode,
    exitSelectMode,
    toggleWord,
    isSelected,
    selectAllFromSections,
    toggleSectionWords,
    openUserBookModal,
    openActionModal,
    openSettingsModal,
    handleTabPress,
  } = useBookManagerController();

  const renderItem = useCallback(
    ({ item }) => (
      <BetterItem
        item={item}
        isSelectMode={selectMode}
        isSelected={isSelected(item)}
        onLongPress={() => !selectMode && enterSelectMode(item)}
        onPress={() =>
          selectMode ? toggleWord(item) : navigateToWordDetail(item.word)
        }
      />
    ),
    [selectMode, selectedWords, enterSelectMode, toggleWord, isSelected],
  );

  const renderSectionHeader = useCallback(
    ({ section }) => {
      const realSection = realSections?.find(s => s.key === section.key);
      return (
        <SectionHeader
          title={section.title}
          sectionKey={section.key}
          isExpanded={expandedKeys.has(section.key)}
          onToggle={toggleSection}
          isSelectMode={selectMode}
          isSectionSelected={isSectionSelected(realSection)}
          onToggleSection={() => toggleSectionWords(realSection)}
          displayOrderValue={displayOrderValue}
          openRenameUnitModal={openRenameUnitModal}
        />
      );
    },
    [
      expandedKeys,
      toggleSection,
      selectMode,
      realSections,
      selectedWords,
      isSectionSelected,
      toggleSectionWords,
    ],
  );

  return (
    <Page pageStyle={[atomStyles.bgWhite, atomStyles.paddingTop16]}>
      {selectMode ? (
        <SelectModeHeader
          isAllSelected={isAllSelected}
          onSelectAll={() => {
            if (isAllSelected) {
              setSelectedWords({});
            } else {
              selectAllFromSections(realSections);
            }
          }}
          onBack={exitSelectMode}
          onAction={openActionModal}
        />
      ) : (
        <DefaultHeader
          displayBookName={displayBook?.name}
          displayOrder={displayOrder}
          displayOrderOptions={displayOrderOptions}
          openUserBookModal={openUserBookModal}
          onUpdateDisplayOrder={updateDisplayOrder}
          onOpenSettings={openSettingsModal}
        />
      )}
      <SectionList
        sections={displaySections}
        keyExtractor={item => item.id || item.word}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
        ItemSeparatorComponent={<BetterItemSeparator />}
        extraData={{ selectMode, selectedWords, expandedKeys }}
        removeClippedSubviews={false}
        initialNumToRender={10}
        showsVerticalScrollIndicator={false}
      />
      {!selectMode && <View style={{ height: 60, width: '100%' }} />}
      {!selectMode && (
        <BottomTabBar
          activeTab="Book"
          onTabPress={key => handleTabPress(key, 'Book')}
        />
      )}
    </Page>
  );
}

//------------------- 标题栏 -------------------
const DefaultHeader = memo(
  ({
    displayBookName,
    displayOrder,
    displayOrderOptions,
    openUserBookModal,
    onUpdateDisplayOrder,
    onOpenSettings,
  }) => {
    return (
      <View
        style={[
          generalStyles.rowBetweenContainer,
          atomStyles.paddingHorizontal16,
          atomStyles.paddingBottom16,
        ]}
      >
        {/* 词书切换部分 */}
        <TouchableOpacity
          style={[generalStyles.rowContainer, atomStyles.gap8]}
          onPress={openUserBookModal}
        >
          <Text style={[generalStyles.textImportantTitleBlack]}>
            {displayBookName || '暂无词书'}
          </Text>
          <Image
            source={downIcon}
            style={generalStyles.largeIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* 右侧操作区 */}
        <View style={[generalStyles.rowContainer, atomStyles.gap8]}>
          <Dropdown
            options={displayOrderOptions}
            value={displayOrder}
            onSelect={onUpdateDisplayOrder}
            renderTrigger={() => (
              <Image source={sortIcon} style={generalStyles.largeIcon} />
            )}
            menuStyle={[styles.menu, generalStyles.menuShadow]}
          />

          <ImageButton
            imageSource={settingsIcon}
            imageStyle={generalStyles.largeIcon}
            onPress={onOpenSettings}
          />
        </View>
      </View>
    );
  },
);

const SelectModeHeader = memo(
  ({ isAllSelected, onSelectAll, onBack, onAction }) => {
    return (
      <View
        style={[
          generalStyles.rowBetweenContainer,
          atomStyles.paddingHorizontal16,
          atomStyles.paddingBottom16,
          atomStyles.zIndex,
        ]}
      >
        <TextButton
          title={isAllSelected ? '全不选' : '全选'}
          onPress={onSelectAll}
          textStyle={generalStyles.textImportantTitleBlue}
        />

        <View style={[generalStyles.rowContainer, atomStyles.gap16]}>
          <TextButton
            title={'退出'}
            onPress={onBack}
            textStyle={generalStyles.textImportantTitleBlue}
          />

          <TextButton
            title={'操作'}
            onPress={onAction}
            textStyle={generalStyles.textImportantTitleBlue}
          />
        </View>
      </View>
    );
  },
);

//------------------- 单词列表 -------------------
const SectionHeader = memo(
  ({
    title,
    sectionKey,
    isExpanded,
    onToggle,
    isSelectMode,
    isSectionSelected,
    onToggleSection,
    openRenameUnitModal,
    displayOrderValue,
  }) => {
    return (
      <Pressable
        style={styles.sectionHeader}
        onPress={() => onToggle(sectionKey)}
        onLongPress={
          displayOrderValue === 'unit'
            ? () => openRenameUnitModal(sectionKey, title)
            : null
        }
      >
        <View style={[generalStyles.rowContainer, atomStyles.gap8]}>
          {isSelectMode && (
            <ImageButton
              imageSource={isSectionSelected ? selectedIcon : emptyIcon}
              onPress={onToggleSection}
              buttonStyle={[
                isSectionSelected ? styles.checkboxSelected : styles.checkbox,
              ]}
              imageStyle={[generalStyles.smallIcon, atomStyles.tintWhite]}
            />
          )}
          <Text style={generalStyles.textOptionsBlack}>{title}</Text>
        </View>
        <Image
          source={isExpanded ? rightIcon : downIcon}
          style={generalStyles.largeIcon}
          pointerEvents="none"
        />
      </Pressable>
    );
  },
);

const BetterItem = memo(
  ({ item, isSelectMode, isSelected, onLongPress, onPress }) => {
    return (
      <TouchableOpacity
        style={styles.wordItem}
        onLongPress={onLongPress}
        onPress={onPress}
      >
        {isSelectMode && (
          <ImageButton
            imageSource={isSelected ? selectedIcon : emptyIcon}
            buttonStyle={[
              isSelected ? styles.checkboxSelected : styles.checkbox,
            ]}
            imageStyle={[generalStyles.smallIcon, atomStyles.tintWhite]}
          />
        )}

        <CustomText
          type="english"
          style={[generalStyles.textTitleBlack, atomStyles.letterSpacing]}
        >
          {item.word}
        </CustomText>
      </TouchableOpacity>
    );
  },
  (prev, next) => {
    return (
      prev.item.word === next.item.word &&
      prev.isSelectMode === next.isSelectMode &&
      prev.isSelected === next.isSelected
    );
  },
);

const BetterItemSeparator = memo(() => <View style={styles.ItemSeparator} />);
