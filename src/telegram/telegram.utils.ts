export class TelegramUtils {
  static async download(url: string): Promise<ArrayBuffer> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to download image');
    }
    return response.arrayBuffer();
  }
}
