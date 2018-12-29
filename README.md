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

The endpoint
```
$ curl -X POST \
  https://{api-gateway-id}.execute-api.{region}.amazonaws.com/dev/images \
  -H 'Content-Type: application/json' \
  -H 'cache-control: no-cache' \
  -d '{
 "imageUrl": "http://xxxxxx/xxxxxxx.jpg",
 "dimensions": ["600x600"],
 "snsCb": "arn:aws:sns:us-east-1:123465489767:event-tracked"
}'
```

