import { useState, useCallback, memo, useMemo, useEffect } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  Pressable,
  TextInput,
  FlatList,
} from 'react-native';

import { ImageButton, TextButton } from '../../components/ui/Button';
import { Dropdown } from '../../components/ui/Dropdown';

import styles from './style';
import generalStyles from '../../styles/general.style';
import atomStyles from '../../styles/atom.style';

import wordbookCover from '../../../../assets/bookCover/wordbook.jpg';

import addIcon from '../../../../assets/icon/add.png';
import editIcon from '../../../../assets/icon/edit.png';

export const AlertHeaderLine = memo(() => {
  return (
    <View style={[generalStyles.rowCenterContainer]}>
      <View style={styles.modalDragHandle} />
    </View>
  );
});

//------------------- 词书弹窗 -------------------
export const UserBookModalContent = memo(
  ({ userBooks, onSelectBook, navigateToAddBook, navigateToEditBook }) => {
    return (
      <FlatList
        data={userBooks}
        keyExtractor={item => item.category}
        renderItem={({ item }) => (
          <BookGroupItem
            item={item}
            onSelectBook={onSelectBook}
            onAddBook={navigateToAddBook}
            onEditBook={navigateToEditBook}
          />
        )}
        style={atomStyles.fullWidth}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={atomStyles.gap24}
        scrollEnabled={false}
      />
    );
  },
);

const BookGroupItem = memo(({ item, onSelectBook, onAddBook, onEditBook }) => {
  const groupedBooksBySubcategory = useMemo(() => {
    const grouped = {};
    item.books.forEach(book => {
      const key = book.subcategory || '未分类';
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(book);
    });
    return grouped;
  }, [item.books]);

  const subcategories = useMemo(
    () => Object.keys(groupedBooksBySubcategory),
    [groupedBooksBySubcategory],
  );

  const isGroupCategory =
    item.category === '单词本' || item.category === '笔记本';

  const [activeSubcategory, setActiveSubcategory] = useState(
    subcategories[0] || null,
  );

  const handleAddBook = useCallback(() => {
    onAddBook(item.category);
  }, [onAddBook, item.category]);

  useEffect(() => {
    if (
      subcategories.length > 0 &&
      !subcategories.includes(activeSubcategory)
    ) {
      setActiveSubcategory(subcategories[0]);
    }
  }, [subcategories]);

  return (
    <View style={atomStyles.gap16}>
      <CategoryHeader
        category={item.category}
        allSubcategories={isGroupCategory ? subcategories : undefined}
        activeSubcategory={activeSubcategory}
        setActiveSubcategory={setActiveSubcategory}
        onAddBook={handleAddBook}
      />

      {isGroupCategory ? (
        <BookListWithSubcategory
          category={item.category}
          books={groupedBooksBySubcategory[activeSubcategory] || []}
          onSelectBook={onSelectBook}
          onEditBook={onEditBook}
        />
      ) : (
        <BookListNormal books={item.books} onSelectBook={onSelectBook} />
      )}
    </View>
  );
});

const CategoryHeader = memo(
  ({
    category,
    subcategories,
    activeSubcategory,
    setActiveSubcategory,
    onAddBook,
  }) => {
    const isGroupCategory = category === '单词本' || category === '笔记本';
    const showAddButton = isGroupCategory;

    return (
      <View style={styles.categoryHeader}>
        <View style={[generalStyles.rowCenterContainer, atomStyles.gap16]}>
          <Text style={styles.categoryName}>{category}</Text>

          {isGroupCategory && subcategories?.length > 0 && (
            <Dropdown
              options={subcategories}
              value={activeSubcategory}
              placeholder="暂无分类"
              onSelect={setActiveSubcategory}
              triggerStyle={styles.subcategoryDropdownTrigger}
              labelStyle={styles.subcategoryDropdownLabel}
              menuStyle={[
                styles.subcategoryDropdownMenu,
                generalStyles.menuShadow,
              ]}
              triggerArrowStyle={[
                atomStyles.tintBlue,
                generalStyles.mediumIcon,
              ]}
              itemStyle={styles.subcategoryDropdownItem}
              itemTextStyle={styles.subcategoryDropdownItemText}
            />
          )}
        </View>

        {showAddButton && (
          <ImageButton
            imageSource={addIcon}
            buttonStyle={styles.addButton}
            onPress={onAddBook}
            imageStyle={[generalStyles.largeIcon, atomStyles.tintWhite]}
          />
        )}
      </View>
    );
  },
);

const BookListWithSubcategory = memo(
  ({ category, books, onSelectBook, onEditBook }) => {
    return (
      <View style={atomStyles.gap16}>
        <View style={atomStyles.gap16}>
          {books.length > 0 ? (
            books.map(book => (
              <BookItem
                key={book._id}
                book={book}
                category={category}
                onPress={onSelectBook}
                onEdit={onEditBook}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyPrompt}>暂无{category}</Text>
            </View>
          )}
        </View>
      </View>
    );
  },
);

const BookListNormal = memo(({ books, onSelectBook }) => {
  const book = books[0];
  if (!book)
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyPrompt}>暂无在学词书</Text>
      </View>
    );

  return (
    <Pressable
      style={({ pressed }) => [
        styles.learningWordbookContainer,
        pressed && atomStyles.bgWhitePressed,
      ]}
      onPress={() => onSelectBook(book)}
    >
      <Image source={wordbookCover} style={styles.wordbookImage} />
      <View style={atomStyles.justifyBetween}>
        <Text style={[generalStyles.textOptionsBlack, atomStyles.fw500]}>
          {book.name}
        </Text>
        <Text style={generalStyles.textSmallPrompt}>
          {book.word_count ?? 0} 个单词
        </Text>
      </View>
    </Pressable>
  );
});

