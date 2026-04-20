import { useState, memo } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { NoteCard } from './NoteCard';
import { DefinitionCard } from './DefinitionCard';

import { TextButton } from '../components/ui/Button';

import atomStyles from '../styles/atom.style';
import generalStyles from '../styles/general.style';

import Theme from '../../config/theme/index';

import upIcon from '../../../assets/icon/up.png';
import downIcon from '../../../assets/icon/down.png';

export function WordDataSection({ wordData, handleDeleteNote }) {
  return (
    <ScrollView
      style={atomStyles.flex}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={atomStyles.gap16}
    >
      {wordData.map((item, index) => (
        <DataItem
          key={item._id}
          item={item}
          isLast={index === wordData.length - 1}
          handleDeleteNote={handleDeleteNote}
        />
      ))}
    </ScrollView>
  );
}

const DataItem = memo(
  ({ item, isLast, handleDeleteNote }) => {
    const {
      _id,
      word,
      book_name,
      content,
      word_count,
      style_type,
      is_expanded: defaultExpanded,
      book_id,
      source_type,
    } = item;

    const navigation = useNavigation();
    const isNote = source_type === 'user';
    const [isExpanded, setIsExpanded] = useState(defaultExpanded || false);

    const toggleExpand = () => setIsExpanded(prev => !prev);

    const handleEdit = () => {
      navigation.navigate('NoteFormSreen', {
        word,
        editingNote: {
          _id,
          note_display_type: content.note_display_type,
          cellTexts: content.cellTexts,
          noteStyles: content.noteStyles,
          notebook: {
            _id: book_id,
            name: book_name,
            word_count,
          },
        },
      });
    };

    return (
      <View style={atomStyles.gap16}>
        <View style={atomStyles.gap16}>
          <TouchableOpacity
            onPress={toggleExpand}
            style={generalStyles.rowBetweenContainer}
            onLongPress={
              isNote
                ? () => {
                    handleDeleteNote(_id);
                  }
                : undefined
            }
          >
            <View style={[atomStyles.gap10, generalStyles.rowContainer]}>
              <Text style={styles.sectionTitle}>{book_name}</Text>
              {isNote && (
                <TextButton
                  title="编辑"
                  onPress={e => {
                    e.stopPropagation();
                    handleEdit();
                  }}
                  textStyle={generalStyles.textPrompt}
                />
              )}
            </View>
            <Image
              source={isExpanded ? upIcon : downIcon}
              style={generalStyles.largeIcon}
            />
          </TouchableOpacity>

          {isExpanded &&
            (isNote ? (
              <NoteCard
                note_display_type={content.note_display_type}
                cellTexts={content.cellTexts}
                noteStyles={content.noteStyles}
              />
            ) : (
              <DefinitionCard content={content} style_type={style_type} />
            ))}
        </View>
        {!isLast && <View style={styles.devideLine} />}
      </View>
    );
  },
  (prev, next) => prev.item.version === next.item.version,
);

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    color: Theme.colors.textLightBlack,
  },
  devideLine: {
    height: 3,
    backgroundColor: Theme.colors.divider3,
    borderRadius: 999,
  },
});
