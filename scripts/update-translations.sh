
if [ $TRAVIS_EVENT_TYPE != "cron" ]; then
    echo "Not a CRON job, do nothing"
    exit 0
else
    echo "Process CRON daily jobs"
fi

for lang in 'fr' 'en'
do
    echo
    echo "Process $lang"

    BRANCH_NAME=translations-$lang
    TRANSIFEX_URL="https://www.transifex.com/api/2/project/c2corg_ui/resource/main/translation/$lang/?mode=reviewed&file"
    FILE="translations/dist/$lang.json"

    git checkout -q master
    git checkout -b $BRANCH_NAME
    curl -s --user api:$TRANSIFEX_TOKEN -X GET $TRANSIFEX_URL | node scripts/po2json.js > $FILE

    if [[ `git status --porcelain` ]]; then
        echo "$lang has been modified"

        git add -A $FILE
        git commit -m "Update $lang translations"
        git push --force --set-upstream origin $BRANCH_NAME
    else
        echo "No changes detected on $lang"
    fi
done
