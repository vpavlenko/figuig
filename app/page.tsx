"use client";

import { useMemo, useState } from "react";

const EXAMPLE_GAP_PX = 5;
const SOURCE_ENGLISH_GAP_PX = 0;
const GROUP_GAP_PX = 28;
const GROUP_TITLE_GAP_PX = 6;
const COLOR_LIGHTNESS_DARK = "55%";
const COLOR_LIGHTNESS_LIGHT = "70%";

const VERB_SOURCES = new Set(["муд", "суфғ", "фр", "рз", "ситф"]);
const PRONOUN_SOURCES = new Set(["шм", "х", "с", "и"]);
const PARTICLE_SOURCES = new Set(["мани", "ин", "ала", "д"]);
const NOUN_SOURCES = new Set(["мтукл", "тажра", "учу"]);

const DICTIONARY_GROUPS: Array<{
  title: string;
  sources: Set<string>;
}> = [
  { title: "Nouns", sources: NOUN_SOURCES },
  { title: "Verbs", sources: VERB_SOURCES },
  { title: "Pronouns", sources: PRONOUN_SOURCES },
  { title: "Particles", sources: PARTICLE_SOURCES },
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
    english: "you (fem.)",
    color: `hsl(190 85% ${COLOR_LIGHTNESS_DARK})`,
    englishForms: ["youfem"],
  },
  { source: "х", english: "I", color: `hsl(210 85% ${COLOR_LIGHTNESS_LIGHT})` },
  {
    source: "с",
    english: "he/it",
    color: `hsl(225 85% ${COLOR_LIGHTNESS_DARK})`,
    englishForms: ["him", "him/it", "himit"],
  },
  { source: "и", english: "he", color: `hsl(260 85% ${COLOR_LIGHTNESS_LIGHT})` },
  {
    source: "ала",
    english: "FUTURE_INTERROGATIVE",
    color: `hsl(270 85% ${COLOR_LIGHTNESS_DARK})`,
  },
  { source: "д", english: "FUTURE_DECLARATIVE", color: `hsl(293 85% ${COLOR_LIGHTNESS_LIGHT})` },
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
  groups: Array<{ title: string; sentences: number[] }>;
}> = [
  {
    title: "No Object Pronoun",
    groups: [
      { title: "Non-I subject", sentences: [1, 4, 5, 16, 3, 21,] },
      { title: "'I' as subject", sentences: [2, 6] },
    ],
  },
  {
    title: "Object Pronoun After Verb",
    groups: [
      { title: "Non-I subject", sentences: [11, 12, 17] },
      { title: "'I' as subject", sentences: [18, 19, 20] },
    ],
  },
  {
    title: "Object Pronoun Before Verb",
    groups: [
      { title: "Non-I subject", sentences: [8, 13, 10, 15, 9, 14, 22] },
      { title: "'I' as subject", sentences: [7] },
    ],
  },
];

