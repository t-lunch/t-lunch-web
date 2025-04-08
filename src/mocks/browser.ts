import { setupWorker } from 'msw/browser';
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/lunches', async () =>
    HttpResponse.json([
      { id: "1", time: "13:00", place: "Кухня", participants: 2 },
      { id: "2", time: "12:30", place: "Кафе", participants: 3 },
      { id: "3", time: "12:30", place: "Кафе", participants: 3 }
    ])
  ),
  http.post("/api/lunches", (req) => {
    const body = req.body as { time?: string; place?: string; note?: string };
    if (!body || typeof body !== "object" || !body.time) {
      return HttpResponse.json({ error: "Некорректные данные" }, { status: 400 });
    }

    return HttpResponse.json({
      id: Date.now().toString(),
      time: body.time,
      place: body.place,
      note: body.note,
      participants: 1,
      creator: "you",
    });
  }),
];

export const worker = setupWorker(...handlers);
