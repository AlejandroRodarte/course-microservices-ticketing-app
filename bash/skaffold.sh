#!/usr/bin/env bash

dev() {
  local current_ns; current_ns="$(kubectl config view --minify --output 'jsonpath={..namespace}')"
  kubectl config set-context --current --namespace=
  (sleep 5 && kubectl config set-context --current --namespace="${current_ns}" ) &

  skaffold dev --profile=dev
}

dev