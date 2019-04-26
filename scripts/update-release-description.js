/* eslint-disable no-console */

const fs = require('fs');
const axios = require('axios');

if (process.argv.length !== 5) {
  console.log(`Usage
  node ${process.argv[1]} <tag-name> <user> <token>`);
  process.exit(1);
}

const orgName = 'c2corg';
const repoName = 'CI-CD-test';

const tagName = process.argv[2];
const githubUsername = process.argv[3];
const githubToken = process.argv[4];

const gitLog = fs.readFileSync('/dev/stdin', 'utf-8');
console.log('getting release data');

axios.get(`https://api.github.com/repos/${orgName}/${repoName}/releases/tags/${tagName}`)
  .then((response) => {
    const data = response.data;
    const releaseUrl = data.url;

    const payload = {
      'tag_name': data.tag_name,
      'target_commitish': data.target_commitish,
      'name': data.name,
      'body': gitLog,
      'draft': data.draft,
      'prerelease': data.prerelease
    };

    console.log('Update release data', releaseUrl);

    axios.patch(releaseUrl, payload, {
      auth: {
        username: githubUsername,
        password: githubToken
      }
    })
      .then(() => {
        console.log('Release is updated');
      })
      .catch((error) => {
        console.log(error);
    });
});
