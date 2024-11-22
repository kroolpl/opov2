import { createClient } from 'contentful';
import type { Entry, EntryFieldTypes } from 'contentful';

export interface StoryFields {
  title: string;
  slug: string;
  author: string;
  content: any;
  isPublished: boolean;
  publishedDate: string;
}

export type Story = Entry<StoryFields>;

if (!import.meta.env.CONTENTFUL_SPACE_ID || !import.meta.env.CONTENTFUL_ACCESS_TOKEN) {
  throw new Error('Missing Contentful environment variables');
}

export const contentfulClient = createClient({
  space: import.meta.env.CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.CONTENTFUL_ACCESS_TOKEN,
  environment: 'master'
});

export async function getPublishedStories() {
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

export async function getStoryBySlug(slug: string) {
  try {
    const response = await contentfulClient.getEntries<StoryFields>({
      content_type: 'story',
      'fields.slug': slug,
      limit: 1
    });
    
    return response.items[0];
  } catch (error) {
    console.error('Error fetching story:', error);
    return null;
  }
} 