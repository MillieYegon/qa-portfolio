#!/usr/bin/env bash
# Downloads the open-source WebdriverIO native demo app (React Native) used by this suite.
set -euo pipefail
VERSION="${APP_VERSION:-v2.2.0}"
mkdir -p "$(dirname "$0")/../apps"
curl -fL -o "$(dirname "$0")/../apps/android.wdio.native.app.${VERSION}.apk" \
  "https://github.com/webdriverio/native-demo-app/releases/download/${VERSION}/android.wdio.native.app.${VERSION}.apk"
