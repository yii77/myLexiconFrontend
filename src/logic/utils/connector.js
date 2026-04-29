const CONNECTOR_MAP = {
  空格: '   ',
  逗号: '， ',
  点号: '. ',
  短横线: ' - ',
  下划线: ' _ ',
};

export function getConnector(next_col) {
  if (!next_col) return '';

  const key = next_col.trim();

  return CONNECTOR_MAP[key] ?? '';
}

export function getConnectorOptions() {
  return Object.keys(CONNECTOR_MAP);
}
