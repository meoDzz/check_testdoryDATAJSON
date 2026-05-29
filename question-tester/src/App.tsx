// import { useState } from 'react';
// import DynamicQuestion from './components/DynamicQuestion';
// import type { IEnglishQuestionJSONB } from './components/types/exam';

// const MOCK_TEMPLATES: Record<string, any> = {
//   multiple_choice: {
//     type: "multiple_choice",
//     instruction: "Choose the correct answer to complete the sentence.",
//     question_text: "He **suggested** (1) to the cinema tonight.",
//     options: [
//       { value: "A", text: "going" },
//       { value: "B", text: "to go" },
//       { value: "C", text: "go" },
//       { value: "D", text: "went" }
//     ],
//     correct_answer: "going",
//     explanation: "Cấu trúc: suggest + V-ing (đề nghị làm gì đó)."
//   },
//   open_cloze: {
//     type: "open_cloze",
//     instruction: "Read the text and fill in each blank with exactly ONE word.",
//     passage: "In many parts (1) the world, severe weather events are becoming more frequent. This is largely due (2) climate change.",
//     correct_answer: {
//       "0": "of",
//       "1": "to"
//     }
//   },
//   word_order: {
//     type: "word_order",
//     instruction: "Rearrange the words to make a meaningful sentence.",
//     question_text: "is / school / big / my / new",
//     correct_answer: "my new school is big",
//     explanation: "Standard Subject + Verb + Object word order."
//   },
//   error_correction: {
//     type: "error_correction",
//     instruction: "Identify the underlined part that needs correction.",
//     question_text: "She **have** (A) been working **here** (B) for **three** (C) **years** (D).",
//     options: [
//       { value: "A", text: "have" },
//       { value: "B", text: "here" },
//       { value: "C", text: "three" },
//       { value: "D", text: "years" }
//     ],
//     correct_answer: "have",
//     explanation: "Chủ ngữ 'She' là ngôi thứ 3 số ít nên phải dùng 'has' thay vì 'have'."
//   },
//   reading_comprehension: {
//     type: "reading_listening_comprehension",
//     instruction: "Read the passage and decide if the statements are True (T) or False (F).",
//     passage: "The school library is very big. It has thousands of books. Students come here to read or borrow books.",
//     sub_questions: [
//       {
//         id: "41",
//         question_text: "The library is small.",
//         options: [
//           { value: "T", text: "True" },
//           { value: "F", text: "False" }
//         ],
//         correct_answer: "False"
//       },
//       {
//         id: "42",
//         question_text: "It has thousands of books.",
//         options: [
//           { value: "T", text: "True" },
//           { value: "F", text: "False" }
//         ],
//         correct_answer: "True"
//       }
//     ]
//   },
//   pronunciation: {
//     type: "pronunciation",
//     instruction: "Pronunciation (Odd One Out)",
//     question_text: "Choose the word whose underlined part is pronounced differently.",
//     options: [
//       { value: "A", text: "st<u>u</u>dy" },
//       { value: "B", text: "l<u>u</u>nch" },
//       { value: "C", text: "s<u>u</u>bject" },
//       { value: "D", text: "m<u>u</u>sic" }
//     ],
//     correct_answer: "music"
//   },
//   listening_open_cloze: {
//     type: "listening_open_cloze",
//     instruction: "Listen to the recording and fill in the missing words.",
//     audio_url: "/cdn/testdata/english/unit1/listening/file_example_MP3_700KB.mp3",
//     passage: "My name is Lan. I am a (1) at a secondary school. My school is very (2).",
//     correct_answer: {
//       "1": ["student"],
//       "2": ["big/beautiful"]
//     }
//   },
//   listening_comprehension: {
//     type: "reading_listening_comprehension",
//     instruction: "Listen to the passage and choose the correct answer.",
//     audio_url: "/cdn/testdata/english/unit1/listening/file_example_MP3_700KB-1.mp3",
//     show_passage: true,
//     passage: "Mai is 11. She goes to Sunrise School. She likes Art. She plays the piano.",
//     sub_questions: [
//       {
//         id: "s1_q1",
//         question_text: "How old is Mai?",
//         options: [
//           { value: "A", text: "10" },
//           { value: "B", text: "11" },
//           { value: "C", text: "12" },
//           { value: "D", text: "13" }
//         ],
//         correct_answer: "11"
//       },
//       {
//         id: "s1_q2",
//         question_text: "Her school is...",
//         options: [
//           { value: "A", text: "Sunrise" },
//           { value: "B", text: "Sunset" }
//         ],
//         correct_answer: "Sunrise"
//       }
//     ]
//   }
// };

