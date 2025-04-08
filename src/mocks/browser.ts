import { http, HttpResponse } from 'msw';
import { setupWorker } from 'msw/browser';


let lunchList = [
  { id: "1", time: "13:00", place: "Кухня", participants: 2, creator: "Алексей" },
  { id: "2", time: "12:30", place: "Кафе", participants: 3, creator: "Марина" },
];


export const handlers = [

  http.get('/api/lunches', () =>
    HttpResponse.json(lunchList)
  ),

  http.get('/api/lunches/:id', (req) => {
    const { id } = req.params;
    const lunch = lunchList.find((l) => l.id === id);
    if (lunch) {
      return HttpResponse.json(lunch);
    }
    return HttpResponse.json({ error: "Not Found" }, { status: 404 });
  }),

  http.post('/api/lunches', async (req) => {
    let body: any = {};
    try {
      body = await req.request.json();
    } catch (e) {
      body = req.body || {};
    }
    const { time, place, note } = body as { time?: string; place?: string; note?: string };

    if (!time || !place) {
      return HttpResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const newLunch = {
      id: Date.now().toString(),
      time,
      place,
      note,
      participants: 1,
      creator: "you"
    };

    lunchList.push(newLunch);
    return HttpResponse.json(newLunch);
  }),
];

export const worker = setupWorker(...handlers); 