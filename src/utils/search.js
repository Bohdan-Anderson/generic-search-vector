var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/**
 * Returns the similarity between two vectors using the cosine similarity.
 * @param vector1 Vector 1
 * @param vector2 Vector 2
 * @returns Similarity between the two vectors
 */
export var cosineSimilarity = function (vector1, vector2) {
    // Return the quotient of the dot product and the product of the norms
    return (dotProduct(vector1, vector2) / (normalize(vector1) * normalize(vector2)));
};
/**
 * Normalizes a vector.
 * @remarks
 * The norm of a vector is the square root of the sum of the squares of the elements.
 * The LocalIndex pre-normalizes all vectors to improve performance.
 * @param vector Vector to normalize
 * @returns Normalized vector
 */
export var normalize = function (vector) {
    // Initialize a variable to store the sum of the squares
    var sum = 0;
    // Loop through the elements of the array
    for (var i = 0; i < vector.length; i++) {
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
export var normalizedCosineSimilarity = function (vector1, norm1, vector2, norm2) {
    // Return the quotient of the dot product and the product of the norms
    return dotProduct(vector1, vector2) / (norm1 * norm2);
};
export var dotProduct = function (arr1, arr2) {
    // Initialize a variable to store the sum of the products
    var sum = 0;
    // Loop through the elements of the arrays
    for (var i = 0; i < arr1.length; i++) {
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
export var queryItems = function (items, vector, topK) { return __awaiter(void 0, void 0, void 0, function () {
    var norm, distances, i, item, distance, top;
    return __generator(this, function (_a) {
        norm = normalize(vector);
        distances = [];
        for (i = 0; i < items.length; i++) {
            item = items[i];
            distance = normalizedCosineSimilarity(vector, norm, item.vectors, item.norm);
            distances.push({ index: i, distance: distance });
        }
        // Sort by distance DESCENDING
        distances.sort(function (a, b) { return b.distance - a.distance; });
        top = distances.slice(0, topK).map(function (d) {
            return {
                item: Object.assign({}, items[d.index]),
                score: d.distance,
            };
        });
        return [2 /*return*/, top];
    });
}); };
