# CI-CD-test
This repo is a test repo

## Targets

Proof of concept of a CI-CD env integrated with github pages and camptocamp prod/demo servers

### [x] When a commit is made on {branch-name} branch
  
1. a build must be run and deployed on `https://c2corg.github.io/ci-cd-test/{branch-name}/#/`
2. [x] Other build musts be preserved
3. [x] if <branch-name> is `gh-pages`, do nothing
4. [ ] <del>if <branch-name> is `master`, build must also be available on https://c2corg.github.io/ci-cd-test/#/</del> **No**, it may need two builds, as branch name must be in URL. Too heavy, skip. 
5. [X] set a pages with available builds list on root page
  
### [ ] When a commit is made on `master`

1. [ ] a build must be run and deployed on demo server
2. [ ] `.po` file must be pushed to transifex

### [ ] When a [release](https://github.com/c2corg/CI-CD-test/releases) is done on github

* [ ] a git log must be added in release description : `git log --pretty=oneline v7.0.6..HEAD --no-merges`
* [x] a docker image must be pushed to docker hub
* [ ] production server must be updated with this image
* [ ] a message must be sent on camptocamp forum

### [ ] When a string is translated to transifex

* `messages:compile` must be run
* For each lang with new messages, a PR must be created : `translations-{lang}`
* It must be done once a day, at midnight

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

Todo ...
