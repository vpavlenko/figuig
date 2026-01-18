"use client";

import { useMemo, useState } from "react";

const EXAMPLE_GAP_PX = 10;
const SOURCE_ENGLISH_GAP_PX = 0;
const COLOR_LIGHTNESS_DARK = "60%";
const COLOR_LIGHTNESS_LIGHT = "70%";

const VERB_SOURCES = new Set(["муд", "суфғ", "фр", "рз", "ситф"]);

const DICTIONARY = [
  {
    source: "мтукл",
    english: "friend",
    color: `hsl(0 85% ${COLOR_LIGHTNESS_DARK})`,
    englishForms: ["friend"],
  },
  {
    source: "тажра",
    english: "dish",
    color: `hsl(23 85% ${COLOR_LIGHTNESS_LIGHT})`,
    englishForms: ["dish"],
  },
  {
    source: "учу",
    english: "couscous",
    color: `hsl(45 85% ${COLOR_LIGHTNESS_DARK})`,
    englishForms: ["couscous"],
  },
  {
    source: "муд",
    english: "to prepare",
    color: `hsl(68 85% ${COLOR_LIGHTNESS_LIGHT})`,
    englishForms: ["prepare", "prepared", "prepares", "preparing"],
  },
  {
    source: "суфғ",
    english: "to let out",
    color: `hsl(90 85% ${COLOR_LIGHTNESS_DARK})`,
  },
  {
    source: "фр",
    english: "to hide",
    color: `hsl(113 85% ${COLOR_LIGHTNESS_LIGHT})`,
    englishForms: ["hide", "hid", "hides", "hiding"],
  },
  {
    source: "рз",
    english: "to break",
    color: `hsl(135 85% ${COLOR_LIGHTNESS_DARK})`,
    englishForms: ["break", "broke", "broken", "breaking"],
  },
  {
    source: "ситф",
    english: "to let in",
    color: `hsl(158 85% ${COLOR_LIGHTNESS_LIGHT})`,
  },
  {
    source: "шм",
    english: "you (fem.)",
    color: `hsl(180 85% ${COLOR_LIGHTNESS_DARK})`,
    englishForms: ["you"],
  },
  { source: "х", english: "I", color: `hsl(203 85% ${COLOR_LIGHTNESS_LIGHT})` },
  {
    source: "с",
    english: "he/it",
    color: `hsl(225 85% ${COLOR_LIGHTNESS_DARK})`,
    englishForms: ["him", "him/it", "himit"],
  },
  { source: "и", english: "he", color: `hsl(248 85% ${COLOR_LIGHTNESS_LIGHT})` },
  {
    source: "ала",
    english: "FUTURE_INTERROGATIVE",
    color: `hsl(270 85% ${COLOR_LIGHTNESS_DARK})`,
  },
  {
    source: "мани",
    english: "where",
    color: `hsl(293 85% ${COLOR_LIGHTNESS_LIGHT})`,
    englishForms: ["where"],
  },
  {
    source: "н",
    english: "POSSESSIVE",
    color: `hsl(315 85% ${COLOR_LIGHTNESS_DARK})`,
    englishForms: ["my", "his"],
  },
  { source: "д", english: "FUTURE_DECLARATIVE", color: `hsl(338 85% ${COLOR_LIGHTNESS_LIGHT})` },
];

const SENTENCE_GROUPS: Array<{ title: string; sentences: number[] }> = [

  {
    title: "Non-I subject; no object pronoun",
    sentences: [1, 3, 4, 5, 16, 21],
  },
  {
    title: "'I' as subject; no object pronoun",
    sentences: [2, 6],
  },


  {
    title: "Non-I subject; object pronoun after verb",
    sentences: [11, 12, 17],
  },
  {
    title: "'I' as subject; object pronoun after verb",
    sentences: [18, 19, 20],
  },
  
  {
    title: "Non-I subject; object pronoun before verb",
    sentences: [8, 9, 10, 13, 14, 15, 22],
  },
  {
    title: "'I' as subject; object pronoun before verb",
    sentences: [7],
  },


  
];

