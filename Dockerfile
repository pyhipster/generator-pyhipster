# syntax=docker/dockerfile:1
FROM python:3.12.0b4-alpine3.18

# copy sources
COPY . /home/pyhipster/generator-pyhipster

RUN \
  # configure the "pyhipster" user
  apk add doas bash; \
  addgroup pyhipster ; \
  adduser pyhipster -s /bin/bash -G pyhipster ; \
  echo 'pyhipster:pyhipster' |chpasswd ; \
  echo 'permit pyhipster as root' > /etc/doas.d/doas.conf ; \
  mkdir /home/pyhipster/app ; \
#  export DEBIAN_FRONTEND=noninteractive && \
  export TZ=Asia\Calcutta ; \
  ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN  \
  apk update ; \
  # install utilities
  apk add \
    wget \
    curl \
    vim \
    git \
    zip \
    bzip2 \
    fontconfig \
    libpng-dev \
    nodejs \
    npm \
    sudo ; \
  # ARCH=`uname -m`; \
  # case "${ARCH}" in \
  #    aarch64|arm64) \
  #      ARCH='arm64'; \
  #      ;; \
  #    amd64|x86_64) \
  #      ARCH='x64'; \
  #      ;; \
  #    *) \
  #      echo "Unsupported arch: ${ARCH}"; \
  #      exit 1; \
  #      ;; \
  # esac; \
  # JHI_NODE_VERSION="$(/home/pyhipster/generator-pyhipster/test-integration/scripts/99-print-node-version.sh)"; \
  # wget https://nodejs.org/dist/v$JHI_NODE_VERSION/node-v$JHI_NODE_VERSION-linux-$ARCH.tar.gz -O /tmp/node.tar.gz && \
  # tar -C /usr/local --strip-components 1 -xzf /tmp/node.tar.gz && \
  # # upgrade npm
  # npm install -g npm@7 && \
  # # install yeoman
  npm install -g yo && \
  # cleanup
  apk cache clean && \
  rm -rf \
    /home/pyhipster/.cache/ \
    # /var/lib/apt/lists/* \
    /tmp/* \
    /var/tmp/*

RUN \
  # install jhipster
  cd /home/pyhipster/generator-pyhipster && npm ci --production && \
  npm install -g /home/pyhipster/generator-pyhipster && \
  # fix jhipster user permissions
  chown -R pyhipster:pyhipster \
    /home/pyhipster \
    /usr/local/lib/node_modules && \
  # cleanup
  rm -rf \
    /home/pyhipster/.cache/ \
    /var/lib/apt/lists/* \
    /tmp/* \
    /var/tmp/*

# expose the working directory, the Tomcat port, the BrowserSync ports
USER pyhipster
ENV PATH $PATH:/usr/bin
WORKDIR "/home/pyhipster/app"
VOLUME ["/home/pyhipster/app"]
EXPOSE 8080 9000 3001
CMD ["tail", "-f", "/home/pyhipster/generator-pyhipster/generators/server-flask/templates/src/main/resources/banner-no-color.txt"]
