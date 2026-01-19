import HomeClient from "./HomeClient";

type PageSearchParams = Record<string, string | string[] | undefined>;

export default function Page({ searchParams }: { searchParams?: PageSearchParams }) {
  const solutionParam = searchParams?.solution;
  const solutionValue = Array.isArray(solutionParam) ? solutionParam[0] : solutionParam;
  const showSolution = solutionValue === "1";
  return <HomeClient showSolution={showSolution} />;
}

