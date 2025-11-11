
export interface LanguageTranslation {
  message: string;
  dayStreak: string;
  wealthLevel: string;
  becauseYouDeserve: string;
  notificationTitle: string;
  notificationBody: string;
  memberId: string;
}

export const translations: { [key: string]: LanguageTranslation } = {
  en: { 
    message: "You Are Wealthy Today",
    dayStreak: "DAY STREAK",
    wealthLevel: "WEALTH LEVEL",
    becauseYouDeserve: "Because you deserve the reminder",
    notificationTitle: "Aura",
    notificationBody: "Daily Reminder - You Are Wealthy Today",
    memberId: "Member ID",
  },
  es: { 
    message: "Eres Próspero Hoy",
    dayStreak: "RACHA DE DÍAS",
    wealthLevel: "NIVEL DE RIQUEZA",
    becauseYouDeserve: "Porque te mereces el recordatorio",
    notificationTitle: "Aura",
    notificationBody: "Recordatorio Diario - Eres Próspero Hoy",
    memberId: "ID de Miembro",
  },
  fr: { 
    message: "Tu Es Prospère Aujourd'hui",
    dayStreak: "SÉRIE DE JOURS",
    wealthLevel: "NIVEAU DE RICHESSE",
    becauseYouDeserve: "Parce que tu mérites le rappel",
    notificationTitle: "Aura",
    notificationBody: "Rappel Quotidien - Tu Es Prospère Aujourd'hui",
    memberId: "ID Membre",
  },
  de: { 
    message: "Du Bist Heute Wohlhabend",
    dayStreak: "TAGESSTRÄHNE",
    wealthLevel: "WOHLSTANDSNIVEAU",
    becauseYouDeserve: "Weil du die Erinnerung verdienst",
    notificationTitle: "Aura",
    notificationBody: "Tägliche Erinnerung - Du Bist Heute Wohlhabend",
    memberId: "Mitglieds-ID",
  },
  it: { 
    message: "Sei Prospero Oggi",
    dayStreak: "SERIE DI GIORNI",
    wealthLevel: "LIVELLO DI RICCHEZZA",
    becauseYouDeserve: "Perché meriti il promemoria",
    notificationTitle: "Aura",
    notificationBody: "Promemoria Giornaliero - Sei Prospero Oggi",
    memberId: "ID Membro",
  },
  pt: { 
    message: "Você É Próspero Hoje",
    dayStreak: "SEQUÊNCIA DE DIAS",
    wealthLevel: "NÍVEL DE RIQUEZA",
    becauseYouDeserve: "Porque você merece o lembrete",
    notificationTitle: "Aura",
    notificationBody: "Lembrete Diário - Você É Próspero Hoje",
    memberId: "ID de Membro",
  },
  ru: { 
    message: "Ты Процветаешь Сегодня",
    dayStreak: "ДНЕВНАЯ СЕРИЯ",
    wealthLevel: "УРОВЕНЬ БОГАТСТВА",
    becauseYouDeserve: "Потому что ты заслуживаешь напоминания",
    notificationTitle: "Aura",
    notificationBody: "Ежедневное Напоминание - Ты Процветаешь Сегодня",
    memberId: "ID Участника",
  },
  zh: { 
    message: "你今天很富裕",
    dayStreak: "连续天数",
    wealthLevel: "财富水平",
    becauseYouDeserve: "因为你值得提醒",
    notificationTitle: "Aura",
    notificationBody: "每日提醒 - 你今天很富裕",
    memberId: "会员编号",
  },
  ja: { 
    message: "あなたは今日裕福です",
    dayStreak: "連続日数",
    wealthLevel: "富のレベル",
    becauseYouDeserve: "あなたはリマインダーに値するから",
    notificationTitle: "Aura",
    notificationBody: "毎日のリマインダー - あなたは今日裕福です",
    memberId: "会員ID",
  },
  ko: { 
    message: "당신은 오늘 부유합니다",
    dayStreak: "연속 일수",
    wealthLevel: "부의 수준",
    becauseYouDeserve: "당신은 알림을 받을 자격이 있으니까요",
    notificationTitle: "Aura",
    notificationBody: "일일 알림 - 당신은 오늘 부유합니다",
    memberId: "회원 ID",
  },
  ar: { 
    message: "أنت مزدهر اليوم",
    dayStreak: "سلسلة الأيام",
    wealthLevel: "مستوى الثروة",
    becauseYouDeserve: "لأنك تستحق التذكير",
    notificationTitle: "Aura",
    notificationBody: "تذكير يومي - أنت مزدهر اليوم",
    memberId: "معرف العضو",
  },
  hi: { 
    message: "आप आज समृद्ध हैं",
    dayStreak: "दिन की लकीर",
    wealthLevel: "धन स्तर",
    becauseYouDeserve: "क्योंकि आप अनुस्मारक के योग्य हैं",
    notificationTitle: "Aura",
    notificationBody: "दैनिक अनुस्मारक - आप आज समृद्ध हैं",
    memberId: "सदस्य आईडी",
  },
  pl: { 
    message: "Jesteś Zamożny Dzisiaj",
    dayStreak: "SERIA DNI",
    wealthLevel: "POZIOM BOGACTWA",
    becauseYouDeserve: "Bo zasługujesz na przypomnienie",
    notificationTitle: "Aura",
    notificationBody: "Codzienne Przypomnienie - Jesteś Zamożny Dzisiaj",
    memberId: "ID Członka",
  },
};

export const languageNames: { [key: string]: string } = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
  pt: "Português",
  ru: "Русский",
  zh: "中文",
  ja: "日本語",
  ko: "한국어",
  ar: "العربية",
  hi: "हिन्दी",
  pl: "Polski",
};

// Country code mapping for flags (using emoji flags)
export const countryFlags: { [key: string]: string } = {
  en: "🇬🇧",
  es: "🇪🇸",
  fr: "🇫🇷",
  de: "🇩🇪",
  it: "🇮🇹",
  pt: "🇵🇹",
  ru: "🇷🇺",
  zh: "🇨🇳",
  ja: "🇯🇵",
  ko: "🇰🇷",
  ar: "🇸🇦",
  hi: "🇮🇳",
  pl: "🇵🇱",
};

// Country codes for membership ID
export const countryCodes: { [key: string]: string } = {
  en: "GB",
  es: "ES",
  fr: "FR",
  de: "DE",
  it: "IT",
  pt: "PT",
  ru: "RU",
  zh: "CN",
  ja: "JP",
  ko: "KR",
  ar: "SA",
  hi: "IN",
  pl: "PL",
};
