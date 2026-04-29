import { memo, useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Image,
  Switch,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import { NOTE_DISPLAY_TYPES } from '../../../data/constants/noteDisplayType';

import { getFont, getFontOptions } from '../../../logic/utils/font';
import { getWeight, getWeightOptions } from '../../../logic/utils/fontWeight';
import { getConnectorOptions } from '../../../logic/utils/connector';

import { FullColorPicker } from '../../widgets/FullColorPicker';

import { Page } from '../../components/ui/Page';
import { CommonHeader } from '../../components/ui/Header';
import { TextButton } from '../../components/ui/Button';
import { Dropdown } from '../../components/ui/Dropdown';

import { useNoteFormController } from './useNoteFormController';

import styles from './style';
import generalStyles from '../../styles/general.style';
import atomStyles from '../../styles/atom.style';

import Theme from '../../../config/theme';

import downIcon from '../../../../assets/icon/down.png';
import addIcon from '../../../../assets/icon/add.png';
import upIcon from '../../../../assets/icon/up.png';
import expandIcon from '../../../../assets/icon/expand.png';

export default function NoteFormSreen({ route, navigation }) {
  const editingNote = route.params.editingNote ?? null;
  const isEditing = !!editingNote;

  const {
    selectedBook,
    selectorOpen,
    subcategoryOption,
    groupedBooks,
    wordExistingBookIds,
    rows,
    cols,
    cellTexts,
    colWidths,
    rowHeights,
    colDragging,
    firstRowDefaults,
    note_display_type,
    firstRowOptions,
    noteStyles,
    activeStyleCardIndex,
    setSelectorOpen,
    navigateToEditBook,
    navigateToAddBook,
    handleSelectBook,
    refreshNote,
    createColPanResponder,
    addColumn,
    addRow,
    changeText,
    changeColWidthByInput,
    changeRowHeight,
    setNoteDisplayType,
    setActiveStyleCardIndex,
    updateCardData,
    handleFinish,
    handlePreview,
  } = useNoteFormController();

  useFocusEffect(
    useCallback(() => {
      refreshNote();
    }, []),
  );

  return (
    <Page pageStyle={atomStyles.gap16}>
      <CommonHeader
        title={isEditing ? '编辑笔记' : '新增笔记'}
        leftText={'取消'}
        onLeftPress={() => navigation.goBack()}
        rightText={'完成'}
        onRightPress={() =>
          handleFinish(
            selectedBook,
            cellTexts,
            note_display_type,
            noteStyles,
            editingNote,
          )
        }
        headerStyle={atomStyles.marginHorizontal16}
      />
      <View style={generalStyles.horizontalDivider}></View>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!selectorOpen}
      >
        <View style={atomStyles.gap16}>
          <CardTitle title={'笔记本'} />
          <NotebookSelector
            selectedBook={selectedBook}
            selectorOpen={selectorOpen}
            setSelectorOpen={setSelectorOpen}
            handleSelectBook={handleSelectBook}
            subcategoryOption={subcategoryOption}
            groupedBooks={groupedBooks}
            navigateToEditBook={navigateToEditBook}
            navigateToAddBook={navigateToAddBook}
            wordExistingBookIds={wordExistingBookIds}
          />
        </View>
        <View style={atomStyles.gap16}>
          <CardTitle
            title={'笔记内容'}
            rightElement={
              <TextButton
                title={'增加列'}
                onPress={() => {
                  addColumn();
                }}
                textStyle={styles.addColumnBtnText}
                hitSlop={generalStyles.hitSlop5}
              />
            }
          />
          <EditableTable
            rows={rows}
            cols={cols}
            cellTexts={cellTexts}
            colWidths={colWidths}
            rowHeights={rowHeights}
            firstRowDefaults={firstRowDefaults}
            colDragging={colDragging}
            changeText={changeText}
            changeRowHeight={changeRowHeight}
            changeColWidthByInput={changeColWidthByInput}
            addRow={addRow}
            createColPanResponder={createColPanResponder}
          />
        </View>
        <View style={atomStyles.gap16}>
          <CardTitle
            title={'笔记样式'}
            rightElement={
              <TextButton
                title={'预览'}
                onPress={() => {
                  handlePreview(note_display_type, cellTexts, noteStyles);
                }}
                textStyle={styles.addColumnBtnText}
              />
            }
          />
          <NoteDisplayModeSelector
            note_display_type={note_display_type}
            setNoteDisplayType={setNoteDisplayType}
          />
          <StyleSettingsCard
            noteStyles={noteStyles}
            firstRowOptions={firstRowOptions}
            activeStyleCardIndex={activeStyleCardIndex}
            setActiveStyleCardIndex={setActiveStyleCardIndex}
            updateCardData={updateCardData}
          />
        </View>
      </ScrollView>
    </Page>
  );
}

