import axios from "axios";

export const getLunches = async () => {
  const response = await axios.get("/api/lunches");
  return response.data;
};


// export const createLunch = async (data: any) => {
//   // Here make a real request for the server

//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const storedLunches = JSON.parse(localStorage.getItem("lunches") || "[]");
//       const newLunch = {
//         id: Date.now().toString(),
//         time: data.time,
//         place: data.place,
//         note: data.note,
//         participants: 1,
//         creator: "you",
//       };
//       storedLunches.push(newLunch);
//       localStorage.setItem("lunches", JSON.stringify(storedLunches));
//       resolve(newLunch);
//     }, 500);
//   });
// };
export const createLunch = async (data: any) => {
  const response = await axios.post("/api/lunches", data, {
    headers: { "Content-Type": "application/json" }
  });
  return response.data;
};