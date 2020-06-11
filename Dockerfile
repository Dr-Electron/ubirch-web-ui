FROM ubuntu:20.04
ENV DEBIAN_FRONTEND=noninteractive

EXPOSE 9101
EXPOSE 8081

# -----------------------------------------------------------------------------
# Install system basics
# -----------------------------------------------------------------------------
RUN \
  apt-get update -qqy && \
  apt-get install -qqy --allow-unauthenticated \
          apt-transport-https \
          software-properties-common \
          curl \
          expect \
          zip \
          libsass-dev \
          git \
          sudo

# -----------------------------------------------------------------------------
# Install npm, node, cordova & ionic
# -----------------------------------------------------------------------------
RUN curl -sL https://deb.nodesource.com/setup_12.x | sudo bash -
RUN apt-get install -qqy nodejs
RUN npm install -g cordova ionic typescript

# Copy files
COPY ${PROJECT_FILES} /usr/share/service

# build widgets project
WORKDIR /usr/share/service/widgets
RUN npm install
RUN npm run build:dev
RUN echo WIDGET IS BUILT, PROCEEDING TO MAIN PROJECT

#WORKDIR /usr/share/service
#RUN pwd && ls
#RUN npm install
#
## Install node modules
#WORKDIR /usr/share/service
#
#CMD bash startup-prod.sh
