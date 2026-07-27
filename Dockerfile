ARG BRANCH=next

FROM ghcr.io/geode-solutions/opengeodeweb-router:$BRANCH AS router

FROM ghcr.io/geode-solutions/pegghy-back:$BRANCH AS back

FROM ghcr.io/geode-solutions/pegghy-viewer:$BRANCH AS viewer

FROM debian:12-slim

RUN apt-get update

# Setup router
RUN apt-get install -y curl jq bash supervisor nginx
COPY --from=router /etc/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=router /etc/supervisord.conf /etc/supervisord.conf
RUN mkdir -p /var/log/supervisor
RUN mkdir -p /etc/supervisor/conf.d
COPY --from=router /etc/supervisor/conf.d /etc/supervisor/conf.d
COPY --from=router /usr/local/bin/cleanup.bash /usr/local/bin/cleanup.bash
RUN chmod +x /usr/local/bin/cleanup.bash

# Setup back
RUN apt-get install -y libgomp1
COPY --from=back /usr/local/bin/pegghy-back /usr/local/bin/pegghy-back
RUN chmod +x /usr/local/bin/pegghy-back
COPY --from=back /PEGGHy-Data /PEGGHy-Data
COPY <<'EOT' /etc/supervisor/conf.d/pegghy-back.conf
[program:pegghy-back]
command=/usr/local/bin/pegghy-back --project_folder_path /project --timeout 2 --upload_folder_path PEGGHy-Data
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0
EOT

# Setup viewer
RUN apt-get install -y libosmesa6-dev libx11-dev libxrender-dev
COPY --from=viewer /usr/local/bin/pegghy-viewer /usr/local/bin/pegghy-viewer
RUN chmod +x /usr/local/bin/pegghy-viewer
RUN mkdir www && touch www/healthcheck
COPY <<'EOT' /etc/supervisor/conf.d/pegghy-viewer.conf
[program:pegghy-viewer]
command=/usr/local/bin/pegghy-viewer --project_folder_path /project --content ./www --host 0.0.0.0
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0
EOT

ENV PYTHON_ENV=prod
ENV DISPLAY=:0

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]