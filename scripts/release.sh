
# if it's a tag, add commit logs
if [ $TRAVIS_TAG ]; then
    echo "Add commit logs to tag description"
    
    firstTag=$(git tag | sort -r | head -1)
    secondTag=$(git tag | sort -r | head -2 | awk '{split($0, tags, "\n")} END {print tags[1]}')
    
    echo "Changes between ${secondTag} and ${firstTag}\n"
    
    git log  --pretty=format:' * %s' ${secondTag}..${firstTag}
fi


