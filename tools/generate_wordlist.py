"""
Converts turkce_kelime_listesi.txt to turkish-words.js
Filters out multi-word phrases and invalid entries
"""

import os

# Read the word list
input_file = os.path.join(os.path.dirname(__file__), '..', 'turkce_kelime_listesi.txt')
output_file = os.path.join(os.path.dirname(__file__), '..', 'turkish-words.js')

words = set()

with open(input_file, 'r', encoding='utf-8') as f:
    for line in f:
        word = line.strip().lower()

        # Skip empty lines
        if not word:
            continue

        # Skip multi-word phrases (contain spaces)
        if ' ' in word:
            continue

        # Skip entries with special characters
        if '/' in word or '-' in word:
            continue

        # Skip single characters
        if len(word) < 2:
            continue

        # Skip words starting with uppercase (proper nouns)
        # We already lowercased, so just add valid words
        words.add(word)

print(f"Found {len(words)} valid words")

# Generate JavaScript file
js_content = '''// Turkish word dictionary for validation
// Generated from turkce_kelime_listesi.txt
// Contains {} words

const TURKISH_WORDS = new Set([
{}
]);

// Character mapping for keyboard fallback (ASCII to Turkish)
const CHAR_EQUIVALENTS = {{
    'c': ['c', 'ç'],
    'g': ['g', 'ğ'],
    'i': ['i', 'ı'],
    'o': ['o', 'ö'],
    's': ['s', 'ş'],
    'u': ['u', 'ü'],
    'ç': ['ç', 'c'],
    'ğ': ['ğ', 'g'],
    'ı': ['ı', 'i'],
    'ö': ['ö', 'o'],
    'ş': ['ş', 's'],
    'ü': ['ü', 'u']
}};

// Function to check if a word exists (handles Turkish character equivalents)
function isValidTurkishWord(word) {{
    const normalizedWord = word.toLowerCase().trim();

    // Direct check
    if (TURKISH_WORDS.has(normalizedWord)) {{
        return true;
    }}

    // Try with character substitutions
    return tryWordVariations(normalizedWord, 0);
}}

function tryWordVariations(word, index) {{
    if (index >= word.length) {{
        return TURKISH_WORDS.has(word);
    }}

    const char = word[index];
    const equivalents = CHAR_EQUIVALENTS[char];

    if (equivalents) {{
        for (const eq of equivalents) {{
            const variation = word.slice(0, index) + eq + word.slice(index + 1);
            if (tryWordVariations(variation, index + 1)) {{
                return true;
            }}
        }}
        return false;
    }}

    return tryWordVariations(word, index + 1);
}}

// Function to check if a character matches (with fallback)
function charactersMatch(required, given) {{
    const reqLower = required.toLowerCase();
    const givLower = given.toLowerCase();

    if (reqLower === givLower) {{
        return true;
    }}

    const reqEquivalents = CHAR_EQUIVALENTS[reqLower] || [reqLower];
    const givEquivalents = CHAR_EQUIVALENTS[givLower] || [givLower];

    for (const req of reqEquivalents) {{
        for (const giv of givEquivalents) {{
            if (req === giv) {{
                return true;
            }}
        }}
    }}

    return false;
}}
'''

# Sort words and format as JavaScript array
sorted_words = sorted(words)
words_js = ',\n'.join(f'    "{w}"' for w in sorted_words)

js_content = js_content.format(len(words), words_js)

with open(output_file, 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f"Generated {output_file}")