const CardTitle = memo(
  ({ title, rightElement, titleStyle, containerStyle }) => {
    return (
      <View
        style={[
          generalStyles.rowBetweenContainer,
          styles.cardTitleRow,
          containerStyle,
        ]}
      >
        <Text style={[styles.cardTitleGrayText, titleStyle]}>{title}</Text>
        {rightElement}
      </View>
    );
  },
);

/**
 * 笔记本
 */
const NotebookSelector = memo(
  ({
    selectedBook,
    selectorOpen,
    setSelectorOpen,
    handleSelectBook,
    subcategoryOption,
    groupedBooks,
    navigateToEditBook,
    navigateToAddBook,
    wordExistingBookIds,
  }) => {
    return (
      <View>
        {/* 触发器 */}
        <Pressable
          style={[styles.oneLineOption, generalStyles.rowBetweenContainer]}
          onPress={() => setSelectorOpen(!selectorOpen)}
        >
          <Text style={[generalStyles.textOptionsBlack, atomStyles.top1]}>
            {selectedBook ? selectedBook.name : '请选择笔记本'}
          </Text>
          <Image
            source={selectorOpen ? upIcon : downIcon}
            style={generalStyles.mediumIcon}
          />
        </Pressable>

        {/* 下拉内容 */}
        {selectorOpen && (
          <>
            {/* 点击外部关闭的遮罩层 */}
            <TouchableOpacity
              style={generalStyles.visible}
              onPress={() => setSelectorOpen(false)}
              activeOpacity={1}
            />
            <View style={[styles.dropdownContainer]}>
              <BookList
                handleSelectBook={handleSelectBook}
                subcategoryOption={subcategoryOption}
                groupedBooks={groupedBooks}
                navigateToEditBook={navigateToEditBook}
                navigateToAddBook={navigateToAddBook}
                wordExistingBookIds={wordExistingBookIds}
              />
            </View>
          </>
        )}
      </View>
    );
  },
);

const BookList = memo(
  ({
    handleSelectBook,
    subcategoryOption = [],
    groupedBooks = {},
    navigateToEditBook,
    navigateToAddBook,
    wordExistingBookIds = [],
  }) => {
    const defaultSub = subcategoryOption?.[0] || '未分类';
    const [activeSubcategory, setActiveSubcategory] = useState(defaultSub);

    // 过滤当前分类下的书籍
    const currentBooks = useMemo(
      () => groupedBooks[activeSubcategory] ?? [],
      [groupedBooks, activeSubcategory],
    );

    return (
      <View style={atomStyles.gap16}>
        {/* 子分类列表，横向 */}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.subcategoryTabsContainer}
          contentContainerStyle={atomStyles.gap8}
        >
          {subcategoryOption.map(sub => (
            <SubcategoryTabItem
              key={sub}
              sub={sub}
              isActive={activeSubcategory === sub}
              onPress={setActiveSubcategory}
            />
          ))}
        </ScrollView>

        {/* 书籍列表列表 */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={atomStyles.maxHeight120}
        >
          {currentBooks.map(book => (
            <BookItem
              key={book._id}
              book={book}
              disabled={wordExistingBookIds.includes(book._id)}
              onPress={handleSelectBook}
              onLongPress={navigateToEditBook}
            />
          ))}

          <View
            style={[
              generalStyles.rowCenterContainer,
              atomStyles.paddingVertical16,
            ]}
          >
            <Text style={generalStyles.textPrompt}>
              {currentBooks.length === 0
                ? '暂无笔记本，'
                : '没有想要的笔记本，'}
            </Text>
            <TextButton title={'新增'} onPress={navigateToAddBook} />
          </View>
        </ScrollView>
      </View>
    );
  },
);

const SubcategoryTabItem = memo(({ sub, isActive, onPress }) => (
  <TextButton
    title={sub}
    onPress={() => onPress(sub)}
    buttonStyle={[
      styles.subcategoryTabBase,
      isActive ? styles.subcategoryTabActive : styles.subcategoryTabInactive,
    ]}
    textStyle={[
      atomStyles.text13,
      isActive
        ? styles.subcategoryTabTextActive
        : styles.subcategoryTabTextInactive,
    ]}
  />
));

