import { getCollection, type CollectionEntry } from 'astro:content';

export async function getPublishedWriting(): Promise<CollectionEntry<'writing'>[]> {
  const posts = await getCollection('writing', ({ data }) => data.draft === false);
  return posts.sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime() || a.id.localeCompare(b.id),
  );
}
