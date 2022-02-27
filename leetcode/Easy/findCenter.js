/**
 * @param {number[][]} edges
 * @return {number}
 */
const findCenter = (edges) => {
    const [a, b] = edges[0], [c, d] = edges[1];
    return a === c || a === d ? a : b;
};