# syntax=docker/dockerfile:1
#
# One Dockerfile for every app – each still gets its own image and can be deployed on its own:
#   docker build -f tools/docker/Dockerfile --target web --build-arg APP=mfe-cart   -t mfe-store/mfe-cart .
#   docker build -f tools/docker/Dockerfile --target api --build-arg APP=layout-api -t mfe-store/layout-api .

# ---- deps: identical for all apps, so the layer is shared/cached between images -------------------
FROM node:24-slim AS deps
WORKDIR /workspace
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# ---- build: only the requested app (and the libs it uses) ------------------------------------------
FROM deps AS build
ARG APP
ENV NX_DAEMON=false NX_NO_CLOUD=true NX_TUI=false CI=true
COPY . .
RUN test -n "$APP" || (echo "Build arg APP is required, e.g. --build-arg APP=mfe-cart" && exit 1)
RUN npx nx build "$APP" --configuration=production

# ---- api: Node services (layout-api) ---------------------------------------------------------------
FROM node:24-slim AS api
ARG APP
ENV NODE_ENV=production PORT=3333 LAYOUT_FILE=/data/layout.json
WORKDIR /app
COPY --from=build /workspace/dist/apps/${APP}/ ./
RUN mkdir -p /data && chown node:node /data
USER node
EXPOSE 3333
CMD ["node", "main.js"]

# ---- web: Angular apps (shell + microfrontends) served by nginx – default target -------------------
FROM nginx:1.29-alpine AS web
ARG APP
LABEL org.opencontainers.image.title="$APP"
RUN mkdir -p /etc/nginx/snippets
COPY tools/docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --chmod=755 tools/docker/40-federation-manifest.sh /docker-entrypoint.d/40-federation-manifest.sh
COPY --chmod=755 tools/docker/41-api-proxy.sh /docker-entrypoint.d/41-api-proxy.sh
COPY --from=build /workspace/dist/apps/${APP}/browser /usr/share/nginx/html
EXPOSE 80
