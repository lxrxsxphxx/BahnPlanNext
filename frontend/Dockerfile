FROM node:22.20.0-alpine AS development-dependencies-env
COPY . /app
WORKDIR /app
ENV CI=true
RUN pnpm install

FROM node:22.20.0-alpine AS production-dependencies-env
COPY ./package.json package-lock.json /app/
WORKDIR /app
ENV CI=true
RUN pnpm install --prod

FROM node:22.20.0-alpine AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
ENV CI=true
RUN pnpm run build

FROM node:22.20.0-alpine
COPY ./package.json package-lock.json /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
WORKDIR /app
CMD ["pnpm", "run", "start"]
