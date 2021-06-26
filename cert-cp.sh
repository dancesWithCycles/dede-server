#!/bin/bash
# copy certificate
#
clear
echo "The script starts."
#
# Read the first command line argument: domain
argv="$1"
echo ""
if [[ -n "$argv" ]]; then
    echo "Domain: $argv"
else
    echo "Please supply the domain as first argument!"
    exit 1
fi
#
# path
path="/etc/letsencrypt/live/${argv}"
echo ""
echo "Path: $path"
#
# Does domain exist?
echo ""
if [[ -d "$path" ]]; then
    echo "Domain exists."
else
    echo "Domain does not exist. Please supply a valid domain."
    exit 2
fi

# Read the first command line argument: target
target="$2"
echo ""
if [[ -n "$target" ]]; then
    echo "Target: $target"
else
    echo "Please supply the full target path as second argument."
    exit 3
fi
#
# Does target exist?
echo ""
if [[ -d "$target" ]]; then
    echo "Target exists."
else
    echo "Target does not exists. Please supply a valid target."
    exit 4
fi
echo ""
chain="chain.pem"
echo "Chain: $chain"
echo ""
fullchain="fullchain.pem"
echo "Fullchain: $fullchain"
echo ""
key="privkey.pem"
echo "Key: $key"
echo ""
#
# Does source file exist?
source="${path}/${chain}"
echo "source: ${source}"
echo ""
if [[ -f "$source" ]]; then
    echo "Source exists."
else
    echo "Source does not exists."
    exit 5
fi
echo ""
#
# copy
echo "copy source: ${source} to target: ${target}/c"
cp "${source}" "${target}/c"
echo ""
#
# Does source file exist?
source="${path}/${fullchain}"
echo "source: ${source}"
echo ""
if [[ -f "$source" ]]; then
    echo "Source exists."
else
    echo "Source does not exists."
    exit 5
fi
echo ""
#
# copy
echo "copy source: ${source} to target: ${target}/f"
cp "${source}" "${target}/f"
echo ""
#
# Does source file exist?
source="${path}/${key}"
echo "source: ${source}"
echo ""
if [[ -f "$source" ]]; then
    echo "Source exists."
else
    echo "Source does not exists."
    exit 5
fi
echo ""
#
# copy
echo "copy source: ${source} to target: ${target}/p"
cp "${source}" "${target}/p"
echo ""
echo "change own"
chown stefan /var/www/dede-obc-adapter/p
if [ $? -eq 0 ]
then
  echo "Own changed."
else
  echo "Failure: Own did not change."
  exit 6
fi
echo ""
echo "I give you the prompt back."
echo ""
exit 0
