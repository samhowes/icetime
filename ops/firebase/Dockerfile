FROM node:20-alpine3.18 as base
ARG BUILD_DATE
ARG VERSION=13.7.5
ARG VCS_REF

LABEL org.label-schema.schema-version="1.0" \
      org.label-schema.name="firebase-tools" \
      org.label-schema.version=${VERSION}
ENV FIREBASE_TOOLS_VERSION=${VERSION}
ENV HOME=/home/node


RUN apk --no-cache add openjdk11-jre bash
RUN yarn global add firebase-tools@${VERSION} && \
    yarn cache clean && \
    firebase -V && \
    java -version

RUN firebase setup:emulators:firestore && \
  firebase setup:emulators:ui && \
  firebase setup:emulators:storage

COPY .firebaserc $HOME

WORKDIR $HOME

FROM base as local
COPY firebase.json $HOME
COPY ops/firebase/start_docker.sh $HOME

CMD ["bash", "start_docker.sh"]

