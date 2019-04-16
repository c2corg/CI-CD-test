# CI-CD-test
This repo is a test repo

## Targets

Proof of concept of a CI-CD env integrated with github pages and camptocamp prod/demo servers

1. [x] When a commit is made on <branch-name> branch, a build must be run and deployed on `https://c2corg.github.io/ci-cd-test/<branch-name>/#/`
  1. [x] Other build musts be preserved
  2. [x] if <branch-name> is `gh-pages`, do nothing
  3. [ ] <del>if <branch-name> is `master`, build must also be available on https://c2corg.github.io/ci-cd-test/#/</del> **No**, it may need two builds, as branch name must be in URL. Too heavy, skip. 
  4. [ ] set a pages with available builds list on root page
2. [ ] When a commit is made on `master`, a build must be run and deployed on demo server
3. [ ] When a [release](https://github.com/c2corg/CI-CD-test/releases) is done on github
  * [ ] a build must be run and deployed on production server 
  * [ ] a git log must be added in release description : `git log --pretty=oneline v7.0.6..HEAD --no-merges`
  * [ ] a message must be sent on camptocamp forum

----

## Solutions

### 1. When a commit is made on  Deploy on <branch-name> 
  
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
