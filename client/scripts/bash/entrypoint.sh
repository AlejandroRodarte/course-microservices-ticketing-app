#!/bin/bash
function apply_path {
  echo "Check that we have NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY variable."
  test -n "$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
  find /node/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#APP_NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_VAR#$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY#g"

  echo "Check that we have NEXT_PUBLIC_ENV variable."
  test -n "$NEXT_PUBLIC_ENV"
  find /node/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#APP_NEXT_PUBLIC_ENV_VAR#$NEXT_PUBLIC_ENV#g"

  echo "Check that we have NEXT_PUBLIC_API_URL variable."
  test -n "$NEXT_PUBLIC_API_URL"
  find /node/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#APP_NEXT_PUBLIC_API_URL_VAR#$NEXT_PUBLIC_API_URL#g"
}

apply_path
exec "$@"