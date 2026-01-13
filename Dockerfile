FROM node:12-alpine

WORKDIR /excalidraw-room

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

EXPOSE 80
CMD ["npm", "start"]
