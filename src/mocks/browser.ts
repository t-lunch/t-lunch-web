import { setupWorker } from 'msw/browser';
import { http, HttpResponse } from 'msw';


export const handlers = [
  http.get('/api/lunches', async () =>
    HttpResponse.json([
      { id: "1", time: "13:00", place: "Кухня", participants: 2 },
      { id: "2", time: "12:30", place: "Кафе", participants: 3 },
      { id: "2", time: "12:30", place: "Кафе", participants: 3 }
    ])
  )
];
  
export const worker = setupWorker(...handlers);

