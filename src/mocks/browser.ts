import { http, HttpResponse } from 'msw';
import { setupWorker } from 'msw/browser';

interface Participant { id: string; name: string }
interface Lunch {
  id: string;
  time: string;
  place: string;
  note: string;
  participants: number;
  creator: string;
  participantsList: Participant[];
}

let lunchList: Lunch[] = [
  {
    id: "1",
    time: "13:00",
    place: "Кухня",
    participants: 2,
    creator: "Алексей",
    note: "",
    participantsList: [
      { id: "u1", name: "Иван Петров" },
      { id: "u2", name: "Ольга Сидорова" }
    ]
  },
  {
    id: "2",
    time: "12:30",
    place: "Кафе",
    participants: 1,
    creator: "Марина",
    note: "Жду всех в кафе «Уют»",
    participantsList: [
      { id: "u3", name: "Марина" }
    ]
  }
];

export const handlers = [
  http.get('/api/lunches', () => {
    return HttpResponse.json(lunchList);
  }),

  http.get('/api/lunches/:id', ({ params }) => {
    const lunch = lunchList.find(l => l.id === params.id);
    if (!lunch) {
      return new HttpResponse(null, { status: 404, statusText: 'Not Found' });
    }
    return HttpResponse.json(lunch);
  }),

  http.get('/lunch/:id', ({ params }) => {
    const lunch = lunchList.find(l => l.id === params.id);
    if (!lunch) {
      return new HttpResponse(null, { status: 404, statusText: 'Not Found' });
    }
    return HttpResponse.json(lunch);
  }),

  http.post('/api/lunches', async ({ request }) => {
    const { time, place, note, participants } = await request.json();
    const newLunch: Lunch = {
      id: Date.now().toString(),
      time,
      place,
      note: note || '',
      participants: participants || 1,
      creator: 'you',
      participantsList: [{ id: 'you', name: 'Вы' }]
    };
    lunchList.push(newLunch);
    return HttpResponse.json(newLunch);
  }),

  http.post('/api/lunches/:id/join', ({ params }) => {
    const lunch = lunchList.find(l => l.id === params.id);
    if (!lunch) {
      return new HttpResponse(null, { status: 404, statusText: 'Not Found' });
    }
    const newParticipant = { id: Date.now().toString(), name: 'Вы' };
    lunch.participantsList.push(newParticipant);
    lunch.participants = lunch.participantsList.length;
    return HttpResponse.json(lunch);
  }),
];

export const worker = setupWorker(...handlers);
