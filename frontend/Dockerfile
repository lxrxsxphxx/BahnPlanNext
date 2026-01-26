FROM node:22.20.0-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

FROM base AS development-dependencies-env
COPY . /app
ENV CI=true
RUN pnpm install

FROM base AS production-dependencies-env
COPY ./package.json pnpm-lock.yaml /app/
ENV CI=true
RUN pnpm install --prod

FROM base AS build-env
ARG VITE_API_URL=http://localhost:8000
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
ENV CI=true
ENV VITE_API_URL=${VITE_API_URL}
RUN pnpm run build

FROM base
COPY ./package.json pnpm-lock.yaml /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
CMD ["pnpm", "run", "start"]
