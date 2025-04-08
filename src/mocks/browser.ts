import { setupWorker } from 'msw/browser';
import { http, HttpResponse } from 'msw';

// Храним список обедов в переменной, чтобы изменения сохранялись между запросами
let lunchList = [
  { id: "1", time: "13:00", place: "Кухня", participants: 2 },
  { id: "2", time: "12:30", place: "Кафе", participants: 3 },
  { id: "3", time: "12:30", place: "Кафе", participants: 3 }
];

export const handlers = [
  http.get('/api/lunches', () =>
    HttpResponse.json(lunchList)
  ),
  http.post('/api/lunches', async (req) => {
    let body: any = {};
    try {
      // Попытка получить тело запроса через req.request.json()
      body = await req.request.json();
    } catch (e) {
      // Если не получилось, fallback на req.body
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
