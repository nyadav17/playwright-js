"use-strict";
// @ts-check

export function areMapsEqual(map1, map2) {
  // Check if both maps have the same size
  if (map1.size !== map2.size) {
    return false;
  }

  // Check if each key-value pair is equal
  for (let [key, value] of map1) {
    if (!map2.has(key) || map2.get(key) !== value) {
      return false;
    }
  }

  return true;
}
