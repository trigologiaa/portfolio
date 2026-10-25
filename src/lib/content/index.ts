import "server-only";
import path from "node:path";
import { loadAbout, loadProfile, loadStack, loadTimeline } from "./loader";
import type { Profile, Stack, Timeline } from "./schemas";

const root: string = path.join(process.cwd(), "content");

export const getProfile = (locale: string): Profile =>
  loadProfile(root, locale);
export const getStack = (locale: string): Stack => loadStack(root, locale);
export const getTimeline = (locale: string): Timeline =>
  loadTimeline(root, locale);
export const getAbout = (locale: string): string => loadAbout(root, locale);

export { ContentError } from "./loader";
export type { Profile, Stack, Timeline, TimelineEntry } from "./schemas";
