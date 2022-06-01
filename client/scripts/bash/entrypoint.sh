#!/bin/bash
function apply_path {
  echo "Check that we have NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY variable."
  echo $NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  test -n "$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
  find /node/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#APP_NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_VAR#$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY#g"

  echo "Check that we have NEXT_PUBLIC_ENV variable."
  echo $NEXT_PUBLIC_ENV
  test -n "$NEXT_PUBLIC_ENV"
  find /node/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#APP_NEXT_PUBLIC_ENV_VAR#$NEXT_PUBLIC_ENV#g"

  echo "Check that we have NEXT_PUBLIC_API_URL variable."
  echo $NEXT_PUBLIC_API_URL
  test -n "$NEXT_PUBLIC_API_URL"
  find /node/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#APP_NEXT_PUBLIC_API_URL_VAR#$NEXT_PUBLIC_API_URL#g"

  if [[ "$NEXT_PUBLIC_ENV" == "production-docker" ]]; then
    echo "Docker (production) environment detected."
    
    echo "Check that we have NEXT_PUBLIC_AUTH_MICROSERVICE_PORT variable."
    echo $NEXT_PUBLIC_AUTH_MICROSERVICE_PORT
    test -n "$NEXT_PUBLIC_AUTH_MICROSERVICE_PORT"
    find /node/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#APP_NEXT_PUBLIC_AUTH_MICROSERVICE_PORT_VAR#$NEXT_PUBLIC_AUTH_MICROSERVICE_PORT#g"

    echo "Check that we have NEXT_PUBLIC_TICKETS_MICROSERVICE_PORT variable."
    echo $NEXT_PUBLIC_TICKETS_MICROSERVICE_PORT
    test -n "$NEXT_PUBLIC_TICKETS_MICROSERVICE_PORT"
    find /node/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#APP_NEXT_PUBLIC_TICKETS_MICROSERVICE_PORT_VAR#$NEXT_PUBLIC_TICKETS_MICROSERVICE_PORT#g"

    echo "Check that we have NEXT_PUBLIC_ORDERS_MICROSERVICE_PORT variable."
    echo $NEXT_PUBLIC_ORDERS_MICROSERVICE_PORT
    test -n "$NEXT_PUBLIC_ORDERS_MICROSERVICE_PORT"
    find /node/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#APP_NEXT_PUBLIC_ORDERS_MICROSERVICE_PORT_VAR#$NEXT_PUBLIC_ORDERS_MICROSERVICE_PORT#g"

    echo "Check that we have NEXT_PUBLIC_PAYMENTS_MICROSERVICE_PORT variable."
    echo $NEXT_PUBLIC_PAYMENTS_MICROSERVICE_PORT
    test -n "$NEXT_PUBLIC_PAYMENTS_MICROSERVICE_PORT"
    find /node/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#APP_NEXT_PUBLIC_PAYMENTS_MICROSERVICE_PORT_VAR#$NEXT_PUBLIC_PAYMENTS_MICROSERVICE_PORT#g"
  fi
}

apply_path
exec "$@"