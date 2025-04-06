FROM node:22.14 AS base

WORKDIR /src

FROM base AS build

RUN corepack enable

COPY . .
COPY package.json .
RUN pnpm install --filter "@personal-finance-tracker/client-main..." --frozen-lockfile

WORKDIR /src/apps/client

ARG ENVIRONMENT
RUN mv .env.${ENVIRONMENT} .env

RUN pnpm turbo build

FROM base AS running

COPY --from=build /src/apps/client/.output /src/.output

CMD ["node", ".output/server/index.mjs"]