export default function Home() {
  const entries = [
    { id: 1, source: "мтукл ин х и муд учу", translation: "My friend prepared the couscous." },
    { id: 2, source: "муд х учу", translation: "I prepared the couscous." },
    { id: 3, source: "д и муд учу", translation: "He will prepare the couscous." },
    {
      id: 4,
      source: "мтукл ин х мани и муд учу ?",
      translation: "Where did my friend prepare the couscous?",
    },
    { id: 5, source: "мани ала и муд учу ?", translation: "Where will he prepare the couscous?" },
    { id: 6, source: "мани ала фр х тажра ?", translation: "Where shall I hide the dish?" },
    { id: 7, source: "с муд х", translation: "I will prepare him/it." },
    { id: 8, source: "шм и фр", translation: "He will hide you-fem." },
    { id: 9, source: "мани шм и фр ?", translation: "Where did he hide you-fem.?" },
    { id: 10, source: "мани шм ала и ситф ?", translation: "Where will he let you-fem. in?" },
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
    { id: 21, source: "д и рз тажра ин х", translation: "" },
    { id: 22, source: "мтукл ин х мани шм ала и фр ?", translation: "" },
  ];

  const dictionary = DICTIONARY;
  const entryById = new Map(entries.map((entry) => [entry.id, entry] as const));

  function normalizeEnglish(token: string) {
    return token.toLowerCase().replace(/[^a-z]+/g, "");
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
    const englishTokenSet = new Set<string>();
    for (const t of englishNormalizedTokens) {
      if (t) englishTokenSet.add(t);
    }
    for (const t of wordTokens) {
      if (t.punctuation) englishTokenSet.add(t.punctuation);
    }
    return { wordTokens, englishNormalizedTokens, englishTokenSet };
  }

  const entryMetaById = useMemo(() => {
    const meta = new Map<number, { sourceTokenSet: Set<string>; englishTokenSet: Set<string> }>();
    for (const entry of entries) {
      const sourceTokenSet = new Set(entry.source.split(/\s+/).filter(Boolean));
      const englishTokenSet = entry.translation
        ? parseTranslation(entry.translation).englishTokenSet
        : new Set<string>();
      meta.set(entry.id, { sourceTokenSet, englishTokenSet });
    }
    return meta;
  }, [entries]);

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

  function activateFromSourceToken(rawToken: string) {
    setActive({ origin: "source", source: rawToken });
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

    if (token === "my") return dictionaryIndex.bySource.get("х") ?? null;
    if (token === "his") return dictionaryIndex.bySource.get("с") ?? null;
    if (token === "will" || token === "shall") return dictionaryIndex.bySource.get("ала") ?? null;

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

  function isSourceHighlighted(sentenceId: number, rawToken: string) {
    if (!activeSource) return false;
    if (rawToken !== activeSource) return false;
    if (activeOrigin !== "english") return true;
    if (!activeEnglishKey) return false;

    const meta = entryMetaById.get(sentenceId);
    return !!meta && meta.englishTokenSet.has(activeEnglishKey);
  }

  function renderSource(sentenceId: number, source: string) {
    const tokens = source.split(/\s+/).filter(Boolean);
    return (
      <div className="entry-source">
        {tokens.map((token, index) => {
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
                        ? "="
                        : token === "х" && VERB_SOURCES.has(tokens[index - 1] ?? "")
                          ? "="
                          : " ";

          return (
            <span key={`${token}-${index}`}>
              {separator}
              <span
                className={`token${isSourceHighlighted(sentenceId, token) ? " is-highlighted" : ""}`}
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

  function renderTranslation(sentenceId: number, translation: string) {
    const { wordTokens, englishNormalizedTokens } = parseTranslation(translation);
    const meta = entryMetaById.get(sentenceId);
    return (
      <div className="entry-translation">
        {wordTokens.map((token, index) => {
          const entry = translationEntryForIndex(englishNormalizedTokens, index);
          const englishKey = englishNormalizedTokens[index] ?? "";
          const isHighlighted =
            !!entry &&
            !!activeSource &&
            entry.source === activeSource &&
            (activeOrigin !== "english" ||
              (activeEnglishKey === englishKey && !!meta?.sourceTokenSet.has(activeSource)));
          const isFutureQuestion =
            englishNormalizedTokens.includes("will") || englishNormalizedTokens.includes("shall");
          const isQuestionMarkHighlighted =
            token.punctuation === "?" &&
            isFutureQuestion &&
            activeOrigin === "english" &&
            activeSource === "ала" &&
            activeEnglishKey === "?" &&
            !!meta?.sourceTokenSet.has("ала");
          return (
          <span key={`${token.word}${token.punctuation}-${index}`}>
            {index ? " " : ""}
            <span
              className={`token${isHighlighted ? " is-highlighted" : ""}`}
              style={entry ? { color: entry.color } : undefined}
              onMouseEnter={() => {
                if (!entry) return;
                const sourceTokenSet = meta?.sourceTokenSet;
                if (!sourceTokenSet?.has(entry.source)) return;
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
                  token.punctuation === "?" && isFutureQuestion
                    ? { color: dictionaryIndex.bySource.get("ала")?.color }
                    : undefined
                }
                onMouseEnter={() =>
                  token.punctuation === "?" && isFutureQuestion
                    ? setActive({ origin: "english", source: "ала", englishKey: "?" })
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
    return (
      <div key={entry.source} className="dictionary-item">
        <span
          className={`token dictionary-source${isSourceActive ? " is-highlighted" : ""}`}
          style={{ color: entry.color }}
          onMouseEnter={() => setActive({ origin: "source", source: entry.source })}
          onMouseLeave={clearActive}
        >
          {entry.source}
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
      <div className="sentences">
        <div className="sentences-columns">
          {SENTENCE_GROUP_COLUMNS.map((column) => (
            <section key={column.title} className="sentences-column">
              <h2 className="sentences-column-title">{column.title}</h2>
              {column.groups.map((group) => (
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
        <h2 className="dictionary-title">Dictionary</h2>
        <div className="dictionary-grid">
          {DICTIONARY_GROUPS.map((group) => {
            const entriesForGroup = dictionary.filter((entry) =>
              group.sources.has(entry.source),
            );
            return (
              <div key={group.title} className="dictionary-column">
                <h3 className="dictionary-column-title">{group.title}</h3>
                <div className="dictionary-list">
                  {entriesForGroup.map(renderDictionaryEntry)}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
