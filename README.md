## To check log
serverless logs -f functionHandlerName -t

## Setup
```
# 1
$ cp .env.sample .env

# 2
create buckets in s3
```

Setup Docker image
```
$ docker-compose build
```


Run test

```
$ docker-compose -f docker-compose.yml -f docker-compose.dev.yml run test
```

Deploy to dev
```
$ docker-compose -f docker-compose.yml -f docker-compose.dev.yml run deploy-dev
```

