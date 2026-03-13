## deploy

setup a data directory:

```
mkdir data
docker run -it --rm -v $(pwd)/data:/data ghcr.io/the-real-liu/it5012_26_bd_code:main /setup.sh my_password
```

deploy:

```
docker run --name itserver -p 8888:80 -v $(pwd)/data:/data ghcr.io/the-real-liu/it5012_26_bd_code:main
```

then you can login using credentials:

```
admin@example.com
my_password
```

