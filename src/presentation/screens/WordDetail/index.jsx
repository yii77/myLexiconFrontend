import { useCallback } from 'react';
import { View } from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import { useGetWordData } from '../../../logic/hooks/word/useGetWordData';
import { useWordSwitch } from '../../../logic/hooks/word/useSwitchWord';
import { useNoteActions } from '../../../logic/hooks/word/useNoteActions';

import { WordDataSection } from '../../widgets/WordDataSection';

import { useCustomAlert } from '../../components/system/Alert/useCustomAlert';

import { Page } from '../../components/ui/Page';
import { ImageButton } from '../../components/ui/Button';
import { CustomText } from '../../components/ui/Font';

import styles from './style';
import generalStyles from '../../styles/general.style';
import atomStyles from '../../styles/atom.style';

import leftIcon from '../../../../assets/icon/left.png';
import rightIcon from '../../../../assets/icon/right.png';
import addIcon from '../../../../assets/icon/add.png';
import backIcon from '../../../../assets/icon/back.png';

export default function WordDetailScreen({ route, navigation }) {
  const { word: initialWord, wordArray } = route.params;

  const { currentIndex, currentWord, goPrev, goNext } = useWordSwitch(
    initialWord,
    wordArray,
  );
  const { wordData, refreshNotes } = useGetWordData(currentWord);

  useFocusEffect(
    useCallback(() => {
      refreshNotes();
    }, [refreshNotes]),
  );

  const { showAlert, hideAlert } = useCustomAlert();

  const { deleteNote } = useNoteActions();

  console.log(wordData);
  const handleDeleteNote = _id => {
    showAlert({
      title: '提示',
      content: '确认删除笔记吗？',
      buttons: [
        { text: '取消', onPress: hideAlert },
        {
          text: '确定',
          onPress: () => {
            const success = deleteNote(_id);
            if (success) {
              refreshNotes();
              hideAlert();
            } else {
              // hideAlert();
            }
          },
        },
      ],
    });
  };

  return (
    <Page pageStyle={[atomStyles.paddingHorizontal16, atomStyles.gap16]}>
      <View style={[generalStyles.rowContainer, atomStyles.paddingBottom10]}>
        <ImageButton
          imageSource={backIcon}
          imageStyle={styles.backIcon}
          onPress={() => navigation.goBack()}
        />
        <CustomText type="english" style={styles.wordTitle}>
          {currentWord}
        </CustomText>
      </View>

      <WordDataSection
        wordData={wordData}
        handleDeleteNote={handleDeleteNote}
      />

      <ImageButton
        imageSource={addIcon}
        onPress={() => {
          navigation.navigate('NoteFormSreen', { word: currentWord });
        }}
        buttonStyle={styles.addNoteButton}
        imageStyle={styles.addNoteImage}
      />
      <View style={styles.bottomRow}>
        <ImageButton
          imageSource={leftIcon}
          imageStyle={generalStyles.XLargeIcon}
          disabled={currentIndex === 0}
          onPress={goPrev}
        />
        <ImageButton
          imageSource={rightIcon}
          imageStyle={generalStyles.XLargeIcon}
          disabled={currentIndex === wordArray.length - 1}
          onPress={goNext}
        />
      </View>
    </Page>
  );
}
