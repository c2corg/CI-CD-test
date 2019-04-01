# clone 
git clone --depth=50 --branch=gh-pages https://github.com/c2corg/CI-CD-test.git c2corg/CI-CD-test

# move new folder
mv dist/$TRAVIS_BRANCH c2corg/CI-CD-test/$TRAVIS_BRANCH

cd c2corg/CI-CD-test
ls -la

git branch

git add -A

git commit -m="Deploy $TRAVIS_BRANCH branch"

git push