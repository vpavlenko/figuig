"use client";

import { useMemo, useState } from "react";

const EXAMPLE_GAP_PX = 4;
const SOURCE_ENGLISH_GAP_PX = 0;
const GROUP_GAP_PX = 20;
const GROUP_TITLE_GAP_PX = 4;
const COLOR_LIGHTNESS_DARK = "55%";
const COLOR_LIGHTNESS_LIGHT = "70%";
const JOIN_COLOR = "#888";
const JOIN_MARGIN_PX = -3;

const VERB_SOURCES = new Set(["муд", "суфғ", "фр", "рз", "ситф"]);
const PRONOUN_SOURCES = new Set(["шм", "х", "с", "и"]);
const PARTICLE_SOURCES = new Set(["мани", "ин", "ала", "ад"]);
const NOUN_SOURCES = new Set(["мтукл", "тажра", "учу"]);
const CLITIC_I_SOURCE_KEY = "и=";
const ENGLISH_KEY_HIM_OBJECT = "him_obj";

const CYR_TO_LAT = {
  а: "a",
  д: "d",
  ж: "ž",
  з: "z",
  и: "i",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "x",
  ч: "č",
  ш: "š",
  ғ: "ǧ",
} as const satisfies Record<string, string>;

function transliterateCyrillicToLatin(text: string) {
  return Array.from(text)
    .map((char) => {
      const lower = char.toLowerCase();
      const mapped = CYR_TO_LAT[lower as keyof typeof CYR_TO_LAT];
      if (!mapped) return char;
      return char === lower ? mapped : mapped.toUpperCase();
    })
    .join("");
}

const DICTIONARY_COLUMNS: Array<{ key: string; sources: Set<string> }> = [
  { key: "nouns", sources: NOUN_SOURCES },
  { key: "verbs", sources: VERB_SOURCES },
  { key: "pronouns", sources: PRONOUN_SOURCES },
  { key: "particles", sources: PARTICLE_SOURCES },
];

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
    color: `hsl(140 85% ${COLOR_LIGHTNESS_DARK})`,
    englishForms: ["break", "broke", "broken", "breaking"],
  },
  {
    source: "ситф",
    english: "to let in",
    color: `hsl(150 85% ${COLOR_LIGHTNESS_LIGHT})`,
  },
  {
    source: "шм",
    english: "you-fem",
    color: `hsl(190 85% ${COLOR_LIGHTNESS_DARK})`,
    englishForms: ["youfem"],
  },
  { source: "х", english: "I", color: `hsl(210 85% ${COLOR_LIGHTNESS_LIGHT})` },
  {
    source: "с",
    english: "he/it",
    color: `hsl(225 85% ${COLOR_LIGHTNESS_DARK})`,
  },
  { source: "и", english: "he", color: `hsl(260 85% ${COLOR_LIGHTNESS_LIGHT})` },
  {
    source: "ала",
    english: "FUTURE_INTERROGATIVE",
    color: `hsl(270 85% ${COLOR_LIGHTNESS_DARK})`,
  },
  { source: "ад", english: "FUTURE_DECLARATIVE", color: `hsl(293 85% ${COLOR_LIGHTNESS_LIGHT})` },
  {
    source: "мани",
    english: "where",
    color: `hsl(315 85% ${COLOR_LIGHTNESS_DARK})`,
    englishForms: ["where"],
  },
  {
    source: "ин",
    english: "POSSESSIVE",
    color: `hsl(338 85% ${COLOR_LIGHTNESS_LIGHT})`,
  },
];

const SENTENCE_GROUP_COLUMNS: Array<{
  title: string;
  groups: Array<{ title: string; sentences: number[]; solutionAppend?: number[] }>;
}> = [
  {
    title: "No Object Pronoun",
    groups: [
      { title: "S = 3sg", sentences: [1, 4, 5, 16, 3, 21], solutionAppend: [25, 28] },
      { title: "S = 1sg", sentences: [2, 6], solutionAppend: [23] },
    ],
  },
  {
    title: "Object Pronoun After Verb",
    groups: [
      { title: "S = 3sg", sentences: [11, 12, 17], solutionAppend: [26] },
      { title: "S = 1sg", sentences: [18, 19, 20], solutionAppend: [27] },
    ],
  },
  {
    title: "Object Pronoun Before Verb",
    groups: [
      { title: "S = 3sg", sentences: [8, 13, 10, 15, 9, 14, 22] },
      { title: "S = 1sg", sentences: [7], solutionAppend: [24] },
    ],
  },
];