const BookItem = memo(({ book, disabled, onPress, onLongPress }) => (
  <Pressable
    style={({ pressed }) => [
      styles.bookItem,
      pressed && !disabled && atomStyles.bgGray,
    ]}
    onPress={() => onPress(book, disabled)}
    onLongPress={() => onLongPress(book)}
  >
    <View style={generalStyles.rowBetweenContainer}>
      <Text
        style={[
          generalStyles.textOptionsBlack,
          disabled && styles.disabledText,
        ]}
      >
        {book.name}
      </Text>
      <Text style={generalStyles.textPrompt}>
        {book.word_count ?? 0} 条笔记
      </Text>
    </View>
  </Pressable>
));

/**
 * 笔记内容
 */
const EditableTable = ({
  rows,
  cols,
  cellTexts,
  colWidths,
  rowHeights,
  firstRowDefaults,
  colDragging,
  changeText,
  changeRowHeight,
  changeColWidthByInput,
  addRow,
  createColPanResponder,
}) => {
  return (
    <View style={generalStyles.flexGapContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.noteContainer]}
      >
        <View>
          {/* 表格内容区域 */}
          <View>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <View key={`row-group-${rowIndex}`}>
                <View style={generalStyles.rowContainer}>
                  {Array.from({ length: cols }).map((_, colIndex) => (
                    <TableCell
                      key={`cell-${rowIndex}-${colIndex}`}
                      rowIndex={rowIndex}
                      colIndex={colIndex}
                      text={cellTexts[rowIndex][colIndex] || ''}
                      width={colWidths[colIndex]}
                      rowHeight={rowHeights[rowIndex]}
                      isFirstRow={rowIndex === 0}
                      cols={cols}
                      firstRowDefault={firstRowDefaults[colIndex]}
                      changeText={changeText}
                      changeRowHeight={changeRowHeight}
                      changeColWidthByInput={changeColWidthByInput}
                    />
                  ))}
                </View>
                {/* 行分隔线 */}
                {rowIndex !== 0 && (
                  <View style={generalStyles.horizontalDivider} />
                )}
              </View>
            ))}
          </View>

          {/* 列宽调整手柄 */}
          <DragHandles
            cols={cols}
            colWidths={colWidths}
            colDragging={colDragging}
            createColPanResponder={createColPanResponder}
          />

          <View style={styles.addRowTouch} />
        </View>
      </ScrollView>

      {/* 底部操作栏 */}
      <AddRowAction onAddRow={addRow} />
    </View>
  );
};

const TableCell = memo(
  ({
    rowIndex,
    colIndex,
    text,
    width,
    rowHeight,
    isFirstRow,
    cols,
    firstRowDefault,
    changeText,
    changeRowHeight,
    changeColWidthByInput,
  }) => {
    const isLeft = isFirstRow && colIndex === 0;
    const isRight = isFirstRow && colIndex === cols - 1;
    const needRightBorder = !isFirstRow && colIndex !== cols - 1;

    const cellStyle = {
      width: width,
      height: isFirstRow ? 40 : rowHeight,
    };

    return (
      <View>
        <View
          style={[
            generalStyles.rowContainer,
            isFirstRow ? styles.headerCell : styles.contentCell,
            isLeft && styles.headerTopLeftCell,
            isRight && styles.headerTopRightCell,
            { width: width }, // 确保外层 View 也实时变宽
          ]}
        >
          <TextInput
            multiline
            textAlignVertical="top"
            value={text}
            placeholder={isFirstRow ? firstRowDefault : ''}
            onChangeText={newText =>
              changeText({ text: newText, rowIndex, colIndex })
            }
            onContentSizeChange={e => {
              const contentHeight = e.nativeEvent.contentSize.height;
              changeRowHeight({ contentHeight, rowIndex, colIndex });
            }}
            style={[
              styles.cellBase,
              isFirstRow ? styles.HeaderCellText : styles.contentCellText,
              cellStyle,
            ]}
          />
          {needRightBorder && <View style={styles.verticalDivider} />}
        </View>

        <Text
          style={[styles.visibleText, { width: width }]}
          onLayout={e => {
            const textWidth = e.nativeEvent.layout.width;
            changeColWidthByInput({ textWidth, rowIndex, colIndex });
          }}
        >
          {text || ' '}
        </Text>
      </View>
    );
  },
  (prev, next) => {
    return (
      prev.width === next.width &&
      prev.text === next.text &&
      prev.rowHeight === next.rowHeight
    );
  },
);

