export interface Participant {
  id: string;
  name: string;
}

export interface Lunch {
  id: string;
  time: string;
  place: string;
  note?: string;
  participants: number;
  creatorId: string;
  creatorName: string;
  participantsList: Participant[];
}