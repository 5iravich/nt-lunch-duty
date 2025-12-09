import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {

  const players = ["Meen", "Cho", "Faii"]; // รายชื่อผู้แข่งขัน


  const [scores, setScores] = useState(() => {
  const saved = localStorage.getItem("scores");
  return saved ? JSON.parse(saved) : { Meen: 0, Cho: 0, Faii: 0 };
});
  
  const [roundResult, setRoundResult] = useState({ first: "", second: "", third: "" });

  // โหลดคะแนนจาก localStorage เมื่อเปิดเว็บ
  useEffect(() => {
    const saved = localStorage.getItem("scores");
    if (saved) {
      setScores(JSON.parse(saved));
    }
  }, []);

  // บันทึกคะแนนลง localStorage ทุกครั้งที่คะแนนเปลี่ยน
  useEffect(() => {
    localStorage.setItem("scores", JSON.stringify(scores));
  }, [scores]);

  const handleInput = (field, value) => {
    setRoundResult({ ...roundResult, [field]: value });
  };

  const handleSubmit = () => {
  if (!roundResult.first || !roundResult.second || !roundResult.third) return;


  const newScores = { ...scores };


  // ผู้ชนะได้ 2 คะแนน
  newScores[roundResult.first] += 2;
  // ที่ 2 ได้ 1 คะแนน
  newScores[roundResult.second] += 1;
  // ที่ 3 ได้ 0 (ไม่ต้องเพิ่ม)


  setScores(newScores);
  setRoundResult({ first: "", second: "", third: "" });
  };

  // แปลงคะแนนให้เป็นระยะทาง (สูงสุด = นำ)
const maxScore = Math.max(...Object.values(scores));


const getPosition = (score) => {
if (maxScore === 0) return 0;
return (score / maxScore) * 85; // ควบคุมความยาวของการวิ่ง
};

  return (
    <div className="min-h-screen bg-gray-950 text-white ">
      <div className="absolute bottom-4 right-4 items-center p-6">
        <h3 className="text-center text-xl font-bold mb-4">ระบบเก็บคะแนนผู้แข่งขัน</h3>

      {/* คะแนนรวม */}
      <div className="grid grid-cols-3 gap-3 mb-4 w-full max-w-xl">
        {players.map((p) => (
          <div key={p} className={`block group text-center `}>
            <div className={`relative rounded-xl p-3 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-300 overflow-hidden
              ${p === 'Meen' ? 'bg-gradient-to-br from-red-800 to-red-500' 
              : p === 'Cho' ? 'bg-gradient-to-br from-green-800 to-green-500' 
              : 'bg-gradient-to-br from-blue-800 to-blue-500'}`}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
              <h2 className="text-md font-semibold">{p}</h2>
              <motion.p key={scores[p]} initial={{ scale: 1 }} animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 0.4 }} className="text-3xl font-bold">
                {scores[p]}
              </motion.p>
            </div>
          </div>
        ))}
      </div>


      {/* เลือกผลรอบ */}
      <div className="block group  w-full max-w-xs ">
        <div className="relative p-6 rounded-2xl shadow-xl space-y-4 bg-white hover:shadow-lg hover:scale-[1.02] transition-all duration-300 overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gray-300 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
      <h2 className="text-gray-900 text-md font-bold mb-4 text-center">ผลการแข่งขันรอบนี้</h2>


      <select className="w-full text-sm p-2 text-gray-900 bg-gray-400 rounded-xl"
      value={roundResult.first} onChange={(e) => handleInput("first", e.target.value)}
      >
      <option value="">เลือกผู้ชนะ (2 คะแนน)</option>
      {players.map((p) => (
      <option key={p} value={p} disabled={p === roundResult.second || p === roundResult.third }> {p} </option>
      ))}
      </select>


      <select className="w-full p-2 text-sm text-gray-900 bg-gray-400 rounded-xl"
      value={roundResult.second} onChange={(e) => handleInput("second", e.target.value)}
      >
      <option value="">เลือกอันดับ 2 (1 คะแนน)</option>
      {players.map((p) => (
      <option key={p} value={p} disabled={p === roundResult.first || p === roundResult.third}> {p} </option>
      ))}
      </select>


      <select className="w-full p-2 text-sm text-gray-900 bg-gray-400 rounded-xl"
      value={roundResult.third} onChange={(e) => handleInput("third", e.target.value)}
      >
      <option value="">เลือกอันดับ 3 (0 คะแนน)</option>
      {players.map((p) => (
      <option key={p} value={p} disabled={p === roundResult.first || p === roundResult.second}> {p} </option>
      ))}
      </select>


      <button className="w-full text-xs bg-green-600 hover:bg-green-700 p-3 rounded-xl font-bold mt-4"
      onClick={handleSubmit}>บันทึกคะแนน</button>
      </div>
      
      
      </div>
      </div>
      </div>
      
  );
}
