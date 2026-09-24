FROM 'cypress/included:13.13.0'
RUN rm -f /etc/apt/sources.list.d/google-chrome.list && \
  apt-get update && \
  apt-get install -y --no-install-recommends python3-venv && \
  rm -rf /var/lib/apt/lists/* && \
  python3 -m venv /opt/venv && \
  /opt/venv/bin/pip install --only-binary :all: requests==2.34.2
ENV PATH="/opt/venv/bin:$PATH"

ENV CYPRESS_VIDEO=false

WORKDIR /e2e

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --ignore-scripts && ./node_modules/.bin/cypress install
COPY ./reporter-config.json ./reporter-config.json
COPY ./cypress.config.js ./cypress.config.js
COPY ./cypress ./cypress

CMD ["/bin/sh", "-c", "sleep 15"]