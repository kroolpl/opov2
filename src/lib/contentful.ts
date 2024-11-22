import type { Entry, EntryFieldTypes, EntrySkeletonType } from 'contentful';
import * as contentful from 'contentful';

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

export const contentfulClient = contentful.createClient({
  space: import.meta.env.CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.CONTENTFUL_ACCESS_TOKEN,
  environment: 'master'
});

export async function getPublishedStories() {
  const response = await contentfulClient.getEntries<StorySkeletonType>({
    content_type: 'story',
    'fields.isPublished': true,
    order: ['-fields.publishedDate']
  });
  
  return response.items;
}

export async function getStoryBySlug(slug: string) {
  const response = await contentfulClient.getEntries<StorySkeletonType>({
    content_type: 'story',
    'fields.slug': slug,
    limit: 1
  });
  
  return response.items[0];
} 