FROM node:18 as build
WORKDIR /src
COPY . .
RUN npm install && \
    npm run build
FROM nginx:stable
COPY --from=build /src/dist/client/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