const DragHandles = ({
  cols,
  colWidths,
  colDragging,
  createColPanResponder,
}) => {
  if (cols <= 1) return null;

  return (
    <>
      {colWidths.map((width, index) => {
        const left =
          colWidths.slice(0, index + 1).reduce((a, b) => a + b, 0) - 5;
        const isDragging = colDragging[index];

        const moveImageColor = {
          tintColor: isDragging ? Theme.colors.focusBlue : '#9db3b7c2',
        };
        const moveLineColor = {
          backgroundColor: isDragging ? Theme.colors.focusBlue : 'transparent',
        };

        return (
          <View
            key={`col-drag-${index}`}
            style={[styles.moveContainer, { left }]}
            {...createColPanResponder(index).panHandlers}
          >
            {index === cols - 1 ? (
              <Image
                source={expandIcon}
                style={[styles.moveImage, moveImageColor]}
              />
            ) : (
              <View style={[styles.moveLine, moveLineColor]} />
            )}
          </View>
        );
      })}
    </>
  );
};

const AddRowAction = memo(({ onAddRow }) => (
  <TouchableOpacity
    onPress={onAddRow}
    style={[generalStyles.rowCenterContainer, styles.addRowBtnRow]}
  >
    <View style={[styles.addRowBtn]}>
      <Image
        source={addIcon}
        style={[atomStyles.tintWhite, generalStyles.smallIcon]}
      />
    </View>
    <Text style={[atomStyles.text14, atomStyles.fw500, atomStyles.gray2]}>
      增加行
    </Text>
  </TouchableOpacity>
));

/**
 * 笔记样式
 */

