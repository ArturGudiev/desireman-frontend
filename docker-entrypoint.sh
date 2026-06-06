#!/bin/sh
AUTH_USER="${AUTH_USER:-admin}"
AUTH_PASS="${AUTH_PASS:-admin}"
htpasswd -cb /etc/nginx/.htpasswd "$AUTH_USER" "$AUTH_PASS"

exec nginx -g "daemon off;"
