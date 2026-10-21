FROM nginxinc/nginx-unprivileged:1.30.6-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY headers_seguranca.conf /etc/nginx/headers_seguranca.conf
COPY index.html servicos.html sobre.html 404.html robots.txt sitemap.xml site.webmanifest /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY assets/ /usr/share/nginx/html/assets/

EXPOSE 8080
