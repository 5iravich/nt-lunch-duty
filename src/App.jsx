import React, { useEffect, useState } from "react";
import Bg from './assets/bg.png'

const dutyMembers = [
  "Pao & Fai",
  "Fon & Meen",
  "Aote & Aom",
  "Cho & Biw",
  "Tar & Pak"
];

// วันเริ่มต้นหมุนเวร (YYYY-MM-DD)
const startDate = "2025-08-11";

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
    case 0: return "bg-gradient-to-t from-red-800 from-10% via-red-500 via-50% to-rose-300 to-90% text-white backdrop-blur-xs";      // อาทิตย์
    case 1: return "bg-gradient-to-t from-amber-500 from-10% via-yellow-500 via-50% to-amber-100 to-90% text-white backdrop-blur-xs";   // จันทร์
    case 2: return "bg-gradient-to-t from-rose-800 from-10% via-pink-500 via-50% to-fuchsia-300 to-90% text-white backdrop-blur-xs";     // อังคาร
    case 3: return "bg-gradient-to-t from-teal-800 from-10% via-emerald-500 via-50% to-green-300 to-90% text-white backdrop-blur-xs";    // พุธ
    case 4: return "bg-gradient-to-t from-orange-600 from-10% via-orange-500 via-50% to-yellow-300 to-90% text-white backdrop-blur-xs";   // พฤหัส
    case 5: return "bg-gradient-to-t from-blue-600 from-10% via-sky-500 via-50% to-cyan-300 to-90% text-white backdrop-blur-xs";     // ศุกร์
    case 6: return "bg-gradient-to-t from-fuchsia-600 from-10% via-purple-500 via-50% to-violet-300 to-90% text-white backdrop-blur-xs";   // เสาร์
    default: return "bg-gray-300 text-black";
  }
}

export default function App() {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // fetch("http://localhost:3001/holidays")
    fetch("https://nt-lunch-duty.vercel.app/holidays")
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

  if (loading) {
    return <p>กำลังโหลดข้อมูล...</p>;
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
    <div style={{ padding: "20px", fontFamily: "Kanit" }}>
      
      {/* Card วันนี้ */}
      <div className={`shadow-md rounded-2xl p-6 text-center ${todayColor} transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 cursor-pointer`}>
        <h1 className="text-xl font-bold mb-2">🕛</h1>
        <h2 className="text-xl font-bold mb-2">เวรเที่ยงวันนี้</h2>
        {todayDuty ? (
          <div>
            <p className="text-lg text-gray-600">{todayDuty.date}</p>
            <p className="text-2xl font-bold text-amber-600 mt-2">
              {todayDuty.person}
            </p>
          </div>
        ) : (
          <p className="font-bold">วันนี้ไม่มีเวร ( วันหยุด )</p>
        )}
      </div>

      <h2 className="pt-8 pb-3 text-center">ตารางเวรเที่ยง ( ล่วงหน้า 7 วัน )</h2>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700" border="1" cellPadding="6" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">วันที่</th>
            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">ผู้รับผิดชอบ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
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
                className={`hover:bg-gray-100 dark:hover:bg-neutral-700 ${isToday ? "bg-yellow-200 font-bold" : ""}`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">{row.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{row.person}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div><p className="pt-5 text-xs text-center text-gray-500">Made with ❤ by Cho Hae</p></div>
    </div>
  );
}
