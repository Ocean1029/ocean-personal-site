import { describe, expect, it } from 'vitest';
import { imagePlaceholderLabel } from './image-placeholder';

describe('imagePlaceholderLabel', () => {
  it('identifies a missing image and its intended content in Chinese', () => {
    expect(imagePlaceholderLabel('個人照片')).toBe('圖片待補：個人照片');
  });
});
