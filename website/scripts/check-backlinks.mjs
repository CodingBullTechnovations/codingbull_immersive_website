import assert from 'node:assert/strict';
import { applyProfiles, mergeProfiles, validateProfile, verifiedProfiles } from './addbacklinks.mjs';

const original = {
  links: [{ id: 'instagram', url: 'https://www.instagram.com/codingbulltech/', showInFooter: false, includeInSameAs: false, extra: 'keep' }],
  contentEmbeds: [{ id: 'owner-embed', embedUrl: 'https://example.com/owner', enabled: true }],
  instagramContent: { enabled: false, title: 'Owner title' },
  customOwnerSetting: { preserve: true },
};
let saved = structuredClone(original);
let writes = 0;
const tx = { siteSetting: {
  findUnique: async () => ({ value: structuredClone(saved) }),
  upsert: async (args) => { saved = structuredClone(args.update.value); writes += 1; },
} };

const preview = await applyProfiles(tx, verifiedProfiles, true);
assert.equal(preview.changed, true);
assert.equal(writes, 0);
assert.deepEqual(saved, original);
await applyProfiles(tx, verifiedProfiles);
assert.equal(writes, 1);
assert.equal(saved.links.length, original.links.length + verifiedProfiles.length);
assert.deepEqual(saved.links[0], original.links[0]);
for (const key of ['contentEmbeds', 'instagramContent', 'customOwnerSetting']) assert.deepEqual(saved[key], original[key]);
await applyProfiles(tx, verifiedProfiles);
assert.equal(writes, 1, 'Repeat execution must not write');

const existingCustom = { links: [{ id: 'custom-profile', url: `${verifiedProfiles[0].url}/`, showInFooter: false, includeInSameAs: false }] };
const kept = mergeProfiles(existingCustom, [verifiedProfiles[0]]);
assert.equal(kept.changed, false);
assert.deepEqual(kept.value.links, existingCustom.links);
assert.throws(() => mergeProfiles({ links: [{ id: 'clutch', url: 'https://clutch.co/profile/someone-else' }] }, verifiedProfiles), /different URL/);
assert.throws(() => mergeProfiles({ links: 'bad' }, verifiedProfiles), /must be an array/);
assert.throws(() => mergeProfiles('bad', verifiedProfiles), /malformed/);
assert.equal(mergeProfiles(undefined, verifiedProfiles).value.links.length, 4);
for (const [id, url] of [
  ['clutch', 'https://vendor.clutch.co'],
  ['clutch', 'https://staging.clutch.co/profile/codingbull-technovations'],
  ['goodfirms', 'https://myaccount.goodfirms.co/users/update-listing'],
  ['pinterest', 'https://www.pinterest.com/settings/'],
  ['pinterest', 'https://www.pinterest.com/codingbullz/?token=private'],
  ['clutch', 'javascript:alert(1)'],
]) assert.throws(() => validateProfile({ id, url }), /Invalid public profile/);
console.log('✓ profile command: preview writes nothing; additive updates preserve settings; repeat is a no-op; URL conflicts and dashboard links rejected');
