import { memo, useCallback } from 'react';
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

import backIcon from '../../../../assets/icon/back.png';

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
    handleSelectCategory,
    handleSelectSubcategory,
    handleDownloadWordBook,
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
        handleSelect={handleSelectCategory}
      />
      <HorizontalDividingLine />

      <SubcategoryList
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
        handleSelectSubcategory={handleSelectSubcategory}
      />

      <WordbookList
        libraryLoading={libraryLoading}
        error={error}
        handleDownloadWordBook={handleDownloadWordBook}
        wordbooks={filteredWordbooks}
        practiceWordbookId={practiceWordbookId}
      />
    </Page>
  );
}

const Search = memo(({ onSearch }) => {
  return (
    <TextInput
      placeholder="输入词书名称搜索"
      style={generalStyles.searchTextInput}
      onFocus={onSearch}
    />
  );
});

const CategoryList = ({ categories, selectedCategory, handleSelect }) => {
  const renderItem = useCallback(
    ({ item }) => {
      const isSelected = selectedCategory?.name === item.name;

      return (
        <CategoryItem
          item={item}
          isSelected={isSelected}
          onPress={handleSelect}
        />
      );
    },
    [selectedCategory?.name, handleSelect],
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
};

const CategoryItem = memo(({ item, isSelected, onPress }) => {
  const handlePress = useCallback(() => {
    onPress(item);
  }, [onPress, item]);

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

const SubcategoryList = memo(
  ({ selectedCategory, selectedSubcategory, handleSelectSubcategory }) => {
    if (!selectedCategory) return null;

    const subcategories = selectedCategory.subcategories || [];

    const handleItemPress = useCallback(
      item => {
        handleSelectSubcategory(item);
      },
      [handleSelectSubcategory],
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
  },
);

const SubcategoryItem = memo(({ item, isSelected, onPress }) => {
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

const WordbookList = ({
  libraryLoading,
  error,
  wordbooks,
  practiceWordbookId,
  handleDownloadWordBook,
}) => {
  const renderItem = useCallback(
    ({ item }) => {
      const isLearning = item._id === practiceWordbookId;

      return (
        <WordbookItem
          item={item}
          isLearning={isLearning}
          onPress={handleDownloadWordBook}
        />
      );
    },
    [practiceWordbookId, handleDownloadWordBook],
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
};

const WordbookItem = memo(({ item, isLearning, onPress }) => {
  const handlePress = useCallback(() => {
    onPress(item);
  }, [onPress, item]);

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
