import { notFound } from "next/navigation";
import type { JSX } from "react/jsx-runtime";
import { Mdx } from "@/components/mdx/mdx";
import { ProjectDetail } from "@/features/projects/components/project-detail";
import type { Project } from "@/features/projects/curation/curate";
import { getProjects } from "@/features/projects/get-projects";
import {
  findProject,
  getAdjacentProjects,
} from "@/features/projects/navigation";
import { routing } from "@/i18n/routing";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams(): Promise<
  { locale: string; slug: string }[]
> {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of routing.locales) {
    for (const project of (await getProjects(locale)).projects) {
      params.push({ locale, slug: project.slug });
    }
  }
  return params;
}

export default async function ProjectPage({
  params,
}: PageProps): Promise<JSX.Element> {
  const { locale, slug } = await params;
  const { projects } = await getProjects(locale);
  const project: Project | null = findProject(projects, slug);
  if (!project) {
    notFound();
  }
  const { previous, next } = getAdjacentProjects(projects, slug);
  const body = project.enrichment?.body;
  return (
    <main id="content">
      <ProjectDetail project={project} previous={previous} next={next}>
        {body ? <Mdx source={body} /> : null}
      </ProjectDetail>
    </main>
  );
}
