/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export function getSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9\s-]/g, "") // remove special characters
    .trim()
    .replace(/\s+/g, "-") // replace spaces with -
    .replace(/-+/g, "-"); // remove double hyphens
}
