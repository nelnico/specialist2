import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";
import omitBy from "lodash/omitBy";

export function omitEmpty<T extends Record<string, unknown>>(
  obj: T
): Partial<T> {
  return omitBy(obj, (value) => {
    return (
      value === null ||
      value === undefined ||
      (typeof value === "string" && value.trim() === "") ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === "object" && !Array.isArray(value) && isEmpty(value))
    );
  }) as Partial<T>;
}

export function omitEmptySearchValues<T extends Record<string, unknown>>(
  obj: T,
  defaults: Partial<T>
): Partial<T> {
  return omitBy(obj, (value, key) => {
    const defaultValue = defaults[key as keyof T];
    return (
      value === null ||
      value === undefined ||
      (typeof value === "string" && value.trim() === "") ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === "object" && !Array.isArray(value) && isEmpty(value)) ||
      isEqual(value, defaultValue) // Matches default values
    );
  }) as Partial<T>;
}
