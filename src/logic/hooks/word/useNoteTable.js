import { useState } from 'react';
import { Dimensions, PanResponder } from 'react-native';

export function useNoteTable(initData = null) {
  const minHeight = 80;
  const maxWidth = Dimensions.get('window').width - 32;
  const minWidth = maxWidth / 3;

  const initRows = initData?.length > 0 ? initData.length : 2;
  const initCols = initData?.[0]?.length > 0 ? initData[0].length : 1;

  const defaultFirstRow = Array.from({ length: initCols }, (_, i) =>
    i === 0 ? 'content' : `content${i}`,
  );

  const defaultCellTexts =
    initData ??
    Array.from({ length: initRows }, (_, rowIndex) =>
      rowIndex === 0 ? [...defaultFirstRow] : Array(initCols).fill(''),
    );

  const defaultFirstRowDefaults = initData
    ? initData[0].map((v, i) => v || `content${i}`)
    : defaultFirstRow;

  // ========== 状态初始化 ==========
  const [rows, setRows] = useState(initRows);
  const [cols, setCols] = useState(initCols);
  const [firstRowDefaults, setFirstRowDefaults] = useState(
    defaultFirstRowDefaults,
  );
  const [cellTexts, setCellTexts] = useState(defaultCellTexts);
  const [colWidths, setColWidths] = useState(
    Array(initCols).fill(Math.max(maxWidth / initCols, minWidth)),
  );
  const [rowHeights, setRowHeights] = useState(Array(initRows).fill(minHeight));
  const [colMaxTextWidths, setColMaxTextWidths] = useState(
    Array(initCols).fill(0),
  );
  const [colDragging, setColDragging] = useState(Array(initCols).fill(false));
  const [colResized, setColResized] = useState(Array(initCols).fill(false));
  const [colHasContent, setColHasContent] = useState(
    Array(initCols).fill(false),
  );

  const createColPanResponder = colIndex =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setColDragging(prev => {
          const newDragging = [...prev];
          newDragging[colIndex] = true;
          return newDragging;
        });
      },
      onPanResponderMove: (_, gestureState) => {
        setColWidths(prev => {
          const widths = [...prev];
          const newWidth = prev[colIndex] + gestureState.dx;
          const totalWidth =
            widths.reduce((a, b) => a + b, 0) + gestureState.dx;
          if (totalWidth < maxWidth) return widths;
          if (newWidth >= maxWidth) return widths;
          if (newWidth <= minWidth) return widths;
          widths[colIndex] = newWidth;
          return widths;
        });
      },
      onPanResponderRelease: () => {
        setColDragging(prev => {
          const newDragging = [...prev];
          newDragging[colIndex] = false;
          return newDragging;
        });
        setColResized(prev => {
          const next = [...prev];
          next[colIndex] = true;
          return next;
        });
      },
    });

  const addColumn = () => {
    const newCols = cols + 1;
    const newDefault = `content${cols}`;

    // 更新第一行默认值
    const newFirstRowDefaults = [...firstRowDefaults, newDefault];

    // 更新 cellTexts
    const newCellTexts = cellTexts.map((row, rowIndex) =>
      rowIndex === 0 ? [...row, newDefault] : [...row, ''],
    );

    // 更新列宽
    const newColWidths = [...colWidths];
    if (newCols === 2) {
      const avg = maxWidth / newCols;
      if (colMaxTextWidths[0] < avg) {
        newColWidths[0] = avg;
        newColWidths[1] = avg;
      } else {
        const w1 = Math.max(minWidth, maxWidth - colWidths[0]);
        const w0 = maxWidth - w1;
        newColWidths[0] = w0;
        newColWidths[1] = w1;
      }
    } else if (newCols === 3) {
      for (let i = 0; i < 2; i++) {
        if (!colResized[i]) newColWidths[i] = minWidth;
      }
      newColWidths.push(minWidth);
    } else {
      newColWidths.push(minWidth);
    }

    // 更新其他列状态
    setColMaxTextWidths([...colMaxTextWidths, 0]);
    setColDragging([...colDragging, false]);
    setColResized([...colResized, false]);
    setColHasContent([...colHasContent, false]);

    // 最后统一更新状态
    setCols(newCols);
    setFirstRowDefaults(newFirstRowDefaults);
    setCellTexts(newCellTexts);
    setColWidths(newColWidths);
  };

  const addRow = () => {
    setRows(prevRows => prevRows + 1);

    const newRow = Array(cols).fill('');

    setCellTexts(prev => [...prev, newRow]);

    setRowHeights(prev => [...prev, minHeight]);
  };

  const changeText = ({ text, rowIndex, colIndex }) => {
    setCellTexts(prev => {
      const newTexts = [...prev];
      newTexts[rowIndex] = [...newTexts[rowIndex]];
      newTexts[rowIndex][colIndex] = text;

      setColHasContent(prevHasContent => {
        const newHasContent = [...prevHasContent];

        if (text) {
          newHasContent[colIndex] = true;
        } else {
          const hasOtherContent = newTexts
            .slice(1) // 忽略第一行
            .some(row => row[colIndex] && row[colIndex].trim() !== '');
          newHasContent[colIndex] = hasOtherContent;
        }

        return newHasContent;
      });

      return newTexts;
    });
  };

  const changeColWidthByInput = ({ textWidth, rowIndex, colIndex }) => {
    // 计算新的最大列宽
    const newColMaxTextWidths = [...colMaxTextWidths];
    if (textWidth > newColMaxTextWidths[colIndex]) {
      newColMaxTextWidths[colIndex] = Math.min(textWidth, maxWidth);
    }

    // 更新列宽
    const newColWidths = [...colWidths];
    // 如果正在拖动、已经调整过或文字超宽，则不改变当前宽度
    if (
      !colDragging[colIndex] &&
      !colResized[colIndex] &&
      textWidth <= maxWidth
    ) {
      let totalWidth = 0;
      for (let i = 0; i < colWidths.length; i++) {
        totalWidth += i === colIndex ? newColMaxTextWidths[i] : colWidths[i];
      }
      if (totalWidth >= maxWidth) {
        newColWidths[colIndex] = Math.max(
          minWidth,
          newColMaxTextWidths[colIndex],
        );
      }
    }

    // 一次性更新状态
    setColMaxTextWidths(newColMaxTextWidths);
    setColWidths(newColWidths);
  };

  const changeRowHeight = ({ contentHeight, rowIndex, colIndex }) => {
    setRowHeights(prevHeights => {
      const newHeights = [...prevHeights];
      const currentHeight = newHeights[rowIndex] || minHeight;

      // 如果新的内容高度比当前行高大，则更新
      if (contentHeight > currentHeight) {
        newHeights[rowIndex] = contentHeight;
      } else {
        const isOtherColsEmpty = cellTexts[rowIndex].every(
          (text, i) => i === colIndex || !text,
        );
        if (isOtherColsEmpty)
          newHeights[rowIndex] = Math.max(contentHeight, minHeight);
      }

      return newHeights;
    });
  };

  return {
    rows,
    cols,
    cellTexts,
    colWidths,
    rowHeights,
    colDragging,
    colHasContent,
    createColPanResponder,
    addColumn,
    addRow,
    firstRowDefaults,
    changeText,
    changeColWidthByInput,
    changeRowHeight,
  };
}
