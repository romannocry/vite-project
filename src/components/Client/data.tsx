import { ClientItem, SelectivityItem} from './types'

export const loggedIn = "Alice";

export const dataset: ClientItem[] = [
  { id: '123', name: 'client' },
  { id: '124', name: 'new client' },
  { id: '125', name: 'another client' },
  { id: '126', name: 'extra client' },
];

export const initialSelectivity: SelectivityItem[] = [
  {
    id: '123',
    name: 'Alice',
    team: '',
    sub_team: '',
    selected_by: '',
    created_on: new Date(),
    status: '',
    input_fields: '{}',
  },
  {
    id: '124',
    name: 'Bob',
    team: '',
    sub_team: '',
    selected_by: '',
    created_on: new Date(),
    status: '',
    input_fields: '',
  },
  {
    id: '123',
    name: 'Bob',
    team: '',
    sub_team: '',
    selected_by: '',
    created_on: new Date(),
    status: '',
    input_fields: '',
  },
  {
    id: '125',
    name: 'Alice',
    team: '',
    sub_team: '',
    selected_by: '',
    created_on: new Date(),
    status: '',
    input_fields: '',
  },
];
