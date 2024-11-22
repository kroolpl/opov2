import { createClient } from 'contentful';
import type { Entry, EntryFieldTypes } from 'contentful';

interface StoryFields {
  title: string;
  slug: string;
  author: string;
  content: any;
  isPublished: boolean;
  publishedDate: string;
}

export type Story = Entry<StoryFields>;

if (!import.meta.env.CONTENTFUL_SPACE_ID || !import.meta.env.CONTENTFUL_ACCESS_TOKEN) {
  throw new Error(
    'Contentful space ID and access token are required. ' +
    'Please add CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN to your .env file.'
  );
}

export const contentfulClient = createClient({
  space: import.meta.env.CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.CONTENTFUL_ACCESS_TOKEN,
  environment: 'master'
});

export async function getPublishedStories(): Promise<Story[]> {
  try {
    const response = await contentfulClient.getEntries<StoryFields>({
      content_type: 'story',
      'fields.isPublished': true,
      order: ['-fields.publishedDate']
    });
    
    return response.items;
  } catch (error) {
    console.error('Error fetching stories:', error);
    return [];
  }
}

export async function getStoryBySlug(slug: string): Promise<Story | null> {
  try {
    const response = await contentfulClient.getEntries<StoryFields>({
      content_type: 'story',
      'fields.slug': slug,
      limit: 1
    });
    
    return response.items[0] || null;
  } catch (error) {
    console.error('Error fetching story:', error);
    return null;
  }
} 