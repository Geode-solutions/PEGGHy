// Loads every PNG of assets/img in one go, keyed by file name without extension
// (e.g. "otelo" -> assets/img/otelo.png, "fondation-geol" -> assets/img/fondation-geol.png).
const modules = import.meta.glob<string>("@/assets/img/*.png", {
  eager: true,
  import: "default",
});

const PNG_EXTENSION = /\.png$/u;

const images: Record<string, string> = {};
for (const [path, source] of Object.entries(modules)) {
  const fileName = path.split("/").pop() ?? path;
  images[fileName.replace(PNG_EXTENSION, "")] = source;
}

export { images };
