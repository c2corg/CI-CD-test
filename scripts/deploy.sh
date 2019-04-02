# clone 
git clone --single-branch --branch=gh-pages https://github.com/c2corg/CI-CD-test.git gh-pages

# move new folder
mv dist gh-pages/$TRAVIS_BRANCH

cd gh-pages
ls -la

git branch

git add -A
git commit -m "Deploy $TRAVIS_BRANCH branch"

git push