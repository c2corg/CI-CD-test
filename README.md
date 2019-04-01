# CI-CD-test
This repo is a test repo

## Targets

Proof of concept of a CI-CD env integrated with github pages and camptocamp prod/demo servers

* [x] When a commit is made on <branch-name> branch, a build must be run and deployed on `https://c2corg.github.io/ci-cd-test/<branch-name>/#/`
  * [ ] Other build musts be preserved
  * [x] if <branch-name> is `gh-pages`, do nothing
  * [ ] if <branch-name> is `master`, build must also be available on https://c2corg.github.io/ci-cd-test/#/
* [ ] When a commit is made on `master`, a build must be run and deployed on demo server
* [ ] When a [release](https://github.com/c2corg/CI-CD-test/releases) is done on github, a build must be run and deployed on production server 
