#!/bin/bash

data_dir="/data"
import_dir="$data_dir/import"
export_dir="$data_dir/export"
suffix="$(date +%s)"

if [[ -d "$export_dir" ]]; then
  if [[ -d "$import_dir" ]]; then
    mv "$import_dir" "$import_dir.$suffix"
  fi;

  mv "$export_dir" "$import_dir"
fi;

exec firebase emulators:start --import="$import_dir" --export-on-exit="$export_dir"
