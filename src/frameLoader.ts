export const FOLDER_FRAME_COUNTS: Record<string, number> = {
  Smoke: 10,
  SmokeExplosion: 16,
  SmokeSpell: 10,
  PoisonousSmoke: 12,
};

export const AVAILABLE_FOLDERS = [
  "Smoke",
  "SmokeExplosion",
  "SmokeSpell",
  "PoisonousSmoke",
] as const;

export type BuiltInFolderName = (typeof AVAILABLE_FOLDERS)[number];

export interface FrameOptions {
  folder?: string;
  frameCount?: number;
  extension?: string;
  padZero?: boolean;
  publicPath?: string;
}

/**
 * Resolves frame images for gestures:
 *
 * 1. If using built-in names (e.g. "Smoke", "SmokeExplosion"):
 *    Loads from `/images/click/<folder>/01.png` in the consumer's public folder
 *    (populated automatically via `npx react-tailwind-click-frame-animation init`).
 *
 * 2. If using a custom folder path (e.g. "/assets/fire"):
 *    Generates sequential paths looking into the consumer project's public folder.
 */
export function getFramesFromFolder(
  folderOrOptions?: string | FrameOptions,
  frameCount?: number,
  extension: string = "png",
  padZero: boolean = true
): string[] {
  let folder: string | undefined;
  let count: number | undefined;
  let ext: string = extension;
  let pad: boolean = padZero;
  let publicPath: string = "";

  if (typeof folderOrOptions === "object" && folderOrOptions !== null) {
    folder = folderOrOptions.folder;
    count = folderOrOptions.frameCount;
    ext = folderOrOptions.extension ?? extension;
    pad = folderOrOptions.padZero ?? padZero;
    publicPath = folderOrOptions.publicPath ?? "";
  } else {
    folder = folderOrOptions;
    count = frameCount;
  }

  const rawFolder = folder || "Smoke";
  const cleanExt = ext.startsWith(".") ? ext.slice(1) : ext;
  const cleanPrefix = publicPath ? publicPath.replace(/\/+$/, "") : "";

  // If it's a built-in folder name (not starting with "/" or "./" or "http")
  const isBuiltInName = AVAILABLE_FOLDERS.includes(rawFolder as BuiltInFolderName);
  const basePath = isBuiltInName
    ? `${cleanPrefix}/images/click/${rawFolder}`
    : rawFolder.startsWith("/") && cleanPrefix
    ? `${cleanPrefix}${rawFolder.endsWith("/") ? rawFolder.slice(0, -1) : rawFolder}`
    : rawFolder.endsWith("/")
    ? rawFolder.slice(0, -1)
    : rawFolder;

  const folderName = basePath.split("/").filter(Boolean).pop() || basePath;
  const finalCount = count || FOLDER_FRAME_COUNTS[folderName] || 10;

  return Array.from({ length: finalCount }, (_, i) => {
    const index = i + 1;
    const num = pad ? String(index).padStart(2, "0") : String(index);
    return `${basePath}/${num}.${cleanExt}`;
  });
}
