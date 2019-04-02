# clone repository on gh-pages branch. Save it in gh-pages folder 
git clone --single-branch --branch=gh-pages https://${GITHUB_TOKEN}@github.com/c2corg/CI-CD-test.git gh-pages
# git clone --single-branch --branch=gh-pages https://${GITHUB_TOKEN}@github.com/${TRAVIS_REPO_SLUG}.git gh-pages

# move build into gh-pages folder, under a new folder with <branch-name> as name
mv dist gh-pages/$TRAVIS_BRANCH

# Add this folder into gh-pages branch, commit and push
cd gh-pages
git add .
git commit -m "Deploy $TRAVIS_BRANCH branch"
git push