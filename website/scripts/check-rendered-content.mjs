import fs from 'node:fs';
import path from 'node:path';

const appDir = path.join(process.cwd(), '.next', 'server', 'app');
const failures = [];

function read(route) {
  const file = path.join(appDir, route);
  if (!fs.existsSync(file)) {
    failures.push(`missing rendered artifact: ${route}`);
    return '';
  }
  return fs.readFileSync(file, 'utf8');
}

function requireText(route, value) {
  const html = read(route);
  if (!html.includes(value)) failures.push(`${route} is missing required text: ${value}`);
}

function forbidText(route, values) {
  const html = read(route);
  for (const value of values) {
    if (html.includes(value)) failures.push(`${route} contains rejected text: ${value}`);
  }
}

requireText('services/custom-business-systems.html', 'Custom Business Software Development Company');
requireText('services/custom-business-systems.html', 'Good fit when');
requireText('about.html', '"@type":"AboutPage"');
requireText('contact.html', '"@type":"ContactPage"');
requireText('contact.html', 'id="contact-budget"');
requireText('contact.html', '$1k-$2k');
requireText('contact.html', '$5k+');
requireText('index.html', 'A clinic website with booking takes 4–6 weeks.');
requireText('index.html', 'A full HRMS or e-commerce platform takes 8–16 weeks.');
requireText('usa.html', 'Architecture response within 48 working hours');

forbidText('services/healthcare-software-development.html', ['reducing no-shows by up to 40%']);
forbidText('case-studies/physioway.html', [
  '15k',
  '500+',
  '45 seconds',
  '35%',
  'used in the project architecture.',
]);
forbidText('case-studies/shashwat-ivf.html', [
  '120%',
  '&lt;2min',
  '<2min',
  '80%',
  '2x inquiries',
  'Django API',
  'WhatsApp Business',
  'used in the project architecture.',
]);
forbidText('insights/custom-ecommerce-inventory-order-automation.html', ['"dateModified"']);
forbidText('sitemap.xml.body', ['2026-07-14']);

if (failures.length) {
  console.error('Rendered-content guard failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('✓ rendered-content guard passed — reviewed metadata, schema, dates, and rejected claims');
