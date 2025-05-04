import { http, HttpResponse, es } from 'msw'
import { setupWorker } from 'msw/browser'

interface Participant { id: string; name: string }
interface Lunch {
  id: string
  time: string
  place: string
  note: string
  participants: number
  creatorId: string
  creatorName: string
  participantsList: Participant[]
}

const getTimePlus30 = (): string => {
  const now = new Date()
  now.setMinutes(now.getMinutes() + 30)
  const hh = now.getHours().toString().padStart(2, '0')
  const mm = now.getMinutes().toString().padStart(2, '0')
  return `${hh}:${mm}`
}

let lunchList: Lunch[] = [
  {
    id: "1",
    time: "13:00",
    place: "Кухня",
    participants: 2,
    creatorId: "uAleksey",
    creatorName: "Алексей",
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
    creatorId: "uMarina",
    creatorName: "Марина",
    note: "Жду всех в кафе «Уют»",
    participantsList: [
      { id: "u3", name: "Марина" }
    ]
  },
  {
    id: "3",
    time: getTimePlus30(),
    place: "Столовая",
    participants: 0,
    creatorId: "uPetr",
    creatorName: "Петр",
    note: "",
    participantsList: []
  },
  {
    id: "4",
    time: getTimePlus30(),
    place: "Кофейня",
    participants: 1,
    creatorId: "uElena",
    creatorName: "Елена",
    note: "Возьму для всех кофе!",
    participantsList: [
      { id: "u4", name: "Елена" }
    ]
  }
]

export const handlers = [
  http.get('/api/lunches', () => {
    return HttpResponse.json(lunchList)
  }),

  http.get('/api/lunches/:id', ({ params }) => {
    const lunch = lunchList.find(l => l.id === params.id)
    if (!lunch) {
      return new HttpResponse(null, { status: 404, statusText: 'Not Found' })
    }
    return HttpResponse.json(lunch)
  }),

  http.post('/api/lunches', async ({ request }) => {
    const { place, note, creatorId, creatorName } = await request.json()
  
    const time = getTimePlus30()
  
    const newLunch: Lunch = {
      id: Date.now().toString(),
      time,
      place,
      note: note || '',
      participants: 1,
      creatorId,
      creatorName,
      participantsList: [{ id: creatorId, name: creatorName }]
    }
  
    lunchList.push(newLunch)
  
    return HttpResponse.json(newLunch)
  }),
  

  http.post('/api/lunches/:id/join', async ({ params, request }) => {
    const lunch = lunchList.find(l => l.id === params.id);
    if (!lunch) {
      return new HttpResponse(null, { status: 404, statusText: 'Not Found' });
    }
  
    const { userId, creatorName } = await request.json();
  
    if (lunch.participantsList.some(p => p.id === userId)) {
      return new HttpResponse(null, { status: 400, statusText: 'Already joined' });
    }
  
    const newParticipant = { id: userId, name: creatorName };
    lunch.participantsList.push(newParticipant);
    lunch.participants = lunch.participantsList.length;
  
    return HttpResponse.json(lunch);
  }),
  


  http.post('/api/lunches/:id/leave', async ({ params, request }) => {
    const lunch = lunchList.find(l => l.id === params.id)
    if (!lunch) {
      return new HttpResponse(null, { status: 404, statusText: 'Not Found' })
    }
  
    const { userId } = await request.json() as { userId: string }
  
    lunch.participantsList = lunch.participantsList.filter(p => p.id !== userId)
    lunch.participants = lunch.participantsList.length
  
    return HttpResponse.json(lunch)
  }),
  

  // GET profile
  http.get('/api/profile', ({ request }) => {
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const user = users.find((u: any) => u.username === userId)
    if (!user) {
      return new HttpResponse(null, { status: 404, statusText: 'User not found' })
    }
    return HttpResponse.json(user)
  }),

  // PUT профиль + одновременный апдейт lunchList
  http.put('/api/profile', async ({ request }) => {
    const { userId, ...data } = (await request.json()) as {
      userId: string
      firstName?: string
      lastName?: string
      telegram?: string
      office?: string
    }

    // 1) Обновляем localStorage.users
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const idx = users.findIndex((u: any) => u.username === userId)
    if (idx === -1) {
      return new HttpResponse(null, { status: 404, statusText: 'Not Found' })
    }
    users[idx] = { ...users[idx], ...data }
    localStorage.setItem('users', JSON.stringify(users))
    const updatedUser = users[idx]

    // 2) Формируем новое отображаемое имя
    const newName = `${updatedUser.firstName} ${updatedUser.lastName}`

    // 3) Применяем ко всем lunchList
    lunchList = lunchList.map((l) => {
      // если вы создатель — меняем creatorName
      if (l.creatorId === userId) {
        l.creatorName = newName
      }
      // если вы участник — меняем имя в participantsList
      l.participantsList = l.participantsList.map((p) =>
        p.id === userId ? { ...p, name: newName } : p
      )
      l.participants = l.participantsList.length
      return l
    })

    // 4) Возвращаем обновлённого пользователя
    return HttpResponse.json(updatedUser)
  }),

  // чтобы React Router работал SPA-переход на /profile
  http.get('/profile', () => {
    return new HttpResponse(
      '<!doctype html><html><body><div id="root"></div></body></html>',
      { headers: { 'Content-Type': 'text/html' } }
    )
  }),
]

export const worker = setupWorker(...handlers)
