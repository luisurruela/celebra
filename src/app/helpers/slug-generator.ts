import { collection, Firestore, getDocs, query, where } from '@angular/fire/firestore';

export async function generateUniqueSlug(
  fs: Firestore,
  userId: string,
  collectionPath: string,
  baseText: string
): Promise<string> {
  let slug = baseText
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');

  const colRef = collection(fs, `users/${userId}/${collectionPath}`);
  let exists = true;
  let counter = 1;

  while (exists) {
    const q = query(colRef, where('slug', '==', slug));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      exists = false; // slug disponible
    } else {
      slug = `${slug}-${counter}`;
      counter++;
    }
  }

  return slug;
}