export default function Home() {
  const [mode, setMode] = useState<"statement" | "solution">("statement");
  const [script, setScript] = useState<"cyrillic" | "latin">("latin");

  const entries = [
    { id: 1, source: "мтукл ин х и муд учу", translation: "My friend prepared the couscous." },
    { id: 2, source: "муд х учу", translation: "I prepared the couscous." },
    { id: 3, source: "ад и муд учу", translation: "He will prepare the couscous." },
    {
      id: 4,
      source: "мтукл ин х мани и муд учу ?",
      translation: "Where did my friend prepare the couscous?",
    },
    { id: 5, source: "мани ала и муд учу ?", translation: "Where will he prepare the couscous?" },
    { id: 6, source: "мани ала фр х тажра ?", translation: "Where shall I hide the dish?" },
    { id: 7, source: "с муд х", translation: "I will prepare him/it." },
    { id: 8, source: "шм и фр", translation: "He will hide you-fem." },
    { id: 9, source: "мани шм и фр ?", translation: "Where did he hide you-fem?" },
    { id: 10, source: "мани шм ала и ситф ?", translation: "Where will he let you-fem in?" },
    { id: 11, source: "и ситф и", translation: "He let him in." },
    { id: 12, source: "и муд и", translation: "He prepared him/it." },
    { id: 13, source: "с и суфғ", translation: "He will let him out." },
    { id: 14, source: "мани с и ситф ?", translation: "Where did he let him in?" },
    { id: 15, source: "мани с ала и фр ?", translation: "Where will he hide him?" },
    { id: 16, source: "и ситф мтукл ин с", translation: "He let his friend in." },
    { id: 17, source: "и рз и", translation: "He broke him/it." },
    { id: 18, source: "фр х шм", translation: "I hid you-fem." },
    { id: 19, source: "рз х с", translation: "I broke him/it." },
    { id: 20, source: "суфғ х с", translation: "I let (past) him out." },
    {
      id: 21,
      source: "ад и рз тажра ин х",
      translation: mode === "solution" ? "He will break my dish." : "",
    },
    {
      id: 22,
      source: "мтукл ин х мани шм ала и фр ?",
      translation: mode === "solution" ? "Where will my friend hide you-fem?" : "",
    },
  ];

  const solutionExamples =
    mode === "solution"
      ? [
          {
            id: 23,
            translation: "Where shall I let his friend in?",
            source: "мани ала ситф х мтукл ин с ?",
          },
          {
            id: 24,
            translation: "Where shall I let you-fem out?",
            source: "мани шм ала суфғ х ?",
          },
          {
            id: 25,
            translation: "My friend broke the dish.",
            source: "мтукл ин х и рз тажра",
          },
          {
            id: 26,
            translation: "He hid him/it.",
            source: "и фр и",
          },
          {
            id: 27,
            translation: "I prepared him/it.",
            source: "муд х с",
          },
          {
            id: 28,
            translation: "His friend will hide the couscous.",
            source: "мтукл ин с ад и фр учу",
          },
        ]
      : [];

  const dictionary = DICTIONARY;
  const allEntries = [...entries, ...solutionExamples];
  const entryById = new Map(allEntries.map((entry) => [entry.id, entry] as const));

  function normalizeEnglish(token: string) {
    return token.toLowerCase().replace(/[^a-z]+/g, "");
  }

  function canonicalEnglishKey(englishNormalizedToken: string) {
    if (englishNormalizedToken === "him" || englishNormalizedToken === "himit") return ENGLISH_KEY_HIM_OBJECT;
    return englishNormalizedToken;
  }

  function isCliticI(sourceTokens: string[], tokenIndex: number) {
    return sourceTokens[tokenIndex] === "и" && VERB_SOURCES.has(sourceTokens[tokenIndex + 1] ?? "");
  }

  function sourceKeyAt(sourceTokens: string[], tokenIndex: number) {
    const token = sourceTokens[tokenIndex];
    if (token === "и" && isCliticI(sourceTokens, tokenIndex)) return CLITIC_I_SOURCE_KEY;
    return token;
  }

  function parseTranslation(translation: string) {
    const rawTokens = translation.split(/\s+/).filter(Boolean);
    const wordTokens = rawTokens.map((token) => {
      const lastChar = token.slice(-1);
      if (lastChar === "." || lastChar === "?" || lastChar === "!") {
        return { word: token.slice(0, -1), punctuation: lastChar };
      }
      return { word: token, punctuation: "" };
    });
    const englishNormalizedTokens = wordTokens.map((token) => normalizeEnglish(token.word));
    const englishKeys = englishNormalizedTokens.map(canonicalEnglishKey);
    const englishTokenSet = new Set<string>();
    for (const t of englishKeys) {
      if (t) englishTokenSet.add(t);
    }
    for (const t of wordTokens) {
      if (t.punctuation) englishTokenSet.add(t.punctuation);
    }
    return { wordTokens, englishNormalizedTokens, englishKeys, englishTokenSet };
  }

  const entryMetaById = useMemo(() => {
    const meta = new Map<
      number,
      {
        sourceTokens: string[];
        sourceKeys: string[];
        sourceKeySet: Set<string>;
        englishTokenSet: Set<string>;
      }
    >();
    for (const entry of allEntries) {
      const sourceTokens = entry.source.split(/\s+/).filter(Boolean);
      const sourceKeys = sourceTokens.map((_, index) => sourceKeyAt(sourceTokens, index));
      const sourceKeySet = new Set(sourceKeys);
      const englishTokenSet = entry.translation
        ? parseTranslation(entry.translation).englishTokenSet
        : new Set<string>();
      meta.set(entry.id, { sourceTokens, sourceKeys, sourceKeySet, englishTokenSet });
    }
    return meta;
  }, [allEntries]);

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
    origin: "source" | "english";
    source?: string;
    englishKey?: string;
  } | null>(null);

  const activeSource = active?.source ?? null;
  const activeEnglishKey = active?.englishKey ?? null;
  const activeOrigin = active?.origin ?? null;

  function activateFromSourceToken(sourceKey: string) {
    setActive({ origin: "source", source: sourceKey });
  }

  function letSenseForIndex(englishNormalizedTokens: string[], index: number) {
    const window = englishNormalizedTokens.slice(index - 4, index + 5);
    if (window.includes("out")) return dictionaryIndex.bySource.get("суфғ") ?? null;
    if (window.includes("in")) return dictionaryIndex.bySource.get("ситф") ?? null;
    return null;
  }

  function pickThirdPersonObjectSource(sourceTokens: string[]) {
    const hasS = sourceTokens.includes("с");
    const hasObjectI = sourceTokens.some((token, index) => token === "и" && !isCliticI(sourceTokens, index));
    if (hasS && !hasObjectI) return "с";
    if (!hasS && hasObjectI) return "и";
    if (hasS && hasObjectI) return sourceTokens.indexOf("с") < sourceTokens.lastIndexOf("и") ? "с" : "и";
    return null;
  }

  function translationEntryForIndex(
    englishNormalizedTokens: string[],
    index: number,
    sourceTokens: string[],
  ) {
    const token = englishNormalizedTokens[index];
    if (!token) return null;

    if (token === "my") return dictionaryIndex.bySource.get("х") ?? null;
    if (token === "his") return dictionaryIndex.bySource.get("с") ?? null;
    if (token === "he") {
      const entry = dictionaryIndex.bySource.get("и");
      if (!entry) return null;
      if (!sourceTokens.some((t, i) => t === "и" && isCliticI(sourceTokens, i))) return null;
      return { ...entry, source: CLITIC_I_SOURCE_KEY };
    }
    if (token === "will" || token === "shall") {
      if (sourceTokens.includes("ала")) return dictionaryIndex.bySource.get("ала") ?? null;
      if (sourceTokens.includes("ад")) return dictionaryIndex.bySource.get("ад") ?? null;
      return dictionaryIndex.bySource.get("ала") ?? null;
    }
    if (token === "him" || token === "himit") {
      const source = pickThirdPersonObjectSource(sourceTokens);
      return source ? dictionaryIndex.bySource.get(source) ?? null : null;
    }

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

  function isSourceHighlighted(sentenceId: number, tokenKey: string, tokenIndex: number) {
    if (!activeSource) return false;
    if (tokenKey !== activeSource) return false;
    if (activeOrigin !== "english") return true;
    if (!activeEnglishKey) return false;

    const meta = entryMetaById.get(sentenceId);
    if (!meta || !meta.englishTokenSet.has(activeEnglishKey)) return false;

    if (activeSource === "и") {
      const lastStandaloneIIndex = meta.sourceTokens.reduce((lastIndex, token, index) => {
        if (token === "и" && !isCliticI(meta.sourceTokens, index)) return index;
        return lastIndex;
      }, -1);
      if (lastStandaloneIIndex !== -1) return tokenIndex === lastStandaloneIIndex;
    }

    return true;
  }

  function renderSource(sentenceId: number, source: string) {
    const tokens = source.split(/\s+/).filter(Boolean);
    const lastStandaloneIIndex = tokens.reduce((lastIndex, token, index) => {
      if (token === "и" && !isCliticI(tokens, index)) return index;
      return lastIndex;
    }, -1);
    return (
      <div className="entry-source">
        {tokens.map((token, index) => {
          const tokenKey = sourceKeyAt(tokens, index);
          const displayToken =
            script === "latin" ? transliterateCyrillicToLatin(token) : token;
          const separator =
            index === 0
              ? ""
              : token === "?"
                ? ""
                : token === "ин" && index > 0 && index < tokens.length - 1
                    ? "-"
                    : tokens[index - 1] === "ин" && index - 2 >= 0
                      ? "-"
                    : tokens[index - 1] === "и" && VERB_SOURCES.has(token)
                        ? "~"
                        : token === "х" && VERB_SOURCES.has(tokens[index - 1] ?? "")
                          ? "~"
                          : " ";

          return (
            <span key={`${token}-${index}`}>
              {separator === "-" || separator === "~" ? (
                <span
                  style={{
                    color: JOIN_COLOR,
                    display: "inline-block",
                    marginLeft: JOIN_MARGIN_PX,
                    marginRight: JOIN_MARGIN_PX,
                  }}
                >
                  {separator}
                </span>
              ) : (
                separator
              )}
              <span
                className={`token${
                  isSourceHighlighted(sentenceId, tokenKey, index) ? " is-highlighted" : ""
                }`}
                style={
                  dictionaryIndex.bySource.has(token)
                    ? token === "и"
                      ? isCliticI(tokens, index) || index === lastStandaloneIIndex
                        ? { color: dictionaryIndex.bySource.get(token)?.color }
                        : undefined
                      : { color: dictionaryIndex.bySource.get(token)?.color }
                    : undefined
                }
                onMouseEnter={() => activateFromSourceToken(tokenKey)}
                onMouseLeave={clearActive}
              >
                {displayToken}
              </span>
            </span>
          );
        })}
      </div>
    );
  }

  function renderTranslation(sentenceId: number, translation: string) {
    const { wordTokens, englishNormalizedTokens, englishKeys } = parseTranslation(translation);
    const meta = entryMetaById.get(sentenceId);
    const isFutureQuestion =
      englishNormalizedTokens.includes("will") || englishNormalizedTokens.includes("shall");
    const futureQuestionSourceKey = meta?.sourceKeySet.has("ала")
      ? "ала"
      : meta?.sourceKeySet.has("ад")
        ? "ад"
        : null;
    return (
      <div className="entry-translation">
        {wordTokens.map((token, index) => {
          const entry = translationEntryForIndex(englishNormalizedTokens, index, meta?.sourceTokens ?? []);
          const englishKey = englishKeys[index] ?? "";
          const isHighlighted =
            !!entry &&
            !!activeSource &&
            entry.source === activeSource &&
            (activeOrigin !== "english" ||
              (activeEnglishKey === englishKey && !!meta?.sourceKeySet.has(activeSource)));
          const isQuestionMarkHighlighted =
            token.punctuation === "?" &&
            isFutureQuestion &&
            activeOrigin === "english" &&
            !!futureQuestionSourceKey &&
            activeSource === futureQuestionSourceKey &&
            activeEnglishKey === "?" &&
            !!meta?.sourceKeySet.has(futureQuestionSourceKey);
          return (
          <span key={`${token.word}${token.punctuation}-${index}`}>
            {index ? " " : ""}
            <span
              className={`token${isHighlighted ? " is-highlighted" : ""}`}
              style={entry ? { color: entry.color } : undefined}
              onMouseEnter={() => {
                if (!entry) return;
                const sourceKeySet = meta?.sourceKeySet;
                if (!sourceKeySet?.has(entry.source)) return;
                setActive({ origin: "english", source: entry.source, englishKey });
              }}
              onMouseLeave={clearActive}
            >
              {token.word}
            </span>
            {token.punctuation ? (
              <span
                className={`token${isQuestionMarkHighlighted ? " is-highlighted" : ""}`}
                style={
                  token.punctuation === "?" && isFutureQuestion && futureQuestionSourceKey
                    ? { color: dictionaryIndex.bySource.get(futureQuestionSourceKey)?.color }
                    : undefined
                }
                onMouseEnter={() =>
                  token.punctuation === "?" && isFutureQuestion && futureQuestionSourceKey
                    ? setActive({ origin: "english", source: futureQuestionSourceKey, englishKey: "?" })
                    : null
                }
                onMouseLeave={clearActive}
              >
                {token.punctuation}
              </span>
            ) : null}
          </span>
        );
        })}
      </div>
    );
  }

  function renderDictionaryEntry(entry: (typeof DICTIONARY)[number]) {
    const isSourceActive = activeSource === entry.source;
    const isEnglishActive = isSourceActive;
    const displaySource =
      script === "latin" ? transliterateCyrillicToLatin(entry.source) : entry.source;
    return (
      <div key={entry.source} className="dictionary-item">
        <span
          className={`token dictionary-source${isSourceActive ? " is-highlighted" : ""}`}
          style={{ color: entry.color }}
          onMouseEnter={() => setActive({ origin: "source", source: entry.source })}
          onMouseLeave={clearActive}
        >
          {displaySource}
        </span>
        <span className="dictionary-sep">-</span>
        <span
          className={`token dictionary-english${isEnglishActive ? " is-highlighted" : ""}`}
          style={{ color: entry.color }}
          onMouseEnter={() => setActive({ origin: "source", source: entry.source })}
          onMouseLeave={clearActive}
        >
          {entry.english}
        </span>
      </div>
    );
  }

  return (
    <main
      style={
        {
          ["--example-gap"]: `${EXAMPLE_GAP_PX}px`,
          ["--source-english-gap"]: `${SOURCE_ENGLISH_GAP_PX}px`,
          ["--group-gap"]: `${GROUP_GAP_PX}px`,
          ["--group-title-gap"]: `${GROUP_TITLE_GAP_PX}px`,
        } as React.CSSProperties
      }
    >
      <div className="mode-switch">
        <div
          role="tablist"
          aria-label="Script"
          style={{
            display: "inline-flex",
            padding: 2,
            border: "1px solid rgb(102, 102, 102)",
            borderRadius: 999,
            background: "rgb(11, 11, 11)",
            gap: 2,
          }}
        >
          <button
            type="button"
            role="tab"
            aria-selected={script === "latin"}
            onClick={() => setScript("latin")}
            style={{
              border: "none",
              borderRadius: 999,
              padding: "6px 12px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              background: script === "latin" ? "rgb(229, 231, 235)" : "transparent",
              color: script === "latin" ? "rgb(11, 11, 11)" : "rgb(203, 213, 225)",
              transition: "background 120ms, color 120ms",
              boxShadow:
                script === "latin"
                  ? "rgba(229, 231, 235, 0.25) 0px 0px 0px 1px"
                  : undefined,
            }}
          >
            Latin
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={script === "cyrillic"}
            onClick={() => setScript("cyrillic")}
            style={{
              border: "none",
              borderRadius: 999,
              padding: "6px 12px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              background: script === "cyrillic" ? "rgb(229, 231, 235)" : "transparent",
              color: script === "cyrillic" ? "rgb(11, 11, 11)" : "rgb(203, 213, 225)",
              transition: "background 120ms, color 120ms",
              boxShadow:
                script === "cyrillic"
                  ? "rgba(229, 231, 235, 0.25) 0px 0px 0px 1px"
                  : undefined,
            }}
          >
            Cyrillic
          </button>
        </div>

        <div
          role="tablist"
          aria-label="View mode"
          style={{
            display: "inline-flex",
            padding: 2,
            border: "1px solid rgb(102, 102, 102)",
            borderRadius: 999,
            background: "rgb(11, 11, 11)",
            gap: 2,
          }}
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === "statement"}
            onClick={() => setMode("statement")}
            style={{
              border: "none",
              borderRadius: 999,
              padding: "6px 12px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              background: mode === "statement" ? "rgb(229, 231, 235)" : "transparent",
              color: mode === "statement" ? "rgb(11, 11, 11)" : "rgb(203, 213, 225)",
              transition: "background 120ms, color 120ms",
              boxShadow:
                mode === "statement"
                  ? "rgba(229, 231, 235, 0.25) 0px 0px 0px 1px"
                  : undefined,
            }}
          >
            statement
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "solution"}
            onClick={() => setMode("solution")}
            style={{
              border: "none",
              borderRadius: 999,
              padding: "6px 12px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              background: mode === "solution" ? "rgb(229, 231, 235)" : "transparent",
              color: mode === "solution" ? "rgb(11, 11, 11)" : "rgb(203, 213, 225)",
              transition: "background 120ms, color 120ms",
              boxShadow:
                mode === "solution"
                  ? "rgba(229, 231, 235, 0.25) 0px 0px 0px 1px"
                  : undefined,
            }}
          >
            solution
          </button>
        </div>
      </div>

      <div className="sentences">
        <div className="sentences-columns">
          {SENTENCE_GROUP_COLUMNS.map((column) => (
            <section key={column.title} className="sentences-column">
              <h2 className="sentences-column-title">{column.title}</h2>
              {column.groups.map((group) => (
                <section key={group.title} className="group">
                  <h3 className="group-title">{group.title}</h3>
                  <ol className="group-list">
                    {(mode === "solution"
                      ? [...group.sentences, ...(group.solutionAppend ?? [])]
                      : group.sentences
                    ).map((id) => {
                      const entry = entryById.get(id);
                      if (!entry) return null;
                      const isSolutionNumber = mode === "solution" && entry.id >= 21;
                      return (
                        <li key={entry.id} className="sentence-item">
                          <div className={`entry-number${isSolutionNumber ? " is-solution" : ""}`}>
                            {entry.id}.
                          </div>
                          <div>
                            {renderSource(entry.id, entry.source)}
                            {entry.translation ? renderTranslation(entry.id, entry.translation) : null}
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </section>
              ))}
            </section>
          ))}
        </div>

      </div>

      <section className="dictionary">
        <div className="dictionary-grid">
          {DICTIONARY_COLUMNS.map((group) => {
            const entriesForGroup = dictionary.filter((entry) => group.sources.has(entry.source));
            return (
              <div key={group.key} className="dictionary-column">
                <div className="dictionary-list">{entriesForGroup.map(renderDictionaryEntry)}</div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
