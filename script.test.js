const { getFallbackText, summarizeSynonyms, renderDictionaryResult } = require('./script');

describe('script utility functions', () => {
  test('getFallbackText returns the original value when non-empty', () => {
    expect(getFallbackText('hello', 'fallback')).toBe('hello');
    expect(getFallbackText('   hi  ', 'fallback')).toBe('   hi  ');
  });

  test('getFallbackText returns fallback for empty or whitespace values', () => {
    expect(getFallbackText('', 'fallback')).toBe('fallback');
    expect(getFallbackText('   ', 'fallback')).toBe('fallback');
    expect(getFallbackText(null, 'fallback')).toBe('fallback');
    expect(getFallbackText(undefined, 'fallback')).toBe('fallback');
  });

  test('summarizeSynonyms returns unique synonyms up to eight items', () => {
    const meanings = [
      {
        definitions: [
          { synonyms: ['fast', 'quick', 'rapid'] },
          { synonyms: ['speedy', 'quick'] },
        ],
      },
      {
        definitions: [
          { synonyms: ['swift', 'rapid', 'fleet'] },
        ],
      },
    ];

    const result = summarizeSynonyms(meanings);
    expect(result).toEqual(expect.arrayContaining(['fast', 'quick', 'rapid', 'speedy', 'swift', 'fleet']));
    expect(result.length).toBeLessThanOrEqual(8);
    expect(new Set(result).size).toBe(result.length);
  });

  test('renderDictionaryResult returns HTML with the expected word, pronunciation, definitions, and synonyms', () => {
    const entry = {
      word: 'example',
      phonetics: [{ text: '/ɪɡˈzæmpəl/' }],
      meanings: [
        {
          partOfSpeech: 'noun',
          definitions: [
            { definition: 'A representative form or pattern.', synonyms: ['instance', 'case'] },
            { definition: 'Something that is typical of its kind.' },
          ],
        },
      ],
    };

    const html = renderDictionaryResult(entry);
    expect(html).toContain('example');
    expect(html).toContain('/ɪɡˈzæmpəl/');
    expect(html).toContain('A representative form or pattern.');
    expect(html).toContain('instance');
    expect(html).toContain('case');
    expect(html).toContain('Synonyms');
  });
});
