FROM node:10

ENV DATABASE_URL=${DATABASE_URL}

# Create app directory
WORKDIR /usr/src/studyBites-api

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

CMD ["yarn", "run", "dev"]
