export interface ClientItem {
  id: string;
  name: string;
}

export interface SelectivityItem {
  id: string;
  name: string;
  team?: string;
  sub_team?: string;
  selected_by?: string;
  created_on?: string;
  status?: string;
  input_fields?: string;
}