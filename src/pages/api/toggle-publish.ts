import type { APIRoute } from 'astro';
import contentfulManagement from 'contentful-management';

const client = contentfulManagement.createClient({
  accessToken: import.meta.env.CONTENTFUL_MANAGEMENT_TOKEN || ''
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const { entryId, publish } = await request.json();

    const space = await client.getSpace(import.meta.env.CONTENTFUL_SPACE_ID || '');
    const environment = await space.getEnvironment('master');
    
    const entry = await environment.getEntry(entryId);
    entry.fields.isPublished = { 'en-US': publish };
    
    const updatedEntry = await entry.update();
    await updatedEntry.publish();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Toggle publish error:', error);
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