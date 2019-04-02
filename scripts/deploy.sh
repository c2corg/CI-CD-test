echo "Deploy $TRAVIS_REPO_SLUG:$TRAVIS_BRANCH build on gh-pages branch"
echo "TRAVIS_PULL_REQUEST = $TRAVIS_PULL_REQUEST"

# clone repository on gh-pages branch. Save it in gh-pages folder 
git clone --single-branch --branch=gh-pages https://${GITHUB_TOKEN}@github.com/${TRAVIS_REPO_SLUG}.git gh-pages

# move build into gh-pages folder, under a new folder with <branch-name> as name
rm -rf gh-pages/$TRAVIS_BRANCH
mv dist gh-pages/$TRAVIS_BRANCH

# Add this folder into gh-pages branch and commit
cd gh-pages
git add .
git commit -m "Deploy $TRAVIS_BRANCH branch"

# push
# Notice the > /dev/null 2>&1 on the end! If push fails for any reason,
# it prevents any unwanted sensitive information to be recorded in the travis logs. 
git push > /dev/null 2>&1