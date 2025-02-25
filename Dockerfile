FROM node:22

WORKDIR /app

COPY package*.json ./

FROM base as build

RUN npm install --omit=dev

COPY . .

RUN npm run build

RUN npm prune --omit=dev

ENV NODE_ENV=production
ENV PORT=3000

FROM base

COPY --from=build /app /app

EXPOSE 3000

CMD ["npm", "run", "start"]
