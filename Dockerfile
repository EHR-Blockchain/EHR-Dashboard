# Stage 1
FROM node:lts-stretch-slim AS builder
WORKDIR /app
COPY . ./
# Using image caching for faster builds
COPY package.json yarn.lock ./
RUN yarn --pure-lockfile
RUN yarn build
# Stage 2 - the production environment
FROM node:lts-stretch-slim
RUN yarn global add serve
WORKDIR /app
COPY --from=builder /app/build .
CMD ["serve", "-p", "80", "-s", "."]