const NoteDisplayModeSelector = memo(
  ({ note_display_type, setNoteDisplayType }) => {
    return (
      <View style={[styles.oneLineOption, generalStyles.rowBetweenContainer]}>
        <Text style={[generalStyles.textOptionsBlack, atomStyles.top1]}>
          选择展示模式
        </Text>

        <View style={styles.noteDisplayTypeContainer}>
          {NOTE_DISPLAY_TYPES.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.tabItem,
                option.value === note_display_type && styles.tabItemActive,
              ]}
              onPress={() => setNoteDisplayType(option.value)}
            >
              <Text
                style={[
                  generalStyles.textBody,
                  option.value === note_display_type && styles.tabTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  },
);

const StyleSettingsCard = memo(
  ({
    noteStyles,
    firstRowOptions,
    activeStyleCardIndex,
    setActiveStyleCardIndex,
    updateCardData,
  }) => {
    const activeLabel = firstRowOptions[activeStyleCardIndex];
    const activeData = noteStyles[activeLabel];

    // 如果当前选中的列没有配置数据，则不渲染
    if (!activeData) return null;

    return (
      <View style={styles.card}>
        {/* 列标签切换栏 */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.colLableContainer}
        >
          {firstRowOptions.map((label, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.tabItem,
                index === activeStyleCardIndex && styles.tabItemActive,
              ]}
              onPress={() => setActiveStyleCardIndex(index)}
            >
              <Text
                style={[
                  generalStyles.textBody,
                  index === activeStyleCardIndex && styles.tabTextActive,
                ]}
              >
                {label || `列 ${index + 1}`}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 具体样式配置表单 */}
        <RowStyleCard
          data={activeData}
          onChange={(field, value) => updateCardData(activeLabel, field, value)}
        />
      </View>
    );
  },
);

const RowStyleCard = memo(({ data, onChange }) => {
  const sizeOptions = ['12', '13', '14', '15', '16', '17', '18', '19', '20'];
  const next_col_options = getConnectorOptions();
  const weightOptions = getWeightOptions(data.font_family);
  const [fontOptions, setFontOptions] = useState([]);

  useEffect(() => {
    const init = async () => {
      const options = await getFontOptions();
      setFontOptions(options);
    };
    init();
  }, []);

  // 左侧竖线组件
  const GroupWrapper = ({ children }) => (
    <View style={styles.groupContainer}>
      <View style={styles.leftLineContainer}>
        <View style={styles.height12}></View>
        <View style={styles.leftLine}></View>
        <View style={styles.height10}></View>
      </View>
      <View style={atomStyles.flex}>{children}</View>
    </View>
  );

  const renderRow = (label, right) => (
    <View>
      <View style={styles.styleRow}>
        <Text style={generalStyles.textOptionsBlack}>{label}</Text>
        {right}
      </View>
      <View style={generalStyles.horizontalDivider}></View>
    </View>
  );

  return (
    <View style={generalStyles.gap16}>
      {/* ==================== 第一组 ==================== */}
      <GroupWrapper>
        {renderRow(
          '显示列标签',
          <Switch
            value={data.show_label}
            onValueChange={v => onChange('show_label', v)}
            trackColor={styles.switch}
            thumbColor={Theme.colors.bgWhite}
            ios_backgroundColor="#e0e0e0"
            style={atomStyles.left10}
          />,
        )}
      </GroupWrapper>

      {/* ==================== 第一组 ==================== */}
      <GroupWrapper>
        {renderRow(
          '默认隐藏',
          <Switch
            value={data.default_hidden}
            onValueChange={v => onChange('default_hidden', v)}
            trackColor={styles.switch}
            thumbColor={Theme.colors.bgWhite}
            ios_backgroundColor="#e0e0e0"
            style={atomStyles.left10}
          />,
        )}

        {renderRow(
          '点击切换显隐',
          <Switch
            value={data.toggle_visible}
            onValueChange={v => onChange('toggle_visible', v)}
            trackColor={styles.switch}
            thumbColor={Theme.colors.bgWhite}
            ios_backgroundColor="#e0e0e0"
            style={atomStyles.left10}
          />,
        )}
      </GroupWrapper>

      {/* ==================== 第二组（字体设置） ==================== */}
      <GroupWrapper>
        {/* 字体 */}
        {renderRow(
          '字体',
          <Dropdown
            options={fontOptions}
            value={data.font_family}
            onSelect={v => onChange('font_family', v)}
            zIndex={13}
            labelStyle={generalStyles.textOptionsGray}
            triggerArrowStyle={generalStyles.triggerArrowStyle}
            menuStyle={[styles.fontDropdownMenu, generalStyles.menuShadow]}
            itemTextStyle={fontName => ({
              fontFamily: `${getFont(fontName)}-${400}`,
            })}
          />,
        )}

        {/* 字体大小 */}
        {renderRow(
          '字体大小',
          <Dropdown
            options={sizeOptions}
            value={data.font_size}
            onSelect={v => onChange('font_size', v)}
            menuStyle={[styles.fontSizeDropdownMenu, generalStyles.menuShadow]}
            labelStyle={generalStyles.textOptionsGray}
            triggerArrowStyle={generalStyles.triggerArrowStyle}
            itemTextStyle={opt => ({
              fontFamily: `${getFont(data.font_family)}-${400}`,
              fontSize: Number(opt),
            })}
          />,
        )}

        {/* 字体粗细 */}
        {renderRow(
          '字体粗细',
          <Dropdown
            options={weightOptions}
            value={data.font_weight}
            onSelect={v => onChange('font_weight', v)}
            menuStyle={[
              styles.fontWeightDropdownMenu,
              generalStyles.menuShadow,
            ]}
            labelStyle={generalStyles.textOptionsGray}
            triggerArrowStyle={generalStyles.triggerArrowStyle}
            itemTextStyle={opt => ({
              fontFamily: `${getFont(data.font_family)}-${getWeight(opt)}`,
            })}
          />,
        )}

        {/* 字体颜色 */}
        {renderRow(
          '字体颜色',
          <FullColorPicker
            color={data.font_color}
            onColorChange={color => onChange('font_color', color)}
          />,
        )}

        {/* 背景色 */}
        {renderRow(
          '高亮色',
          <FullColorPicker
            color={data.background_color}
            onColorChange={color => onChange('background_color', color)}
          />,
        )}

        {/* 斜体 */}
        {renderRow(
          '斜体',
          <Switch
            value={data.italic}
            onValueChange={v => onChange('italic', v)}
            trackColor={styles.switch}
            thumbColor={Theme.colors.bgWhite}
            ios_backgroundColor="#e0e0e0"
            style={atomStyles.left10}
          />,
        )}
      </GroupWrapper>

      {/* ==================== 第三组 ==================== */}
      <GroupWrapper>
        {renderRow(
          '下一列分隔',
          <Dropdown
            options={next_col_options}
            value={data.next_col}
            onSelect={v => onChange('next_col', v)}
            menuStyle={[
              styles.nextConnectorDropdownMenu,
              generalStyles.menuShadow,
            ]}
            labelStyle={generalStyles.textOptionsGray}
            triggerArrowStyle={generalStyles.triggerArrowStyle}
          />,
        )}
      </GroupWrapper>
    </View>
  );
});
