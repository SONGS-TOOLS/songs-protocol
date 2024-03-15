// utils/hashFile.ts
export async function hashFile(file: File): Promise<string> {
    // Placeholder for hashing logic
    // In a real application, you would replace this with actual file hashing
    const text = await file.text();
    return `hashed-${text.length}`;
  }
  