// export default function App() {
//   const [jsonString, setJsonString] = useState(JSON.stringify(MOCK_TEMPLATES.multiple_choice, null, 2));
//   const [userAnswer, setUserAnswer] = useState<any>(null);

//   // 🎯 TỐI ƯU 1: Loại bỏ useEffect, parse đồng bộ trực tiếp khi Render
//   let parsedContent: IEnglishQuestionJSONB | null = null;
//   let jsonError: string | null = null;

//   try {
//     parsedContent = JSON.parse(jsonString);
//   } catch (err: any) {
//     jsonError = err.message;
//   }

//   const loadTemplate = (key: string) => {
//     setUserAnswer(null); // Reset câu trả lời cũ khi đổi dạng bài
//     setJsonString(JSON.stringify(MOCK_TEMPLATES[key], null, 2));
//   };

//   // 🎯 TỐI ƯU 2: Thay vì dùng cả cục jsonString làm key (khiến UI bị hủy-vẽ-lại liên tục khi gõ từng chữ),
//   // ta chỉ đổi key khi thực sự thay đổi loại câu hỏi (type) để tối ưu hiệu năng và giữ mượt mà.
//   const componentKey = parsedContent ? `${parsedContent.type}-test` : 'invalid';

//   return (
//     <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
//       <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center shadow-md">
//         <h1 className="text-xl font-bold tracking-tight text-blue-400">
//           🛠️ JSON Database UI Tester
//         </h1>
//         <div className="flex gap-2">
//           {Object.keys(MOCK_TEMPLATES).map((type) => (
//             <button
//               key={type}
//               onClick={() => loadTemplate(type)}
//               className="px-3 py-1.5 bg-slate-700 hover:bg-blue-600 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
//             >
//               {type.replace('_', ' ')}
//             </button>
//           ))}
//         </div>
//       </header>

//       <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden h-[calc(100vh-69px)]">
//         {/* PANEL TRÁI: NHẬP JSON */}
//         <div className="p-4 border-r border-slate-700 flex flex-col bg-slate-950/40">
//           <div className="flex justify-between items-center mb-2">
//             <span className="text-sm font-bold text-slate-400 uppercase tracking-wide">Dán dữ liệu JSON Database:</span>
//             {jsonError ? (
//               <span className="text-xs font-semibold text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-800">❌ Lỗi cú pháp</span>
//             ) : (
//               <span className="text-xs font-semibold text-green-400 bg-green-950 px-2 py-0.5 rounded border border-green-800">✔️ Hợp lệ</span>
//             )}
//           </div>
//           <textarea
//             value={jsonString}
//             onChange={(e) => setJsonString(e.target.value)}
//             className="flex-1 w-full p-4 font-mono text-sm bg-slate-900 text-emerald-400 border border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 shadow-inner resize-none leading-relaxed"
//           />
//         </div>

//         {/* PANEL PHẢI: UI PREVIEW VÀ LOGS */}
//         <div className="p-6 overflow-y-auto bg-slate-900 flex flex-col gap-6">
//           <div className="bg-white text-slate-900 p-6 rounded-3xl shadow-xl border border-slate-200">
//             <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b pb-2">LIVE PREVIEW UI</div>
            
//             {/* Hiển thị dựa trên trạng thái hợp lệ của JSON */}
//             {!jsonError && parsedContent ? (
//               <DynamicQuestion
//                 key={componentKey} 
//                 questionId="test-id"
//                 content={parsedContent}
//                 userAnswer={userAnswer}
//                 onAnswerChange={(ans) => setUserAnswer(ans)}
//               />
//             ) : (
//               <div className="text-center py-10 text-red-500 font-medium italic bg-red-50 rounded-2xl border border-red-200 p-4">
//                 {jsonError ? `Cú pháp JSON chưa đúng: ${jsonError}` : 'Vui lòng điền đúng định dạng JSON...'}
//               </div>
//             )}
//           </div>

//           <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left">
//             <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">DỮ LIỆU STATE ĐẦU RA (`userAnswer`)</div>
//             <pre className="font-mono text-sm text-amber-400 whitespace-pre-wrap break-all">
//               {userAnswer !== null && userAnswer !== undefined ? JSON.stringify(userAnswer, null, 2) : '// Chưa kích hoạt lựa chọn'}
//             </pre>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from 'react';
import DynamicQuestion from './components/DynamicQuestion';
import type { IEnglishQuestionJSONB } from './components/types/exam';

