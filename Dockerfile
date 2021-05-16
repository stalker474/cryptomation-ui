FROM node:14-alpine as base

WORKDIR /src
COPY package*.json ./
EXPOSE 3001

FROM base as production
ENV NODE_ENV=production
RUN npm ci
COPY . .
CMD ["npm", "run", "start"]