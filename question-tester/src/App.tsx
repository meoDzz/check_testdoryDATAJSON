import { useState } from 'react';
import DynamicQuestion from './components/DynamicQuestion';
import type { IEnglishQuestionJSONB } from './components/types/exam';

const MOCK_TEMPLATES: Record<string, IEnglishQuestionJSONB> = {
  multiple_choice: {
    type: "multiple_choice",
    instruction: "Choose the correct answer to complete the sentence.",
    question_text: "He **suggested** (1) to the cinema tonight.",
    options: [
      { value: "A", text: "going" },
      { value: "B", text: "to go" },
      { value: "C", text: "go" },
      { value: "D", text: "went" }
    ]
  },
  open_cloze: {
    type: "open_cloze",
    instruction: "Fill in each blank with ONE suitable word.",
    passage: "Yesterday, I went (to) the market and bought some (fresh) apples. It was a nice (day) overall."
  },
  word_order: {
    type: "word_order",
    instruction: "Rearrange the words to make a meaningful sentence.",
    question_text: "They / football / playing / are / park / in / the"
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
    ]
  },
  fill_blank: {
    type: "fill_blank",
    instruction: "Fill in the blank with the correct answer.",
    question_text: "The capital of Vietnam is ________."
  },
  cloze_multiple_choice: {
    type: "cloze_multiple_choice",
    instruction: "Read the passage and choose the best answer for each blank.",
    passage: "I usually get up at 6 AM. Then I (1) my teeth and have (2) with my family.",
    sub_questions: [
      { id: "1", options: ["A. brush", "B. wash", "C. clean", "D. make"] },
      { id: "2", options: ["A. lunch", "B. dinner", "C. breakfast", "D. snack"] }
    ]
  },
  reading_comprehension: {
    type: "reading_listening_comprehension",
    instruction: "Read the passage and answer the questions below.",
    passage: "Da Nang is one of the most beautiful coastal cities in Vietnam. It is known for its sandy beaches and history as a French colonial port.",
    sub_questions: [
      { 
        id: "q1", 
        question_text: "Where is Da Nang located?", 
        options: [{ value: "A", text: "Northern Vietnam" }, { value: "B", text: "Central Vietnam" }, { value: "C", text: "Southern Vietnam" }] 
      },
      { 
        id: "q2", 
        question_text: "What is Da Nang known for?", 
        options: [{ value: "A", text: "Mountains" }, { value: "B", text: "Sandy beaches" }, { value: "C", text: "Snow" }] 
      }
    ]
  },
  pronunciation: {
    type: "pronunciation",
    instruction: "Choose the word whose underlined part is pronounced differently.",
    question_text: "Find the word with a different sound.",
    options: [
      { value: "A", text: "l<b>oo</b>k" },
      { value: "B", text: "b<b>oo</b>k" },
      { value: "C", text: "f<b>oo</b>t" },
      { value: "D", text: "d<b>oo</b>r" }
    ]
  },
  writing_essay: {
    type: "writing_essay",
    instruction: "Write a short essay based on the prompt.",
    prompt: "Describe your favorite hobby and explain why you enjoy it.",
    minimum_words: 150
  },
  listening_gap_filling: {
    type: "listening_gap_filling",
    instruction: "Listen to the audio and fill in the missing words.",
    audio_url: "https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg",
    passage: "Welcome to our (1). Today we will talk about the (2) changes."
  }
};

export default function App() {
  const [jsonString, setJsonString] = useState(JSON.stringify(MOCK_TEMPLATES.multiple_choice, null, 2));
  const [userAnswer, setUserAnswer] = useState<any>(null);

  // 🎯 TỐI ƯU 1: Loại bỏ useEffect, parse đồng bộ trực tiếp khi Render
  let parsedContent: IEnglishQuestionJSONB | null = null;
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

  // 🎯 TỐI ƯU 2: Thay vì dùng cả cục jsonString làm key (khiến UI bị hủy-vẽ-lại liên tục khi gõ từng chữ),
  // ta chỉ đổi key khi thực sự thay đổi loại câu hỏi (type) để tối ưu hiệu năng và giữ mượt mà.
  const componentKey = parsedContent ? `${parsedContent.type}-test` : 'invalid';

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
              <DynamicQuestion
                key={componentKey} 
                questionId="test-id"
                content={parsedContent}
                userAnswer={userAnswer}
                onAnswerChange={(ans) => setUserAnswer(ans)}
              />
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