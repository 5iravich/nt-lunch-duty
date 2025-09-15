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
      return "bg-gradient-to-r from-orange-300 via-yellow-300 to-white animate-gradient-x";
    case "afternoon":
      return "bg-gradient-to-r from-sky-300 via-blue-300 to-white animate-gradient-x";
    case "evening":
      return "bg-gradient-to-r from-purple-300 via-pink-300 to-white animate-gradient-x";
    case "night":
      return "bg-gradient-to-r from-gray-300 via-blue-300 to-white animate-gradient-x";
    default:
      return "bg-gray-300";
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
    case 0: return "bg-white/30 ring-2 ring-red-300/50 shadow-lg shadow-red-500/50 text-gray-900 backdrop-blur-xs hover:ring-0";      // อาทิตย์
    case 1: return "bg-white/30 ring-2 ring-yellow-300/50 shadow-lg shadow-yellow-500/50 text-gray-900 backdrop-blur-xs hover:ring-0";   // จันทร์
    case 2: return "bg-white/30 ring-2 ring-pink-300/50 shadow-lg shadow-pink-500/50 text-gray-900 backdrop-blur-xs hover:ring-0";     // อังคาร
    case 3: return "bg-white/30 ring-2 ring-green-300/50 shadow-lg shadow-green-500/50 text-gray-900 backdrop-blur-xs hover:ring-0";    // พุธ
    case 4: return "bg-white/30 ring-2 ring-orange-300/50 shadow-lg shadow-orange-500/50 text-gray-900 backdrop-blur-xs hover:ring-0";   // พฤหัส
    case 5: return "bg-white/30 ring-2 ring-blue-300/50 shadow-lg shadow-blue-500/50 text-gray-900 backdrop-blur-xs hover:ring-0";     // ศุกร์
    case 6: return "bg-white/30 ring-2 ring-purple-300/50 shadow-lg shadow-purple-500/50 text-gray-900 backdrop-blur-xs hover:ring-0";   // เสาร์
    default: return "bg-white/30 text-gray-900";
  }
}

// ฟังก์ชันสร้างปฏิทินเวรทั้งเดือนแบบ Grid
function generateMonthlyDutyCalendar(startDate, holidays, members) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const daysInMonth = lastDay.getDate();
  const startWeekday = firstDay.getDay(); // 0=อาทิตย์, 1=จันทร์...
  const calendar = [];

  // วนวันในเดือน
  for (let day = 1; day <= daysInMonth; day++) {
    const current = new Date(year, month, day);
    const dayOfWeek = current.getDay();
    const dateStr = current.toISOString().split("T")[0];

    let dutyPerson = null;
    if (dayOfWeek >= 1 && dayOfWeek <= 5 && !holidays.includes(dateStr)) {
      const workdaysPassed = countWorkdays(new Date(startDate), current, holidays) - 1;
      dutyPerson = members[workdaysPassed % members.length];
    }

    calendar.push({
      date: day,
      isToday: current.toDateString() === today.toDateString(),
      dutyPerson,
    });
  }

  // เติมช่องว่างก่อนวันแรก
  for (let i = 0; i < startWeekday; i++) {
    calendar.unshift({ empty: true });
  }

  return calendar;
}




export default function App() {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showFullCalendar, setShowFullCalendar] = useState(false);

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
  const monthlyCalendar = generateMonthlyDutyCalendar(startDate, holidays, dutyMembers);

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
      <div className={`mt-12 shadow-md rounded-2xl px-18 py-10 text-center ${todayColor} transition delay-150 duration-300 ease-in-out hover:shadow-xl hover:-translate-y-3px hover:scale-110 cursor-pointer`}>
        <h1 className="text-xl font-bold mb-2">🕛</h1>
        <h2 className="text-xl font-bold mb-2">เวรเที่ยงวันนี้</h2>
        {todayDuty ? (
          <div>
            <p className="text-lg text-gray-900">{todayDuty.date}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {todayDuty.person}
            </p>
          </div>
        ) : (
          <p className="font-bold">วันนี้ไม่มีเวร ( วันหยุด )</p>
        )}
      </div>
      <div
        className=""
        onMouseEnter={() => setShowFullCalendar(true)}
        onMouseLeave={() => setShowFullCalendar(false)}
      >
      <h2 className="pt-8 pb-4 text-center text-gray-700">ตารางเวรเที่ยง ( ล่วงหน้า 7 วัน )</h2>
      <table className="divide-y divide-gray-200 bg-white/30 backdrop-blur-xs rounded-2xl hover:shadow-xl transition delay-150 duration-300 ease-in-out hover:scale-102" border="1" cellPadding="6" style={{ borderCollapse: "collapse" }}>
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
      
      </div>
      <div><p className="pt-5 text-xs text-center text-gray-700">Made with ❤ by Cho Hae</p></div>

      {/* Popup ปฏิทินทั้งเดือนแบบ Grid */}
        {showFullCalendar && (
          <div className="z-50 bg-white/70 shadow-xl rounded-lg p-4 z-50 transition-all duration-300">
            <h3 className="font-bold text-gray-600 text-center text-lg mb-3">📅 ปฏิทินเวรเที่ยงประจำเดือน</h3>
            <div className="grid grid-cols-7 gap-2 text-center text-sm">
              {/* หัวตารางวัน */}
              {["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"].map((day, i) => (
                <div key={i} className="font-bold text-gray-600">{day}</div>
              ))}
              {/* วันในเดือน */}
              {monthlyCalendar.map((day, idx) =>
                day.empty ? (
                  <div key={idx}></div>
                ) : (
                  <div
                    key={idx}
                    className={`p-1 border rounded-lg ${day.isToday ? "bg-yellow-200 font-bold" : "bg-gray-50/50"} hover:bg-gray-100`}
                  >
                    <div className="text-xs">{day.date}</div>
                    {day.dutyPerson && (
                      <div className="text-[0.65rem] mt-1 text-gray-600">{day.dutyPerson}</div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        )}
    </div>
  );
}