export default function Home() {
  const entries = [
    { id: 1, source: "мтукл н х и муд учу", translation: "My friend prepared the couscous." },
    { id: 2, source: "муд х учу", translation: "I prepared the couscous." },
    { id: 3, source: "д и муд учу", translation: "He will prepare the couscous." },
    {
      id: 4,
      source: "мтукл н х мани и муд учу ?",
      translation: "Where did my friend prepare the couscous?",
    },
    { id: 5, source: "мани ала и муд учу ?", translation: "Where will he prepare the couscous?" },
    { id: 6, source: "мани ала фр х тажра ?", translation: "Where shall I hide the dish?" },
    { id: 7, source: "с муд х", translation: "I will prepare him/it." },
    { id: 8, source: "шм и фр", translation: "He will hide you (fem.)." },
    { id: 9, source: "мани шм и фр ?", translation: "Where did he hide you (fem.)?" },
    { id: 10, source: "мани шм ала и ситф ?", translation: "Where will he let you (fem.) in?" },
    { id: 11, source: "и ситф и", translation: "He let him in." },
    { id: 12, source: "и муд и", translation: "He prepared him/it." },
    { id: 13, source: "с и суфғ", translation: "He will let him out." },
    { id: 14, source: "мани с и ситф ?", translation: "Where did he let him in?" },
    { id: 15, source: "мани с ала и фр ?", translation: "Where will he hide him?" },
    { id: 16, source: "и ситф мтукл н с", translation: "He let his friend in." },
    { id: 17, source: "и рз и", translation: "He broke him/it." },
    { id: 18, source: "фр х шм", translation: "I hid you (fem.)." },
    { id: 19, source: "рз х с", translation: "I broke him/it." },
    { id: 20, source: "суфғ х с", translation: "I let (past) him out." },
    { id: 21, source: "д и рз тажра н х", translation: "" },
    { id: 22, source: "мтукл н х мани шм ала и фр ?", translation: "" },
  ];

  const dictionary = DICTIONARY;
  const entryById = new Map(entries.map((entry) => [entry.id, entry] as const));

  function normalizeEnglish(token: string) {
    return token.toLowerCase().replace(/[^a-z]+/g, "");
  }

  const dictionaryIndex = useMemo(() => {
    const bySource = new Map<string, (typeof DICTIONARY)[number]>();
    const byEnglishForm = new Map<string, (typeof DICTIONARY)[number]>();
    for (const entry of dictionary) {
      bySource.set(entry.source, entry);
      const forms = entry.englishForms?.length ? entry.englishForms : [entry.english];
      for (const form of forms) byEnglishForm.set(normalizeEnglish(form), entry);
    }
    return { bySource, byEnglishForm };
  }, [dictionary]);

  const [active, setActive] = useState<{
    source?: string;
  } | null>(null);

  const activeSource = active?.source ?? null;

  function activateFromSourceToken(rawToken: string) {
    setActive({ source: rawToken });
  }

  function letSenseForIndex(englishNormalizedTokens: string[], index: number) {
    const window = englishNormalizedTokens.slice(index - 4, index + 5);
    if (window.includes("out")) return dictionaryIndex.bySource.get("суфғ") ?? null;
    if (window.includes("in")) return dictionaryIndex.bySource.get("ситф") ?? null;
    return null;
  }

  function translationEntryForIndex(englishNormalizedTokens: string[], index: number) {
    const token = englishNormalizedTokens[index];
    if (!token) return null;

    if (token === "let" || token === "lets" || token === "letting") {
      return letSenseForIndex(englishNormalizedTokens, index);
    }

    if (token === "in" || token === "out") {
      return letSenseForIndex(englishNormalizedTokens, index);
    }

    return dictionaryIndex.byEnglishForm.get(token) ?? null;
  }

  function clearActive() {
    setActive(null);
  }

  function isSourceHighlighted(rawToken: string) {
    if (!activeSource) return false;
    return rawToken === activeSource;
  }

  function renderSource(source: string) {
    const tokens = source.split(/\s+/).filter(Boolean);
    return (
      <div className="entry-source">
        {tokens.map((token, index) => {
          const separator =
            index === 0
              ? ""
              : token === "?"
                ? ""
                : token === "н" && index > 0 && index < tokens.length - 1
                    ? "-"
                    : tokens[index - 1] === "н" && index - 2 >= 0
                      ? "-"
                    : tokens[index - 1] === "и" && VERB_SOURCES.has(token)
                        ? "="
                        : token === "х" && VERB_SOURCES.has(tokens[index - 1] ?? "")
                          ? "="
                          : " ";

          return (
            <span key={`${token}-${index}`}>
              {separator}
              <span
                className={`token${isSourceHighlighted(token) ? " is-highlighted" : ""}`}
                style={
                  dictionaryIndex.bySource.has(token)
                    ? { color: dictionaryIndex.bySource.get(token)?.color }
                    : undefined
                }
                onMouseEnter={() => activateFromSourceToken(token)}
                onMouseLeave={clearActive}
              >
                {token}
              </span>
            </span>
          );
        })}
      </div>
    );
  }

  function renderTranslation(translation: string) {
    const tokens = translation.split(/\s+/).filter(Boolean);
    const wordTokens = tokens.map((token) => {
      const lastChar = token.slice(-1);
      if (lastChar === "." || lastChar === "?" || lastChar === "!") {
        return { word: token.slice(0, -1), punctuation: lastChar };
      }
      return { word: token, punctuation: "" };
    });
    const englishNormalizedTokens = wordTokens.map((token) => normalizeEnglish(token.word));
    return (
      <div className="entry-translation">
        {wordTokens.map((token, index) => {
          const entry = translationEntryForIndex(englishNormalizedTokens, index);
          const isHighlighted = !!entry && !!activeSource && entry.source === activeSource;
          return (
          <span key={`${token.word}${token.punctuation}-${index}`}>
            {index ? " " : ""}
            <span
              className={`token${isHighlighted ? " is-highlighted" : ""}`}
              style={entry ? { color: entry.color } : undefined}
              onMouseEnter={() => (entry ? setActive({ source: entry.source }) : null)}
              onMouseLeave={clearActive}
            >
              {token.word}
            </span>
            {token.punctuation ? <span>{token.punctuation}</span> : null}
          </span>
        );
        })}
      </div>
    );
  }

  return (
    <main
      style={
        {
          ["--example-gap"]: `${EXAMPLE_GAP_PX}px`,
          ["--source-english-gap"]: `${SOURCE_ENGLISH_GAP_PX}px`,
        } as React.CSSProperties
      }
    >
      <div className="sentences">
        {SENTENCE_GROUPS.map((group) => (
          <section key={group.title} className="group">
            <h3 className="group-title">{group.title}</h3>
            <ol className="group-list">
              {group.sentences.map((id) => {
                const entry = entryById.get(id);
                if (!entry) return null;
                return (
                  <li key={entry.id} className="sentence-item">
                    <div className="entry-number">{entry.id}.</div>
                    <div>
                      {renderSource(entry.source)}
                      {entry.translation ? renderTranslation(entry.translation) : null}
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>

      <aside className="dictionary">
        <h2 className="dictionary-title">Dictionary</h2>
        <div className="dictionary-list">
          {dictionary.map((entry) => {
            const isSourceActive = activeSource === entry.source;
            const isEnglishActive = isSourceActive;
            return (
              <div key={entry.source} className="dictionary-item">
                <span
                  className={`token dictionary-source${
                    isSourceActive ? " is-highlighted" : ""
                  }`}
                  style={{ color: entry.color }}
                  onMouseEnter={() =>
                    setActive({ source: entry.source })
                  }
                  onMouseLeave={clearActive}
                >
                  {entry.source}
                </span>
                <span className="dictionary-english">-</span>
                <span
                  className={`token dictionary-english${
                    isEnglishActive ? " is-highlighted" : ""
                  }`}
                  style={{ color: entry.color }}
                  onMouseEnter={() =>
                    setActive({ source: entry.source })
                  }
                  onMouseLeave={clearActive}
                >
                  {entry.english}
                </span>
              </div>
            );
          })}
        </div>
      </aside>
    </main>
  );
}
