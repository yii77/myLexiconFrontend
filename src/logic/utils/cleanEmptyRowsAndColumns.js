export function cleanEmptyRowsAndColumns({
  note_display_type,
  cellTexts,
  noteStyles,
}) {
  if (!Array.isArray(cellTexts) || cellTexts.length === 0) {
    return { note_display_type, cellTexts, noteStyles };
  }

  const rows = cellTexts.length;
  const cols = cellTexts[0].length;

  let newCellTexts = cellTexts.map(row => [...row]); // 深拷贝
  let newNoteStyles = { ...noteStyles };

  // ========== 1. 删除整行全为空 ==========
  newCellTexts = newCellTexts.filter((row, rowIndex) => {
    if (rowIndex === 0) return true; // 第一行永远保留
    const allEmpty = row.every(text => !text || text.trim() === '');
    return !allEmpty;
  });

  // ========== 2. 删除整列全为空（第一行除外） ==========
  const colsToDelete = [];

  for (let col = 0; col < cols; col++) {
    const colName = newCellTexts[0][col];

    const allEmptyBelowFirstRow = newCellTexts
      .slice(1)
      .every(row => !row[col] || row[col].trim() === '');

    if (allEmptyBelowFirstRow) {
      colsToDelete.push(col);

      // 删除 noteStyles[列名]
      if (newNoteStyles[colName] !== undefined) {
        delete newNoteStyles[colName];
      }
    }
  }

  // 从 cellTexts 删除列
  if (colsToDelete.length > 0) {
    newCellTexts = newCellTexts.map(row =>
      row.filter((_, colIndex) => !colsToDelete.includes(colIndex)),
    );
  }

  return {
    note_display_type,
    cellTexts: newCellTexts,
    noteStyles: newNoteStyles,
  };
}
