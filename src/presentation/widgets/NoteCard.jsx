import { useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { mapFont } from '../../logic/utils/mapFont';
import { mapWeight } from '../../logic/utils/mapWeight';
import { mapConnector } from '../../logic/utils/mapConnector';

import generalStyles from '../styles/general.style';
import atomStyles from '../styles/atom.style';

export function NoteCard({ note_display_type, cellTexts, noteStyles }) {
  if (!cellTexts || cellTexts.length === 0) return null;

  const headers = cellTexts[0];
  const rows = cellTexts.slice(1);

  const stylesMap = {};
  const toggleMap = {};
  const showLabelMap = {};
  const connectorMap = {};
  const initialVisible = {};

  for (const [key, item] of Object.entries(noteStyles)) {
    stylesMap[key] = {
      color: item.font_color,
      fontWeight: mapWeight(item.font_weight),
      fontFamily: mapFont(item.font_family),
      fontSize: Number(item.font_size),
      fontStyle: item.italic ? 'italic' : 'normal',
      backgroundColor: item.background_color,
    };
    toggleMap[key] = item.toggle_visible;
    showLabelMap[key] = item.show_label;
    connectorMap[key] = item.next_col || '无';
    initialVisible[key] = !item.default_hidden;
  }

  const [visibleMap, setVisibleMap] = useState(initialVisible);

  const handlePress = () => {
    setVisibleMap(prev => {
      const updated = { ...prev };
      for (const key in toggleMap) {
        if (toggleMap[key]) {
          updated[key] = !prev[key];
        }
      }
      return updated;
    });
  };

  // ======================= 行模式 =======================
  if (note_display_type === 'row') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        style={[atomStyles.gap8, atomStyles.flex]}
        activeOpacity={1}
      >
        {rows.map((row, rowIndex) => {
          const lastIndex = row.reduceRight(
            (acc, v, idx) => (acc === -1 && v ? idx : acc),
            -1,
          );
          return (
            <Text key={rowIndex} style={generalStyles.rowWrapContainer}>
              {row.map((text, colIndex) => {
                const header = headers[colIndex];
                const connector =
                  colIndex < lastIndex
                    ? mapConnector(connectorMap[header])
                    : '';
                if (!text || !visibleMap[header]) return null;
                return (
                  <Text key={colIndex}>
                    <Text style={stylesMap[header]}>
                      {showLabelMap[header] && `${header}：`}
                      {text}
                    </Text>
                    {connector}
                  </Text>
                );
              })}
            </Text>
          );
        })}
      </TouchableOpacity>
    );
  }

  // ======================= 列模式 =======================
  if (note_display_type === 'col') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        style={[atomStyles.gap8, atomStyles.flex]}
        activeOpacity={1}
      >
        {headers.map((header, colIndex) => {
          if (!visibleMap[header]) return null;
          const lastIndex = rows.reduceRight(
            (acc, row, idx) => (acc === -1 && row[colIndex] ? idx : acc),
            -1,
          );
          if (lastIndex === -1) return null;
          return (
            <Text key={colIndex} style={generalStyles.rowWrapContainer}>
              {showLabelMap[header] && `${header}：`}
              {rows.map((row, rowIdx) => {
                const text = row[colIndex] || '';
                const connector =
                  rowIdx < lastIndex ? mapConnector(connectorMap[header]) : '';
                if (!text) return null;
                return (
                  <Text key={rowIdx}>
                    <Text style={stylesMap[header]}>{text}</Text>
                    {connector}
                  </Text>
                );
              })}
            </Text>
          );
        })}
      </TouchableOpacity>
    );
  }

  return null;
}
