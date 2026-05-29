'use client';
import React from 'react';
// Đảm bảo tuân thủ cấu hình verbatimModuleSyntax nghiêm ngặt của dự án
import type { IEnglishQuestionJSONB } from './types/exam';

interface Props {
  questionId: string;
  content: IEnglishQuestionJSONB;
  userAnswer: any;
  onAnswerChange: (ans: any) => void;
  isReviewMode?: boolean;
  reviewResult?: any;
  correct_answer?: any;
  explanation?: string;
}

export default function DynamicQuestion({ content, userAnswer, onAnswerChange }: Props) {

  // Hàm xử lý chung cho các dạng có nhiều câu hỏi phụ (sub_questions)
  const handleSubAnswerChange = (subId: string, value: string) => {
    const currentSubAnswers = userAnswer && typeof userAnswer === 'object' ? userAnswer : {};
    onAnswerChange({ ...currentSubAnswers, [subId]: value });
  };

  if (!content) return <div className="text-slate-400">Đang tải nội dung câu hỏi...</div>;

  // Hàm định dạng chuỗi văn bản (Xử lý chuỗi in đậm **text** và tạo nhãn số thứ tự (số))
  const renderFormattedText = (text: string) => {
    if (!text) return null;

    const parts = text.split(/(\*\*[^*]+\*\*|\(\d+\))/g);

    return parts.map((part, index) => {
      // 1. Xử lý In đậm dấu sao đôi
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="text-red-700 font-bold">
            {part.slice(2, -2)}
          </strong>
        );
      }

      // 2. Xử lý Ô tròn số thứ tự dạng "Viên thuốc"
      if (part.startsWith('(') && part.endsWith(')')) {
        const num = part.slice(1, -1);
        return (
          <span
            key={index}
            className="inline-flex items-center justify-center bg-blue-50 border border-blue-300 text-blue-700 rounded-full px-3 py-0.5 mx-1 font-semibold cursor-pointer hover:bg-blue-100 hover:border-blue-400 transition-all shadow-sm shadow-blue-100/50"
            title={`Vị trí số ${num}`}
          >
            {num}
          </span>
        );
      }

      // 3. Văn bản thuần túy
      return part;
    });
  };

  return (
    <div className="space-y-6 text-left">
      {/* KHU VỰC HIỂN THỊ YÊU CẦU ĐỀ BÀI */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
          {content.type?.replace('_', ' ')}
        </span>
        <p className="mt-2 text-slate-700 font-extrabold text-base">
          {content.instruction}
        </p>
      </div>

      {/* TRÌNH PHÁT ĐA PHƯƠNG TIỆN (AUDIO/FILE NGHE) */}
      {content.audio_url && (
        <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex items-center gap-3">
          <span className="text-xl">🎵</span>
          <audio src={content.audio_url} controls className="w-full h-10" />
        </div>
      )}

      {/* TRÌNH HIỂN THỊ HÌNH ẢNH MINH HỌA */}
      {content.image_url && (
        <div className="w-full max-w-lg mx-auto bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
          <img src={content.image_url} alt="Question Graphic" className="w-full h-auto object-contain rounded-xl" />
        </div>
      )}

      {/* ĐIỀU HƯỚNG GIAO DIỆN TỰ ĐỘNG THEO DẠNG JSON COI ĐƯỢC */}
      {(() => {
        switch (content.type) {
          // ==========================================
          // 1. NHÓM CÁC DẠNG TRẮC NGHIỆM ĐƠN ĐÁP ÁN CHỮ
          // ==========================================
          case 'multiple_choice':
          case 'true_false':
          case 'synonym_antonym':
          case 'short_dialogue': {
            return (
              <div className="space-y-4">
                {content.question_text && (
                  <p className="font-bold text-slate-800 bg-slate-50 p-3 rounded-xl leading-relaxed">
                    {renderFormattedText(content.question_text)}
                  </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {content.options?.map((opt) => {
                    const cleanOptText = opt.text?.toString().trim() || "";
                    const cleanUserAnswer = userAnswer?.toString().trim() || "";
                    const isSelected = cleanUserAnswer === cleanOptText;

                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => onAnswerChange(cleanOptText)}
                        className={`p-4 border-2 rounded-2xl text-left font-bold transition-all active:scale-[0.99] w-full flex items-center ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {opt.value}. {cleanOptText}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          }

          // ==========================================
          // 2. DẠNG ĐIỀN TỪ VÀO CHỖ TRỐNG CƠ BẢN
          // ==========================================
          case 'fill_blank':
            return (
              <div className="space-y-3">
                <p className="font-bold text-slate-800 text-base bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200 leading-relaxed">
                  {content.question_text || content.passage}
                </p>
                <input
                  type="text"
                  value={userAnswer || ''}
                  onChange={(e) => onAnswerChange(e.target.value)}
                  placeholder="Gõ đáp án của bạn vào đây..."
                  className="w-full p-4 border-2 border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:border-blue-500 transition-all bg-slate-50/50"
                />
              </div>
            );

          // ==========================================
          // 3. DẠNG ĐIỀN KHUYẾT TRONG ĐOẠN VĂN ĐÀN HỒI
          // ==========================================
          case 'open_cloze': {
            const textToDisplay = content.passage || content.question_text || "";
            const parts = textToDisplay.split(/\(([^)]+)\)/);

            const handleInlineChange = (index: number, value: string) => {
              const currentAnswers = typeof userAnswer === 'object' && userAnswer !== null ? userAnswer : {};
              onAnswerChange({ ...currentAnswers, [index]: value });
            };

            return (
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm text-slate-800 font-medium text-base leading-[3] text-left break-words">
                  {parts.map((part, index) => {
                    const isGap = index % 2 !== 0;

                    if (isGap) {
                      const gapId = Math.floor(index / 2);
                      return (
                        <input
                          key={index}
                          type="text"
                          placeholder={part}
                          className="inline-block align-baseline w-24 h-8 px-2 py-0.5 mx-2 text-center font-bold text-blue-700 border-b-2 border-slate-300 bg-blue-50/50 rounded-t-lg focus:bg-white focus:border-blue-600 focus:outline-none transition-all"
                          value={(userAnswer && typeof userAnswer === 'object') ? (userAnswer[gapId] || '') : ''}
                          onChange={(e) => handleInlineChange(gapId, e.target.value)}
                        />
                      );
                    }
                    return <span key={index}>{part}</span>;
                  })}
                </div>
                <p className="text-xs text-slate-400 italic">💡 Gợi ý từ khóa nằm trong các ô trống.</p>
              </div>
            );
          }

          // ==========================================
          // 4. DẠNG SẮP XẾP TỪ THÀNH CÂU (ĐÃ SỬA LỖI HOOK)
          // ==========================================
          case 'word_order': {
            if (!content.question_text) {
              return <div className="text-red-500 italic">Dữ liệu câu hỏi bị lỗi (thiếu question_text).</div>;
            }

            const rawWords = content.question_text.split('/').map(w => w.trim()).filter(Boolean);
            
            // Giải pháp tối ưu: Phân tách chuỗi được lưu từ userAnswer để làm mảng thứ tự chọn, loại bỏ hoàn toàn useState
            const sequence: string[] = userAnswer 
              ? (typeof userAnswer === 'string' ? userAnswer.split(' ').filter(Boolean) : []) 
              : [];

            const handleWordClick = (word: string, index: number) => {
              const key = `${word}-${index}`;
              const newSequence = [...sequence, key];
              onAnswerChange(newSequence.join(' '));
            };

            const handleRemoveWord = (indexToRemove: number) => {
              const newSequence = sequence.filter((_, i) => i !== indexToRemove);
              onAnswerChange(newSequence.join(' '));
            };

            return (
              <div className="space-y-6">
                <div className="min-h-[80px] p-4 bg-blue-50 border-2 border-blue-200 border-dashed rounded-2xl flex flex-wrap gap-2 items-center">
                  {sequence.length === 0 && <span className="text-blue-300 text-sm italic font-medium">Bấm vào từ để bắt đầu sắp xếp câu...</span>}
                  {sequence.map((item, idx) => {
                    const word = item.split('-')[0];
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleRemoveWord(idx)}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-bold shadow-sm hover:bg-red-500 transition-colors"
                      >
                        {word} ✕
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap gap-2">
                  {rawWords.map((word, index) => {
                    const isUsed = sequence.includes(`${word}-${index}`);
                    return (
                      <button
                        key={`${word}-${index}`}
                        type="button"
                        disabled={isUsed}
                        onClick={() => handleWordClick(word, index)}
                        className={`px-4 py-2 rounded-xl font-bold border-2 transition-all ${
                          isUsed
                            ? 'opacity-20 cursor-not-allowed bg-slate-200 border-transparent'
                            : 'bg-white border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-slate-700'
                        }`}
                      >
                        {word}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          }

          // ==========================================
          // 5. NHÓM ĐỌC/NGHE HIỂU CÓ BÀI ĐỌC & CÂU HỎI PHỤ
          // ==========================================
          case 'reading_listening_comprehension':
          case 'cloze_test':
          case 'tf_not_given':
          case 'map_labelling':
            return (
              <div className="flex flex-col gap-6">
                {content.passage && (
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-slate-700 leading-relaxed max-h-80 overflow-y-auto font-serif">
                    {renderFormattedText(content.passage)}
                  </div>
                )}

                <div className="space-y-6 divide-y divide-slate-100">
                  {content.sub_questions?.map((sub, sIdx) => (
                    <div key={sub.id} className="pt-4 first:pt-0">
                      <p className="font-bold text-slate-800 mb-3 text-sm">
                        Câu {sIdx + 1}: {sub.question_text}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {sub.options?.map((opt) => {
                          const contentToSave = typeof opt === 'string' ? opt : opt.text;
                          const label = typeof opt === 'string' ? opt : `${opt.value}. ${opt.text}`;
                          const isSelected = userAnswer?.[sub.id] === contentToSave;

                          return (
                            <button
                              key={typeof opt === 'string' ? opt : opt.value}
                              type="button"
                              onClick={() => handleSubAnswerChange(sub.id, contentToSave)}
                              className={`p-4 border-2 rounded-2xl text-left font-bold transition-all active:scale-[0.99] w-full flex items-center ${
                                isSelected
                                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );

          // ==========================================
          // 6. DẠNG TỰ LUẬN/BÀI VIẾT DÀI (ESSAY)
          // ==========================================
          case 'writing_essay':
          case 'writing_report': {
            const currentWords = userAnswer?.split(/\s+/).filter(Boolean).length || 0;
            return (
              <div className="space-y-4">
                {content.prompt && (
                  <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl text-slate-700 font-medium text-sm leading-relaxed">
                    💡 <strong>Đề bài:</strong> {content.prompt}
                  </div>
                )}
                <textarea
                  rows={8}
                  value={userAnswer || ''}
                  onChange={(e) => onAnswerChange(e.target.value)}
                  placeholder="Gõ bài viết của bạn tại đây..."
                  className="w-full p-4 border-2 border-slate-200 rounded-3xl outline-none font-sans text-slate-700 text-sm leading-relaxed focus:border-blue-500 transition-all bg-slate-50/30"
                />
                <div className="flex justify-between items-center text-[10px] font-black tracking-wider text-slate-400 uppercase">
                  <span>Yêu cầu tối thiểu: {content.minimum_words || 0} từ</span>
                  <span className={currentWords < (content.minimum_words || 0) ? 'text-amber-500' : 'text-green-600'}>Hiện tại: {currentWords} từ</span>
                </div>
              </div>
            );
          }

          // ==========================================
          // 7. DẠNG TÌM LỖI SAI (CHỌN ĐÁP ÁN A, B, C, D)
          // ==========================================
          case 'error_correction': {
            return (
              <div className="space-y-4">
                <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm text-lg text-slate-800 leading-relaxed font-medium">
                  {renderFormattedText(content.question_text ?? "")}
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {['A', 'B', 'C', 'D'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => onAnswerChange(opt)}
                      className={`p-4 border-2 rounded-2xl font-bold transition-all ${
                        userAnswer === opt
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            );
          }

          // ==========================================
          // 8. DẠNG TRẮC NGHIỆM ĐIỀN KHUYẾT ĐOẠN VĂN
          // ==========================================
          case 'cloze_multiple_choice': {
            const handleSelect = (qId: number | string, value: string) => {
              const currentAnswers = (userAnswer as Record<string, string>) || {};
              onAnswerChange({ ...currentAnswers, [qId]: value });
            };

            return (
              <div className="space-y-6">
                {content.passage && (
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm leading-relaxed text-slate-800">
                    {renderFormattedText(content.passage)}
                  </div>
                )}
                <div className="space-y-4">
                  {content.sub_questions?.map((q) => (
                    <div key={q.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="font-bold text-slate-700 mb-2">Câu {q.id}:</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {(q.options || []).map((opt: any, index: number) => {
                          const isString = typeof opt === 'string';
                          const valToSave = isString ? opt.substring(opt.indexOf('.') + 1).trim() : opt.text;
                          const displayLabel = isString ? opt : `${opt.value}. ${opt.text}`;
                          const isSelected = (userAnswer as Record<string, string>)?.[q.id] === valToSave;

                          return (
                            <button
                              key={`${q.id}-${valToSave}-${index}`}
                              type="button"
                              onClick={() => handleSelect(q.id, valToSave)}
                              className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                                isSelected ? 'bg-blue-600 text-white' : 'bg-white border border-slate-300 text-slate-600 hover:border-blue-400'
                              }`}
                            >
                              {displayLabel}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          // ==========================================
          // 9. DẠNG PHÁT ÂM/TRỌNG ÂM (CÓ RENDERING HTML TAG)
          // ==========================================
          case 'pronunciation': {
            return (
              <div className="space-y-4">
                <p className="font-bold text-slate-800 bg-slate-50 p-3 rounded-xl border border-blue-100">
                  {content.question_text}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {content.options?.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => onAnswerChange(opt.text)}
                      className={`p-4 border-2 rounded-2xl text-left font-bold transition-all ${
                        userAnswer === opt.text
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {opt.value}. <span dangerouslySetInnerHTML={{ __html: opt.text }} />
                    </button>
                  ))}
                </div>
              </div>
            );
          }

          // ==========================================
          // 10. NHÓM NGHE ĐIỀN KHUYẾT THEO SỐ THỨ TỰ (AUDIO)
          // ==========================================
          case 'listening_open_cloze':
          case 'listening_gap_filling': {
            const renderGaps = (text: string) => {
              const parts = text.split(/(\(\d+\))/g);
              return parts.map((part, index) => {
                if (part.match(/\(\d+\)/)) {
                  const gapId = part.replace(/[()]/g, '');
                  return (
                    <input
                      key={index}
                      type="text"
                      className="w-20 mx-1 border-b-2 border-slate-300 text-center font-bold text-blue-700 outline-none focus:border-blue-600 transition-colors bg-slate-50"
                      placeholder={part}
                      value={userAnswer?.[gapId] || ''}
                      onChange={(e) => handleSubAnswerChange(gapId, e.target.value)}
                    />
                  );
                }
                return <span key={index} className="leading-9">{part}</span>;
              });
            };

            return (
              <div className="flex flex-col gap-6">
                <div className="p-5 bg-white rounded-2xl border border-slate-200 text-slate-700 leading-relaxed font-serif">
                  {content.passage && renderGaps(content.passage)}
                </div>
              </div>
            );
          }

          // ==========================================
          // DEFAULT: DẠNG TỰ LUẬN NGẮN (SHORT ANSWER)
          // ==========================================
          default:
            return (
              <div className="space-y-3">
                <textarea
                  rows={4}
                  value={userAnswer || ''}
                  onChange={(e) => onAnswerChange(e.target.value)}
                  placeholder="Gõ câu trả lời tự luận ngắn của bạn tại đây..."
                  className="w-full p-4 border-2 border-slate-200 rounded-2xl outline-none text-slate-700 focus:border-blue-500 transition-colors"
                />
              </div>
            );
        }
      })()}
    </div>
  );
}