import React, { useCallback } from 'react';
import {
  Text,
  FlatList,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';

import { useLibraryController } from './useLibraryController';

import { Page } from '../../components/ui/Page';
import { CommonHeader } from '../../components/ui/Header';
import { TextButton } from '../../components/ui/Button';
import { HorizontalDividingLine } from '../../components/ui/DividingLine';

import styles from './style';
import generalStyles from '../../styles/general.style';
import atomStyles from '../../styles/atom.style';

import backIcon from '../../../../asset/back.png';

export default function LibraryScreen({ navigation }) {
  const {
    categories,
    libraryLoading,
    error,
    filteredWordbooks,
    practiceWordbookId,

    selectedCategory,
    selectedSubcategory,

    handleSearch,
    selectCategory,
    selectSubcategory,
    onDownloadAction,
  } = useLibraryController();

  return (
    <Page pageStyle={[atomStyles.gap16, atomStyles.paddingHorizontal16]}>
      <CommonHeader
        title={'词库'}
        leftImageSource={backIcon}
        leftImageStyle={[generalStyles.mediumIcon]}
        onLeftPress={() => navigation.goBack()}
      />
      <Search onSearch={handleSearch} />
      <CategoryList
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={selectCategory}
      />
      <HorizontalDividingLine />

      <SubcategoryList
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
        selectSubcategory={selectSubcategory}
      />

      <WordbookList
        libraryLoading={libraryLoading}
        error={error}
        onDownload={onDownloadAction}
        wordbooks={filteredWordbooks}
        practiceWordbookId={practiceWordbookId}
      />
    </Page>
  );
}

const Search = React.memo(function Search({ onSearch }) {
  return (
    <TextInput
      placeholder="输入词书名称搜索"
      style={generalStyles.searchTextInput}
      onFocus={onSearch}
    />
  );
});

function CategoryList({ categories, selectedCategory, onSelect }) {
  const renderItem = useCallback(
    ({ item }) => {
      const isSelected = selectedCategory?.name === item.name;

      return (
        <CategoryItem item={item} isSelected={isSelected} onSelect={onSelect} />
      );
    },
    [selectedCategory?.name, onSelect],
  );
  return (
    <View>
      <FlatList
        horizontal
        data={categories}
        extraData={selectedCategory?.name}
        keyExtractor={item => item.name}
        contentContainerStyle={atomStyles.gap16}
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
      />
    </View>
  );
}

const CategoryItem = React.memo(function CategoryItem({
  item,
  isSelected,
  onSelect,
}) {
  const handlePress = useCallback(() => {
    onSelect(item);
  }, [onSelect, item]);

  return (
    <View>
      <TextButton
        title={item.name}
        onPress={handlePress}
        buttonStyle={styles.defaultCategory}
        textStyle={[
          generalStyles.textOptionsGray,
          isSelected && [generalStyles.textOptionsBlack, atomStyles.fw600],
        ]}
      />
      {isSelected && <View style={styles.categorySelected} />}
    </View>
  );
});

const SubcategoryList = React.memo(function SubcategoryList({
  selectedCategory,
  selectedSubcategory,
  selectSubcategory,
}) {
  if (!selectedCategory) return null;

  const subcategories = selectedCategory.subcategories || [];

  const handleItemPress = useCallback(
    item => {
      selectSubcategory(item);
    },
    [selectSubcategory],
  );

  return (
    <View style={[generalStyles.rowWrapContainer, atomStyles.gap10]}>
      {subcategories.map(item => (
        <SubcategoryItem
          key={item}
          item={item}
          isSelected={selectedSubcategory === item}
          onPress={handleItemPress}
        />
      ))}
    </View>
  );
});

const SubcategoryItem = React.memo(function SubcategoryItem({
  item,
  isSelected,
  onPress,
}) {
  return (
    <TextButton
      title={item}
      onPress={() => onPress(item)}
      buttonStyle={[
        styles.defaultSubcategory,
        isSelected ? styles.subcategorySelected : null,
      ]}
      textStyle={[
        generalStyles.textSmallPrompt,
        isSelected ? atomStyles.whight : null,
      ]}
    />
  );
});

function WordbookList({
  libraryLoading,
  error,
  wordbooks,
  practiceWordbookId,
  onDownload,
}) {
  const renderItem = useCallback(
    ({ item }) => {
      const isLearning = item._id === practiceWordbookId;

      return (
        <WordbookItem
          item={item}
          isLearning={isLearning}
          onDownload={onDownload}
        />
      );
    },
    [practiceWordbookId, onDownload],
  );

  if (libraryLoading) return <Text>正在加载</Text>;
  if (error) return <Text>{error}</Text>;
  if (wordbooks.length === 0) {
    return <Text>你还没有自定义词书 ~</Text>;
  }

  return (
    <FlatList
      data={wordbooks}
      keyExtractor={item => item._id}
      renderItem={renderItem}
      extraData={practiceWordbookId}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[atomStyles.gap16, atomStyles.paddingBottom16]}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={5}
      removeClippedSubviews={true}
    />
  );
}

const WordbookItem = React.memo(function WordbookItem({
  item,
  isLearning,
  onDownload,
}) {
  const handlePress = useCallback(() => {
    onDownload(item);
  }, [onDownload, item]);

  return (
    <TouchableOpacity
      style={atomStyles.row}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.wordbookImage}></View>
      <View style={atomStyles.justifyBetween}>
        <Text style={generalStyles.textTitle}>{item.name}</Text>
        {item.description ? (
          <Text style={styles.description}>{item.description}</Text>
        ) : null}
        <View style={[atomStyles.row, atomStyles.gap16]}>
          <Text style={generalStyles.textPrompt}>
            {item.word_count ?? 0} 个单词
          </Text>
          {isLearning && (
            <View style={atomStyles.top1}>
              <Text style={styles.learningTagText}>正在学习</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
});
