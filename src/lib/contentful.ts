import { createClient } from 'contentful';
import type { Entry, EntrySkeletonType, EntryFieldTypes } from 'contentful';

interface StoryFields {
  title: EntryFieldTypes.Text;
  slug: EntryFieldTypes.Text;
  author: EntryFieldTypes.Text;
  content: EntryFieldTypes.RichText;
  isPublished: EntryFieldTypes.Boolean;
  publishedDate: EntryFieldTypes.Date;
}

interface StorySkeletonType extends EntrySkeletonType {
  contentTypeId: 'story';
  fields: StoryFields;
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
    const response = await contentfulClient.getEntries<StorySkeletonType>({
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
    const response = await contentfulClient.getEntries<StorySkeletonType>({
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