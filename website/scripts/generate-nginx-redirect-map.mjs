import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const redirectPath = path.join(root, 'src', 'config', 'legacy-redirects.json');
const outputPath = path.join(root, 'deployment', 'nginx-legacy-redirect-map.conf');
const redirects = JSON.parse(await readFile(redirectPath, 'utf8'));

const rows = Object.entries(redirects)
  .map(([source, destination]) => `    ${source} ${destination};`)
  .join('\n');

const output = `# Generated from src/config/legacy-redirects.json.
# Include this map in the nginx http {} context, then use
# $codingbull_canonical_path in every non-canonical entry point below.
map $uri $codingbull_canonical_path {
    default $uri;
${rows}
}

# Apply the map in EVERY server block that is not the canonical HTTPS www
# origin. Any block that redirects without the map produces a two-hop chain
# (host/scheme fix first, then the Next.js legacy-path redirect).
#
# Merge these directives into the existing blocks after preserving their
# certificate directives. Do not create a second competing block for a host.
#
# 1) HTTP apex — http://codingbullz.com/<legacy>
# server {
#     listen 80;
#     server_name codingbullz.com;
#     return 301 https://www.codingbullz.com$codingbull_canonical_path$is_args$args;
# }
#
# 2) HTTP www — http://www.codingbullz.com/<legacy>
# server {
#     listen 80;
#     server_name www.codingbullz.com;
#     return 301 https://www.codingbullz.com$codingbull_canonical_path$is_args$args;
# }
#
# 3) HTTPS apex — https://codingbullz.com/<legacy>
# server {
#     listen 443 ssl http2;
#     server_name codingbullz.com;
#     # existing ssl_certificate / ssl_certificate_key directives stay here
#     return 301 https://www.codingbullz.com$codingbull_canonical_path$is_args$args;
# }
#
# 4) HTTPS www is the canonical origin and must NOT use the map. It proxies to
#    Next.js, which already resolves legacy paths in a single 301.
#
# Verify one hop for every entry point after reloading nginx:
#   curl -sIL http://codingbullz.com/blog      | grep -iE '^HTTP/|^location:'
#   curl -sIL http://www.codingbullz.com/blog  | grep -iE '^HTTP/|^location:'
#   curl -sIL https://codingbullz.com/blog     | grep -iE '^HTTP/|^location:'
# Each must show exactly one 301 to https://www.codingbullz.com/insights.
`;

await writeFile(outputPath, output);
console.log(`Generated ${path.relative(root, outputPath)} from ${path.relative(root, redirectPath)}`);