const MOCK_TEMPLATES: Record<string, any> = {
  multiple_choice: {
    type: "multiple_choice",
    instruction: "Choose the correct answer to complete the sentence.",
    question_text: "He **suggested** (1) to the cinema tonight.",
    options: [
      { value: "A", text: "going" },
      { value: "B", text: "to go" },
      { value: "C", text: "go" },
      { value: "D", text: "went" }
    ],
    correct_answer: "going",
    explanation: "Cấu trúc: suggest + V-ing (đề nghị làm gì đó)."
  },
  open_cloze: {
    type: "open_cloze",
    instruction: "Read the text and fill in each blank with exactly ONE word.",
    passage: "In many parts (1) the world, severe weather events are becoming more frequent. This is largely due (2) climate change.",
    correct_answer: {
      "0": "of",
      "1": "to"
    }
  },
  word_order: {
    type: "word_order",
    instruction: "Rearrange the words to make a meaningful sentence.",
    question_text: "is / school / big / my / new",
    correct_answer: "my new school is big",
    explanation: "Standard Subject + Verb + Object word order."
  },
  error_correction: {
    type: "error_correction",
    instruction: "Identify the underlined part that needs correction.",
    question_text: "She **have** (A) been working **here** (B) for **three** (C) **years** (D).",
    options: [
      { value: "A", text: "have" },
      { value: "B", text: "here" },
      { value: "C", text: "three" },
      { value: "D", text: "years" }
    ],
    correct_answer: "have",
    explanation: "Chủ ngữ 'She' là ngôi thứ 3 số ít nên phải dùng 'has' thay vì 'have'."
  },
  reading_comprehension: {
    type: "reading_listening_comprehension",
    instruction: "Read the passage and decide if the statements are True (T) or False (F).",
    passage: "The school library is very big. It has thousands of books. Students come here to read or borrow books.",
    sub_questions: [
      {
        id: "41",
        question_text: "The library is small.",
        options: [
          { value: "T", text: "True" },
          { value: "F", text: "False" }
        ],
        correct_answer: "False"
      },
      {
        id: "42",
        question_text: "It has thousands of books.",
        options: [
          { value: "T", text: "True" },
          { value: "F", text: "False" }
        ],
        correct_answer: "True"
      }
    ]
  },
  pronunciation: {
    type: "pronunciation",
    instruction: "Pronunciation (Odd One Out)",
    question_text: "Choose the word whose underlined part is pronounced differently.",
    options: [
      { value: "A", text: "st<u>u</u>dy" },
      { value: "B", text: "l<u>u</u>nch" },
      { value: "C", text: "s<u>u</u>bject" },
      { value: "D", text: "m<u>u</u>sic" }
    ],
    correct_answer: "music"
  },
  listening_open_cloze: {
    type: "listening_open_cloze",
    instruction: "Listen to the recording and fill in the missing words.",
    audio_url: "/cdn/testdata/english/unit1/listening/file_example_MP3_700KB.mp3",
    passage: "My name is Lan. I am a (1) at a secondary school. My school is very (2).",
    correct_answer: {
      "1": ["student"],
      "2": ["big/beautiful"]
    }
  },
  listening_comprehension: {
    type: "reading_listening_comprehension",
    instruction: "Listen to the passage and choose the correct answer.",
    audio_url: "/cdn/testdata/english/unit1/listening/file_example_MP3_700KB-1.mp3",
    show_passage: true,
    passage: "Mai is 11. She goes to Sunrise School. She likes Art. She plays the piano.",
    sub_questions: [
      {
        id: "s1_q1",
        question_text: "How old is Mai?",
        options: [
          { value: "A", text: "10" },
          { value: "B", text: "11" },
          { value: "C", text: "12" },
          { value: "D", text: "13" }
        ],
        correct_answer: "11"
      },
      {
        id: "s1_q2",
        question_text: "Her school is...",
        options: [
          { value: "A", text: "Sunrise" },
          { value: "B", text: "Sunset" }
        ],
        correct_answer: "Sunrise"
      }
    ]
  }
};

