FROM public.ecr.aws/lambda/nodejs:20 as base

ARG BASE_DIRECTORY=${LAMBDA_TASK_ROOT}
WORKDIR ${BASE_DIRECTORY}

COPY package*.json ./
RUN npm install

FROM base as deps
WORKDIR ${BASE_DIRECTORY}
COPY . .

FROM deps AS builder
RUN npm run build

FROM builder as runner
RUN npm run copy:index
WORKDIR ${BASE_DIRECTORY}

CMD [ "index.handler" ]
