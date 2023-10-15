#!/bin/bash
noOnly() {
  if grep -r -F .only $(find . -name '*\.test\.[t,j]s' -not -path "./node_modules/*"); then
    echo 'Found .only tests' && exit 1;
  else
    echo 'No .only found' && exit 0;
  fi
}
noOnly
