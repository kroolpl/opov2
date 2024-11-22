import { createClient } from 'contentful';
import type { Entry, EntryFieldTypes, EntrySkeletonType } from 'contentful';

export interface StoryFields extends EntrySkeletonType {
  contentTypeId: 'story';
  fields: {
    title: EntryFieldTypes.Text;
    slug: EntryFieldTypes.Text;
    author: EntryFieldTypes.Text;
    content: EntryFieldTypes.RichText;
    isPublished: EntryFieldTypes.Boolean;
    publishedDate: EntryFieldTypes.Date;
  };
}

export type Story = Entry<StoryFields['fields']>;

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
    const response = await contentfulClient.getEntries<StoryFields['fields']>({
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
    const response = await contentfulClient.getEntries<StoryFields['fields']>({
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