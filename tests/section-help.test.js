import test from 'node:test';
import assert from 'node:assert/strict';
import {sectionHelp} from '../src/section-help.js';
test('all public content sections have native disclosure and always visible caveat',()=>{
 for(const path of ['/','/events','/events/example','/texas/events','/texas/events/example','/bikes','/bikes/example','/brands/example','/texas/routes/example','/texas/trails','/texas/clubs','/guides/example','/texas','/texas-rides','/#garage','/#saved']) {
  const html=sectionHelp(path);assert.match(html,/<details[^>]*><summary>How to use this section<\/summary>/,path);
  assert.ok(html.indexOf('section-help-essential')<html.indexOf('<details'),path);
  assert.ok((html.match(/<li>/g)||[]).length>=3,path);assert.doesNotMatch(html,/onclick=|onmouseover=|title=/);
 }
});
test('calendar download claims limited to curated event routes',()=>{
 assert.match(sectionHelp('/texas/events/example'),/all-day/);assert.doesNotMatch(sectionHelp('/events'),/all-day/);
 assert.match(sectionHelp('/events'),/registration deadline/);assert.match(sectionHelp('/texas/events'),/does not update itself/);
});
test('unknown details and public account scope stated accurately',()=>{
 assert.match(sectionHelp('/bikes'),/does not mean the feature is absent/);assert.match(sectionHelp('/'),/profile and garage are public/);
 assert.match(sectionHelp('/texas/trails'),/planning references/);assert.match(sectionHelp('/guides'),/AI-assisted/);
});
test('policy pages omitted and untrusted route content never interpolated',()=>{
 for(const path of ['/privacy','/terms','/about','/editorial','/data-use','/community-guidelines']) assert.equal(sectionHelp(path),'');
 assert.doesNotMatch(sectionHelp('/events/<script>alert(1)</script>'),/script|alert\(1\)/);
 assert.equal(sectionHelp('/unrecognized'), '');
});
