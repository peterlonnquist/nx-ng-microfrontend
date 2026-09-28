#!/bin/sh
# If API_UPSTREAM is set (shell container only), proxy /api/* to it so the browser can call a
# same-origin `/api/...` URL – the same one the Angular dev server proxies locally.
set -eu

[ -z "${API_UPSTREAM:-}" ] && exit 0

cat > /etc/nginx/snippets/api.conf <<CONF
location ^~ /api/ {
  # Docker's DNS + a variable = resolve lazily, so nginx still starts if the API is down.
  resolver 127.0.0.11 valid=10s ipv6=off;
  set \$api_upstream ${API_UPSTREAM};
  proxy_pass \$api_upstream;
  proxy_set_header Host \$host;
  proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
}
CONF

echo "Proxying /api/ -> ${API_UPSTREAM}"
