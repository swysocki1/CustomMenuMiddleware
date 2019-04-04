FUNCTION=CustomMenuMiddleware
FILE=lambda-custom-menu-middleware

# Refresh modules and remove existing zip file
rm -rf dist
rm -rf /tmp/$FILE.zip
mkdir dist

node_modules/.bin/tsc

cp package.json dist/
cp index.js dist/

# Only include production modules
cd dist && npm install --production && cd ..

cp server.js dist/app/

# Zip related files
cd dist && zip /tmp/$FILE \
    -r index.js \
    app/ \
    package.json \
    node_modules/ \
    && cd ..

# Deploy
export AWS_PROFILE=custommenu
aws lambda update-function-code \
    --function-name $FUNCTION \
    --zip-file fileb:///tmp/$FILE.zip
