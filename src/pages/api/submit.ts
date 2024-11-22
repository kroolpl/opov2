import type { APIRoute } from 'astro';
import contentfulManagement from 'contentful-management';

const client = contentfulManagement.createClient({
  accessToken: import.meta.env.CONTENTFUL_MANAGEMENT_TOKEN || ''
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const author = formData.get('author') as string;
    const content = formData.get('content') as string;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const space = await client.getSpace(import.meta.env.CONTENTFUL_SPACE_ID || '');
    const environment = await space.getEnvironment('master');

    // First, create the content type if it doesn't exist
    try {
      await environment.getContentType('story');
    } catch {
      // Create content type if it doesn't exist
      const contentType = await environment.createContentTypeWithId('story', {
        name: 'Story',
        fields: [
          { id: 'title', name: 'Title', type: 'Text', required: true },
          { id: 'slug', name: 'Slug', type: 'Text', required: true },
          { id: 'author', name: 'Author', type: 'Text', required: true },
          { id: 'content', name: 'Content', type: 'RichText', required: true },
          { id: 'isPublished', name: 'Is Published', type: 'Boolean', required: true },
          { id: 'publishedDate', name: 'Published Date', type: 'Date', required: true }
        ]
      });
      await contentType.publish();
    }
    
    // Create entry
    const entry = await environment.createEntry('story', {
      fields: {
        title: { 'en-US': title },
        author: { 'en-US': author },
        content: { 
          'en-US': {
            nodeType: 'document',
            data: {},
            content: [
              {
                nodeType: 'paragraph',
                data: {},
                content: [
                  {
                    nodeType: 'text',
                    value: content,
                    marks: [],
                    data: {}
                  }
                ]
              }
            ]
          }
        },
        slug: { 'en-US': slug },
        isPublished: { 'en-US': false },
        publishedDate: { 'en-US': new Date().toISOString() }
      }
    });

    // Publish the entry
    await entry.publish();

    return new Response(JSON.stringify({ success: true }), {
      status: 302,
      headers: {
        'Location': '/?submitted=true'
      }
    });
  } catch (error) {
    console.error('Submission error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}; 