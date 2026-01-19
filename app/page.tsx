import HomeClient from "./HomeClient";

type PageSearchParams = Record<string, string | string[] | undefined>;

export default async function Page({
  searchParams,
}: {
  searchParams?: PageSearchParams | Promise<PageSearchParams>;
}) {
  const resolvedSearchParams = searchParams ? await Promise.resolve(searchParams) : undefined;
  const solutionParam = resolvedSearchParams?.solution;
  const solutionValue = Array.isArray(solutionParam) ? solutionParam[0] : solutionParam;
  const showSolution = solutionValue === "1";
  return <HomeClient showSolution={showSolution} />;
}
