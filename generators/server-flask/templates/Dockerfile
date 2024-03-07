FROM pyhipster/pyhipster:latest
LABEL authors="PyHipster"

WORKDIR /home/pyhipster/app

COPY . /home/pyhipster/app

USER root
RUN tar -czf /tmp/source.tar.gz --exclude='.venv' --exclude='node_modules' --exclude='poetry.lock' --exclude='package-lock.json' . && \
 rm -Rf /home/pyhipster/app && \
 mkdir /home/pyhipster/app && \
 tar -xzf /tmp/source.tar.gz -C /home/pyhipster/app && \
 rm /tmp/source.tar.gz

USER pyhipster
RUN \
  curl -sSL https://install.python-poetry.org | python3 - && \
  /home/pyhipster/.local/bin/poetry install && \
  npm install

ENV PATH $PATH:/usr/bin:/home/pyhipster/.local/bin
ENTRYPOINT ["/home/pyhipster/app/src/main/docker/jib/entrypoint.sh"]
