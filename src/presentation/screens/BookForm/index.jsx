import { memo } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useRoute } from '@react-navigation/native';

import { useBookForm } from '../../../logic/hooks/book/useBookForm';

import { Page } from '../../components/ui/Page';
import { TextButton } from '../../components/ui/Button';
import { CommonHeader } from '../../components/ui/Header';

import styles from './style';
import atomStyles from '../../styles/atom.style';
import generalStyles from '../../styles/general.style';

import deleteIcon from '../../../../assets/icon/delete.png';

export default function BookForm({ navigation }) {
  const route = useRoute();

  const { state, actions } = useBookForm(navigation, route);
  const {
    subcategory,
    bookName,
    optionalSubcategories,
    isEdit,
    category,
    editingBook,
  } = state;
  const { setSubcategory, setBookName, handleConfirm, handleDelete, close } =
    actions;

  return (
    <Page pageStyle={atomStyles.gap16}>
      <CommonHeader
        title={isEdit ? `编辑${editingBook.category}` : `新增${category}`}
        leftText="取消"
        onLeftPress={close}
        leftTextStyle={atomStyles.lightBlue}
        {...(isEdit && {
          rightImageSource: deleteIcon,
          onRightPress: handleDelete,
          rightImageStyle: [atomStyles.tintGray],
        })}
        headerStyle={atomStyles.marginHorizontal16}
      />

      <View style={styles.contentContainer}>
        <View style={styles.card}>
          <SubcategorySelector
            items={optionalSubcategories}
            selectedValue={subcategory}
            onSelect={setSubcategory}
          />
          <FormInput
            value={subcategory}
            onChange={setSubcategory}
            placeholder={
              optionalSubcategories.length === 0
                ? '请创建分类'
                : '请选择或创建分类'
            }
          />
        </View>

        <View style={styles.card}>
          <FormInput
            value={bookName}
            onChange={setBookName}
            placeholder="请输入书籍名称"
          />
        </View>

        <TextButton
          title={isEdit ? '保存' : '确定'}
          onPress={handleConfirm}
          buttonStyle={styles.confirmButton}
          textStyle={styles.confirmButtonText}
        />
      </View>
    </Page>
  );
}

const SubcategorySelector = memo(({ items, selectedValue, onSelect }) => {
  if (!items || items.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.subcategoryTabsContainer}
    >
      {items.map(item => {
        const isSelected = item === selectedValue;
        return (
          <TouchableOpacity
            key={item}
            onPress={() => onSelect(isSelected ? '' : item)}
            style={[
              styles.subcategoryTab,
              styles.subcategoryTabInactive,
              isSelected && styles.subcategoryTabActive,
            ]}
          >
            <Text
              style={[
                generalStyles.textSmallPrompt,
                isSelected && styles.subcategoryTabTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
});

export const FormInput = memo(({ value, onChange, placeholder }) => (
  <TextInput
    placeholder={placeholder}
    style={styles.textInput}
    value={value}
    onChangeText={onChange}
  />
));