const BookItem = memo(({ book, onPress, onEdit, category }) => {
  return (
    <View style={styles.bookItem}>
      <TouchableOpacity style={styles.bookInfo} onPress={() => onPress(book)}>
        <Text style={[generalStyles.textOptionsBlack, atomStyles.fw500]}>
          {book.name}
        </Text>
        <Text style={generalStyles.textSmallPrompt}>
          {book.word_count ?? 0} {category === '单词本' ? '个单词' : '条笔记'}
        </Text>
      </TouchableOpacity>
      <ImageButton
        imageSource={editIcon}
        onPress={() => onEdit(book)}
        imageStyle={[generalStyles.XLargeIcon, atomStyles.tintBlue]}
      />
    </View>
  );
});

//------------------- 单词操作弹窗 -------------------
export const WordsActionModalContent = memo(
  ({
    onDelete,
    onCancel,
    isNoteBook,
    onMoveToUnit,
    onCopyToBook,
    onMoveToBook,
  }) => {
    return (
      <View>
        <TextButton
          title="删除"
          onPress={onDelete}
          textStyle={atomStyles.text16}
          buttonStyle={styles.actionItem}
        />
        <TextButton
          title="添加至分组 ..."
          onPress={onMoveToUnit}
          textStyle={atomStyles.text16}
          buttonStyle={styles.actionItem}
        />
        {!isNoteBook && (
          <View>
            <TextButton
              title="拷贝至词书 ..."
              textStyle={atomStyles.text16}
              buttonStyle={styles.actionItem}
              onPress={onCopyToBook}
            />
            <TextButton
              title="移动至词书 ..."
              onPress={onMoveToBook}
              textStyle={atomStyles.text16}
              buttonStyle={styles.actionItem}
            />
          </View>
        )}

        <View style={styles.actionModaSeparator} />
        <TextButton
          title="取消"
          onPress={onCancel}
          textStyle={atomStyles.text16}
          buttonStyle={styles.actionItem}
        />
      </View>
    );
  },
);

//------------------- 单元选择弹窗 -------------------
export const UnitMoveModalContent = memo(({ wordIds, units, onSelectUnit }) => {
  const renderItem = ({ item }) => (
    <TextButton
      title={item.title}
      onPress={() => onSelectUnit(wordIds, item.unit_id, item.title)}
      textStyle={generalStyles.textOptionsBlack}
      buttonStyle={styles.unitItem}
    />
  );

  return (
    <FlatList
      data={units}
      keyExtractor={item => item.unit_id}
      renderItem={renderItem}
      style={{ marginBottom: 8 }}
      scrollEnabled={false}
      contentContainerStyle={atomStyles.gap16}
    />
  );
});

//------------------- 新增单元并移动弹窗 -------------------

export const AddAndMoveToUnitModalContent = memo(
  ({ defaultValue, onChangeText }) => {
    return (
      <TextInput
        style={generalStyles.modalInput}
        autoFocus
        defaultValue={defaultValue}
        onChangeText={onChangeText}
      />
    );
  },
);

//------------------- 单词移动/复制至书本弹窗 -------------------
export const BookMoveOrCopyModalContent = memo(
  ({ wordIds, userBooks, currentBook, mode = 'move', onSelectBook }) => {
    const books = useMemo(() => {
      const list = [];

      userBooks?.forEach(group => {
        if (group.category === '在学词书') {
          if (group.books?.length) {
            list.push({
              ...group.books[0],
              displayCategory: '在学词书',
            });
          }
        }

        if (group.category === '单词本') {
          group.books?.forEach(book => {
            list.push({
              ...book,
              displayCategory: '单词本',
            });
          });
        }
      });

      return list.filter(book => book._id !== currentBook?._id);
    }, [userBooks]);

    const handlePress = item => {
      onSelectBook(wordIds, item, mode);
    };

    const renderItem = ({ item }) => (
      <TouchableOpacity
        style={[styles.unitItem, atomStyles.paddingVertical10]}
        onPress={() => handlePress(item)}
      >
        <View style={generalStyles.rowBetweenContainer}>
          <Text style={[generalStyles.textTitle, { fontSize: 16 }]}>
            {item.name}
          </Text>

          <Text style={[generalStyles.textSmallPrompt, atomStyles.top1]}>
            {item.word_count ?? 0}词
          </Text>
        </View>

        <Text style={[generalStyles.textSmallPrompt]}>
          {item.displayCategory}
        </Text>
      </TouchableOpacity>
    );

    return (
      <FlatList
        data={books}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        style={{ marginBottom: 8 }}
        scrollEnabled={false}
        contentContainerStyle={atomStyles.gap16}
      />
    );
  },
);

//------------------- 设置弹窗 -------------------
export const SettingsModalContent = memo(
  ({ onExpandAll, onCollapseAll, onEnterAction }) => {
    return (
      <View>
        <TextButton
          title="全部展开"
          onPress={onExpandAll}
          textStyle={generalStyles.textBody}
          buttonStyle={styles.settingItem}
        />
        <Separator />
        <TextButton
          title="全部折叠"
          onPress={onCollapseAll}
          textStyle={generalStyles.textBody}
          buttonStyle={styles.settingItem}
        />
        <Separator />
        <TextButton
          title="批量操作"
          onPress={onEnterAction}
          textStyle={generalStyles.textBody}
          buttonStyle={styles.settingItem}
        />
        <Separator />
        <TextButton
          title="显示解释"
          textStyle={generalStyles.textBody}
          buttonStyle={styles.settingItem}
        />
        <Separator />
        <TextButton
          title="解释设置"
          textStyle={generalStyles.textBody}
          buttonStyle={styles.settingItem}
        />
      </View>
    );
  },
);

const Separator = memo(() => <View style={styles.settingItemSeparator} />);
