/**
 * Created by jiachenpan on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternalUrl(path: string) {
  return /^(https?:|mailto:|tel:)/.test(path)
}
