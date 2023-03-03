FROM 'cypress/included:10.6.0'
RUN apt-get update && apt-get install -y python3-pip && \
  pip3 install requests

ENV CYPRESS_VIDEO=false

WORKDIR /e2e

COPY package.json yarn.lock ./
RUN yarn
COPY ./merge_rp_launches.py ./merge_rp_launches.py
COPY ./reporter-config.json ./reporter-config.json
COPY ./cypress.config.js ./cypress.config.js
COPY ./cypress ./cypress
COPY ./reporters ./reporters

CMD ["/bin/sh", "-c", "sleep 15"]