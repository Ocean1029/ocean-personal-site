import { describe, expect, it } from 'vitest';
import { pageIntro } from './page-intro';

describe('pageIntro', () => {
  it('keeps the section title in English and provides a Chinese summary', () => {
    expect(pageIntro('blog')).toEqual({
      title: 'Notes',
      summary: '記下做過的事、看過的故事，以及那些還在慢慢形成的想法。',
    });
  });
});
