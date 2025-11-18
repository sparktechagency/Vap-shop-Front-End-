export default function extractIdFromUrl(url: string): number | null {
  try {
    const parsedUrl = new URL(url, "http://dummy.base"); // support relative URLs
    const path = parsedUrl.pathname;

    // match /stores/store/:id, /brands/brand/:id, or /profile/:id
    const match = path.match(/\/(stores\/store|brands\/brand|profile)\/(\d+)/i);
    if (match && match[2]) {
      return parseInt(match[2], 10);
    }

    return null;
  } catch (e) {
    return null;
  }
}