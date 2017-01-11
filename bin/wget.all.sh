#!/bin/bash
for i in $(ls); do
foo=$(basename $i);
echo ${foo%.*};
  wget  -O $foo http://localhost:5984/cm-spb/${foo%.*};
done;
