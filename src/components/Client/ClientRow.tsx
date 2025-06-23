import { ClientItem } from './types';
import { loggedIn } from './types';

const ClientRow = ({ item, uniqueNames, selectivityMap, onActionClick }) => {
  const isSelected = selectivityMap[item.id]?.has(loggedIn);
  return (
    <tr>
      <td>{item.id}</td>
      <td>{item.name}</td>
      <td>
        <button onClick={() => onActionClick(item.id, isSelected ? 'update status' : 'add')}>
          {isSelected ? 'update status' : 'Add'}
        </button>
      </td>
      {uniqueNames.map(name => (
        <td key={name}>
          {selectivityMap[item.id]?.has(name) ? 'x' : ''}
        </td>
      ))}
    </tr>
  );
};

export default ClientRow;
