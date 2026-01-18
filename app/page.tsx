"use client";

import { useMemo, useState } from "react";

const DICTIONARY = [
  { source: "учу", english: "couscous" },
  { source: "муд", english: "prepare" },
];

export default function Home() {
  const entries = [
    { id: 1, source: "амтукл инух и-муд учу", translation: "My friend prepared the couscous." },
    { id: 2, source: "муд х учу", translation: "I prepared the couscous." },
    { id: 3, source: "ади муд учу", translation: "He will prepare the couscous." },
    {
      id: 4,
      source: "амтукл инух мани и-муд учу",
      translation: "Where did my friend prepare the couscous?",
    },
    { id: 5, source: "мани ала и-муд учу", translation: "Where will he prepare the couscous?" },
    { id: 6, source: "мани ала фр х тажра", translation: "Where shall I hide the dish?" },
    { id: 7, source: "ас муд х", translation: "I will prepare him/it." },
    { id: 8, source: "а шм и-фр", translation: "He will hide you (fem.)." },
    { id: 9, source: "мани шм и-фр", translation: "Where did he hide you (fem.)?" },
    { id: 10, source: "мани шм ала и-ситф", translation: "Where will he let you (fem.) in?" },
    { id: 11, source: "и-ситф и", translation: "He let him in." },
    { id: 12, source: "и-муд и", translation: "He prepared him/it." },
    { id: 13, source: "ас и-суфɣ", translation: "He will let him out." },
    { id: 14, source: "мани с и-ситф", translation: "Where did he let him in?" },
    { id: 15, source: "мани с ала и-фр", translation: "Where will he hide him?" },
    { id: 16, source: "и-ситф амтукл инс", translation: "He let his friend in." },
    { id: 17, source: "и-рз и", translation: "He broke him/it." },
    { id: 18, source: "фр х шм", translation: "I hid you (fem.)." },
    { id: 19, source: "рз х с", translation: "I broke him/it." },
    { id: 20, source: "суфɣ х с", translation: "I let (past) him out." },
    { id: 21, source: "ад и-рз тажра инух", translation: "" },
    { id: 22, source: "амтукл инух мани шм ала и-фр", translation: "" },
  ];

  const dictionary = DICTIONARY;

  function stemSource(token: string) {
    return token.replace(/^и-/, "");
  }

  function normalizeEnglish(token: string) {
    return token.toLowerCase().replace(/[^a-z]+/g, "");
  }

  const dictionaryIndex = useMemo(() => {
    const bySource = new Map<string, string>();
    const byEnglish = new Map<string, string>();
    for (const entry of dictionary) {
      bySource.set(entry.source, entry.english);
      byEnglish.set(normalizeEnglish(entry.english), entry.source);
    }
    return { bySource, byEnglish };
  }, [dictionary]);

  const [active, setActive] = useState<{
    sourceStem?: string;
    english?: string;
  } | null>(null);

  const activeSourceStem = active?.sourceStem ?? null;
  const activeEnglish = active?.english ?? null;
  const activeEnglishNormalized = activeEnglish ? normalizeEnglish(activeEnglish) : null;

  function activateFromSourceToken(rawToken: string) {
    const sourceStem = stemSource(rawToken);
    const english = dictionaryIndex.bySource.get(sourceStem);
    setActive({ sourceStem, english });
  }

  function activateFromEnglishToken(rawToken: string) {
    const englishNormalized = normalizeEnglish(rawToken);
    if (!englishNormalized) return;
    const sourceStem = dictionaryIndex.byEnglish.get(englishNormalized);
    setActive({ sourceStem, english: rawToken });
  }

  function clearActive() {
    setActive(null);
  }

  function isSourceHighlighted(rawToken: string) {
    if (!activeSourceStem) return false;
    return stemSource(rawToken) === activeSourceStem;
  }

  function isEnglishHighlighted(rawToken: string) {
    if (!activeEnglishNormalized) return false;
    return normalizeEnglish(rawToken) === activeEnglishNormalized;
  }

  function renderSource(source: string) {
    const tokens = source.split(/\s+/).filter(Boolean);
    return (
      <div className="entry-source">
        {tokens.map((token, index) => (
          <span key={`${token}-${index}`}>
            {index ? " " : ""}
            <span
              className={`token${isSourceHighlighted(token) ? " is-highlighted" : ""}`}
              onMouseEnter={() => activateFromSourceToken(token)}
              onMouseLeave={clearActive}
            >
              {token}
            </span>
          </span>
        ))}
      </div>
    );
  }

  function renderTranslation(translation: string) {
    const tokens = translation.split(/\s+/).filter(Boolean);
    return (
      <div className="entry-translation">
        {tokens.map((token, index) => (
          <span key={`${token}-${index}`}>
            {index ? " " : ""}
            <span
              className={`token${isEnglishHighlighted(token) ? " is-highlighted" : ""}`}
              onMouseEnter={() => activateFromEnglishToken(token)}
              onMouseLeave={clearActive}
            >
              {token}
            </span>
          </span>
        ))}
      </div>
    );
  }

  return (
    <main>
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
            const isSourceActive = activeSourceStem === entry.source;
            const isEnglishActive =
              activeEnglishNormalized === normalizeEnglish(entry.english);
            return (
              <div key={entry.source} className="dictionary-item">
                <span
                  className={`token dictionary-source${
                    isSourceActive ? " is-highlighted" : ""
                  }`}
                  onMouseEnter={() =>
                    setActive({ sourceStem: entry.source, english: entry.english })
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
                  onMouseEnter={() =>
                    setActive({ sourceStem: entry.source, english: entry.english })
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
