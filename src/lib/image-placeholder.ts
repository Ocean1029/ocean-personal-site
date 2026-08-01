export function imagePlaceholderLabel(subject: string, locale: 'zh' | 'en' = 'zh'): string {
  return locale === 'en' ? `Image pending: ${subject}` : `圖片待補：${subject}`;
}
