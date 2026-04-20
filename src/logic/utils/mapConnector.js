export function mapConnector(next_col) {
  if (!next_col) return '';

  const key = next_col.trim();

  const CONNECTOR_MAP = {
    空格: '   ',
    逗号: '， ',
    点号: '. ',
    短横线: ' - ',
    下划线: ' _ ',
  };

  return CONNECTOR_MAP[key] ?? '';
}
