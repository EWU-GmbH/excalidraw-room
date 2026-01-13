FROM node:20-alpine

WORKDIR /excalidraw-room

COPY package.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

EXPOSE 80
CMD ["npm", "start"]
