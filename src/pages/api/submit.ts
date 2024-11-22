import type { APIRoute } from 'astro';
import { createClient } from 'contentful-management';

const client = createClient({
  accessToken: import.meta.env.CONTENTFUL_MANAGEMENT_TOKEN || ''
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const author = formData.get('author') as string;
    const content = formData.get('content') as string;

    const space = await client.getSpace(import.meta.env.CONTENTFUL_SPACE_ID || '');
    const environment = await space.getEnvironment('master');
    
    // Create entry
    const entry = await environment.createEntry('story', {
      fields: {
        title: { 'en-US': title },
        author: { 'en-US': author },
        content: { 'en-US': content },
        slug: { 'en-US': title.toLowerCase().replace(/[^a-z0-9]+/g, '-') },
        isPublished: { 'en-US': false },
        publishedDate: { 'en-US': new Date().toISOString() }
      }
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 302,
      headers: {
        'Location': '/?submitted=true'
      }
    });
  } catch (error) {
    console.error('Submission error:', error);
    return new Response(JSON.stringify({ success: false }), {
      status: 500
    });
  }
}; 