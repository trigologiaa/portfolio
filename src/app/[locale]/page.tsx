import { Mdx } from "@/components/mdx/mdx";
import { AboutSection } from "@/components/sections/about-section";
import { ContactSection } from "@/components/sections/contact-section";
import { Hero } from "@/components/sections/hero";
import { StackSection } from "@/components/sections/stack-section";
import { TimelineSection } from "@/components/sections/timeline-section";
import { ProjectsSection } from "@/features/projects/components/projects-section";
import type { Project } from "@/features/projects/curation/curate";
import { getProjects } from "@/features/projects/get-projects";
import {
  getAbout,
  getProfile,
  getStack,
  getTimeline,
  type Profile,
  type Stack,
  type Timeline,
} from "@/lib/content";
import { socialLinks } from "@/lib/social-links";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<React.JSX.Element> {
  const { locale } = await params;
  const profile: Profile = getProfile(locale);
  const aboutSource: string = getAbout(locale);
  const stackSource: Stack = getStack(locale);
  const timeline: Timeline = getTimeline(locale);
  const { projects } = await getProjects(locale);
  return (
    <main id="content" className="mx-auto max-w-5xl px-4">
      <Hero profile={profile} />
      <AboutSection highlights={profile.highlights}>
        <Mdx source={aboutSource} />
      </AboutSection>
      <ProjectsSection
        projects={projects.filter((project: Project) => project.featured)}
        githubUrl={profile.links.github}
      />
      <StackSection stack={stackSource} />
      <TimelineSection entries={timeline.entries} />
      <ContactSection
        email={profile.email}
        links={socialLinks(profile.links)}
      />
    </main>
  );
}
