// files in public/ need the site's base path in front (only matters if hosted in a subfolder)
export default function asset(path) {
  return import.meta.env.BASE_URL + path;
}
