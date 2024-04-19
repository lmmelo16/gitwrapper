FROM node:18

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install -g typescript && npm install

COPY . .

RUN npm run build

# Allow to run .js file as executable
RUN chmod +x ./dist/cli/cli.js

ENTRYPOINT [ "bash", "entrypoint.sh" ]

CMD ["api"]

