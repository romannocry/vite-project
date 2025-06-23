import { useState, useEffect, useMemo } from 'react';
import { ClientItem, SelectivityItem, loggedIn } from './types';

export function useScopingLogic(initialClients: ClientItem[], initialSelectivity: SelectivityItem[]) {
  const [data, setData] = useState<ClientItem[]>([]);
  const [selectivityData, setSelectivityData] = useState<SelectivityItem[]>([]);
  const [textFilter, setTextFilter] = useState('');
  const [showOnlyMine, setShowOnlyMine] = useState(false);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);

  useEffect(() => {
    setData(initialClients);
    setSelectivityData(initialSelectivity);
  }, [initialClients, initialSelectivity]);

  const selectivityMap = useMemo(() => {
    return selectivityData.reduce((acc, item) => {
      if (!acc[item.id]) acc[item.id] = new Set();
      acc[item.id].add(item.name);
      return acc;
    }, {} as Record<string, Set<string>>);
  }, [selectivityData]);

  const filteredData = useMemo(() => {
    let result = data.filter(item => {
      const matchesText = item.name.toLowerCase().includes(textFilter.toLowerCase());
      const isMine = selectivityMap[item.id]?.has(loggedIn);
      return matchesText && (!showOnlyMine || isMine);
    });

    if (sortDirection) {
      result = [...result].sort((a, b) => {
        if (a.name < b.name) return sortDirection === 'asc' ? -1 : 1;
        if (a.name > b.name) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, textFilter, showOnlyMine, sortDirection, selectivityMap]);

  const uniqueNames = useMemo(
    () => Array.from(new Set(selectivityData.map(s => s.name))),
    [selectivityData]
  );

  const toggleSort = () => {
    if (sortDirection === null) setSortDirection('asc');
    else if (sortDirection === 'asc') setSortDirection('desc');
    else setSortDirection(null);
  };

  return {
    data: filteredData,
    selectivityData,
    selectivityMap,
    uniqueNames,
    setTextFilter,
    showOnlyMine,
    setShowOnlyMine,
    toggleSort,
    sortDirection,
    setSelectivityData
  };
}
