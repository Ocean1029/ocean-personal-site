const intros = {
  work: {
    title: 'Work',
    summary: '把功能、內容與細節一起整理，讓作品在使用時也保持清楚與自然。',
  },
  blog: {
    title: 'Notes',
    summary: '記下做過的事、看過的故事，以及那些還在慢慢形成的想法。',
  },
  cocktails: {
    title: 'Cocktails',
    summary: '把喝過、想重做，或想記住的味道整理成一份自己的酒單。',
  },
  screenings: {
    title: 'Screenings',
    summary: '把看過、想看與值得回看的作品，留在這裡慢慢整理。',
  },
  resume: {
    title: 'Resume',
    summary: '整理目前的經驗、方向與正在累積的能力。',
  },
  contact: {
    title: 'Contact',
    summary: '想聊聊合作、工作或任何值得交流的想法，歡迎聯絡我。',
  },
};

export function pageIntro(page: keyof typeof intros) {
  return intros[page];
}