export default function App() {
  const [jsonString, setJsonString] = useState(JSON.stringify(MOCK_TEMPLATES.multiple_choice, null, 2));
  const [userAnswer, setUserAnswer] = useState<any>(null);

  // Ép kiểu any để hỗ trợ cả Object (1 câu) và Array (nhiều câu)
  let parsedContent: any = null;
  let jsonError: string | null = null;

  try {
    parsedContent = JSON.parse(jsonString);
  } catch (err: any) {
    jsonError = err.message;
  }

  const loadTemplate = (key: string) => {
    setUserAnswer(null); // Reset câu trả lời cũ khi đổi dạng bài
    setJsonString(JSON.stringify(MOCK_TEMPLATES[key], null, 2));
  };

  // Hàm gom state cho trường hợp test nhiều câu (Array)
  const handleArrayAnswerChange = (questionId: string, ans: any) => {
    setUserAnswer((prev: any) => {
      const safePrev = (typeof prev === 'object' && prev !== null && !Array.isArray(prev)) ? prev : {};
      return {
        ...safePrev,
        [questionId]: ans
      };
    });
  };

  // Tối ưu key render để tránh giật lag UI
  const componentKey = parsedContent 
    ? Array.isArray(parsedContent) 
      ? `array-${parsedContent.length}` 
      : `${parsedContent.type}-test` 
    : 'invalid';

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold tracking-tight text-blue-400">
          🛠️ JSON Database UI Tester
        </h1>
        <div className="flex gap-2">
          {Object.keys(MOCK_TEMPLATES).map((type) => (
            <button
              key={type}
              onClick={() => loadTemplate(type)}
              className="px-3 py-1.5 bg-slate-700 hover:bg-blue-600 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
            >
              {type.replace('_', ' ')}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden h-[calc(100vh-69px)]">
        {/* PANEL TRÁI: NHẬP JSON */}
        <div className="p-4 border-r border-slate-700 flex flex-col bg-slate-950/40">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wide">Dán dữ liệu JSON Database:</span>
            {jsonError ? (
              <span className="text-xs font-semibold text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-800">❌ Lỗi cú pháp</span>
            ) : (
              <span className="text-xs font-semibold text-green-400 bg-green-950 px-2 py-0.5 rounded border border-green-800">✔️ Hợp lệ</span>
            )}
          </div>
          <textarea
            value={jsonString}
            onChange={(e) => setJsonString(e.target.value)}
            className="flex-1 w-full p-4 font-mono text-sm bg-slate-900 text-emerald-400 border border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 shadow-inner resize-none leading-relaxed"
          />
        </div>

        {/* PANEL PHẢI: UI PREVIEW VÀ LOGS */}
        <div className="p-6 overflow-y-auto bg-slate-900 flex flex-col gap-6">
          <div className="bg-white text-slate-900 p-6 rounded-3xl shadow-xl border border-slate-200">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b pb-2">LIVE PREVIEW UI</div>
            
            {/* Hiển thị dựa trên trạng thái hợp lệ của JSON */}
            {!jsonError && parsedContent ? (
              Array.isArray(parsedContent) ? (
                <div className="flex flex-col gap-8">
                  {parsedContent.map((q: any, idx: number) => {
                    const qId = q.id || `q_index_${idx}`;
                    return (
                      <div key={qId} className="border-b border-slate-100 pb-8 last:border-0 last:pb-0">
                        <div className="text-sm font-extrabold text-blue-600 mb-4 bg-blue-50 inline-block px-3 py-1 rounded-lg">
                          Câu {idx + 1}:
                        </div>
                        <DynamicQuestion
                          questionId={qId}
                          content={q}
                          userAnswer={userAnswer?.[qId]}
                          onAnswerChange={(ans) => handleArrayAnswerChange(qId, ans)}
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <DynamicQuestion
                  key={componentKey} 
                  questionId={parsedContent.id || "test-id"}
                  content={parsedContent}
                  userAnswer={userAnswer}
                  onAnswerChange={(ans) => setUserAnswer(ans)}
                />
              )
            ) : (
              <div className="text-center py-10 text-red-500 font-medium italic bg-red-50 rounded-2xl border border-red-200 p-4">
                {jsonError ? `Cú pháp JSON chưa đúng: ${jsonError}` : 'Vui lòng điền đúng định dạng JSON...'}
              </div>
            )}
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">DỮ LIỆU STATE ĐẦU RA (`userAnswer`)</div>
            <pre className="font-mono text-sm text-amber-400 whitespace-pre-wrap break-all">
              {userAnswer !== null && userAnswer !== undefined ? JSON.stringify(userAnswer, null, 2) : '// Chưa kích hoạt lựa chọn'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}