FUNCTION=CustomMenuMiddleware
FILE=lambda-custom-menu-middleware

# Refresh modules and remove existing zip file
rm -rf dist
rm -rf /tmp/$FILE.zip
mkdir dist

CONFIG="{
    MYSQL_HOSTNAME=menubuilder.cj7gpfr64aqk.us-east-1.rds.amazonaws.com,
    MYSQL_USERNAME=menubuilder,
    MYSQL_PASSWORD=Test12345
}"

cp package.json dist/
cp index.js dist/
cp swagger.json dist/
cp -rf app/ dist/app/

# Only include production modules
cd dist && npm install --production && cd ..

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

aws lambda update-function-configuration --function-name $FUNCTION --environment "Variables=$CONFIG"