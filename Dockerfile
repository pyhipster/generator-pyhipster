# syntax=docker/dockerfile:1
FROM python:slim-bullseye

# copy sources
COPY . /home/pyhipster/generator-pyhipster

RUN \
  # configure the "pyhipster" user
  groupadd pyhipster && \
  adduser pyhipster --ingroup pyhipster --shell /bin/bash --home /home/pyhipster && \
  usermod -aG sudo pyhipster && \
  echo 'pyhipster:pyhipster' |chpasswd && \
  mkdir /home/pyhipster/app && \
  export DEBIAN_FRONTEND=noninteractive && \
  export TZ=Asia\Kolkata && \
  ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone && \
  apt update && \
  # install utilities
  apt-get --no-install-recommends install -y \
    build-essential \
    procps \
    wget \
    curl \
    vim \
    git \
    zip \
    bzip2 \
    fontconfig \
    libpng-dev && \
    ARCH="$(dpkg --print-architecture)"; \
    case "${ARCH}" in \
       aarch64|arm64) \
         ARCH='arm64'; \
         ;; \
       amd64|x86_64) \
         ARCH='x64'; \
         ;; \
       *) \
         echo "Unsupported arch: ${ARCH}"; \
         exit 1; \
         ;; \
    esac; \
    JHI_NODE_VERSION="$(/home/pyhipster/generator-pyhipster/test-integration/scripts/99-print-node-version.sh)" && \
    wget https://nodejs.org/dist/v$JHI_NODE_VERSION/node-v$JHI_NODE_VERSION-linux-$ARCH.tar.gz -O /tmp/node.tar.gz && \
    tar -C /usr/local --strip-components 1 -xzf /tmp/node.tar.gz && \
  # # # upgrade npm
  # npm install -g npm@7 && \
  # # # install yeoman
  # npm install -g yo && \
  # cleanup
  apt-get clean && apt-get autoclean && \
  rm -rf \
    /var/lib/apt/lists/* \
    /tmp/* \
    /var/tmp/* && \
  # install pyhipster
  cd /home/pyhipster/generator-pyhipster && \
  npm install -g /home/pyhipster/generator-pyhipster && \
  # fix pyhipster user permissions
  chown -R pyhipster:pyhipster \
    /home/pyhipster \
    /usr/local/lib/node_modules

# expose the working directory, the Tomcat port, the BrowserSync ports
USER pyhipster
ENV PATH $PATH:/usr/bin
WORKDIR "/home/pyhipster/app"
VOLUME ["/home/pyhipster/app"]
EXPOSE 8080 9000 3001
CMD ["tail", "-f", "/home/pyhipster/generator-pyhipster/generators/server-flask/templates/src/main/resources/banner-no-color.txt"]
