FROM node:22.14

RUN corepack enable

WORKDIR /app
COPY . .
COPY package.json .
RUN pnpm install --filter "@personal-finance-tracker/server-main..." --frozen-lockfile
WORKDIR /app/apps/server-main
RUN pnpm turbo build

CMD ["pnpm", "start:production"]