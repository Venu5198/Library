# ─────────────────────────────────────────────────────────────────────────────
# Frontend Dockerfile — Production Nginx Runner
#
# Serves the compiled React+Vite single page application via nginx.
# Built with @myorg/ui component library from Verdaccio.
# ─────────────────────────────────────────────────────────────────────────────

FROM nginx:1.25-alpine AS runner
LABEL stage=runner
LABEL org.opencontainers.image.title="MyPlatform Frontend"
LABEL org.opencontainers.image.description="React+Vite frontend served by nginx"

# Remove default nginx site
RUN rm -f /etc/nginx/conf.d/default.conf

# Copy hardened nginx configuration
COPY nginx.conf /etc/nginx/conf.d/app.conf

# Copy compiled production bundle
COPY dist /usr/share/nginx/html

# Tighten file permissions for nginx user
RUN chown -R nginx:nginx /usr/share/nginx/html \
 && chmod -R 755 /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1/nginx-health || exit 1

CMD ["nginx", "-g", "daemon off;"]
