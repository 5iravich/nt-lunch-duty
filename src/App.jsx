import React, { useEffect, useState } from "react";
import Bg from './assets/bg.png'

const dutyMembers = [
  "Pao, Meen & Fai",
  "Aote & Aom",
  "Cho & Biw",
  "Tar & Pak"
];

// วันเริ่มต้นหมุนเวร (YYYY-MM-DD)
const startDate = "2025-08-11";

// ฟังก์ชันแบ่งช่วงเวลา
function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 20) return "evening";
  return "night";
}

// กำหนดสีพื้นหลังตามช่วงเวลา
function getBackgroundClass() {
  switch (getTimeOfDay()) {
    case "morning":
      return "bg-gradient-to-r from-orange-300 via-yellow-200 to-blue-200 animate-gradient-x";
    case "afternoon":
      return "bg-gradient-to-r from-sky-300 via-blue-400 to-indigo-300 animate-gradient-x";
    case "evening":
      return "bg-gradient-to-r from-purple-500 via-pink-400 to-orange-400 animate-gradient-x";
    case "night":
      return "bg-gradient-to-r from-gray-900 via-blue-900 to-black animate-gradient-x";
    default:
      return "bg-gray-200";
  }
}

// ไอคอนประกอบตามเวลา
function getTimeOfDayIcon() {
  switch (getTimeOfDay()) {
    case "morning":
      return "🌅";
    case "afternoon":
      return "🌞";
    case "evening":
      return "🌇";
    case "night":
      return "🌙";
    default:
      return "🕒";
  }
}

function getNextWorkday(date, holidays) {
  let nextDate = new Date(date);
  while (true) {
    const dayOfWeek = nextDate.getDay();
    const dateStr = nextDate.toISOString().split("T")[0];
    if (dayOfWeek >= 1 && dayOfWeek <= 5 && !holidays.includes(dateStr)) {
      return nextDate;
    }
    nextDate.setDate(nextDate.getDate() + 1);
  }
}

