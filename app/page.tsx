"use client";

import { useMemo, useState } from "react";

const EXAMPLE_GAP_PX = 10;
const SOURCE_ENGLISH_GAP_PX = 0;
const COLOR_LIGHTNESS_DARK = "50%";
const COLOR_LIGHTNESS_LIGHT = "70%";

const DICTIONARY = [
  {
    source: "амтукл",
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
  { source: "шм", english: "you (fem.)", color: `hsl(180 85% ${COLOR_LIGHTNESS_DARK})` },
  { source: "х", english: "I", color: `hsl(203 85% ${COLOR_LIGHTNESS_LIGHT})` },
  { source: "с", english: "he/it", color: `hsl(225 85% ${COLOR_LIGHTNESS_DARK})` },
  { source: "и", english: "he", color: `hsl(248 85% ${COLOR_LIGHTNESS_LIGHT})` },
  {
    source: "ала",
    english: "FUTURE QUESTION",
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
  },
  { source: "д", english: "FUTURE DECLARATIVE", color: `hsl(338 85% ${COLOR_LIGHTNESS_LIGHT})` },
];

export default function Home() {
  const entries = [
    { id: 1, source: "амтукл н х и муд учу", translation: "My friend prepared the couscous." },
    { id: 2, source: "муд х учу", translation: "I prepared the couscous." },
    { id: 3, source: "д и муд учу", translation: "He will prepare the couscous." },
    {
      id: 4,
      source: "амтукл н х мани и муд учу ?",
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
    { id: 16, source: "и ситф амтукл н с", translation: "He let his friend in." },
    { id: 17, source: "и рз и", translation: "He broke him/it." },
    { id: 18, source: "фр х шм", translation: "I hid you (fem.)." },
    { id: 19, source: "рз х с", translation: "I broke him/it." },
    { id: 20, source: "суфғ х с", translation: "I let (past) him out." },
    { id: 21, source: "д и рз тажра н х", translation: "" },
    { id: 22, source: "амтукл н х мани шм ала и фр ?", translation: "" },
  ];

  const dictionary = DICTIONARY;

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
    const englishNormalizedTokens = tokens.map(normalizeEnglish);
    return (
      <div className="entry-translation">
        {tokens.map((token, index) => {
          const entry = translationEntryForIndex(englishNormalizedTokens, index);
          const isHighlighted = !!entry && !!activeSource && entry.source === activeSource;
          return (
          <span key={`${token}-${index}`}>
            {index ? " " : ""}
            <span
              className={`token${isHighlighted ? " is-highlighted" : ""}`}
              style={entry ? { color: entry.color } : undefined}
              onMouseEnter={() => (entry ? setActive({ source: entry.source }) : null)}
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
        <ol>
          {entries.map((entry) => (
            <li key={entry.id}>
              <div className="entry-number">{entry.id}.</div>
              <div>
                {renderSource(entry.source)}
                {entry.translation ? renderTranslation(entry.translation) : null}
              </div>
            </li>
          ))}
        </ol>
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
