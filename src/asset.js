// files in public/ need the site's base path in front (matters on github pages)
export default function asset(path) {
  return import.meta.env.BASE_URL + path;
}