function countWorkdays(fromDate, toDate, holidays) {
  let count = 0;
  let current = new Date(fromDate);

  while (current <= toDate) {
    const dayOfWeek = current.getDay();
    const dateStr = current.toISOString().split("T")[0];
    if (dayOfWeek >= 1 && dayOfWeek <= 5 && !holidays.includes(dateStr)) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  return count;
}

function generateDutyTable(startDate, holidays, members) {
  const today = new Date();
  const endDate = new Date();
  endDate.setDate(today.getDate() + 7); // ล่วงหน้า 7 วัน
  const table = [];
  let current = getNextWorkday(today, holidays);

  while (current <= endDate) {
    const workdaysPassed = countWorkdays(new Date(startDate), current, holidays) - 1;
    const dutyIndex = workdaysPassed % members.length;
    const dutyPerson = members[dutyIndex];
    table.push({
      date: current.toLocaleDateString("th-TH", { weekday: "short", day: "2-digit", month: "short", year: "numeric" }),
      person: dutyPerson
    });
    // ไปวันทำงานถัดไป
    current = getNextWorkday(new Date(current.setDate(current.getDate() + 1)), holidays);
  }

  return table;
}

// ฟังก์ชันหา className ของสีตามวัน
function getDayColor(day) {
  switch (day) {
    case 0: return "bg-gradient-to-t from-red-800/20 from-10% via-red-500/20 via-50% to-rose-300/20 to-90% text-white backdrop-blur-xs";      // อาทิตย์
    case 1: return "bg-gradient-to-t from-amber-500/20 from-10% via-yellow-500/20 via-50% to-amber-100/20 to-90% text-white backdrop-blur-xs";   // จันทร์
    case 2: return "bg-gradient-to-t from-rose-800/20 from-10% via-pink-500/20 via-50% to-fuchsia-300/20 to-90% text-white backdrop-blur-xs";     // อังคาร
    case 3: return "bg-gradient-to-t from-teal-800/20 from-10% via-emerald-500/20 via-50% to-green-300/20 to-90% text-white backdrop-blur-xs";    // พุธ
    case 4: return "bg-gradient-to-t from-orange-600/20 from-10% via-orange-500/20 via-50% to-yellow-300/20 to-90% text-white backdrop-blur-xs";   // พฤหัส
    case 5: return "bg-gradient-to-t from-blue-600/20 from-10% via-sky-500/20 via-50% to-cyan-300/20 to-90% text-white backdrop-blur-xs";     // ศุกร์
    case 6: return "bg-gradient-to-t from-fuchsia-600/20 from-10% via-purple-500/20 via-50% to-violet-300/20 to-90% text-white backdrop-blur-xs";   // เสาร์
    default: return "bg-gray-300 text-black";
  }
}

export default function App() {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    fetch("http://localhost:3001/holidays")
      .then(res => res.json())
      .then(data => {
        setHolidays(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching holidays:", err);
        setLoading(false);
      });
  }, []);

   useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
    <div className="flex items-center justify-center h-screen w-full">
      <p className="text-lg font-semibold">กำลังโหลดข้อมูล...</p>
    </div>
  );
  }

  const dutyTable = generateDutyTable(startDate, holidays, dutyMembers);

  // หา duty ของวันนี้
  const today = new Date();
  const todayStr = new Date().toLocaleDateString("th-TH", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const todayDuty = dutyTable.find((row) => row.date === todayStr);
  const todayColor = getDayColor(today.getDay());

  return (
    <div className={`h-screen w-full flex flex-col items-center justify-start p-6 relative transition-all duration-1000 ${getBackgroundClass()}`} style={{ fontFamily: "Kanit" }}>
    <div className="absolute top-4 left-6 text-lg font-semibold text-white drop-shadow-lg">
      {time.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
    </div>
      {/* ไอคอนมุมขวาบน */}
      <div className="absolute top-4 right-6 text-4xl drop-shadow-lg">
        {getTimeOfDayIcon()}
      </div>
      {/* Card วันนี้ */}
      <div className={`mt-12 shadow-md rounded-2xl px-18 py-10 text-center ${todayColor} transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 cursor-pointer`}>
        <h1 className="text-xl font-bold mb-2">🕛</h1>
        <h2 className="text-xl font-bold mb-2">เวรเที่ยงวันนี้</h2>
        {todayDuty ? (
          <div>
            <p className="text-lg text-gray-50">{todayDuty.date}</p>
            <p className="text-2xl font-bold text-white-300 mt-2">
              {todayDuty.person}
            </p>
          </div>
        ) : (
          <p className="font-bold">วันนี้ไม่มีเวร ( วันหยุด )</p>
        )}
      </div>

      <h2 className="pt-8 pb-4 text-center">ตารางเวรเที่ยง ( ล่วงหน้า 7 วัน )</h2>
      <table className="divide-y divide-gray-200 bg-white/50 backdrop-blur-xs rounded-2xl transition delay-150 duration-300 ease-in-out hover:scale-102" border="1" cellPadding="6" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-700 uppercase">วันที่</th>
            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-700 uppercase">ผู้รับผิดชอบ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200" >
          {dutyTable.map((row, index) => {
            const todayStr = new Date().toLocaleDateString("th-TH", {
              weekday: "short",
              day: "2-digit",
              month: "short",
              year: "numeric"
            });

            const isToday = row.date === todayStr;

            return (
              <tr
                key={index}
                className={`hover:bg-gray-100  ${isToday ? "text-white bg-sky-600/20 font-bold" : ""}`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{row.person}</td>
              </tr>
            );
          })}<thead>
          <tr>
            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-700 uppercase"></th>
            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-700 uppercase"></th>
          </tr>
        </thead>
        </tbody>
      </table>
      <div><p className="pt-5 text-xs text-center text-white">Made with ❤ by Cho Hae</p></div>
    </div>
  );
}
