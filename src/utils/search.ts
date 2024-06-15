import type { Entry } from "../types";

/**
 * Returns the similarity between two vectors using the cosine similarity.
 * @param vector1 Vector 1
 * @param vector2 Vector 2
 * @returns Similarity between the two vectors
 */
export const cosineSimilarity = (vector1: number[], vector2: number[]) => {
  // Return the quotient of the dot product and the product of the norms
  return (
    dotProduct(vector1, vector2) / (normalize(vector1) * normalize(vector2))
  );
};

/**
 * Normalizes a vector.
 * @remarks
 * The norm of a vector is the square root of the sum of the squares of the elements.
 * The LocalIndex pre-normalizes all vectors to improve performance.
 * @param vector Vector to normalize
 * @returns Normalized vector
 */
export const normalize = (vector: number[]) => {
  // Initialize a variable to store the sum of the squares
  let sum = 0;
  // Loop through the elements of the array
  for (let i = 0; i < vector.length; i++) {
    // Square the element and add it to the sum
    sum += vector[i] * vector[i];
  }
  // Return the square root of the sum
  return Math.sqrt(sum);
};

/**
 * Returns the similarity between two vectors using cosine similarity.
 * @remarks
 * The LocalIndex pre-normalizes all vectors to improve performance.
 * This method uses the pre-calculated norms to improve performance.
 * @param vector1 Vector 1
 * @param norm1 Norm of vector 1
 * @param vector2 Vector 2
 * @param norm2 Norm of vector 2
 * @returns Similarity between the two vectors
 */
export const normalizedCosineSimilarity = (
  vector1: number[],
  norm1: number,
  vector2: number[],
  norm2: number
) => {
  // Return the quotient of the dot product and the product of the norms
  return dotProduct(vector1, vector2) / (norm1 * norm2);
};

export const dotProduct = (arr1: number[], arr2: number[]) => {
  // Initialize a variable to store the sum of the products
  let sum = 0;
  // Loop through the elements of the arrays
  for (let i = 0; i < arr1.length; i++) {
    // Multiply the corresponding elements and add them to the sum
    sum += arr1[i] * arr2[i];
  }
  // Return the sum
  return sum;
};

/**
 * Finds the top k items in the index that are most similar to the vector.
 * @remarks
 * This method loads the index into memory and returns the top k items that are most similar.
 * An optional filter can be applied to the metadata of the items.
 * @param vector Vector to query against.
 * @param topK Number of items to return.
 * @param filter Optional. Filter to apply.
 * @returns Similar items to the vector that matche the supplied filter.
 */
export const queryItems = async (
  items: Entry[],
  vector: number[],
  topK: number
) => {
  // Calculate distances
  const norm = normalize(vector);
  const distances: { index: number; distance: number }[] = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const distance = normalizedCosineSimilarity(
      vector,
      norm,
      item.vectors,
      item.norm
    );
    distances.push({ index: i, distance: distance });
  }

  // Sort by distance DESCENDING
  distances.sort((a, b) => b.distance - a.distance);

  // Find top k
  const top = distances.slice(0, topK).map((d) => {
    return {
      item: Object.assign({}, items[d.index]) as Entry,
      contextText: items
        .slice(Math.max(0, d.index - 1), d.index + 2)
        .map((i) => i.text),
      score: d.distance,
    };
  });

  return top;
};
