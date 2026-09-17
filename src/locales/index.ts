import defaultLocale from "./en.json";

export type LocaleData = typeof defaultLocale;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Resolves user-provided translations by merging them over the default English locale.
 * If no custom locale is provided, the built-in English locale is returned.
 */
export function resolveLocale(userLocale?: DeepPartial<LocaleData>): LocaleData {
  if (!userLocale) return defaultLocale;

  return {
    hud: {
      ...defaultLocale.hud,
      ...(userLocale.hud || {}),
    },
    gestures: {
      ...defaultLocale.gestures,
      ...(userLocale.gestures || {}),
    },
    warnings: {
      ...defaultLocale.warnings,
      ...(userLocale.warnings || {}),
    },
  };
}

/**
 * Replaces placeholders like {angle} or {distance} with provided values.
 */
export function formatString(
  template: string,
  vars: Record<string, string | number> = {}
): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? `{${key}}`));
}

export { defaultLocale };
