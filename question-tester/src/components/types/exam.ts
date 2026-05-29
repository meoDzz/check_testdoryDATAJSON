export interface IOption {
  value: string;
  text: string;
}

export interface ISubQuestion {
  id: string;
  question_text?: string;
  options?: (string | IOption)[];
}

export interface IEnglishQuestionJSONB {
  type: string;
  instruction?: string;
  audio_url?: string;
  image_url?: string;
  question_text?: string;
  passage?: string;
  prompt?: string;
  minimum_words?: number;
  options?: IOption[];
  sub_questions?: ISubQuestion[];
}