import { ClientItem } from './types';
import ClientRow from './ClientRow';

interface ClientTableProps {
  data: ClientItem[];
  uniqueNames: string[];
  selectivityMap: Record<string, Set<string>>;
  onActionClick: (id: string, action: 'add' | 'update status') => void;
}

const ClientTable = ({ data, uniqueNames, selectivityMap, onActionClick }: ClientTableProps) => (
  <table border={1} cellPadding={5}>
    <thead>
      <tr>
        <th>ID</th>
        <th>Client Name</th>
        <th>Action</th>
        {uniqueNames.map(name => <th key={name}>{name}</th>)}
      </tr>
    </thead>
    <tbody>
      {data.map(item => (
        <ClientRow
          key={item.id}
          item={item}
          uniqueNames={uniqueNames}
          selectivityMap={selectivityMap}
          onActionClick={onActionClick}
        />
      ))}
    </tbody>
  </table>
);

export default ClientTable;
