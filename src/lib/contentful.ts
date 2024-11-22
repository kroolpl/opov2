import contentful from 'contentful';

export const contentfulClient = contentful.createClient({
  space: import.meta.env.CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.CONTENTFUL_ACCESS_TOKEN,
  environment: 'master'
});

export interface Story {
  title: string;
  slug: string;
  author: string;
  content: any; // Rich text content
  isPublished: boolean;
  publishedDate: string;
}

export async function getPublishedStories() {
  const response = await contentfulClient.getEntries<Story>({
    content_type: 'story',
    'fields.isPublished': true,
    order: '-fields.publishedDate'
  });
  
  return response.items;
}

export async function getStoryBySlug(slug: string) {
  const response = await contentfulClient.getEntries<Story>({
    content_type: 'story',
    'fields.slug': slug,
    limit: 1
  });
  
  return response.items[0];
} 