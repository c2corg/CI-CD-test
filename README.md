# CI-CD-test
This repo is a test repo

## Targets

Proof of concept of a CI-CD env integrated with github pages and camptocamp prod/demo servers

### [x] When a commit is made on {branch-name} branch
  
1. [x] a build must be run and deployed on `https://c2corg.github.io/ci-cd-test/{branch-name}/#/`
2. [x] Other build musts be preserved
3. [x] if <branch-name> is `gh-pages`, do nothing
4. <del>if <branch-name> is `master`, build must also be available on https://c2corg.github.io/ci-cd-test/#/</del> **No**, it may need two builds, as branch name must be in URL. Too heavy, skip. 
5. [x] set a pages with available builds list on root page
  
### [ ] When a commit is made on `master`

1. [ ] a build must be run and deployed on demo server
2. [ ] `.po` file must be pushed to transifex

### [ ] When a [release](https://github.com/c2corg/CI-CD-test/releases) is done on github

* [x] a git log must be added in release description : `git log --pretty=oneline v7.0.6..HEAD --no-merges`
* [x] a docker image must be pushed to docker hub
  * it's actually done, but with an overkill : any commit on any branch push an image. We may improve this, at least by limiting it to commits made on master
  
### [ ] When an image linked to a relese is ready on docker hub

* [ ] production server must be updated with this image
* [ ] a message must be sent on camptocamp forum

### [ ] Once a day

* [ ] `messages:compile` must be run
* [ ] For each lang with new messages, a PR must be created : `translations-{lang}`

----

## Solutions

### 1. When a commit is made on {branch-name} : 
  
#### Deploy on `https://c2corg.github.io/ci-cd-test/<branch-name>/#/`

In `vue.config.js`, get the deployed branch name, and append it to public path : 

```js
  config.branchName = process.env.TRAVIS_BRANCH;
  // github pages urls are postfixed
  result.publicPath = `/CI-CD-test/${config.branchName}/`;
```

Then use a custom deploy script, run on all branches (gh-pages is automaticly excluded) : 

**.travis.yml**
```yml

# deploy to github pages on master
deploy:
  provider: script
  skip-cleanup: true
  script: bash scripts/deploy.sh
  verbose: true
  on:
    all_branches: true
```

**bash scripts/deploy.sh**
```bash
# clone repository on gh-pages branch. Save it in gh-pages folder 
git clone --single-branch --branch=gh-pages https://${GITHUB_TOKEN}@github.com/${TRAVIS_REPO_SLUG}.git gh-pages

# move build into gh-pages folder, under a new folder with <branch-name> as name
rm -rf gh-pages/$TRAVIS_BRANCH
mv dist gh-pages/$TRAVIS_BRANCH

# Add this folder into gh-pages branch, commit and push
cd gh-pages
git add .
git commit -m "Deploy $TRAVIS_BRANCH branch"
git push > /dev/null 2>&1
```

Notice the > /dev/null 2>&1 on the end! If push fails for any reason,
it prevents any unwanted sensitive information to be recorded in the travis logs. 

#### Other build musts be preserved

The key point is that we clone full gh-pages branch, and add our build into it. Standard travis script does not preserve precendents files, so we must use a custom script

#### Set a page with available builds list on root page

See index.html

### When a commit is made on master

Todo..

### When a [release](https://github.com/c2corg/CI-CD-test/releases) is done on github

#### a git log must be added in release description

**.travis.yml**
```yml
script:
- bash scripts/update-release-description.sh
```

**scripts/update-release-description.sh**

*Check if tavis job is related to a tag, get last two tags, and call js script*

```bash
# if it's a tag, add commit logs
if [ $TRAVIS_TAG ]; then
    firstTag=$(git tag | sort -r | head -1)
    secondTag=$(git tag | sort -r | head -2 | awk '{split($0, tags, "\n")} END {print tags[1]}')
    git log  --pretty=oneline ${secondTag}..${firstTag} --no-merges | node scripts/update-release-description.js
fi
```

**scripts/update-release-description.js**

```js
/* eslint-disable no-console */

const fs = require('fs');
const axios = require('axios');

const repoSlug = process.env.TRAVIS_REPO_SLUG;
const tagName = process.env.TRAVIS_TAG;
const githubUsername = process.env.GITHUB_USERNAME;
const githubToken = process.env.GITHUB_TOKEN;

const gitLog = fs.readFileSync('/dev/stdin', 'utf-8');
console.log(`git log : \n${gitLog}`);

console.log(`getting release data on https://api.github.com/repos/${repoSlug}/releases/tags/${tagName}`);

axios.get(`https://api.github.com/repos/${repoSlug}/releases/tags/${tagName}`)
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

    console.log('Update release data');

    axios.patch(releaseUrl, payload, {
      auth: {
        username: githubUsername,
        password: githubToken
      }
    })
      .then(() => {
        console.log('Release is updated');
      })
      .catch(() => {
        console.log('Unexpected error. Ouput has been disabled on purpose for security reasons');
        process.exit(1);
    });
  })
  .catch(() => {
    console.log('Unexpected error. Ouput has been disabled on purpose for security reasons');
    process.exit(1);
  }
);
```
  
