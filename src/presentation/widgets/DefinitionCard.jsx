import { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';

import { TextButton } from '../components/ui/Button';
import { CustomText } from '../components/ui/Font';

import atomStyles from '../styles/atom.style';
import generalStyles from '../styles/general.style';

import Theme from '../../config/theme/index';

export function DefinitionCard({ content = [], style_type }) {
  if (!content || content.length === 0) return null;

  if (style_type === 'posPick') {
    return <PosPick content={content} />;
  }

  if (style_type === 'textOnly') {
    return (
      <View>
        {content.map((item, idx) => (
          <CustomText key={idx} type="chinese" style={[generalStyles.textBody]}>
            {Object.values(item).join('.  ')}
          </CustomText>
        ))}
      </View>
    );
  }

  return null;
}

function PosPick({ content }) {
  const [filter, setFilter] = useState('全部');

  const parts = useMemo(() => {
    return [...new Set(content.map(item => Object.values(item)[0]))];
  }, [content]);

  const filteredList = useMemo(() => {
    if (filter === '全部') return content;
    return content.filter(item => Object.values(item)[0] === filter);
  }, [content, filter]);

  useEffect(() => {
    if (parts.length === 1) {
      setFilter(parts[0]);
    } else {
      setFilter('全部');
    }
  }, [parts]);

  return (
    <View style={atomStyles.gap10}>
      <View style={[atomStyles.gap10, generalStyles.rowWrapContainer]}>
        {parts.length > 1 && (
          <FilterButton
            label="全部"
            active={filter === '全部'}
            onPress={() => setFilter('全部')}
          />
        )}

        {parts.map(p => (
          <FilterButton
            key={p}
            label={p}
            active={filter === p}
            onPress={() => setFilter(p)}
          />
        ))}
      </View>

      <View style={atomStyles.gap8}>
        {filteredList.map((item, idx) => {
          const values = Object.values(item);
          const joinedText = values.join('. ');
          const displayContent =
            filter === '全部'
              ? joinedText
              : item.meaning_cn ?? values.slice(1).join('. ');

          return (
            <CustomText key={idx} type="chinese" style={generalStyles.textBody}>
              {displayContent}
            </CustomText>
          );
        })}
      </View>
    </View>
  );
}

function FilterButton({ label, active, onPress }) {
  return (
    <TextButton
      title={label}
      onPress={onPress}
      buttonStyle={[styles.filterButton, active && styles.activeFilterButton]}
      textStyle={[
        generalStyles.textBody,
        active && atomStyles.white,
        active && atomStyles.fw500,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  filterButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#e6e6e6',
  },
  activeFilterButton: {
    backgroundColor: Theme.colors.blockLightBlue,
  },
});
