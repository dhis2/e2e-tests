FROM 'cypress/included:13.13.0'
RUN rm -f /etc/apt/sources.list.d/google-chrome.list && \
  apt-get update && apt-get install -y python3-pip && \
  pip3 install --break-system-packages requests

ENV CYPRESS_VIDEO=false

WORKDIR /e2e

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY ./reporter-config.json ./reporter-config.json
COPY ./cypress.config.js ./cypress.config.js
COPY ./cypress ./cypress

CMD ["/bin/sh", "-c", "sleep 15"]