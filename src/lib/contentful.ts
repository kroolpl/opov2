import * as contentful from 'contentful';

export interface StoryFields {
  title: string;
  slug: string;
  author: string;
  content: contentful.EntryFields.RichText;
  isPublished: boolean;
  publishedDate: string;
}

export interface Story extends contentful.Entry<StoryFields> {}

export const contentfulClient = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || '',
  environment: 'master'
});

export async function getPublishedStories() {
  const response = await contentfulClient.getEntries<StoryFields>({
    content_type: 'story',
    'fields.isPublished': true,
    order: '-fields.publishedDate'
  });
  
  return response.items;
}

export async function getStoryBySlug(slug: string) {
  const response = await contentfulClient.getEntries<StoryFields>({
    content_type: 'story',
    'fields.slug': slug,
    limit: 1
  });
  
  return response.items[0];
} 