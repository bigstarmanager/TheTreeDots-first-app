#!/bin/bash

BASENAME=$(basename $PWD)

export NODE_ENV=${NODE_ENV:-test}

JEST_OPTS=${JEST_OPTS:-}

if [ ${CI} ]; then
  REPORTDIR=/home/circleci/project/reports/junit/${BASENAME}
  echo Creating ${REPORTDIR}
  mkdir -p ${REPORTDIR}
  export JEST_OPTS="--ci --reporters=default --reporters=jest-junit --maxWorkers=50% --testTimeout=50000"
  export JEST_JUNIT_OUTPUT_DIR="${REPORTDIR}"
else
  JEST_OPTS="$JEST_OPTS --maxWorkers=80%"
fi

# run jest in no-cache mode in conjunction with ts-jest isolatedModules https://github.com/kulshekhar/ts-jest/issues/1967
JEST_OPTS="$JEST_OPTS --verbose=true --logHeapUsage --no-cache"
export JEST_OPTS

echo "Testing ${BASENAME}..."

# `--max-old-space-size=1024` test heap size should never larger than 1GB, if that happened node will force gc and the test might fail
node --expose-gc --max-old-space-size=1024 ./node_modules/.bin/jest ${JEST_OPTS} $@

retVal=$?
if [ $retVal -ne 0 ]; then
    echo "Test Error"
    exit $retVal
fi